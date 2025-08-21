import React from "react";
import "../../styles/MeusEventos.css";

import { FaEye, FaPencilAlt, FaPlus, FaCog } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { MdEvent, MdDashboard  } from "react-icons/md";

type Evento = {
  id: number;
  titulo: string;
  status: "aprovado" | "negado" | "em_analise";
};

const eventos: Evento[] = [
  { id: 1, titulo: "Festival de Sertanejo", status: "aprovado" },
  { id: 2, titulo: "Festival de Rock", status: "negado" },
  { id: 3, titulo: "Festival de Funk", status: "em_analise" },
];

const MeusEventos = () => {
  return (
    <div className="meus-ingressos-container">
      {/* Sidebar */}
      <aside className="meus-ingressos-sidebar">
        <nav>
          <button className="meus-ingressos-nav-btn meus-ingressos-active">
            <MdEvent /> Meus Eventos
          </button>
          <button className="meus-ingressos-nav-btn">
            <FaPlus /> Crie seu evento
          </button>

          <button className="meus-ingressos-nav-btn">
            <MdDashboard /> dashboard
          </button>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="meus-ingressos-content">
        {/* Header */}
        <header className="meus-ingressos-header">
          <h2>Meus Eventos</h2>
          <button className="meus-ingressos-btn-criar">
            <FaPlus /> Crie seu evento
          </button>
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
          <div className="meus-ingressos-card meus-ingressos-card--negado">
            <h3>Negados</h3>
            <p>{eventos.filter(e => e.status === "negado").length}</p>
          </div>
        </section>

        {/* Tabela */}
        <table className="meus-ingressos-event-table">
          <thead>
            <tr>
              <th>#</th>
              <th>TÍTULO</th>
              <th>AÇÕES</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id}>
                <td>{evento.id}</td>
                <td>{evento.titulo}</td>
                <td className="meus-ingressos-acoes">
                  <button className="meus-ingressos-acao-btn" title="Visualizar">
                    <FaEye size={18} />
                  </button>
                  <button className="meus-ingressos-acao-btn" title="Editar">
                    <FaPencilAlt size={16} />
                  </button>
                  <button className="meus-ingressos-acao-btn" title="Deletar">
                    <IoTrashBin size={18} />
                  </button>
                </td>
                <td className={`meus-ingressos-status meus-ingressos-status--${evento.status}`}>
                  {evento.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default MeusEventos;
