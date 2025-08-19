import React, { useEffect, useState } from "react";
import EventoCard from "../../components/sections/Adm/EventoCard/EventoCard";
import { Evento } from "../../types/evento";
import { FaSignOutAlt, FaImages } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


import logo from "../../assets/logo.png";
import "../../styles/Painel.css";

//////////////////////////////////////////////////



////////////////////////////////////////////////////////

const email = localStorage.getItem('userName');

// Adicionando 'reanalise' ao tipo de status//////////////////////////
type EventoStatus = "em_analise" | "aprovado" | "rejeitado" | "reanalise";

const Painel: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [status, setStatusFilter] = useState<EventoStatus>("em_analise");
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  // Função para buscar os eventos com base no status selecionado
  const fetchEventosByStatus = (status: EventoStatus) => {
    fetch(`http://localhost:5000/api/listar/${status}`)
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((err) => console.error(`Erro ao buscar eventos ${status}:`, err));
  };

  // Hook para buscar eventos sempre que o statusFilter mudar
  useEffect(() => {
    fetchEventosByStatus(status);
  }, [status]);

  // Função para atualizar o status de um evento
  const updateEventoStatus = async (id: string, newStatus: EventoStatus) => {
    try {
      await fetch(`http://localhost:5000/api/atualizar-status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setEventos((prevEventos) => prevEventos.filter((evento) => evento._id !== id));
    } catch (err) {
      console.error("Erro ao atualizar status do evento:", err);
    }
  };

  const handleAceitar = (id: string) => updateEventoStatus(id, "aprovado");
  const handleRejeitar = (id: string) => updateEventoStatus(id, "rejeitado");
  // Nova função para definir o status de reanálise
  const handleReanalise = (id: string) => updateEventoStatus(id, "reanalise");

  const voltar = (): void => {
    navigate("/")
    window.location.reload();
  }

  const navigate = useNavigate();

  return (
    <div className="painel-wrapper">
      <aside className="painel-sidebar">
        <div className="painel-sidebar-top">
          <div className="painel-container-logo">
            <Link to="/Home" aria-label="Página inicial">
              <img src={logo} alt="Logo" className="painel-logo" />
            </Link>
          </div>
        </div>
        <div className="">
          <Link to="/CarrosselAdm" className="btn-gerenciar-carrossel">
            <FaImages />
            <p>Gerenciar Carrossel</p>
          </Link>
          <button className="btn-gerenciar-carrossel" onClick={() => {
            localStorage.clear();
            setUsuarioLogado(false);
            navigate('/');
            window.location.reload();
          }}>
            <FaSignOutAlt /><p>Sair</p>
          </button>
        </div>
      </aside>

      <main className="painel-main">
        <header className="painel-main-header">
          <div className="header-left">
            <h2>Painel de Administração</h2>
          </div>
          <div className="header-center">
            <button
              className={`tab-button ${status === "em_analise" ? "active" : ""}`}
              onClick={() => setStatusFilter("em_analise")}
            >
              Em Análise
            </button>
            <button
              className={`tab-button ${status === "aprovado" ? "active" : ""}`}
              onClick={() => setStatusFilter("aprovado")}
            >
              Aprovados
            </button>
            <button
              className={`tab-button ${status === "rejeitado" ? "active" : ""}`}
              onClick={() => setStatusFilter("rejeitado")}
            >
              Rejeitados
            </button>
            <button
              className={`tab-button ${status === "reanalise" ? "active" : ""}`}
              onClick={() => setStatusFilter("reanalise")}
            >
              Em Reanálise
            </button>
          </div>
          <div className="header-right">
            <strong>Administrador</strong>
            <p>{email}</p>
          </div>
        </header>

        <div className="painel-grid">
          {eventos.map((evento) => (
            <EventoCard
              key={evento._id}
              evento={{
                ...evento,
                imagem: `http://localhost:5000/uploads/${evento.imagem}`,
              }}
              onAceitar={handleAceitar}
              onRejeitar={handleRejeitar}
              onReanalise={handleReanalise} // Nova prop para o card
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Painel;