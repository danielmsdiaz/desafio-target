import { readFile } from "node:fs/promises";
import { calcularComissoesPorVendedor } from "./comissoes/comissoes.js";
import type { Venda } from "./comissoes/types.js";

const caminho = new URL("../data/vendas.json", import.meta.url);
const conteudo = await readFile(caminho, "utf-8");

const dados = JSON.parse(conteudo) as { vendas: Venda[] };

const comissoes = calcularComissoesPorVendedor(dados.vendas);

const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

console.table(
  Object.entries(comissoes).map(([vendedor, comissao]) => ({
    vendedor,
    comissao: formatador.format(comissao),
  }))
);
