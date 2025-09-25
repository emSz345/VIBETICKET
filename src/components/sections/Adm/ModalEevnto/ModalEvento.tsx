import React from "react";
import { Evento } from "../../../../types/evento";
import "./ModalEvento.css";

type EventoStatus = "em_analise" | "aprovado" | "rejeitado" | "em_reanalise";

interface ModalEventoProps {
    // CORREÇÃO: Tornando os campos de ingresso e venda opcionais (?)
    // Isso resolve o erro de tipagem com o EventoCard.
    evento: Evento & { 
        status: EventoStatus, 
        temMeia: boolean, 
        valorIngressoInteira?: number, // Opcional
        quantidadeInteira?: number,    // Opcional
        dataInicioVendas?: string,     // Opcional
        dataFimVendas?: string,        // Opcional
        valorIngressoMeia?: number, 
        quantidadeMeia?: number 
    };
    onClose: () => void;
    onAceitar: () => void;
    onRejeitar: () => void;
    onReanalise: () => void;
}

const ModalEvento: React.FC<ModalEventoProps> = ({ 
    evento, 
    onClose, 
    onAceitar, 
    onRejeitar, 
    onReanalise 
}) => {
    const formatarMoeda = (valor: number | string | undefined) => {
        if (typeof valor === 'string') {
            valor = parseFloat(valor);
        }
        // Usa 0 como fallback se o valor for undefined ou null
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor ?? 0);
    };

    const temMeiaEntrada = evento.temMeia;

    // Lógica para desabilitar botões
    const isAprovado = evento.status === 'aprovado';
    const isRejeitado = evento.status === 'rejeitado';
    const isEmReanalise = evento.status === 'em_reanalise';
    
    // ACEITAR e REJEITAR são bloqueados após qualquer decisão
    const disableAceitar = isAprovado || isRejeitado || isEmReanalise;
    const disableRejeitar = isAprovado || isRejeitado || isEmReanalise;

    // REANÁLISE: Bloqueado apenas se estiver REJEITADO ou EM REANÁLISE.
    // Permanece ativo se for APROVADO para permitir a reversão.
    const disableReanalise = isRejeitado || isEmReanalise; 


    return (
        <div className="modal-evento-overlay" onClick={onClose}>
            <div className="modal-evento-conteudo" onClick={(e) => e.stopPropagation()}>
                <button className="modal-evento-fechar" onClick={onClose}>×</button>

                {/* Cabeçalho */}
                <div className="modal-evento-header">
                    <img src={evento.imagem} alt={evento.nome} className="modal-evento-imagem" />
                    <div className="modal-evento-info-basica">
                        <h2 className="modal-evento-titulo">{evento.nome}</h2>
                        <p className="modal-evento-data">
                            **📅 {evento.dataInicio}** das {evento.horaInicio} às {evento.horaTermino}
                        </p>
                        <p className="modal-evento-criador">Criado por: **{evento.criadoPor}**</p>
                    </div>
                </div>

                {/* Detalhes do Evento */}
                <div className="modal-evento-detalhes">
                    
                    {/* Descrição */}
                    <div className="modal-evento-item full-width">
                        <strong className="modal-evento-label">Descrição:</strong>
                        <p className="modal-evento-texto">{evento.descricao}</p>
                    </div>

                    {/* Informações sobre Ingressos - INTEIRA */}
                    <strong className="modal-evento-label-secao">Ingresso Inteira</strong>
                    <div className="modal-evento-secao-colunas ingressos-inteira">
                        <div className="modal-evento-item">
                            <strong className="modal-evento-label">Valor:</strong>
                            {/* Usa ?? 0 para garantir que o formato seja exibido corretamente */}
                            <span>{formatarMoeda(evento.valorIngressoInteira)}</span>
                        </div>
                        <div className="modal-evento-item">
                            <strong className="modal-evento-label">Qtd. Total:</strong>
                            <span>{evento.quantidadeInteira || 'N/A'}</span>
                        </div>
                        <div className="modal-evento-item">
                            <strong className="modal-evento-label">Venda Inicia/Acaba:</strong>
                            <p>Início: {evento.dataInicioVendas || 'N/A'}</p>
                            <p>Fim: {evento.dataFimVendas || 'N/A'}</p>
                        </div>
                    </div>
                    
                    {/* Informações sobre Ingressos - MEIA ENTRADA (Condicional) */}
                    {temMeiaEntrada && (
                        <>
                            <strong className="modal-evento-label-secao mt-15">Ingresso Meia-Entrada</strong>
                            <div className="modal-evento-secao-colunas ingressos-meia">
                                <div className="modal-evento-item">
                                    <strong className="modal-evento-label">Valor:</strong>
                                    <span>{formatarMoeda(evento.valorIngressoMeia)}</span>
                                </div>
                                <div className="modal-evento-item">
                                    <strong className="modal-evento-label">Qtd. Total:</strong>
                                    <span>{evento.quantidadeMeia || 'N/A'}</span>
                                </div>
                                <div className="modal-evento-item"></div> 
                            </div>
                        </>
                    )}
                    
                    {/* Categoria e Localização */}
                    <strong className="modal-evento-label-secao mt-15">Detalhes Adicionais</strong>
                    <div className="modal-evento-secao-colunas">
                        <div className="modal-evento-item">
                            <strong className="modal-evento-label">Categoria:</strong>
                            <span>{evento.categoria}</span>
                        </div>

                        <div className="modal-evento-item">
                            <strong className="modal-evento-label">Localização:</strong>
                            <p>
                                {evento.rua}, {evento.cidade} - {evento.estado}
                            </p>
                            <p className="modal-evento-link-mapa">
                                <a href={evento.linkMaps} target="_blank" rel="noreferrer" className="modal-evento-link">Ver no Google Maps</a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="modal-evento-botoes">
                    <button 
                        className="modal-evento-btn modal-evento-btn-rejeitar" 
                        onClick={onRejeitar} 
                        disabled={disableRejeitar}
                    >
                        Rejeitar
                    </button>
                    <button 
                        className="modal-evento-btn modal-evento-btn-reanalise" 
                        onClick={onReanalise}
                        disabled={disableReanalise}
                    >
                        Reanálise
                    </button>
                    <button 
                        className="modal-evento-btn modal-evento-btn-aceitar" 
                        onClick={onAceitar}
                        disabled={disableAceitar}
                    >
                        Aceitar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalEvento;