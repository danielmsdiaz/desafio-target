import { describe, expect, it } from "vitest";
import {
  calcularComissao,
  calcularComissoesPorVendedor,
} from "./comissoes.js";

describe("calcularComissao", () => {
  it.each([
    [99.99, 0],
    [100, 1],
    [499.99, 5],
    [500, 25],
    [1200.50, 60.03],
  ])("para uma venda de %s, retorna %s", (valor, esperado) => {
    expect(calcularComissao(valor)).toBe(esperado);
  });

  it.each([-1, NaN, Infinity])(
    "rejeita o valor inválido %s",
    (valor) => {
      expect(() => calcularComissao(valor)).toThrow();
    }
  );
});

describe("calcularComissoesPorVendedor", () => {
  it("soma as comissões e separa os vendedores", () => {
    const resultado = calcularComissoesPorVendedor([
      { vendedor: "João", valor: 100 },
      { vendedor: "Maria", valor: 500 },
      { vendedor: "João", valor: 1000 },
      { vendedor: "Maria", valor: 90 },
    ]);

    expect(resultado).toEqual({
      João: 51,
      Maria: 25,
    });
  });

  it("retorna um objeto vazio quando não há vendas", () => {
    expect(calcularComissoesPorVendedor([])).toEqual({});
  });
});