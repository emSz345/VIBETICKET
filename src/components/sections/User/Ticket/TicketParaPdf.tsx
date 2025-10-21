// Local: src/components/sections/User/Ticket/TicketParaPdf.tsx

import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Verifique a importação
import { Ingresso } from '../../../../types/Ingresso'; // <-- Importa a interface ATUALIZADA
import './TicketParaPdf.css'; // ✨ CSS específico para o PDF

interface Props {
  ingresso: Ingresso;
}

// --- Importe ou Copie a Função Helper de Formatação ---
const formatarData = (isoDateString?: string): string => {
  if (!isoDateString || new Date(isoDateString).toString() === 'Invalid Date') { return 'Data Indisponível'; }
  try {
    const data = new Date(isoDateString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' });
  } catch (e) { return 'Erro na Data'; }
};
// --- Fim da Função Helper ---


export const TicketParaPdf: React.FC<Props> = ({ ingresso }) => {

  // --- Acesso aos dados populados ---
  const evento = ingresso.eventoId;
  const dataEventoFormatada = formatarData(evento?.dataInicio); // Use o campo correto (ex: dataInicio)
  const nomeEvento = evento?.nome || 'Evento Indisponível';
  const comprovanteId = ingresso.pedidoId || ingresso.id;
  const eventoIdQr = evento?._id || 'evento_invalido';
  const qrData = `ingressoId=${ingresso.id};pedidoId=${ingresso.pedidoId || 'N/A'};eventoId=${eventoIdQr};status=${ingresso.status}`;
  // --- Fim do acesso ---


  return (
    // Usa a estrutura semântica para o PDF
    <div className="pdf-ticket-container">
      {/* SEÇÃO SUPERIOR */}
      <div className="pdf-ticket-top-section">
        <p className="pdf-label-digital">TICKET DIGITAL</p>
        {/* Usa nomeEvento extraído */}
        <h1 className="pdf-event-name-top">{nomeEvento}</h1>
        <div className="pdf-qr-code-area">
          <QRCodeSVG
            value={qrData} // Usa dados combinados
            size={90} // Tamanho ajustado para PDF
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
        {/* Adiciona instrução se necessário */}
        {/* <p className="pdf-qr-instruction">Apresente na entrada</p> */}
      </div>

      {/* SEÇÃO INFERIOR */}
      <div className="pdf-ticket-bottom-section">
        <div className="pdf-detail-group-header">
          <span className="pdf-detail-label-header">NOME DO EVENTO</span>
          {/* Usa nomeEvento extraído */}
          <span className="pdf-detail-value-header">{nomeEvento}</span>
        </div>

        {/* Usa comprovanteId */}
        <div className="pdf-ticket-id-box">{comprovanteId}</div>

        <div className="pdf-details-grid">
          <div className="pdf-detail-cell">
            <span className="pdf-detail-label">DIA DO EVENTO</span>
            {/* Usa dataEventoFormatada */}
            <span className="pdf-detail-value">{dataEventoFormatada}</span>
          </div>
          <div className="pdf-detail-cell">
            <span className="pdf-detail-label">TIPO</span>
            <span className="pdf-detail-value">{ingresso.tipoIngresso}</span>
          </div>
          <div className="pdf-detail-cell">
            <span className="pdf-detail-label">VALOR</span>
            <span className="pdf-detail-value">R$ {ingresso.valor?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="pdf-detail-cell">
            <span className="pdf-detail-label">STATUS</span>
            {/* Usa classe CSS dinâmica e texto ajustado */}
            <span className={`pdf-detail-value status--${ingresso.status?.toLowerCase() || 'pendente'}`}>
              {ingresso.status === 'Pago' ? 'Aprovado' : (ingresso.status || 'Pendente').toUpperCase()}
            </span>
          </div>
          {/* Adicione o local se quiser no PDF */}
          {/*
          <div className="pdf-detail-cell pdf-detail-cell--local"> // Adicione classe se precisar de mais espaço
            <span className="pdf-detail-label">LOCAL</span>
            <span className="pdf-detail-value">{formatarLocal(evento)}</span>
          </div>
           */}
        </div>
      </div>
    </div>
  );
};