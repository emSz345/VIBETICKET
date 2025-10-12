// Local: src/components/sections/User/IngressoCard/IngresseCard.tsx (CÓDIGO ATUALIZADO)

import React from 'react';
// 🔥 Lembre-se de importar createRoot de react-dom/client
import { createRoot } from 'react-dom/client';
import { Ingresso } from '../../../../types/Ingresso';
import { useAuth } from '../../../../Hook/AuthContext';
import './IngressoCard.css';
import { FaQrcode, FaFilePdf, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaTicketAlt } from 'react-icons/fa';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// 🔥 Importa o novo componente de template para o PDF
import { IngressoParaPdf } from '../IngressoParaPdf/IngressoParaPdf';

interface IngressoCardProps {
    ingresso: Ingresso;
    onOpenQrModal: () => void;
}

export const IngressoCard: React.FC<IngressoCardProps> = ({ ingresso, onOpenQrModal }) => {
    const { user } = useAuth();

    // 🔥 LÓGICA ATUALIZADA PARA GERAR PDF
    const handleGeneratePdf = async () => {
        // 1. Cria um container invisível no corpo do documento
        const pdfContainer = document.createElement('div');
        pdfContainer.style.position = 'absolute';
        pdfContainer.style.left = '-9999px'; // Move para fora da tela
        document.body.appendChild(pdfContainer);

        // 2. Renderiza o componente de template dentro do container
        const root = createRoot(pdfContainer);
        root.render(<IngressoParaPdf ingresso={ingresso} userName={user?.nome || 'Não informado'} />);
        
        try {
            // Pequeno timeout para garantir que o componente foi totalmente renderizado no DOM
            await new Promise(resolve => setTimeout(resolve, 200));

            // 3. Usa html2canvas para capturar o container
            const canvas = await html2canvas(pdfContainer, { scale: 3, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            
            // 4. Cria o PDF e adiciona a imagem
            const pdf = new jsPDF('p', 'mm', 'a6'); 
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`ingresso-${ingresso.nomeEvento.replace(/\s+/g, '_')}.pdf`);

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.");
        } finally {
            // 5. Limpa: Desmonta o componente React e remove o container do DOM
            root.unmount();
            document.body.removeChild(pdfContainer);
        }
    };
    
    const dataEventoFormatada = new Date(ingresso.dataEvento).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    // O JSX do card que o usuário vê na tela permanece o mesmo
    return (
        <div className="ingresso-card">
            <div className="ingresso-card__header">
                <h3 className="ingresso-card__event-name">{ingresso.nomeEvento}</h3>
                <span className={`ingresso-card__status status--${ingresso.status.toLowerCase()}`}>
                    {ingresso.status === 'Pago' ? 'Aprovado' : ingresso.status}
                </span>
            </div>

            <div className="ingresso-card__body">
                <div className="ingresso-card__detail">
                    <FaCalendarAlt />
                    <span>{dataEventoFormatada}</span>
                </div>
                <div className="ingresso-card__detail">
                    <FaMapMarkerAlt />
                    <span>{ingresso.localEvento}</span>
                </div>
                
                <hr className="ingresso-card__divider" />

                <div className="ingresso-card__detail">
                    <FaUser />
                    <span><strong>Comprador:</strong> {user?.nome || 'Não informado'}</span>
                </div>
                <div className="ingresso-card__detail">
                    <FaTicketAlt />
                    <span><strong>Tipo:</strong> {ingresso.tipoIngresso} (R$ {ingresso.valor.toFixed(2)})</span>
                </div>
                
                <p className="ingresso-card__id">ID do Ingresso: {ingresso.id}</p>
            </div>

            <div className="ingresso-card__actions">
                <button onClick={handleGeneratePdf} className="ingresso-card__button btn-vermelho">
                    <FaFilePdf /> Gerar PDF
                </button>
                <button onClick={onOpenQrModal} className="ingresso-card__button btn-azul">
                    <FaQrcode /> Abrir QR Code
                </button>
            </div>
        </div>
    );
};