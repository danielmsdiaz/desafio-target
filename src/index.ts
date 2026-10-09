import { readFile } from "node:fs/promises";
import { iniciarMenu } from "./cli/menu.js";

import type { Venda } from "./comissoes/types.js";
import type { Produto } from "./estoque/types.js";

async function main(): Promise<void> {
  const caminhoVendas = new URL("../data/vendas.json", import.meta.url);
  const caminhoEstoque = new URL("../data/estoque.json", import.meta.url);

  const [conteudoVendas, conteudoEstoque] = await Promise.all([
    readFile(caminhoVendas, "utf-8"),
    readFile(caminhoEstoque, "utf-8"),
  ]);

  const dadosVendas = JSON.parse(conteudoVendas) as { vendas: Venda[] };
  const dadosEstoque = JSON.parse(conteudoEstoque) as { estoque: Produto[] };

  await iniciarMenu(dadosVendas.vendas, dadosEstoque.estoque);
}

main().catch((erro: unknown) => {
  console.error(
    erro instanceof Error ? erro.message : "Não foi possível iniciar."
  );

  process.exitCode = 1;
});
