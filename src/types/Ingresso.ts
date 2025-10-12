// Local: src/types/Ingresso.ts

export interface Ingresso {
  // --- Campos do MongoDB ---
  _id: string; // O ID real do banco de dados
  id: string;  // Mapeado de _id, usado como 'key' no React
  createdAt?: string; 
  
  // --- IDs de Relação ---
  userId: string;
  eventoId: string;
  paymentId: string;
  
  // --- Dados do Ingresso (Denormalizados do Evento) ---
  nomeEvento: string;
  localEvento: string;
  dataEvento: string; // Ex: "2025-12-25T18:00:00.000Z"
  tipoIngresso: 'Inteira' | 'Meia'; 
  valor: number;
  status: 'Pago' | 'Pendente' | 'Cancelado';

  // 🔥 MELHORIA FUTURA: O ideal é que seu backend popule estes campos.
  // O código abaixo funcionará mesmo sem eles, mas com eles, fica mais robusto.
  comprador?: {
    nome: string;
  };
  evento?: {
    nome: string;
  };
}