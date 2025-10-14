import React, { useState } from 'react';
import { Ingresso } from '../../../../types/Ingresso';
import { FiMail, FiDownload } from 'react-icons/fi';
import { Ticket } from '../Ticket/Ticket';
import './IngressoCard.css';

import jsPDF from 'jspdf';
import * as QRCode from 'qrcode';

interface Props {
  ingresso: Ingresso;
  onSendEmail: (ingressoId: string) => Promise<void>;
  isSendingEmail: boolean;
}

export const IngressoCard: React.FC<Props> = ({ ingresso, onSendEmail, isSendingEmail }) => {
  const [showIngressoModal, setShowIngressoModal] = useState(false);

  const dataCompraFormatada = ingresso.createdAt
    ? new Date(ingresso.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : 'N/A';

  const dataEventoFormatada = new Date(ingresso.dataEvento).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  const handleGerarPdf = async () => {
    const A6_WIDTH = 105;
    const A6_HEIGHT = 148;
    const MARGIN = 10;
    const CONTENT_WIDTH = A6_WIDTH - MARGIN * 2;

    try {
      const pdf = new jsPDF('p', 'mm', 'a6');
      let currentY = 15;

      // TÍTULO
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor('#2d3748');
      pdf.text('COMPROVANTE', MARGIN, currentY);

      // ID (longo) - Alinhado à direita
      const idText = `#${ingresso.id}`;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      const idX = A6_WIDTH - MARGIN - pdf.getTextWidth(idText);
      pdf.setTextColor('#4a5568');
      pdf.text(idText, idX, currentY);

      currentY += 10;

      // Separador
      pdf.setDrawColor('#e2e8f0');
      pdf.line(MARGIN, currentY, A6_WIDTH - MARGIN, currentY);
      currentY += 8;

      // Nome do Evento
      pdf.setFontSize(8);
      pdf.setTextColor('#a0aec0');
      pdf.text('NOME DO EVENTO', MARGIN, currentY);
      currentY += 5;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor('#2d3748');
      const nomeEventoLines = pdf.splitTextToSize(ingresso.nomeEvento, CONTENT_WIDTH);
      pdf.text(nomeEventoLines, MARGIN, currentY);
      currentY += nomeEventoLines.length * 5 + 3;

      // Separador
      pdf.setDrawColor('#e2e8f0');
      pdf.line(MARGIN, currentY, A6_WIDTH - MARGIN, currentY);
      currentY += 8;

      // Info: Local + Data
      const drawInfo = (label: string, value: string, x: number, y: number, maxWidth = 40) => {
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor('#a0aec0');
        pdf.text(label, x, y);

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#4a5568');
        const lines = pdf.splitTextToSize(value, maxWidth);
        pdf.text(lines, x, y + 4);
        return y + 4 + lines.length * 4;
      };

      let leftY = drawInfo('LOCAL DO EVENTO', ingresso.localEvento, MARGIN, currentY, 45);
      let rightY = drawInfo('DATA DO EVENTO', dataEventoFormatada, A6_WIDTH / 2 + 2, currentY, 40);
      currentY = Math.max(leftY, rightY) + 5;

      // Separador
      pdf.line(MARGIN, currentY, A6_WIDTH - MARGIN, currentY);
      currentY += 6;

      // Grade: 4 colunas
      const colWidth = CONTENT_WIDTH / 4;
      const xPositions = [MARGIN, MARGIN + colWidth, MARGIN + colWidth * 2, MARGIN + colWidth * 3];

      const drawGridCell = (label: string, value: string, x: number, y: number, color = '#2d3748') => {
        pdf.setFontSize(6.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor('#a0aec0');
        pdf.text(label, x, y);

        pdf.setFontSize(8.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(color);
        const valueLines = pdf.splitTextToSize(value, colWidth - 1);
        pdf.text(valueLines, x, y + 3);
        return y + 3 + (valueLines.length * 3.5);
      };

      let lineHeights: number[] = [];
      lineHeights.push(drawGridCell('DATA DA COMPRA', dataCompraFormatada, xPositions[0], currentY));
      lineHeights.push(drawGridCell('TIPO', ingresso.tipoIngresso, xPositions[1], currentY));
      lineHeights.push(drawGridCell('VALOR', `R$ ${ingresso.valor.toFixed(2)}`, xPositions[2], currentY, '#3498db'));

      // STATUS
      const statusText = ingresso.status === 'Pago' ? 'APROVADO' : ingresso.status.toUpperCase();
      const statusWidth = pdf.getTextWidth(statusText) + 4;
      pdf.setFillColor('#e6fffa');
      pdf.setDrawColor('#b2f5ea');
      pdf.roundedRect(xPositions[3], currentY + 1, statusWidth, 6, 2, 2, 'FD');

      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor('#2f855a');
      pdf.text(statusText, xPositions[3] + 2, currentY + 5);

      lineHeights.push(currentY + 10);

      currentY = Math.max(...lineHeights) + 5;

      // Separador final
      pdf.setDrawColor('#e2e8f0');
      pdf.line(MARGIN, currentY, A6_WIDTH - MARGIN, currentY);
      currentY += 5;

      // QR Code
      const qrCodeSize = 30;
      const qrCodeX = (A6_WIDTH - qrCodeSize) / 2;
      const qrCodeY = A6_HEIGHT - qrCodeSize - 12;

      const qrData = `ingresso:${ingresso.id}-evento:${ingresso.eventoId}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrData, { width: 256, margin: 1 });

      pdf.addImage(qrCodeDataURL, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

      pdf.setFontSize(7);
      pdf.setTextColor('#718096');
      pdf.text('Apresente este QR Code caso seja solicitado', A6_WIDTH / 2, qrCodeY + qrCodeSize + 5, { align: 'center' });

      pdf.save(`comprovante-${ingresso.nomeEvento.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Verifique o console.');
    }
  };


  const handleEnviarEmail = () => {
    if (!isSendingEmail) {
      onSendEmail(ingresso.id);
    }
  };

  const handleAbrirIngresso = () => setShowIngressoModal(true);
  const handleFecharModal = () => setShowIngressoModal(false);

  return (
    <>
      {/* O JSX do card e da modal não precisa ser alterado */}
      <div className="IngressoCard" onClick={handleAbrirIngresso}>
        <div className="IngressoCard-ticket">
          <div className="IngressoCard-ticket-header">
            <div className="IngressoCard-ticket-title">
              <h3>COMPROVANTE</h3>
              <span className="IngressoCard-ticket-id">#{ingresso.id}</span>
            </div>
          </div>
          <div className="IngressoCard-ticket-main">
            <div className="IngressoCard-event">
              <span className="IngressoCard-info-label">Nome do Evento</span>
              <h3 className="IngressoCard-event-name">{ingresso.nomeEvento}</h3>
              <div className="IngressoCard-event-details">
                <div className="IngressoCard-event-detail-group">
                  <span className="IngressoCard-info-label">Local do Evento:</span>
                  <span className="IngressoCard-event-location"> {ingresso.localEvento}</span>
                </div>
                <div className="IngressoCard-event-detail-group">
                  <span className="IngressoCard-info-label">Data do Evento:</span>
                  <span className="IngressoCard-event-date"> {dataEventoFormatada}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="IngressoCard-ticket-secondary">
            <div className="IngressoCard-ticket-row">
              <div className="IngressoCard-info-item">
                <span className="IngressoCard-info-label">Data da Compra</span>
                <span className="IngressoCard-info-value">{dataCompraFormatada}</span>
              </div>
              <div className="IngressoCard-info-item">
                <span className="IngressoCard-info-label">Tipo</span>
                <span className="IngressoCard-info-value">{ingresso.tipoIngresso}</span>
              </div>
              <div className="IngressoCard-info-item">
                <span className="IngressoCard-info-label">Valor</span>
                <span className="IngressoCard-info-price">R$ {ingresso.valor.toFixed(2)}</span>
              </div>
              <div className="IngressoCard-info-item">
                <span className="IngressoCard-info-label">Status</span>
                <span className={`IngressoCard-info-status IngressoCard-info-status--${ingresso.status.toLowerCase()}`}>
                  {ingresso.status === 'Pago' ? 'Aprovado' : ingresso.status}
                </span>
              </div>
            </div>
          </div>
          <div className="IngressoCard-ticket-actions" onClick={(e) => e.stopPropagation()}>
            <button className="IngressoCard-ticket-btn IngressoCard-ticket-btn--secondary" onClick={handleGerarPdf}>
              <FiDownload className="IngressoCard-ticket-btn-icon" />
              Baixar Comprovante (PDF)
            </button>
          </div>
        </div>
      </div>
      {showIngressoModal && (
        <div className="IngressoCard-modal">
          <div className="IngressoCard-modal-content">
            <div className="IngressoCard-modal-header">
              <button className="IngressoCard-modal-close" onClick={handleFecharModal}>×</button>
            </div>
            <div className="IngressoCard-modal-body">
              <Ticket ingresso={ingresso} />
            </div>
            <div className="IngressoCard-ticket-modal-actions">
              <button
                className="IngressoCard-ticket-modal-action IngressoCard-ticket-modal-action--primary"
                onClick={handleEnviarEmail}
                disabled={isSendingEmail}
              >
                <FiMail className="IngressoCard-ticket-modal-action-icon" />
                {isSendingEmail ? 'Enviando...' : 'Enviar por Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};