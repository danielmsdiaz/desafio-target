import type {
  Produto,
  DadosMovimentacao,
  Movimentacao,
} from "./types.js";

let proximoIdMovimentacao = 1;

export function movimentarEstoque(
  produtos: Produto[],
  dados: DadosMovimentacao
): Movimentacao {
  const produto = produtos.find(
    (item) => item.codigoProduto === dados.codigoProduto
  );

  if (!produto) {
    throw new Error("Produto não encontrado.");
  }

  if (dados.tipo !== "entrada" && dados.tipo !== "saida") {
    throw new Error("Tipo de movimentação inválido.");
  }

  if (
    !Number.isSafeInteger(dados.quantidade) ||
    dados.quantidade <= 0
  ) {
    throw new Error("A quantidade deve ser um inteiro positivo.");
  }

  if (!dados.descricao.trim()) {
    throw new Error("Informe uma descrição para a movimentação.");
  }

  if (dados.tipo === "saida" && dados.quantidade > produto.estoque) {
    throw new Error("Estoque insuficiente.");
  }

  const estoqueFinal =
    dados.tipo === "entrada"
      ? produto.estoque + dados.quantidade
      : produto.estoque - dados.quantidade;

  if (!Number.isSafeInteger(estoqueFinal) || estoqueFinal < 0) {
    throw new Error("O saldo resultante é inválido.");
  }

  const movimentacao: Movimentacao = {
    ...dados,
    descricao: dados.descricao.trim(),
    id: proximoIdMovimentacao,
    estoqueFinal,
  };

  proximoIdMovimentacao += 1;
  produto.estoque = estoqueFinal;

  return movimentacao;
}
