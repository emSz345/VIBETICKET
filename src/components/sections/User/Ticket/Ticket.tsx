// Local: src/components/sections/User/Ticket/Ticket.tsx

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Ingresso } from '../../../../types/Ingresso';
import './Ticket.css'; // CSS para a exibição na modal

interface Props {
  ingresso: Ingresso;
}

export const Ticket: React.FC<Props> = ({ ingresso }) => {

  const dataFormatada = new Date(ingresso.dataEvento).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="ticket-classic">
      {/* Parte Superior do Ticket */}
      <div className="ticket-top-section">
        <div className="ticket-main-title">
          <div className="ticket-event-type">Ticket Digital</div>
          <div className="ticket-event-name">{ingresso.nomeEvento}</div>
        </div>

        <div className="ticket-qr-floating">
          <QRCodeSVG
            value={`ingresso:${ingresso.id}-evento:${ingresso.eventoId}`}
            size={80}
            level="H"
            includeMargin
          />
        </div>
      </div>

      {/* Linha de Perfuração */}
      <div className="ticket-perforation-line">
        <div className="perforation-dots"></div>
      </div>

      {/* Parte Inferior do Ticket */}
      <div className="ticket-bottom-section">
        <div className="ticket-bottom-header">
          <div className="ticket-event-type">Nome do Evento</div>
          <div className="ticket-event-name-small">{ingresso.nomeEvento}</div>
        </div>

        <div className="ticket-barcode-section">
          <div className="ticket-number">{ingresso.id}</div>
        </div>

        <div className="ticket-info-grid">
          <div className="info-cell">
            <span className="cell-label">Dia do Evento</span>
            <span className="cell-value">{dataFormatada}</span>
          </div>
          <div className="info-cell">
            <span className="cell-label">Tipo</span>
            <span className="cell-value">{ingresso.tipoIngresso}</span>
          </div>
          <div className="info-cell">
            <span className="cell-label">Valor</span>
            <span className="cell-value">R$ {ingresso.valor.toFixed(2)}</span>
          </div>
          <div className="info-cell">
            <span className="cell-label">STATUS</span>
            <span className={`cell-value status--${ingresso.status.toLowerCase()}`}>
              {ingresso.status === 'Pago' ? 'Aprovado' : ingresso.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};