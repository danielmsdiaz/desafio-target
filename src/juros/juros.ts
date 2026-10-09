export interface ResultadoJuros {
  diasAtraso: number;
  juros: number;
  total: number;
}

function converterDataParaDias(data: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    throw new Error("Informe a data no formato AAAA-MM-DD.");
  }

  const dataConvertida = new Date(`${data}T00:00:00.000Z`);

  if (
    Number.isNaN(dataConvertida.getTime()) ||
    dataConvertida.toISOString().slice(0, 10) !== data
  ) {
    throw new Error("Data inválida.");
  }

  return dataConvertida.getTime() / 86_400_000;
}

function obterDataHoje(): string {
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function calcularJuros(
  valor: number,
  vencimento: string,
  dataReferencia: string = obterDataHoje()
): ResultadoJuros {
  if (!Number.isFinite(valor) || valor < 0) {
    throw new Error("O valor deve ser um número válido e não negativo.");
  }

  const valorEmCentavos = Math.round(valor * 100);

  if (!Number.isSafeInteger(valorEmCentavos)) {
    throw new Error("Valor acima do limite permitido.");
  }

  const diaVencimento = converterDataParaDias(vencimento);
  const diaReferencia = converterDataParaDias(dataReferencia);

  const diasAtraso = Math.max(0, diaReferencia - diaVencimento);

  const jurosEmCentavos = Math.round(
    (valorEmCentavos * diasAtraso) / 40
  );

  const totalEmCentavos = valorEmCentavos + jurosEmCentavos;

  if (!Number.isSafeInteger(totalEmCentavos)) {
    throw new Error("Total acima do limite permitido.");
  }

  return {
    diasAtraso,
    juros: jurosEmCentavos / 100,
    total: totalEmCentavos / 100,
  };
}