// Local: src/components/sections/User/Ticket/TicketParaPdf.tsx (NOVO COMPONENTE SIMPLIFICADO)

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Ingresso } from '../../../../types/Ingresso';
import './TicketParaPdf.css'; // ✨ Este CSS será a chave

interface Props {
  ingresso: Ingresso;
}

export const TicketParaPdf: React.FC<Props> = ({ ingresso }) => {
  const dataFormatada = new Date(ingresso.dataEvento).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // O componente será o mais semântico possível, sem estilos inline
  return (
    <div className="pdf-ticket-container">
      {/* SEÇÃO SUPERIOR */}
      <div className="pdf-ticket-top-section">
        <p className="pdf-label-digital">TICKET DIGITAL</p>
        <h1 className="pdf-event-name-top">{ingresso.nomeEvento}</h1>
        <div className="pdf-qr-code-area">
          <QRCodeSVG
            value={`ingresso:${ingresso.id}-evento:${ingresso.eventoId}`}
            size={90} // Tamanho específico para o QR Code no PDF
            level="H"
            includeMargin={true} // Inclui margem interna para o QR
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
      </div>

      {/* SEÇÃO INFERIOR */}
      <div className="pdf-ticket-bottom-section">
        <div className="pdf-detail-group-header">
          <span className="pdf-detail-label-header">NOME DO EVENTO</span>
          <span className="pdf-detail-value-header">{ingresso.nomeEvento}</span>
        </div>

        <div className="pdf-ticket-id-box">{ingresso.id}</div>

        <div className="pdf-details-grid">
          <div className="pdf-detail-cell">
            <span className="pdf-detail-label">DIA DO EVENTO</span>
            <span className="pdf-detail-value">{dataFormatada}</span>
          </div>
          <div className="pdf-detail-cell">
            <span className="pdf-detail-label">TIPO</span>
            <span className="pdf-detail-value">{ingresso.tipoIngresso}</span>
          </div>
          <div className="pdf-detail-cell">
            <span className="pdf-detail-label">VALOR</span>
            <span className="pdf-detail-value">R$ {ingresso.valor.toFixed(2)}</span>
          </div>
          <div className="pdf-detail-cell">
            <span className="pdf-detail-label">STATUS</span>
            <span className={`pdf-detail-value status--${ingresso.status.toLowerCase()}`}>
              {ingresso.status === 'Pago' ? 'Aprovado' : ingresso.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};