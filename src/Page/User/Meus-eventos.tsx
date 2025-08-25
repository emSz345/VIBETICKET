import React, { useState, useEffect } from "react";
import "../../styles/MeusEventos.css";
import { FaEye, FaPencilAlt, FaPlus, FaCog } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { MdEvent, MdDashboard } from "react-icons/md";
import { useAuth } from "../../Hook/AuthContext";
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
  const { user } = useAuth(); // Use o hook de autenticação
  const apiUrl = process.env.REACT_APP_API_URL;

  // Adicione no início do componente para debug
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    console.log('🔐 Token no localStorage:', token);
    console.log('👤 User no localStorage:', user ? JSON.parse(user) : 'Nenhum usuário');

    if (!token) {
      console.error('❌ Nenhum token encontrado!');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    console.log('🔍 Verificação inicial - Token:', token);
    console.log('🔍 Verificação inicial - User:', user);

    if (!token) {
      console.error('❌ Token não encontrado! Redirecionando para login...');
      navigate('/login');
      return;
    }

    fetchMeusEventos();
  }, [navigate]);

  // Função para buscar eventos do usuário logado
  const fetchMeusEventos = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      console.log('🔐 Token sendo enviado:', token);

      if (!token) {
        setError('Usuário não autenticado. Faça login novamente.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/api/eventos/meus-eventos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Status da resposta:', response.status);
      console.log('📊 Headers da resposta:', Object.fromEntries(response.headers.entries()));

      if (response.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
        return;
      }

      if (response.status === 403) {
        const errorData = await response.json();
        console.log('❌ Erro 403 detalhado:', errorData);

        if (errorData.message.includes('Token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        setError('Acesso negado. Token pode estar inválido.');
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
  };

  useEffect(() => {
    console.log('Token no localStorage:', localStorage.getItem('token'));
    console.log('User no localStorage:', localStorage.getItem('user'));
    fetchMeusEventos();
  }, []);

  // Função para deletar evento
  const handleDeleteEvento = async (eventoId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este evento?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/eventos/${eventoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao deletar evento');
      }

      // Atualiza a lista após deletar
      setEventos(eventos.filter(evento => evento._id !== eventoId));
      alert('Evento deletado com sucesso!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar evento');
      console.error('Erro ao deletar evento:', err);
    }
  };

  console.log('Estado atual:', { loading, error, eventos: eventos.length });

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