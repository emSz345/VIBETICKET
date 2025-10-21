// Local: src/components/sections/User/Ticket/Ticket.tsx

import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Certifique-se que a importação está correta
import { Ingresso } from '../../../../types/Ingresso'; // <-- Importa a interface ATUALIZADA
import './Ticket.css'; // CSS para a exibição na modal

interface Props {
  ingresso: Ingresso;
}

// --- Importe ou Copie a Função Helper de Formatação ---
// Idealmente, importe de um arquivo utils (ex: src/utils/formatters.ts)
const formatarData = (isoDateString?: string): string => {
  if (!isoDateString || new Date(isoDateString).toString() === 'Invalid Date') {
    return 'Data Indisponível';
  }
  try {
    const data = new Date(isoDateString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo'
    });
  } catch (e) { return 'Erro na Data'; }
};
// --- Fim da Função Helper ---


export const Ticket: React.FC<Props> = ({ ingresso }) => {

  // --- Acesso aos dados populados ---
  const evento = ingresso.eventoId; // Objeto do evento populado
  // Use o campo de data correto do seu Model Event (ex: dataInicio)
  const dataEventoFormatada = formatarData(evento?.dataInicio);
  const nomeEvento = evento?.nome || 'Evento Indisponível';
  const comprovanteId = ingresso.pedidoId || ingresso.id; // Usa pedidoId se disponível
  const eventoIdQr = evento?._id || 'evento_invalido';
  // Dados para o QR Code (incluindo pedidoId e status)
  const qrData = `ingressoId=${ingresso.id};pedidoId=${ingresso.pedidoId || 'N/A'};eventoId=${eventoIdQr};status=${ingresso.status}`;
  // --- Fim do acesso ---

  return (
    // Usa a classe 'ticket-classic' que você definiu
    <div className="ticket-classic">
      {/* Parte Superior do Ticket */}
      <div className="ticket-top-section">
        <div className="ticket-main-title">
          <div className="ticket-event-type">Ticket Digital</div>
          {/* Usa nomeEvento extraído */}
          <div className="ticket-event-name">{nomeEvento}</div>
        </div>

        <div className="ticket-qr-floating">
          <QRCodeSVG
            value={qrData} // Usa os dados combinados
            size={80} // Tamanho ajustado
            level="H"
            includeMargin
            className="ticket-qrcode-svg-inner" // Adicione uma classe interna se precisar estilizar
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
          {/* Usa nomeEvento extraído */}
          <div className="ticket-event-name-small">{nomeEvento}</div>
        </div>

        <div className="ticket-barcode-section">
          {/* Usa comprovanteId */}
          <div className="ticket-number">{comprovanteId}</div>
          {/* Mantenha o barcode fake se quiser, ou remova */}
          {/* <div className="ticket-barcode-placeholder">||| || |||| ||||| ||| || ||</div> */}
        </div>

        <div className="ticket-info-grid">
          <div className="info-cell">
            <span className="cell-label">Dia do Evento</span>
            {/* Usa dataEventoFormatada */}
            <span className="cell-value">{dataEventoFormatada}</span>
          </div>
          <div className="info-cell">
            <span className="cell-label">Tipo</span>
            <span className="cell-value">{ingresso.tipoIngresso}</span>
          </div>
          <div className="info-cell">
            <span className="cell-label">Valor</span>
            <span className="cell-value">R$ {ingresso.valor?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="info-cell">
            <span className="cell-label">STATUS</span>
            {/* Usa classe CSS dinâmica e texto ajustado */}
            <span className={`cell-value status--${ingresso.status?.toLowerCase() || 'pendente'}`}>
              {ingresso.status === 'Pago' ? 'Aprovado' : (ingresso.status || 'Pendente')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};