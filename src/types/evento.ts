export interface Evento {
  _id: string;
  nome: string;
  imagem: string;
  categoria: string;
  descricao: string;
  rua: string;
  cidade: string;
  estado: string;
  linkMaps: string;
  dataInicio: string;
  horaInicio: string;
  dataFim?: string;
  valorIngressoInteira?: number;
  valorIngressoMeia?: number;
  quantidadeInteira?: number;
  quantidadeMeia?: number;
  temMeia?: boolean;
  querDoar?: boolean;
  valorDoacao?: number;
  criadoPor: string;
}
