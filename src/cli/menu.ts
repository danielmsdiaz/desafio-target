import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { calcularComissoesPorVendedor } from "../comissoes/comissoes.js";
import type { Venda } from "../comissoes/types.js";

import { movimentarEstoque } from "../estoque/estoque.js";
import type { Produto, Movimentacao } from "../estoque/types.js";

import { calcularJuros } from "../juros/juros.js";

const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function lerNumero(texto: string): number {
  const entrada = texto.trim();

  // Aceita 100,50 ou 100.50, sem separador de milhar.
  if (!/^\d+(?:[.,]\d+)?$/.test(entrada)) {
    throw new Error("Informe um número válido, sem separador de milhar.");
  }

  const numero = Number(entrada.replace(",", "."));

  if (!Number.isFinite(numero)) {
    throw new Error("Número inválido.");
  }

  return numero;
}

export async function iniciarMenu(
  vendas: Venda[],
  produtos: Produto[]
): Promise<void> {
  const terminal = createInterface({
    input: stdin,
    output: stdout,
    terminal: false,
  });
  const historico: Movimentacao[] = [];

  try {
    while (true) {
      console.log(`
1. Consultar comissões
2. Movimentar estoque
3. Calcular juros
4. Consultar estoque
5. Consultar histórico
0. Sair
`);

      const opcao = (await terminal.question("Escolha uma opção: ")).trim();

      if (opcao === "0") {
        break;
      }

      try {
        switch (opcao) {
          case "1": {
            const comissoes = calcularComissoesPorVendedor(vendas);

            console.table(
              Object.entries(comissoes).map(([vendedor, comissao]) => ({
                vendedor,
                comissao: formatador.format(comissao),
              }))
            );

            break;
          }

          case "2": {
            console.table(produtos);

            const codigoProduto = lerNumero(
              await terminal.question("Código do produto: ")
            );

            const tipoInformado = (
              await terminal.question(
                "Tipo da movimentação (1 - Entrada / 2 - Saída): "
              )
            ).trim().toLowerCase();

            const tipo =
              tipoInformado === "1" || tipoInformado === "entrada"
                ? "entrada"
                : tipoInformado === "2" || tipoInformado === "saida"
                  ? "saida"
                  : null;

            if (!tipo) {
              throw new Error(
                "Escolha 1 para entrada ou 2 para saída."
              );
            }

            const quantidade = lerNumero(
              await terminal.question("Quantidade: ")
            );

            const descricao = await terminal.question("Descrição: ");

            const movimentacao = movimentarEstoque(produtos, {
              codigoProduto,
              tipo,
              quantidade,
              descricao,
            });

            historico.push(movimentacao);
            console.table([movimentacao]);

            break;
          }

          case "3": {
            const valor = lerNumero(
              await terminal.question("Valor (ex.: 100,50): ")
            );

            const vencimento = (
              await terminal.question("Vencimento (AAAA-MM-DD): ")
            ).trim();

            const resultado = calcularJuros(valor, vencimento);

            console.table([
              {
                diasAtraso: resultado.diasAtraso,
                juros: formatador.format(resultado.juros),
                total: formatador.format(resultado.total),
              },
            ]);

            break;
          }

          case "4":
            console.table(produtos);
            break;

          case "5":
            if (historico.length === 0) {
              console.log("Nenhuma movimentação registrada.");
            } else {
              console.table(historico);
            }
            break;

          default:
            console.log("Opção inválida.");
        }
      } catch (erro) {
        console.log(
          erro instanceof Error ? erro.message : "Erro na operação."
        );
      }
    }
  } finally {
    terminal.close();
  }
}
