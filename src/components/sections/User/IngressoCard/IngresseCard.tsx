// Local: src/components/sections/User/IngressoCard/IngresseCard.tsx

import React, { useState } from 'react';
import { Ingresso } from '../../../../types/Ingresso'; // <-- Certifique-se que esta é a interface ATUALIZADA
import { FiMail, FiDownload } from 'react-icons/fi';
import { Ticket } from '../Ticket/Ticket'; // <-- Lembre-se de atualizar este componente também
import './IngressoCard.css';

import jsPDF from 'jspdf';
import * as QRCode from 'qrcode'; // Use 'import QRCode from 'qrcode';' se for o default export

interface Props {
  ingresso: Ingresso;
  onSendEmail: (ingressoId: string) => Promise<void>;
  isSendingEmail: boolean;
}

// --- FUNÇÕES HELPER DE FORMATAÇÃO (Mova para um arquivo utils/formatters.ts se preferir) ---
const formatarData = (isoDateString?: string): string => {
  // Retorna string vazia ou um placeholder se a data for inválida/ausente
  if (!isoDateString || new Date(isoDateString).toString() === 'Invalid Date') {
    return 'Data Indisponível';
  }
  try {
    const data = new Date(isoDateString);
    // Formato DD/MM/AAAA
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' // Use fuso horário consistente
    });
  } catch (e) {
    console.error("Erro ao formatar data:", isoDateString, e);
    return 'Erro na Data';
  }
};

// Adapte esta função aos campos de endereço EXATOS do seu Model 'Event' no backend
// Exemplo: se seu model tem 'logradouro' em vez de 'rua'
const formatarLocal = (evento?: Ingresso['eventoId']): string => {
  if (!evento) return 'Local não informado';
  const parts = [
    (evento.rua || '') + (evento.numero ? `, ${evento.numero}` : ''), // Combina rua e número
    evento.bairro,
    evento.cidade,
    evento.estado
  ].filter(part => part && part.trim() !== ''); // Remove partes vazias ou apenas espaços

  // Se ainda não tiver partes, retorne um placeholder
  if (parts.length === 0) return 'Local não detalhado';

  // Junta as partes com vírgula, tratando o estado no final
  let localString = '';
  if (parts.length > 1 && evento.cidade && evento.estado) {
    // Ex: "Rua Exemplo, 123, Bairro Tal, Cidade - ESTADO"
    localString = parts.slice(0, -2).join(', '); // Endereço + Bairro
    if (localString) localString += ', ';
    localString += `${evento.cidade} - ${evento.estado}`;
  } else {
    // Fallback: junta tudo com vírgula
    localString = parts.join(', ');
  }
  return localString;
};
// --- FIM DAS FUNÇÕES HELPER ---


