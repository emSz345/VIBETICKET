// Local: src/types/Ingresso.ts

// Interface para os dados do Evento que serão populados pelo backend
// Adapte os nomes dos campos se forem diferentes no seu Model 'Event'
interface EventoPopulado {
  _id: string;        // ID do Evento
  nome: string;       // Nome do Evento (substitui nomeEvento)
  dataInicio: string; // Data de início do evento (substitui dataEvento)
  // Adicione os campos de localização do seu Model 'Event'
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  // Adicione outros campos se precisar (ex: imagem do evento)
  // imagem?: string;
}

export interface Ingresso {
  // --- Campos do MongoDB ---
  _id: string;       // O ID real do banco de dados
  id: string;        // Mapeado de _id, usado como 'key' no React
  createdAt?: string; // Data da compra
  updatedAt?: string;

  // --- IDs de Relação ---
  userId: string;
  pedidoId: string;     // <-- ID do Pedido (importante)
  eventoId: EventoPopulado; // <-- MUDANÇA PRINCIPAL: Agora é um objeto populado
  paymentId?: string;    // <-- Tornar opcional (para status Pendente)

  // --- Dados do Ingresso ---
  tipoIngresso: 'Inteira' | 'Meia';
  valor: number;
  status: 'Pago' | 'Pendente' | 'Cancelado' | 'Recusado' | 'Reembolsado' | 'Expirado'; // <-- Adicionado 'Recusado'

  // --- Campos REMOVIDOS (agora virão de eventoId) ---
  // nomeEvento: string;
  // localEvento: string;
  // dataEvento: string;

  // Opcional: Se seu backend popular dados do comprador também
  comprador?: {
    nome: string;
    // email?: string; // etc.
  };
}