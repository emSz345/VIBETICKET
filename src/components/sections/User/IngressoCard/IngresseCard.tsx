import React from 'react';
import { Ingresso } from '../../../../types/Ingresso';
import './IngressoCard.css';

interface Props {
  ingresso: Ingresso;
}

export const IngressoCard: React.FC<Props> = ({ ingresso }) => {
  return (
    <div className="ingresso-card">
      <h3>#{ingresso.id} - {ingresso.cliente}</h3>
      <div className="detalhes">
        <p><strong>Evento:</strong> {ingresso.evento}</p>
        <p><strong>Data do show:</strong> {ingresso.dataEvento}</p>
        <p><strong>Status:</strong> {ingresso.status}</p>
        <p><strong>Valor:</strong> R$ {ingresso.valor.toFixed(2)}</p>
        <p><strong>Data Compra:</strong> {ingresso.dataCompra}</p>
        <p><strong>Email:</strong> {ingresso.email}</p>
      </div>
    </div>
  );
};