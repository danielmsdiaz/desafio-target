import { describe, expect, it } from "vitest";
import { calcularJuros } from "./juros.js";

describe("calcularJuros", () => {
  it("calcula juros simples de 2,5% por dia", () => {
    expect(calcularJuros(100, "2026-10-01", "2026-10-09"))
      .toEqual({
        diasAtraso: 8,
        juros: 20,
        total: 120,
      });
  });

  it("não cobra juros no dia do vencimento", () => {
    expect(calcularJuros(100, "2026-10-09", "2026-10-09"))
      .toEqual({
        diasAtraso: 0,
        juros: 0,
        total: 100,
      });
  });

  it("não cobra juros antes do vencimento", () => {
    expect(calcularJuros(100, "2026-10-15", "2026-10-09"))
      .toEqual({
        diasAtraso: 0,
        juros: 0,
        total: 100,
      });
  });

  it("calcula atraso na virada do ano", () => {
    expect(calcularJuros(100, "2025-12-31", "2026-01-02"))
      .toEqual({
        diasAtraso: 2,
        juros: 5,
        total: 105,
      });
  });

  it("considera o dia extra de um ano bissexto", () => {
    expect(calcularJuros(100, "2024-02-28", "2024-03-01"))
      .toEqual({
        diasAtraso: 2,
        juros: 5,
        total: 105,
      });
  });

  it("arredonda os juros para centavos", () => {
    expect(calcularJuros(99.99, "2026-10-08", "2026-10-09"))
      .toEqual({
        diasAtraso: 1,
        juros: 2.5,
        total: 102.49,
      });
  });

  it.each([-1, NaN, Infinity])(
    "rejeita o valor inválido %s",
    (valor) => {
      expect(() =>
        calcularJuros(valor, "2026-10-01", "2026-10-09")
      ).toThrow();
    }
  );

  it.each(["2026-02-30", "2026-13-01", "09/10/2026", ""])(
    "rejeita o vencimento inválido %s",
    (vencimento) => {
      expect(() =>
        calcularJuros(100, vencimento, "2026-10-09")
      ).toThrow();
    }
  );

  it("também valida a data de referência", () => {
    expect(() =>
      calcularJuros(100, "2026-10-01", "2026-02-30")
    ).toThrow("Data inválida.");
  });
});