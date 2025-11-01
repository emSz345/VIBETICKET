import React, { useState, useEffect, useCallback } from "react";
import "../../styles/MeusEventos.css";
import { FaEye, FaPencilAlt, FaPlus } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { MdEvent } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import ModalAviso from "../../components/sections/User/ModalAviso/ModalAviso";
import ModalDetalhesEvento from "../../components/sections/Adm/ModalDetalhesEvento/ModalDetalhesEvento";

type Evento = {
  _id: string;
  nome: string;
  status: "aprovado" | "rejeitado" | "em_analise" | "em_reanalise";
};

const MeusEventos = () => {
  const [modalAberta, setModalAberta] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [isDeleting, setIsDeleting] = useState(false); // Loading do delete
  const [eventoParaDeletar, setEventoParaDeletar] = useState<string | null>(null); // Guarda o ID do evento

  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);

  // State para o modal de AVISO (Erro)
  const [modalAvisoOpen, setModalAvisoOpen] = useState(false);
  const [modalAvisoMensagem, setModalAvisoMensagem] = useState({ title: '', message: '' });
  // 🔥 =======================================================
  // 🔥 FUNÇÃO CORRIGIDA (usando Token)
  // 🔥 =======================================================
  const fetchMeusEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Pega o token do localStorage (padrão da sua aplicação)
      const token = localStorage.getItem('token');
      if (!token) {
        // Se não tem token, redireciona para o login
        navigate('/login');
        return;
      }

      const response = await fetch(`${apiUrl}/api/eventos/meus-eventos`, {
        // 2. REMOVIDO: 'credentials: "include"'
        headers: {
          'Content-Type': 'application/json',
          // 3. ADICIONADO: O cabeçalho 'Authorization'
          'Authorization': `Bearer ${token}`
        }
      });

      // Se o token for inválido ou expirado
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Limpa o token inválido
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setEventos(data);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, navigate]);
  // 🔥 =======================================================
  // 🔥 FIM DA CORREÇÃO
  // 🔥 =======================================================

  useEffect(() => {
    fetchMeusEventos();
  }, [fetchMeusEventos]);

  const handleAbrirConfirmacaoDelete = (eventoId: string) => {
    setEventoParaDeletar(eventoId); // Salva o ID do evento que queremos deletar
    setModalConfirmOpen(true);     // Abre o modal de confirmação
  };

  // 🔥 4. FUNÇÃO QUE DE FATO DELETA (chamada pelo modal)
  const handleConfirmarDelete = useCallback(async () => {
    if (!eventoParaDeletar) return; // Segurança

    // REMOVIDO: o window.confirm
    // if (!window.confirm('...')) { return; }

    setIsDeleting(true); // Ativa o loading

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

      // Se o token for inválido
      if (response.status === 401 || response.status === 403) {
        navigate('/login');
        return;
      }

      const responseData = await response.json();

      if (!response.ok) {
        // 🔥 AQUI ESTÁ A MUDANÇA: Em vez de alert(), abrimos o modal de aviso
        // responseData.message virá do backend (ex: "Este evento não pode ser excluído...")
        throw new Error(responseData.message || 'Erro ao deletar evento');
      }

      // Sucesso!
      setEventos(prevEventos => prevEventos.filter(evento => evento._id !== eventoParaDeletar));
      // alert('Evento deletado com sucesso!'); // <-- REMOVIDO (opcional)

      // Fecha o modal de confirmação e limpa
      setModalConfirmOpen(false);
      setEventoParaDeletar(null);

    } catch (err) {
      // 🔥 TRATAMENTO DE ERRO: Abre o modal de aviso
      setModalAvisoMensagem({
        title: 'Operação Falhou',
        message: (err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.')
      });
      setModalAvisoOpen(true);

      // Também fechamos o modal de confirmação, já que a operação (falha) terminou
      setModalConfirmOpen(false);
    } finally {
      setIsDeleting(false); // Desativa o loading em qualquer cenário
    }
  }, [apiUrl, navigate, eventoParaDeletar]);

  const abrirModalDetalhes = (eventoId: string) => {
    setEventoSelecionado(eventoId);
    setModalAberta(true);
  };

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
          {/* A mensagem de erro agora será mais genérica, pois o erro de auth redireciona */}
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
    <div className="meus-ingressos-container">
      {/* Sidebar */}
      <aside className="meus-ingressos-sidebar">
        <nav>
          <button className="meus-ingressos-nav-btn meus-ingressos-active">
            <MdEvent /> Meus Eventos
          </button>
          <Link to="/CriarEventos" className="meus-ingressos-nav-btn">
            <FaPlus /> Crie seu evento
          </Link>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="meus-ingressos-content">
        {/* Header */}
        <header className="meus-ingressos-header">
          <h2>Meus Eventos</h2>
          <Link to="/CriarEventos" className="meus-ingressos-btn-criar">
            <FaPlus /> Crie seu evento
          </Link>
        </header>

        {/* Cards de resumo */}
        <section className="meus-ingressos-resumo">
          <div className="meus-ingressos-card">
            <h3>Total</h3>
            <p>{eventos.length}</p>
          </div>
          <div className="meus-ingressos-card meus-ingressos-card--aprovado">
            <h3>Aprovados</h3>
            <p>{eventos.filter(e => e.status === "aprovado").length}</p>
          </div>
          <div className="meus-ingressos-card meus-ingressos-card--em_analise">
            <h3>Em Análise</h3>
            <p>{eventos.filter(e => e.status === "em_analise").length}</p>
          </div>
          <div className="meus-ingressos-card meus-ingressos-card--rejeitado">
            <h3>Rejeitados</h3>
            <p>{eventos.filter(e => e.status === "rejeitado").length}</p>
          </div>
          <div className="meus-ingressos-card meus-ingressos-card--em_reanalise">
            <h3>Em Reanálise</h3>
            <p>{eventos.filter(e => e.status === "em_reanalise").length}</p>
          </div>
        </section>

        {/* Tabela */}
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
            {eventos.map((evento, index) => (
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
                    onClick={() => handleAbrirConfirmacaoDelete(evento._id)} // <-- CHAMA A FUNÇÃO DE ABRIR MODAL
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

        {eventos.length === 0 && (
          <div className="no-events">
            <p>Você ainda não criou nenhum evento.</p>
          </div>
        )}
      </main>
      <ModalDetalhesEvento
        eventoId={eventoSelecionado || ''}
        isOpen={modalAberta}
        onClose={() => setModalAberta(false)}
      />

      <ModalAviso
        isOpen={modalConfirmOpen}
        onClose={() => setModalConfirmOpen(false)}
        onConfirm={handleConfirmarDelete}
        type="confirmacao"
        theme="info" // "info" usa o ícone de lixeira
        title="Confirmar Exclusão"
        labelConfirmar="Excluir"
        isLoading={isDeleting}
      >
        <p>Tem certeza que deseja excluir este evento?</p>
        <p style={{ fontWeight: 'bold', color: '#c0392b' }}>
          Esta ação não pode ser desfeita.
        </p>
      </ModalAviso>

      {/* Modal de Aviso (para Erros) */}
      <ModalAviso
        isOpen={modalAvisoOpen}
        onClose={() => setModalAvisoOpen(false)}
        type="aviso"
        theme="perigo" // "perigo" usa o ícone de exclamação
        title={modalAvisoMensagem.title}
      >
        <p>{modalAvisoMensagem.message}</p>
      </ModalAviso>
    </div>
  );
};

export default MeusEventos;