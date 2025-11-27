// Meus-eventos.tsx (com sistema de pesquisa) - ORGANIZADO
import React, { useState, useEffect, useCallback } from "react";
import "../../styles/MeusEventos.css";
import { FaEye, FaPencilAlt, FaPlus, FaSearch } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { MdEvent } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import ModalAviso from "../../components/sections/User/ModalAviso/ModalAviso";
import ModalDetalhesEvento from "../../components/sections/Adm/ModalDetalhesEvento/ModalDetalhesEvento";
import VoltarParaInicio from "../../components/layout/VoltarParaInicio/VoltarParaInicio";

import logo from "../../assets/SVGs/img-noEvent.svg";

// TIPAGENS 
type Evento = {
  _id: string;
  nome: string;
  status: "aprovado" | "rejeitado" | "em_analise" | "em_reanalise";
};

type FiltroStatus = "todos" | "aprovado" | "rejeitado" | "em_analise" | "em_reanalise";


const MeusEventos = () => {
  // HOOKS E CONFIGURAÇÕES
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  // ESTADOS
  const [modalAberta, setModalAberta] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para pesquisa e filtros
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");

  // Estados para deleção
  const [isDeleting, setIsDeleting] = useState(false);
  const [eventoParaDeletar, setEventoParaDeletar] = useState<string | null>(null);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);

  // Estados para modais de aviso
  const [modalAvisoOpen, setModalAvisoOpen] = useState(false);
  const [modalAvisoMensagem, setModalAvisoMensagem] = useState({ title: '', message: '' });


  // EFFECTS E INICIALIZAÇÕES
  // --- Busca os eventos do usuário logado --- //
  const fetchMeusEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${apiUrl}/api/eventos/meus-eventos`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Tratamento de erros de autenticação
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setEventos(data);
      setEventosFiltrados(data); // Inicialmente mostra todos

    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, navigate]);

  // --- Aplica os filtros de pesquisa e status --- //
  const aplicarFiltros = useCallback(() => {
    let eventosFiltrados = eventos;

    // Filtro por termo de pesquisa (nome)
    if (termoPesquisa.trim() !== "") {
      eventosFiltrados = eventosFiltrados.filter(evento =>
        evento.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
      );
    }

    // Filtro por status
    if (filtroStatus !== "todos") {
      eventosFiltrados = eventosFiltrados.filter(evento => evento.status === filtroStatus);
    }

    setEventosFiltrados(eventosFiltrados);
  }, [eventos, termoPesquisa, filtroStatus]);

  // --- Effect para aplicar filtros --- //
  useEffect(() => {
    aplicarFiltros();
  }, [aplicarFiltros]);

  // --- Effect para buscar eventos --- //
  useEffect(() => {
    fetchMeusEventos();
  }, [fetchMeusEventos]);


  //  FUNÇÕES DE FILTRO E PESQUISA
  // --- Handler para mudança no termo de pesquisa --- //
  const handlePesquisaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermoPesquisa(e.target.value);
  };

  // --- Handler para mudança no filtro de status --- //
  const handleFiltroStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroStatus(e.target.value as FiltroStatus);
  };

  // --- Limpa todos os filtros --- //
  const limparFiltros = () => {
    setTermoPesquisa("");
    setFiltroStatus("todos");
  };


  // FUNÇÕES DE DELEÇÃO
  // --- Abre modal de confirmação para deletar evento --- //
  const handleAbrirConfirmacaoDelete = (eventoId: string) => {
    setEventoParaDeletar(eventoId);
    setModalConfirmOpen(true);
  };

  // --- Confirma e executa a deleção do evento --- //
  const handleConfirmarDelete = useCallback(async () => {
    if (!eventoParaDeletar) return;

    setIsDeleting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${apiUrl}/api/eventos/${eventoParaDeletar}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Tratamento de erros de autenticação
      if (response.status === 401 || response.status === 403) {
        navigate('/login');
        return;
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao deletar evento');
      }

      // Sucesso - atualiza lista e fecha modal
      setEventos(prevEventos => prevEventos.filter(evento => evento._id !== eventoParaDeletar));
      setModalConfirmOpen(false);
      setEventoParaDeletar(null);

    } catch (err) {
      // Erro - mostra modal de aviso
      setModalAvisoMensagem({
        title: 'Operação Falhou',
        message: (err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.')
      });
      setModalAvisoOpen(true);
      setModalConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }, [apiUrl, navigate, eventoParaDeletar]);


  // FUNÇÕES DE MODAIS 
  // --- Abre modal de detalhes do evento --- //
  const abrirModalDetalhes = (eventoId: string) => {
    setEventoSelecionado(eventoId);
    setModalAberta(true);
  };

  // RENDERIZAÇÃO DE ESTADOS DE CARREGAMENTO 
  if (loading) {
    return (
      <div className="meus-ingressos-container">
        <div className="loading">Carregando eventos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meus-ingressos-container">
        <div className="error">
          <h3>Erro ao carregar eventos</h3>
          <p>{error}</p>
          <button
            onClick={fetchMeusEventos}
            style={{ marginTop: '10px', padding: '8px 16px' }}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <>
      <div className="meus-eventos-container">
        
        {/* ============ SIDEBAR ============ */}
        <aside className="meus-eventos-sidebar">
          <nav>
            <button className="meus-eventos-nav-btn meus-eventos-active">
              <MdEvent /> Meus Eventos
            </button>
            <Link to="/CriarEventos" className="meus-eventos-nav-btn">
              <FaPlus /> Crie seu evento
            </Link>
          </nav>
        </aside>

        {/* ============ CONTEÚDO PRINCIPAL ============ */}
        <main className="meus-eventos-content">
          <VoltarParaInicio />

          {/* Header */}
          <header className="meus-eventos-header">
            <h2 className="meus-eventos-titulo">Meus Eventos</h2>
          </header>

          {/* ============ CARDS DE RESUMO ============ */}
          <section className="meus-eventos-resumo">
            <div className="meus-eventos-card">
              <h3>Total</h3>
              <p>{eventos.length}</p>
            </div>
            <div className="meus-eventos-card meus-eventos-card--aprovado">
              <h3>Aprovados</h3>
              <p>{eventos.filter(e => e.status === "aprovado").length}</p>
            </div>
            <div className="meus-eventos-card meus-eventos-card--em_analise">
              <h3>Em Análise</h3>
              <p>{eventos.filter(e => e.status === "em_analise").length}</p>
            </div>
            <div className="meus-eventos-card meus-eventos-card--rejeitado">
              <h3>Rejeitados</h3>
              <p>{eventos.filter(e => e.status === "rejeitado").length}</p>
            </div>
            <div className="meus-eventos-card meus-eventos-card--em_reanalise">
              <h3>Em Reanálise</h3>
              <p>{eventos.filter(e => e.status === "em_reanalise").length}</p>
            </div>
          </section>

          {/* ============ SISTEMA DE PESQUISA E FILTROS ============ */}
          <div className="meus-eventos-pesquisa-container">
            <div className="meus-eventos-pesquisa-input-group">
              <div className="meus-eventos-pesquisa-wrapper">
                <FaSearch className="meus-eventos-pesquisa-icon" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome do evento..."
                  value={termoPesquisa}
                  onChange={handlePesquisaChange}
                  className="meus-eventos-pesquisa-input"
                />
              </div>
              
              <select
                value={filtroStatus}
                onChange={handleFiltroStatusChange}
                className="meus-eventos-filtro-select"
              >
                <option value="todos">Todos os status</option>
                <option value="aprovado">Aprovados</option>
                <option value="em_analise">Em Análise</option>
                <option value="em_reanalise">Em Reanálise</option>
                <option value="rejeitado">Rejeitados</option>
              </select>

              {(termoPesquisa || filtroStatus !== "todos") && (
                <button
                  onClick={limparFiltros}
                  className="meus-eventos-limpar-filtros"
                >
                  Limpar Filtros
                </button>
              )}
            </div>

            {/* Contador de resultados */}
            <div className="meus-eventos-resultados-info">
              {eventosFiltrados.length === eventos.length ? (
                <span>Mostrando todos os {eventos.length} eventos</span>
              ) : (
                <span>
                  Mostrando {eventosFiltrados.length} de {eventos.length} eventos
                  {(termoPesquisa || filtroStatus !== "todos") && " filtrados"}
                </span>
              )}
            </div>
          </div>

          {/* ============ TABELA DE EVENTOS ============ */}
          <table className="meus-ingressos-event-table">
            <thead>
              <tr>
                <th>#</th>
                <th>NOME</th>
                <th>AÇÕES</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.map((evento, index) => (
                <tr key={evento._id}>
                  <td>{index + 1}</td>
                  <td>{evento.nome}</td>
                  <td className="meus-ingressos-acoes">
                    <button
                      className="meus-ingressos-acao-btn"
                      title="Visualizar"
                      onClick={() => abrirModalDetalhes(evento._id)}>
                      <FaEye size={18} />
                    </button>
                    <Link
                      to={`/editar-evento/${evento._id}`}
                      className="meus-ingressos-acao-btn"
                      title="Editar"
                    >
                      <FaPencilAlt size={16} />
                    </Link>
                    <button
                      className="meus-ingressos-acao-btn"
                      title="Deletar"
                      onClick={() => handleAbrirConfirmacaoDelete(evento._id)}
                    >
                      <IoTrashBin size={18} />
                    </button>
                  </td>
                  <td className={`meus-ingressos-status meus-ingressos-status--${evento.status}`}>
                    {evento.status === "em_analise" ? "Em Análise" :
                      evento.status === "aprovado" ? "Aprovado" :
                        evento.status === "rejeitado" ? "Rejeitado" : "Em Reanálise"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ============ MENSAGEM SEM EVENTOS ============ */}
          {eventosFiltrados.length === 0 && (
            <div className="no-events">
              <img src={logo} alt="Nenhum evento encontrado" className="no-events-logo" />
              <p>
                {eventos.length === 0 
                  ? "Você ainda não criou nenhum evento."
                  : "Nenhum evento encontrado com os filtros aplicados."
                }
              </p>
            </div>
          )}
        </main>

        {/* ============ MODAIS ============ */}
        <ModalDetalhesEvento
          eventoId={eventoSelecionado || ''}
          isOpen={modalAberta}
          onClose={() => setModalAberta(false)}
        />

        {/* Modal de Confirmação de Exclusão */}
        <ModalAviso
          isOpen={modalConfirmOpen}
          onClose={() => setModalConfirmOpen(false)}
          onConfirm={handleConfirmarDelete}
          type="confirmacao"
          theme="info"
          title="Confirmar Exclusão"
          labelConfirmar="Excluir"
          isLoading={isDeleting}
        >
          <p>Tem certeza que deseja excluir este evento?</p>
          <p style={{ fontWeight: 'bold', color: '#c0392b' }}>
            Esta ação não pode ser desfeita.
          </p>
        </ModalAviso>

        {/* Modal de Aviso (Erros) */}
        <ModalAviso
          isOpen={modalAvisoOpen}
          onClose={() => setModalAvisoOpen(false)}
          type="aviso"
          theme="perigo"
          title={modalAvisoMensagem.title}
        >
          <p>{modalAvisoMensagem.message}</p>
        </ModalAviso>
      </div>
    </>
  );
};

export default MeusEventos;