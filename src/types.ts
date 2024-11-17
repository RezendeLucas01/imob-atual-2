export interface Property {
  id: string;
  referencia: string;
  categoria: string;
  valor_aluguel: number;
  valor_condominio: number;
  valor_venda: number;
  rua: string;
  bairro: string;
  regiao: string;
  quartos: number;
  garagem: number;
  descricao: string;
  fotos: string;
  disponivel_locacao: string;
  disponivel_venda: string;
  modalidade: string;
}

export interface SearchFilters {
  rua: string;
  referencia: string;
  bairro: string;
  descricao: string;
  valorMinimo: string;
  valorMaximo: string;
  regioes: string[];
  modalidades: string[];
  categorias: string[];
  disponivelAluguel: boolean;
  disponivelVenda: boolean;
}