// Local: src/components/sections/User/IngressoCard/IngresseCard.tsx

import React, { useState } from 'react';
import { Ingresso } from '../../../../types/Ingresso';
import { FiMail, FiDownload, FiXCircle, FiLoader } from 'react-icons/fi';
import { Ticket } from '../Ticket/Ticket';
import './IngressoCard.css';

import jsPDF from 'jspdf';
import * as QRCode from 'qrcode';
import logo from '../../../../assets/logo-pdf.png';

// =============================================================================
// INTERFACES E TIPOS
// =============================================================================

interface Props {
  ingresso: Ingresso;
  onSendEmail: (ingressoId: string) => Promise<void>;
  isSendingEmail: boolean;
  onReembolsar: (pedidoId: string) => void;
  isReembolsando: boolean;
}

// =============================================================================
// FUNÇÕES AUXILIARES DE FORMATAÇÃO
// =============================================================================

/**
 * Formata uma string de data ISO para o formato DD/MM/AAAA
 * @param isoDateString - String de data no formato ISO
 * @returns Data formatada ou mensagem de erro
 */
const formatarData = (isoDateString?: string): string => {
  if (!isoDateString || new Date(isoDateString).toString() === 'Invalid Date') {
    return 'Data Indisponível';
  }
  
  try {
    const data = new Date(isoDateString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      timeZone: 'America/Sao_Paulo'
    });
  } catch (e) {
    console.error("Erro ao formatar data:", isoDateString, e);
    return 'Erro na Data';
  }
};

/**
 * Formata o endereço do evento para exibição
 * @param evento - Objeto do evento com informações de endereço
 * @returns String formatada com o endereço completo
 */
