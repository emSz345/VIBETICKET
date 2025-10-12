// Local: src/components/sections/User/QrCodeModal/QrCodeModal.tsx

import React from 'react';
// 🔥 CORREÇÃO: Importa o componente nomeado QRCodeSVG
import { QRCodeSVG } from 'qrcode.react'; 
import { Ingresso } from '../../../../types/Ingresso';
import { useAuth } from '../../../../Hook/AuthContext'; // Para obter o nome do usuário logado
import './QrCodeModal.css';
import { FaEnvelope, FaTimes } from 'react-icons/fa';

interface QrCodeModalProps {
    ingresso: Ingresso;
    onClose: () => void;
    onSendEmail: (ingressoId: string) => Promise<void>;
    isSending: boolean;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ ingresso, onClose, onSendEmail, isSending }) => {
    // Pega o usuário logado para exibir o nome do titular
    const { user } = useAuth();

    const handleEmailClick = () => {
        if (!isSending) {
            onSendEmail(ingresso.id);
        }
    };

    return (
        <div className="qr-modal__overlay" onClick={onClose}>
            <div className="qr-modal__content" onClick={(e) => e.stopPropagation()}>
                <button className="qr-modal__close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <h3 className="qr-modal__title">QR Code do Ingresso</h3>
                <div className="qr-modal__qr-container">
                    {/* 🔥 CORREÇÃO: Usa o componente QRCodeSVG */}
                    <QRCodeSVG
                        value={ingresso.id} // O QR Code contém o ID único do ingresso
                        size={200}
                        level={"H"}
                        includeMargin={true}
                    />
                </div>
                <div className="qr-modal__details">
                    {/* 🔥 CORREÇÃO: Usa os campos corretos do tipo Ingresso */}
                    <p><strong>Evento:</strong> {ingresso.nomeEvento}</p>
                    <p><strong>Titular:</strong> {user?.nome || 'Não identificado'}</p>
                    <p>Use este QR Code para entrar no evento.</p>
                </div>
                <button 
                    className="qr-modal__email-button"
                    onClick={handleEmailClick}
                    disabled={isSending}
                >
                    <FaEnvelope />
                    {isSending ? 'Enviando...' : 'Enviar por E-mail'}
                </button>
            </div>
        </div>
    );
};