// src/interfaces/evento.ts

export interface Evento {
    _id: string;
    nome: string;
    imagem: string;
    categoria: string;
    descricao: string;
    cep: string;
    rua: string;
    bairro: string;
    numero: string;
    complemento: string;
    cidade: string;
    estado: string;
    linkMaps: string;
    dataInicio: string;
    horaInicio: string;
    horaTermino: string;
    dataFim: string;
    valorIngressoInteira: number;
    valorIngressoMeia: number;
    quantidadeInteira: number;
    quantidadeMeia: number;
    temMeia: boolean;
    querDoar: boolean;
    valorDoacao: number;
    criadoPor: string;
    status: string;
  }