const formatarLocal = (evento?: Ingresso['eventoId']): string => {
  if (!evento) return 'Local não informado';

  // Coleta e filtra as partes do endereço
  const parts = [
    (evento.rua || '') + (evento.numero ? `, ${evento.numero}` : ''),
    evento.bairro,
    evento.cidade,
    evento.estado
  ].filter(part => part && part.trim() !== '');

  if (parts.length === 0) return 'Local não detalhado';

  let localString = '';
  
  // Formatação especial quando temos cidade e estado
  if (parts.length > 1 && evento.cidade && evento.estado) {
    localString = parts.slice(0, -2).join(', ');
    if (localString) localString += ', ';
    localString += `${evento.cidade} - ${evento.estado}`;
  } else {
    // Fallback: junta tudo com vírgula
    localString = parts.join(', ');
  }

  return localString;
};

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export const IngressoCard: React.FC<Props> = ({
  ingresso,
  onSendEmail,
  isSendingEmail,
  onReembolsar,
  isReembolsando
}) => {
  // ===========================================================================
  // ESTADOS E HOOKS
  // ===========================================================================

  const [showIngressoModal, setShowIngressoModal] = useState(false);

  // ===========================================================================
  // DADOS E FORMATAÇÕES
  // ===========================================================================

  const evento = ingresso.eventoId;
  const comprovanteId = ingresso.pedidoId || ingresso.id;
  
  // Verifica se o ingresso está ativo (status 'Pago')
  const isTicketActive = ingresso.status === 'Pago';
  
  // Dados formatados para exibição
  const dataCompraFormatada = formatarData(ingresso.createdAt);
  const dataEventoFormatada = formatarData(evento?.dataInicio);
  const localEventoFormatado = formatarLocal(evento);
  const nomeEvento = evento?.nome || 'Nome do Evento Indisponível';
  const eventoIdQr = evento?._id || 'evento_invalido';
  
  // Dados para gerar QR Code
  const qrData = `ingressoId=${ingresso.id};pedidoId=${ingresso.pedidoId || 'N/A'};eventoId=${eventoIdQr};status=${ingresso.status}`;

  // Lógica para reembolso (permitido apenas nos primeiros 7 dias)
  const dataCompra = new Date(ingresso.createdAt);
  const dataLimite = new Date(dataCompra.getTime() + 7 * 24 * 60 * 60 * 1000);
  const agora = new Date();
  const podeReembolsar = isTicketActive && (agora < dataLimite);

  // Classes CSS dinâmicas baseadas no status
  const cardStatusClass = `IngressoCard--${ingresso.status?.toLowerCase() || 'pendente'}`;
  const cardActiveClass = isTicketActive ? 'IngressoCard--active' : 'IngressoCard--inactive';

  // ===========================================================================
  // MANIPULADORES DE EVENTOS
  // ===========================================================================

  /**
   * Gera PDF do comprovante do ingresso com logo e QR Code
   */
  const handleGerarPdf = async () => {
    // Verifica se o ingresso está ativo
    if (!isTicketActive) {
      alert('Apenas ingressos com pagamento aprovado podem gerar PDF.');
      return;
    }

    // Configurações do PDF (formato A6)
    const A6_WIDTH = 105;
    const A6_HEIGHT = 148;
    const MARGIN = 10;
    const CONTENT_WIDTH = A6_WIDTH - MARGIN * 2;

    try {
      const pdf = new jsPDF('p', 'mm', 'a6');
      let currentY = 8; // Posição Y inicial

      // === LOGO ===
      const logoWidth = 31;
      const logoHeight = 27;
      const logoX = (A6_WIDTH - logoWidth) / 2; // Centraliza horizontalmente
      pdf.addImage(logo, 'PNG', logoX, 2, logoWidth, logoHeight);
      currentY += logoHeight + 4;

      // === TÍTULO E ID ===
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor('#2d3748');
      pdf.text('COMPROVANTE', MARGIN, currentY);
      
      // ID alinhado à direita
      const idText = `#${comprovanteId}`;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      const idX = A6_WIDTH - MARGIN - pdf.getTextWidth(idText);
      pdf.setTextColor('#4a5568');
      pdf.text(idText, idX, currentY);
      
      currentY += 10;
      pdf.setDrawColor('#e2e8f0');
      pdf.line(MARGIN, currentY, A6_WIDTH - MARGIN, currentY);
      currentY += 8;

      // === NOME DO EVENTO ===
      pdf.setFontSize(8);
      pdf.setTextColor('#a0aec0');
      pdf.text('NOME DO EVENTO', MARGIN, currentY);
      currentY += 5;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor('#2d3748');
      const nomeEventoLines = pdf.splitTextToSize(nomeEvento, CONTENT_WIDTH);
      pdf.text(nomeEventoLines, MARGIN, currentY);
      currentY += nomeEventoLines.length * 5 + 3;

      pdf.setDrawColor('#e2e8f0');
      pdf.line(MARGIN, currentY, A6_WIDTH - MARGIN, currentY);
      currentY += 8;

      // === INFORMAÇÕES: LOCAL + DATA ===
      /**
       * Função auxiliar para desenhar informações com label e valor
       */
      const drawInfo = (label: string, value: string, x: number, y: number, maxWidth = 40) => {
        // Label
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor('#a0aec0');
        pdf.text(label, x, y);
        
        // Valor
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#4a5568');
        const lines = pdf.splitTextToSize(value, maxWidth);
        pdf.text(lines, x, y + 4);
        
        return y + 4 + lines.length * 4;
      };

      // Desenha informações de local e data
      let leftY = drawInfo('LOCAL DO EVENTO', localEventoFormatado, MARGIN, currentY, 45);
      let rightY = drawInfo('DATA DO EVENTO', dataEventoFormatada, A6_WIDTH / 2 + 2, currentY, 40);
      currentY = Math.max(leftY, rightY) + 5;

      pdf.line(MARGIN, currentY, A6_WIDTH - MARGIN, currentY);
      currentY += 6;

      // === GRADE DE INFORMAÇÕES (4 COLUNAS) ===
      const colWidth = CONTENT_WIDTH / 4;
      const xPositions = [MARGIN, MARGIN + colWidth, MARGIN + colWidth * 2, MARGIN + colWidth * 3];

      /**
       * Função auxiliar para desenhar células da grade
       */
      const drawGridCell = (label: string, value: string, x: number, y: number, color = '#2d3748') => {
        // Label
        pdf.setFontSize(6.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor('#a0aec0');
        pdf.text(label, x, y);
        
        // Valor
        pdf.setFontSize(8.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(color);
        const valueLines = pdf.splitTextToSize(value, colWidth - 1);
        pdf.text(valueLines, x, y + 3);
        
        return y + 3 + (valueLines.length * 3.5);
      };

      // Desenha as células da grade
      let lineHeights: number[] = [];
      lineHeights.push(drawGridCell('DATA DA COMPRA', dataCompraFormatada, xPositions[0], currentY));
      lineHeights.push(drawGridCell('TIPO', ingresso.tipoIngresso, xPositions[1], currentY));
      lineHeights.push(drawGridCell('VALOR', `R$ ${ingresso.valor?.toFixed(2) || '0.00'}`, xPositions[2], currentY, '#059669'));

      // === STATUS COM CORES ===
      const statusText = ingresso.status === 'Pago' ? 'APROVADO' : (ingresso.status || 'PENDENTE').toUpperCase();
      const statusWidth = pdf.getTextWidth(statusText) + 4;

      // Define cores baseadas no status
      let statusColorFill = '#FEFBC0'; // Pendente (Amarelo claro)
      let statusColorText = '#9A6B00';
      let statusColorBorder = '#F6E05E';

      if (ingresso.status === 'Pago') {
        statusColorFill = '#E6FFFA'; // Aprovado (Verde)
        statusColorText = '#2F855A';
        statusColorBorder = '#B2F5EA';
      } else if (ingresso.status === 'Recusado' || ingresso.status === 'Cancelado') {
        statusColorFill = '#FED7D7'; // Recusado (Vermelho)
        statusColorText = '#C53030';
        statusColorBorder = '#FEB2B2';
      }

      // Desenha badge do status
      pdf.setFillColor(statusColorFill);
      pdf.setDrawColor(statusColorBorder);
      pdf.roundedRect(xPositions[3], currentY + 1, statusWidth, 6, 2, 2, 'FD');
      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(statusColorText);
      pdf.text(statusText, xPositions[3] + 2, currentY + 5);
      
      lineHeights.push(currentY + 10);
      currentY = Math.max(...lineHeights) + 5;

      pdf.setDrawColor('#fff');
      pdf.line(MARGIN, currentY, A6_WIDTH - MARGIN, currentY);
      currentY += 5;

      // === QR CODE ===
      const qrCodeSize = 30;
      const qrCodeX = (A6_WIDTH - qrCodeSize) / 2;
      const qrCodeY = A6_HEIGHT - qrCodeSize - 12;
      const qrCodeDataURL = await QRCode.toDataURL(qrData, { width: 256, margin: 1 });

      pdf.addImage(qrCodeDataURL, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
      pdf.setFontSize(7);
      pdf.setTextColor('#718096');
      pdf.text('Apresente este QR Code na entrada do evento', A6_WIDTH / 2, qrCodeY + qrCodeSize + 5, { align: 'center' });

      // Salva o PDF
      pdf.save(`ingresso-${nomeEvento.replace(/[^a-zA-Z0-9]/g, '_')}-${comprovanteId}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Verifique o console.');
    }
  };

  /**
   * Envia ingresso por email
   */
  const handleEnviarEmail = () => {
    if (!isTicketActive) {
      alert('Apenas ingressos com pagamento aprovado podem ser enviados por e-mail.');
      return;
    }
    if (!isSendingEmail) {
      onSendEmail(ingresso.id);
    }
  };

  /**
   * Abre modal de visualização do ingresso
   */
  const handleAbrirIngresso = () => {
    if (isTicketActive) {
      setShowIngressoModal(true);
    } else {
      console.log(`Visualização indisponível. Status do ingresso: ${ingresso.status || 'Pendente'}.`);
    }
  };

  /**
   * Fecha modal de visualização
   */
  const handleFecharModal = () => setShowIngressoModal(false);

  // ===========================================================================
  // RENDERIZAÇÃO
  // ===========================================================================

  return (
    <>
      {/* CARD PRINCIPAL */}
      <div
        className={`IngressoCard ${cardStatusClass} ${cardActiveClass}`}
        onClick={handleAbrirIngresso}
        style={{ cursor: isTicketActive ? 'pointer' : 'not-allowed' }}
      >
        <div className="IngressoCard-ticket">

          {/* CABEÇALHO */}
          <div className="IngressoCard-ticket-header">
            <div className="IngressoCard-ticket-title">
              <h3>COMPROVANTE</h3>
              <span className="IngressoCard-ticket-id">#{comprovanteId}</span>
              {isTicketActive && <span className='ingressHint'>Clique sobre o ingresso para abrir</span>}
            </div>
          </div>

          {/* CORPO PRINCIPAL */}
          <div className="IngressoCard-ticket-main">
            <div className="IngressoCard-event">
              <span className="IngressoCard-info-label">Nome do Evento</span>
              <h3 className="IngressoCard-event-name">{nomeEvento}</h3>
              <div className="IngressoCard-event-details">
                <div className="IngressoCard-event-detail-group">
                  <span className="IngressoCard-info-label">Local do Evento:</span>
                  <span className="IngressoCard-event-location"> {localEventoFormatado}</span>
                </div>
                <div className="IngressoCard-event-detail-group">
                  <span className="IngressoCard-info-label">Data do Evento:</span>
                  <span className="IngressoCard-event-date"> {dataEventoFormatada}</span>
                </div>
              </div>
            </div>
          </div>

          {/* DETALHES SECUNDÁRIOS */}
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
                <span className="IngressoCard-info-price">R$ {ingresso.valor?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="IngressoCard-info-item">
                <span className="IngressoCard-info-label">Status</span>
                <span className={`IngressoCard-info-status IngressoCard-info-status--${ingresso.status?.toLowerCase() || 'pendente'}`}>
                  {ingresso.status === 'Pago' ? 'Aprovado' : (ingresso.status || 'Pendente')}
                </span>
              </div>
            </div>
          </div>

          {/* AÇÕES */}
          <div className="IngressoCard-ticket-actions" onClick={(e) => e.stopPropagation()}>

            {/* Botão Baixar PDF */}
            <button
              className="IngressoCard-ticket-btn IngressoCard-ticket-btn--secondary"
              onClick={handleGerarPdf}
              disabled={!isTicketActive || isSendingEmail || isReembolsando}
              aria-label={isTicketActive ? "Baixar Comprovante em PDF" : "PDF indisponível para este status"}
            >
              <FiDownload className="IngressoCard-ticket-btn-icon" />
              Baixar Comprovante (PDF)
            </button>

            {/* Botão Reembolsar */}
            {podeReembolsar && (
              <button
                className="IngressoCard-ticket-btn IngressoCard-ticket-btn--reembolsar"
                onClick={() => onReembolsar(ingresso.pedidoId)}
                disabled={isReembolsando || isSendingEmail}
                aria-label="Cancelar pedido e solicitar reembolso"
              >
                {isReembolsando ? (
                  <FiLoader className="IngressoCard-ticket-btn-icon spin" />
                ) : (
                  <FiXCircle className="IngressoCard-ticket-btn-icon" />
                )}
                {isReembolsando ? 'Processando...' : 'Reembolso'}
              </button>
            )}

            {/* Mensagem de status */}
            {!podeReembolsar && (
              <div className="IngressoCard-status-message">
                {ingresso.status === 'Pago' && agora >= dataLimite ? (
                  'Prazo de reembolso (7 dias) expirou.'
                ) : (
                  `Ações indisponíveis (Status: ${ingresso.status})`
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE VISUALIZAÇÃO */}
      {showIngressoModal && (
        <div className="IngressoCard-modal">
          <div className="IngressoCard-modal-content">

            {/* CABEÇALHO DO MODAL */}
            <div className="IngressoCard-modal-header">
              <button className="IngressoCard-modal-close" onClick={handleFecharModal}>×</button>
            </div>

            {/* CORPO DO MODAL */}
            <div className="IngressoCard-modal-body">
              {isTicketActive ? (
                <Ticket ingresso={ingresso} />
              ) : (
                <p style={{ padding: '20px', textAlign: 'center' }}>Visualização indisponível.</p>
              )}
            </div>

            {/* AÇÕES DO MODAL */}
            <div className="IngressoCard-ticket-modal-actions">
              {isTicketActive && (
                <button
                  className="IngressoCard-ticket-modal-action IngressoCard-ticket-modal-action--primary"
                  onClick={handleEnviarEmail}
                  disabled={isSendingEmail}
                  aria-label="Enviar ingresso por e-mail"
                >
                  <FiMail className="IngressoCard-ticket-modal-action-icon" />
                  {isSendingEmail ? 'Enviando...' : 'Enviar por Email'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};