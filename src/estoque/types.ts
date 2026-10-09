export interface Produto {
  codigoProduto: number;
  descricaoProduto: string;
  estoque: number;
}

export interface DadosMovimentacao {
  codigoProduto: number;
  tipo: "entrada" | "saida";
  quantidade: number;
  descricao: string;
}

export interface Movimentacao extends DadosMovimentacao {
  id: number;
  estoqueFinal: number;
}
