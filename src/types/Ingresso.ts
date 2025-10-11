// Local: ../../types/Ingresso.ts (ou onde estiver sua interface)

export interface Ingresso {
    // 🔥 CRÍTICO: Campos do MongoDB
    _id: string; // O ID real retornado pelo Mongo
    id: string;  // Campo que será usado no React para a 'key' (mapeado de _id)
    createdAt: string; 
    updatedAt: string;
    
    // 🔥 Campos do Usuário e Pagamento
    userId: string;
    paymentId: string;
    
    // 🔥 Campos do Evento (Puxados do Model 'Event' no Webhook)
    eventoId: string;
    localEvento: string; // Ex: 'Rua ABC, 123 - Centro, São Paulo, SP'
    tipoIngresso: 'Inteira' | 'Meia'; 
    
    // Campos principais do Ingresso
    nomeEvento: string;
    dataEvento: string;
    valor: number;
    status: 'Pago' | 'Pendente' | 'Cancelado';

    // Se você tiver cliente/email no frontend, eles viriam de uma população de 'userId',
    // mas por enquanto, esses campos abaixo não estão no seu model Mongoose:
    // cliente?: string;
    // email?: string;
    // dataCompra?: string; 
}