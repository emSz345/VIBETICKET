export interface Ingresso {
    id: number;
    evento: string;
    dataEvento: string;
    valor: number;
    status: 'Pago' | 'Cancelado';
    cliente: string;
    email: string;
    dataCompra: string;
}