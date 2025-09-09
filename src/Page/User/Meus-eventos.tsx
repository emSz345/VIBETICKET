import React, { useState, useEffect, useCallback } from "react";
import "../../styles/MeusEventos.css";
import { FaEye, FaPencilAlt, FaPlus } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { MdEvent } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";

type Evento = {
  _id: string;
  nome: string;
  status: "aprovado" | "rejeitado" | "em_analise" | "em_reanalise";
};

const MeusEventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  // Função de busca de eventos ajustada para cookies
  const fetchMeusEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. REMOVIDO: A verificação de token no localStorage não é mais necessária.
      // const token = localStorage.getItem('token');
      // if (!token) { ... }

      const response = await fetch(`${apiUrl}/api/eventos/meus-eventos`, {
        // 2. ADICIONADO: 'credentials: "include"' para que o navegador envie os cookies de autenticação.
        credentials: 'include',
        headers: {
          // 3. REMOVIDO: O cabeçalho 'Authorization' não é mais necessário com cookies.
          'Content-Type': 'application/json'
        }
      });

      // A verificação de status 401/403 agora é a principal forma de detectar um usuário não logado.
      if (response.status === 401 || response.status === 403) {
        // Limpar qualquer dado antigo, se houver, e redirecionar para o login.
        localStorage.removeItem('user'); // Pode manter isso se guardar dados do usuário
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

  useEffect(() => {
    fetchMeusEventos();
  }, [fetchMeusEventos]);

  // Função de deletar evento ajustada para cookies
  const handleDeleteEvento = useCallback(async (eventoId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este evento?')) {
      return;
    }

    try {
      // 1. REMOVIDO: A busca do token no localStorage
      // const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/api/eventos/${eventoId}`, {
        method: 'DELETE',
        // 2. ADICIONADO: 'credentials: "include"'
        credentials: 'include',
        headers: {
          // 3. REMOVIDO: O cabeçalho 'Authorization'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao deletar evento');
      }

      setEventos(prevEventos => prevEventos.filter(evento => evento._id !== eventoId));
      alert('Evento deletado com sucesso!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar evento');
      console.error('Erro ao deletar evento:', err);
    }
  }, [apiUrl, setEventos]); // Removido 'setEventos' da dependência pois o React garante sua estabilidade

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
                  <button className="meus-ingressos-acao-btn" title="Visualizar">
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
                    onClick={() => handleDeleteEvento(evento._id)}
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
    </div>
  );
};

export default MeusEventos;