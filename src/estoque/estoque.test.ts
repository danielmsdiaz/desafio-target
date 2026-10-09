import { describe, expect, it } from "vitest";
import { movimentarEstoque } from "./estoque.js";
import type { DadosMovimentacao, Produto } from "./types.js";

function criarProdutos(): Produto[] {
  return [
    {
      codigoProduto: 101,
      descricaoProduto: "Caneta Azul",
      estoque: 150,
    },
  ];
}

function criarDados(
  ajustes: Partial<DadosMovimentacao> = {}
): DadosMovimentacao {
  return {
    codigoProduto: 101,
    tipo: "saida",
    quantidade: 20,
    descricao: "Venda de canetas",
    ...ajustes,
  };
}

describe("movimentarEstoque", () => {
  it("registra uma saída e atualiza o saldo", () => {
    const produtos = criarProdutos();
    const resultado = movimentarEstoque(produtos, criarDados());

    expect(resultado.estoqueFinal).toBe(130);
    expect(produtos[0]?.estoque).toBe(130);
    expect(resultado.descricao).toBe("Venda de canetas");
  });

  it("registra uma entrada", () => {
    const produtos = criarProdutos();

    const resultado = movimentarEstoque(
      produtos,
      criarDados({ tipo: "entrada", quantidade: 50 })
    );

    expect(resultado.estoqueFinal).toBe(200);
    expect(produtos[0]?.estoque).toBe(200);
  });

  it("permite retirar todo o estoque", () => {
    const produtos = criarProdutos();

    const resultado = movimentarEstoque(
      produtos,
      criarDados({ quantidade: 150 })
    );

    expect(resultado.estoqueFinal).toBe(0);
    expect(produtos[0]?.estoque).toBe(0);
  });

  it("rejeita saída acima do saldo sem alterar o estoque", () => {
    const produtos = criarProdutos();

    expect(() =>
      movimentarEstoque(produtos, criarDados({ quantidade: 151 }))
    ).toThrow("Estoque insuficiente.");

    expect(produtos[0]?.estoque).toBe(150);
  });

  it("rejeita um produto inexistente", () => {
    expect(() =>
      movimentarEstoque(
        criarProdutos(),
        criarDados({ codigoProduto: 999 })
      )
    ).toThrow("Produto não encontrado.");
  });

  it.each([0, -1, 1.5, NaN, Infinity])(
    "rejeita a quantidade inválida %s sem alterar o estoque",
    (quantidade) => {
      const produtos = criarProdutos();

      expect(() =>
        movimentarEstoque(produtos, criarDados({ quantidade }))
      ).toThrow();

      expect(produtos[0]?.estoque).toBe(150);
    }
  );

  it("rejeita descrição vazia", () => {
    expect(() =>
      movimentarEstoque(
        criarProdutos(),
        criarDados({ descricao: "   " })
      )
    ).toThrow("Informe uma descrição para a movimentação.");
  });

  it("gera IDs diferentes e mantém o saldo entre operações", () => {
    const produtos = criarProdutos();

    const primeira = movimentarEstoque(produtos, criarDados());
    const segunda = movimentarEstoque(produtos, criarDados());

    expect(Number.isSafeInteger(primeira.id)).toBe(true);
    expect(segunda.id).not.toBe(primeira.id);
    expect(primeira.estoqueFinal).toBe(130);
    expect(segunda.estoqueFinal).toBe(110);
  });
});