export const IngressoCard: React.FC<Props> = ({ ingresso, onSendEmail, isSendingEmail }) => {
  const [showIngressoModal, setShowIngressoModal] = useState(false);

  // --- ACESSANDO DADOS POPULADOS DO EVENTO ---
  const evento = ingresso.eventoId; // Agora 'evento' é o objeto populado
  const comprovanteId = ingresso.pedidoId || ingresso.id; // Prioriza pedidoId se existir

  // Formata as datas e local usando as helpers
  const dataCompraFormatada = formatarData(ingresso.createdAt);
  // Certifique-se que 'dataInicio' é o nome correto do campo no seu Model Event
  const dataEventoFormatada = formatarData(evento?.dataInicio);
  const localEventoFormatado = formatarLocal(evento);
  const nomeEvento = evento?.nome || 'Nome do Evento Indisponível';
  const eventoIdQr = evento?._id || 'evento_invalido';
  const qrData = `ingressoId=${ingresso.id};pedidoId=${ingresso.pedidoId || 'N/A'};eventoId=${eventoIdQr};status=${ingresso.status}`;
  // --- FIM DO ACESSO ---

  // --- LÓGICA DE HABILITAÇÃO ---
  // Verifica se o ingresso está em um estado que permite visualização/download ('Pago')
  const isTicketActive = ingresso.status === 'Pago';
  // --- FIM DA LÓGICA DE HABILITAÇÃO ---

  const handleGerarPdf = async () => {
    // --- Verificação de Status ---
    if (!isTicketActive) {
      alert('Apenas ingressos com pagamento aprovado podem gerar PDF.');
      return; // Impede a execução se não estiver ativo
    }
    // --- Fim da Verificação ---

    const A6_WIDTH = 105;
    const A6_HEIGHT = 148;
    const MARGIN = 10;
    const CONTENT_WIDTH = A6_WIDTH - MARGIN * 2;

    try {
      const pdf = new jsPDF('p', 'mm', 'a6');
      let currentY = 15;

      // TÍTULO e ID (usando comprovanteId)
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(14); pdf.setTextColor('#2d3748');
      pdf.text('COMPROVANTE', MARGIN, currentY);
      const idText = `#${comprovanteId}`;
      pdf.setFontSize(8); pdf.setFont('helvetica', 'normal');
      const idX = A6_WIDTH - MARGIN - pdf.getTextWidth(idText);
      pdf.setTextColor('#4a5568'); pdf.text(idText, idX, currentY);
      currentY += 10;
      pdf.setDrawColor('#e2e8f0'); pdf.line(MARGIN, currentY, A6_WIDTH - MARGIN, currentY); currentY += 8;

      // Nome do Evento (usando nomeEvento extraído)
      pdf.setFontSize(8); pdf.setTextColor('#a0aec0');
      pdf.text('NOME DO EVENTO', MARGIN, currentY); currentY += 5;
      pdf.setFontSize(12); pdf.setFont('helvetica', 'bold'); pdf.setTextColor('#2d3748');
      const nomeEventoLines = pdf.splitTextToSize(nomeEvento, CONTENT_WIDTH);
      pdf.text(nomeEventoLines, MARGIN, currentY);
      currentY += nomeEventoLines.length * 5 + 3;

      pdf.setDrawColor('#e2e8f0'); pdf.line(MARGIN, currentY, A6_WIDTH - MARGIN, currentY); currentY += 8;

      // Info: Local + Data (usando formatados)
      const drawInfo = (label: string, value: string, x: number, y: number, maxWidth = 40) => {
        pdf.setFontSize(7); pdf.setFont('helvetica', 'normal'); pdf.setTextColor('#a0aec0'); pdf.text(label, x, y);
        pdf.setFontSize(9); pdf.setFont('helvetica', 'bold'); pdf.setTextColor('#4a5568');
        const lines = pdf.splitTextToSize(value, maxWidth); pdf.text(lines, x, y + 4);
        return y + 4 + lines.length * 4;
      };
      let leftY = drawInfo('LOCAL DO EVENTO', localEventoFormatado, MARGIN, currentY, 45);
      let rightY = drawInfo('DATA DO EVENTO', dataEventoFormatada, A6_WIDTH / 2 + 2, currentY, 40);
      currentY = Math.max(leftY, rightY) + 5;

      pdf.line(MARGIN, currentY, A6_WIDTH - MARGIN, currentY); currentY += 6;

      // Grade: 4 colunas (usando dados diretos do ingresso)
      const colWidth = CONTENT_WIDTH / 4;
      const xPositions = [MARGIN, MARGIN + colWidth, MARGIN + colWidth * 2, MARGIN + colWidth * 3];
      const drawGridCell = (label: string, value: string, x: number, y: number, color = '#2d3748') => {
        pdf.setFontSize(6.5); pdf.setFont('helvetica', 'normal'); pdf.setTextColor('#a0aec0'); pdf.text(label, x, y);
        pdf.setFontSize(8.5); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(color);
        const valueLines = pdf.splitTextToSize(value, colWidth - 1); pdf.text(valueLines, x, y + 3);
        return y + 3 + (valueLines.length * 3.5);
      };
      let lineHeights: number[] = [];
      lineHeights.push(drawGridCell('DATA DA COMPRA', dataCompraFormatada, xPositions[0], currentY));
      lineHeights.push(drawGridCell('TIPO', ingresso.tipoIngresso, xPositions[1], currentY));
      lineHeights.push(drawGridCell('VALOR', `R$ ${ingresso.valor?.toFixed(2) || '0.00'}`, xPositions[2], currentY, '#059669')); // Cor verde para valor

      // Status com cores diferentes
      const statusText = ingresso.status === 'Pago' ? 'APROVADO' : (ingresso.status || 'PENDENTE').toUpperCase();
      const statusWidth = pdf.getTextWidth(statusText) + 4; // Largura baseada no texto
      let statusColorFill = '#FEFBC0'; // Pendente (Amarelo claro)
      let statusColorText = '#9A6B00'; // Amarelo escuro texto
      let statusColorBorder = '#F6E05E'; // Amarelo borda
      if (ingresso.status === 'Pago') {
        statusColorFill = '#E6FFFA'; statusColorText = '#2F855A'; statusColorBorder = '#B2F5EA'; // Aprovado (Verde)
      } else if (ingresso.status === 'Recusado' || ingresso.status === 'Cancelado') {
        statusColorFill = '#FED7D7'; statusColorText = '#C53030'; statusColorBorder = '#FEB2B2'; // Recusado (Vermelho)
      }

      pdf.setFillColor(statusColorFill); pdf.setDrawColor(statusColorBorder); // Borda correspondente
      pdf.roundedRect(xPositions[3], currentY + 1, statusWidth, 6, 2, 2, 'FD'); // Desenha com borda (FD)
      pdf.setFontSize(8.5); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(statusColorText);
      pdf.text(statusText, xPositions[3] + 2, currentY + 5);
      lineHeights.push(currentY + 10);
      currentY = Math.max(...lineHeights) + 5;

      pdf.setDrawColor('#e2e8f0'); pdf.line(MARGIN, currentY, A6_WIDTH - MARGIN, currentY); currentY += 5;

      // QR Code (usando _id do evento populado)
      const qrCodeSize = 30;
      const qrCodeX = (A6_WIDTH - qrCodeSize) / 2;
      const qrCodeY = A6_HEIGHT - qrCodeSize - 12; // Ajuste para texto caber
      const qrCodeDataURL = await QRCode.toDataURL(qrData, { width: 256, margin: 1 });

      pdf.addImage(qrCodeDataURL, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
      pdf.setFontSize(7); pdf.setTextColor('#718096');
      pdf.text('Apresente este QR Code na entrada do evento', A6_WIDTH / 2, qrCodeY + qrCodeSize + 5, { align: 'center' });


      pdf.save(`ingresso-${nomeEvento.replace(/[^a-zA-Z0-9]/g, '_')}-${comprovanteId}.pdf`); // Nome do arquivo mais descritivo
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Verifique o console.');
    }
  };


  const handleEnviarEmail = () => {
    // Só permite enviar se o status for 'Pago'
    if (!isTicketActive) {
      alert('Apenas ingressos com pagamento aprovado podem ser enviados por e-mail.');
      return;
    }
    if (!isSendingEmail) {
      onSendEmail(ingresso.id); // Chama a função passada por props
    }
  };

  const handleAbrirIngresso = () => {
    // --- Verificação de Status ---
    if (isTicketActive) {
      setShowIngressoModal(true); // Abre a modal apenas se ativo
    } else {
      // Opcional: Mostra uma mensagem informativa ao usuário
      console.log(`Visualização indisponível. Status do ingresso: ${ingresso.status || 'Pendente'}.`);
    }
    // --- Fim da Verificação ---
  };
  const handleFecharModal = () => setShowIngressoModal(false);

  // Adiciona classe CSS baseada no status e se está ativo
  const cardStatusClass = `IngressoCard--${ingresso.status?.toLowerCase() || 'pendente'}`;
  const cardActiveClass = isTicketActive ? 'IngressoCard--active' : 'IngressoCard--inactive';

  return (
    <>
      {/* Adiciona classes e cursor dinâmicos ao card principal */}
      <div
        className={`IngressoCard ${cardStatusClass} ${cardActiveClass}`}
        onClick={handleAbrirIngresso} // Função agora verifica o status
        style={{ cursor: isTicketActive ? 'pointer' : 'not-allowed' }} // Cursor apropriado
      >
        <div className="IngressoCard-ticket">
          {/* ----- CABEÇALHO ----- */}
          <div className="IngressoCard-ticket-header">
            <div className="IngressoCard-ticket-title">
              <h3>COMPROVANTE</h3>
              <span className="IngressoCard-ticket-id">#{comprovanteId}</span>
              {/* Mostra dica apenas se o ticket estiver ativo */}
              {isTicketActive && <span className='ingressHint'>Clique sobre o ingresso para abrir</span>}
            </div>
          </div>
          {/* ----- CORPO PRINCIPAL ----- */}
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
          {/* ----- DETALHES SECUNDÁRIOS ----- */}
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
          {/* ----- AÇÕES ----- */}
          <div className="IngressoCard-ticket-actions" onClick={(e) => e.stopPropagation()}>
            {/* Botão para Baixar PDF - Desabilitado se não estiver ativo */}
            <button
              className="IngressoCard-ticket-btn IngressoCard-ticket-btn--secondary"
              onClick={handleGerarPdf}
              disabled={!isTicketActive} // Desabilita se status não for 'Pago'
              aria-label={isTicketActive ? "Baixar Comprovante em PDF" : "PDF indisponível para este status"} // Melhora acessibilidade
            >
              <FiDownload className="IngressoCard-ticket-btn-icon" />
              Baixar Comprovante (PDF)
            </button>
            {/* Opcional: Poderia ter um botão de "Enviar Email" aqui também, se fizesse sentido */}
          </div>
        </div>
      </div>

      {/* ----- MODAL ----- */}
      {/* Modal só abre se showIngressoModal for true (controlado por handleAbrirIngresso) */}
      {showIngressoModal && (
        <div className="IngressoCard-modal">
          <div className="IngressoCard-modal-content">
            <div className="IngressoCard-modal-header">
              <button className="IngressoCard-modal-close" onClick={handleFecharModal}>×</button>
            </div>
            <div className="IngressoCard-modal-body">
              {/* === IMPORTANTE: Atualize o componente Ticket também! === */}
              {/* Ele precisa ler de props.ingresso.eventoId?.nome, etc. */}
              {isTicketActive ? (
                <Ticket ingresso={ingresso} />
              ) : (
                // Mensagem caso algo dê errado e a modal abra indevidamente
                <p style={{ padding: '20px', textAlign: 'center' }}>Visualização indisponível.</p>
              )}
            </div>
            <div className="IngressoCard-ticket-modal-actions">
              {/* Botão de Enviar Email - Renderizado condicionalmente */}
              {isTicketActive && ( // Só mostra se o ingresso estiver 'Pago'
                <button
                  className="IngressoCard-ticket-modal-action IngressoCard-ticket-modal-action--primary"
                  onClick={handleEnviarEmail}
                  disabled={isSendingEmail} // Desabilita durante o envio
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

// Não esqueça de atualizar o componente <Ticket /> para usar ingresso.eventoId?.campo