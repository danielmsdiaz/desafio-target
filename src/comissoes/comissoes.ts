
import type { Venda } from "./types.js";

export function calcularComissao(valor: number): number {
  if (!Number.isFinite(valor) || valor < 0) {
    throw new Error("O valor da venda deve ser um número válido e positivo ou zero.");
  }

  const valorEmCentavos = Math.round(valor * 100);

  if (valorEmCentavos < 10_000) {
    return 0;
  }

  const percentual = valorEmCentavos < 50_000 ? 1 : 5;
  const comissaoEmCentavos = Math.round(
    (valorEmCentavos * percentual) / 100
  );

  return comissaoEmCentavos / 100;
}

export function calcularComissoesPorVendedor(
  vendas: Venda[]
): Record<string, number> {
  const totaisEmCentavos = new Map<string, number>();

  for (const venda of vendas) {
    const comissaoEmCentavos = Math.round(
      calcularComissao(venda.valor) * 100
    );

    const totalAtual = totaisEmCentavos.get(venda.vendedor) ?? 0;

    totaisEmCentavos.set(
      venda.vendedor,
      totalAtual + comissaoEmCentavos
    );
  }

  return Object.fromEntries(
    [...totaisEmCentavos].map(([vendedor, centavos]) => [
      vendedor,
      centavos / 100,
    ])
  );
}
