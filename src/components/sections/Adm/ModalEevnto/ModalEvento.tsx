import React from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Evento as EventoType } from "../../../../types/evento";
import "./ModalEvento.css";


// TIPOS E INTERFACES
type EventoStatus = "em_analise" | "aprovado" | "rejeitado" | "em_reanalise";

interface CriadorPopulado {
    _id: string;
    nome?: string;
    email?: string;
    cpf?: string;
    cnpj?: string;
    tipoPessoa?: 'cpf' | 'cnpj';
}

interface ModalEventoProps {
    evento: Omit<EventoType, 'criadoPor'> & {
        status: EventoStatus,
        temMeia: boolean,
        valorIngressoInteira?: number,
        quantidadeInteira?: number,
        dataInicioVendas?: string,
        dataFimVendas?: string,
        valorIngressoMeia?: number,
        quantidadeMeia?: number,
        criadoPor: CriadorPopulado;
    };
    onClose: () => void;
    onAceitar?: () => void;
    onRejeitar?: () => void;
    onReanalise?: () => void;
}


// COMPONENTE PRINCIPAL
const ModalEvento: React.FC<ModalEventoProps> = ({
    evento,
    onClose,
    onAceitar,
    onRejeitar,
    onReanalise
}) => {

    // FUNÇÕES UTILITÁRIAS
    const formatarMoeda = (valor: number | string | undefined) => {
        if (typeof valor === 'string') {
            valor = parseFloat(valor);
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor ?? 0);
    };

    const getMapSrc = (iframeHtml: string): string | null => {
        if (!iframeHtml) return null;
        const match = iframeHtml.match(/<iframe.*?src=["'](.*?)["']/);
        return match ? match[1] : iframeHtml;
    };

    // VARIÁVEIS DERIVADAS
    const mapSrc = getMapSrc(evento.linkMaps);
    const temMeiaEntrada = evento.temMeia;

    const dadosPessoaisPendentes = !evento.criadoPor ||
        !evento.criadoPor.tipoPessoa ||
        (evento.criadoPor.tipoPessoa === 'cpf' ? !evento.criadoPor.cpf : !evento.criadoPor.cnpj);

    // HANDLER FUNCTIONS
    const handleOverlayClick = (e: React.MouseEvent) => e.stopPropagation();

    // RENDER FUNCTIONS
    const renderHeader = () => (
        <div className="modal-evento-header">
            <img src={evento.imagem} alt={evento.nome} className="modal-evento-imagem" />
            <div className="modal-evento-info-basica">
                <h2 className="modal-evento-titulo">{evento.nome}</h2>
                <p className="modal-evento-data">
                    **📅 {evento.dataInicio}** das {evento.horaInicio} às {evento.horaTermino}
                </p>
                <p className="modal-evento-criador">
                    Criado por: **{evento.criadoPor?.nome || evento.criadoPor?._id || 'Desconhecido'}**
                </p>
                {renderStatusCriador()}
            </div>
        </div>
    );

    const renderStatusCriador = () => (
        <div className={`modal-criador-status ${dadosPessoaisPendentes ? 'pendente' : 'verificado'}`}>
            {dadosPessoaisPendentes ? (
                <>
                    <FaExclamationTriangle />
                    <span>Dados Pessoais Pendentes</span>
                </>
            ) : (
                <>
                    <FaCheckCircle />
                    <span>Dados Verificados</span>
                </>
            )}
        </div>
    );

    const renderDescricao = () => (
        <div className="modal-evento-item full-width">
            <strong className="modal-evento-label">Descrição:</strong>
            <p className="modal-evento-texto">{evento.descricao}</p>
        </div>
    );

    const renderIngressosInteira = () => (
        <>
            <strong className="modal-evento-label-secao">Ingresso Inteira</strong>
            <div className="modal-evento-secao-colunas ingressos-inteira">
                <div className="modal-evento-item">
                    <strong className="modal-evento-label">Valor:</strong>
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
        </>
    );

    const renderIngressosMeia = () => {
        if (!temMeiaEntrada) return null;

        return (
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
        );
    };

    const renderDetalhesAdicionais = () => (
        <>
            <strong className="modal-evento-label-secao mt-15">Detalhes Adicionais</strong>
            <div className="modal-evento-secao-colunas">
                <div className="modal-evento-item">
                    <strong className="modal-evento-label">Categoria:</strong>
                    <span>{evento.categoria}</span>
                </div>
                <div className="modal-evento-item">
                    <strong className="modal-evento-label">Localização:</strong>
                    <p>{evento.rua}, {evento.cidade} - {evento.estado}</p>
                    {renderMapa()}
                </div>
            </div>
        </>
    );

    const renderMapa = () => {
        if (!mapSrc) {
            return <p>Link do mapa não disponível.</p>;
        }

        return (
            <div className="modal-evento-mapa-container">
                <iframe
                    src={mapSrc}
                    className="modal-evento-mapa-iframe"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa do Evento"
                ></iframe>
            </div>
        );
    };

    const renderBotoesAcao = () => (
        <div className="modal-evento-botoes">
            {onRejeitar && (
                <button
                    className="modal-evento-btn modal-evento-btn-rejeitar"
                    onClick={onRejeitar}
                >
                    Rejeitar
                </button>
            )}

            {onReanalise && (
                <button
                    className="modal-evento-btn modal-evento-btn-reanalise"
                    onClick={onReanalise}
                >
                    Reanálise
                </button>
            )}

            {onAceitar && (
                <button
                    className="modal-evento-btn modal-evento-btn-aceitar"
                    onClick={onAceitar}
                >
                    Aceitar
                </button>
            )}
        </div>
    );

    return (
        <div className="modal-evento-overlay" onClick={onClose}>
            <div className="modal-evento-conteudo" onClick={handleOverlayClick}>
                <button className="modal-evento-fechar" onClick={onClose}>
                    ×
                </button>

                {renderHeader()}

                <div className="modal-evento-detalhes">
                    {renderDescricao()}
                    {renderIngressosInteira()}
                    {renderIngressosMeia()}
                    {renderDetalhesAdicionais()}
                </div>

                {renderBotoesAcao()}
            </div>
        </div>
    );
};

export default ModalEvento;