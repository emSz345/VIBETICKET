import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Ingresso } from '../../../../types/Ingresso';
import './TicketParaPdf.css';
import logo from "../../../../assets/logo-pdf.png";

interface Props {
  ingresso: Ingresso;
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
    return 'Erro na Data'; 
  }
};

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export const TicketParaPdf: React.FC<Props> = ({ ingresso }) => {
  // ===========================================================================
  // DADOS E FORMATAÇÕES
  // ===========================================================================

  const evento = ingresso.eventoId;
  const dataEventoFormatada = formatarData(evento?.dataInicio);
  const nomeEvento = evento?.nome || 'Evento Indisponível';
  const comprovanteId = ingresso.pedidoId || ingresso.id;
  const eventoIdQr = evento?._id || 'evento_invalido';
  
  /**
   * Gera dados para o QR Code contendo informações do ingresso
   */
  const qrData = `ingressoId=${ingresso.id};pedidoId=${ingresso.pedidoId || 'N/A'};eventoId=${eventoIdQr};status=${ingresso.status}`;

  // ===========================================================================
  // RENDERIZAÇÃO
  // ===========================================================================

  return (
    <div className="pdf-ticket-container">
      
      {/* LOGO */}
      <div className="pdf-logo-container">
        <img 
          src={logo}
          alt="Logo"
          className="pdf-logo"
        />
      </div>

      {/* SEÇÃO SUPERIOR */}
      <div className="pdf-ticket-top-section">
        <p className="pdf-label-digital">TICKET DIGITAL</p>
        <h1 className="pdf-event-name-top">{nomeEvento}</h1>
        <div className="pdf-qr-code-area">
          <QRCodeSVG
            value={qrData}
            size={90}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
      </div>

      {/* SEÇÃO INFERIOR */}
      <div className="pdf-ticket-bottom-section">
        <div className="pdf-detail-group-header">
          <span className="pdf-detail-label-header">NOME DO EVENTO</span>
          <span className="pdf-detail-value-header">{nomeEvento}</span>
        </div>

        {/* ID DO TICKET */}
        <div className="pdf-ticket-id-box">{comprovanteId}</div>

        {/* GRADE DE DETALHES */}
        <div className="pdf-details-grid">
          <div className="pdf-detail-cell">
            <span className="pdf-detail-label">DIA DO EVENTO</span>
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
            <span className={`pdf-detail-value status--${ingresso.status?.toLowerCase() || 'pendente'}`}>
              {ingresso.status === 'Pago' ? 'Aprovado' : (ingresso.status || 'Pendente').toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};