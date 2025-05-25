export interface Evento {
  id: number;
  nome: string;
  imagem: string;
  data: string; 
  hora: string; 
  descricao: string;
  categoria: string;
  ingressos: number;
  criador: {
    nome: string;
    email: string;
  };
  local: {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    urlMaps: string;
  };
}
