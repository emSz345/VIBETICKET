import React from 'react';
import { Ingresso } from '../../../../types/Ingresso';
import './IngressoCard.css';

interface Props {
  ingresso: Ingresso;
}

export const IngressoCard: React.FC<Props> = ({ ingresso }) => {

  // Formata a data de criação para ser a "Data da Compra"
  const dataCompraFormatada = ingresso.createdAt
    ? new Date(ingresso.createdAt).toLocaleDateString('pt-BR')
    : 'N/A';

  // Você pode precisar de uma lógica de busca (população) no backend para obter o nome do cliente e email.
  // Como esses campos não estão no seu model Mongoose atual, vamos usar o ID do usuário.
  const identificador = ingresso._id || 'ID do Usuário';

  return (
    <div className="ingresso-card">
      <h3>#{ingresso.id} - ID do Evento: {identificador}</h3>
      <div className="detalhes">
        <p><strong>Evento:</strong> {ingresso.nomeEvento}</p> {/* 🔥 CORREÇÃO: nomeEvento */}
        <p><strong>Local:</strong> {ingresso.localEvento}</p> {/* 🔥 NOVO: localEvento */}
        <p><strong>Tipo:</strong> {ingresso.tipoIngresso}</p> {/* 🔥 NOVO: tipoIngresso */}
        <p><strong>Data do Evento:</strong> {ingresso.dataEvento}</p>
        <p><strong>Status:</strong> {ingresso.status}</p>
        <p><strong>Valor:</strong> R$ {ingresso.valor.toFixed(2)}</p>
        <p><strong>Data Compra:</strong> {dataCompraFormatada}</p> {/* 🔥 CORREÇÃO: createdAt */}
        {/* Os campos 'cliente' e 'email' foram removidos pois não existem no seu modelo Ingresso. */}
      </div>
    </div>
  );
}; 