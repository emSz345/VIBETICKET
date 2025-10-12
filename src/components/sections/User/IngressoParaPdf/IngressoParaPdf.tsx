// Local: src/components/sections/User/IngressoParaPdf/IngressoParaPdf.tsx (NOVO ARQUIVO)

import React from 'react';
import { Ingresso } from '../../../../types/Ingresso';
import './IngressoParaPdf.css'; // Vamos criar este CSS a seguir
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaTicketAlt } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react'; // Incluindo o QR Code no PDF

interface IngressoParaPdfProps {
    ingresso: Ingresso;
    userName: string;
}

export const IngressoParaPdf: React.FC<IngressoParaPdfProps> = ({ ingresso, userName }) => {
    const dataEventoFormatada = new Date(ingresso.dataEvento).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    return (
        <div className="ingresso-pdf-template">
            <div className="ingresso-pdf-header">
                <h1 className="ingresso-pdf-event-name">{ingresso.nomeEvento}</h1>
            </div>

            <div className="ingresso-pdf-details">
                <div className="detail-row">
                    <FaCalendarAlt />
                    <span>{dataEventoFormatada}</span>
                </div>
                <div className="detail-row">
                    <FaMapMarkerAlt />
                    <span>{ingresso.localEvento}</span>
                </div>
                <hr className="detail-divider" />
                <div className="detail-row">
                    <FaUser />
                    <span><strong>Comprador:</strong> {userName}</span>
                </div>
                <div className="detail-row">
                    <FaTicketAlt />
                    <span><strong>Tipo:</strong> {ingresso.tipoIngresso} (R$ {ingresso.valor.toFixed(2)})</span>
                </div>
            </div>

            <div className="ingresso-pdf-qrcode-section">
                <QRCodeSVG value={ingresso.id} size={100} />
                <p className="ingresso-pdf-id">ID: {ingresso.id}</p>
            </div>
            
            <p className="ingresso-pdf-footer">Apresente este ingresso (impresso ou no celular) na entrada do evento.</p>
        </div>
    );
};