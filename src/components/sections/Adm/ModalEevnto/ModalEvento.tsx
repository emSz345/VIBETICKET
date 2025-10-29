import React from "react";
import { Evento as EventoType } from "../../../../types/evento";
import "./ModalEvento.css";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

type EventoStatus = "em_analise" | "aprovado" | "rejeitado" | "em_reanalise";

interface CriadorPopulado {
    _id: string;
    nome?: string;
    email?: string; // Se precisar do email
    cpf?: string;
    cnpj?: string;
    tipoPessoa?: 'cpf' | 'cnpj';
}

interface ModalEventoProps {
    // A tipagem de Evento já está correta, incluindo os campos opcionais de ingresso
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

    // CORREÇÃO ESSENCIAL: As props de ação SÃO OPCIONAIS (com '?' no tipo)
    // Isso resolve os erros de tipagem no EventoCard.
    onAceitar?: () => void;
    onRejeitar?: () => void;
    onReanalise?: () => void;
}

const ModalEvento: React.FC<ModalEventoProps> = ({
    evento,
    onClose,
    onAceitar, // Recebe a função ou undefined
    onRejeitar, // Recebe a função ou undefined
    onReanalise // Recebe a função ou undefined
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

    const dadosPessoaisPendentes = !evento.criadoPor || // Se não houver criador
        !evento.criadoPor.tipoPessoa || // Se não houver tipo definido
        (evento.criadoPor.tipoPessoa === 'cpf' ? !evento.criadoPor.cpf : !evento.criadoPor.cnpj);

    const temMeiaEntrada = evento.temMeia;

    // A lógica de transição é delegada aos componentes pai (Painel e EventoCard),
    // que passarão `undefined` para as ações não permitidas.

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
                        <p className="modal-evento-criador">
                            Criado por: **{evento.criadoPor?.nome || evento.criadoPor?._id || 'Desconhecido'}**
                        </p>
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

                {/* Botões de Ação - RENDERIZAÇÃO CONDICIONAL */}
                {/* Os botões só aparecem se a função de callback (prop) tiver sido passada */}
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
            </div>
        </div>
    );
};

export default ModalEvento;