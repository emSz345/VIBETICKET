import React, { useEffect, useState } from "react";
import EventoCard from "../../components/sections/Adm/EventoCard/EventoCard";
import { Evento } from "../../types/evento";

import logo1 from "../../assets/img-logo.png";
import "../../styles/Painel.css";
import { Link } from "react-router-dom";

const Painel: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);

  const handleAceitar = (id: string) => console.log("Aceito:", id);
  const handleRejeitar = (id: string) => console.log("Rejeitado:", id);

  useEffect(() => {
    fetch("http://localhost:5000/api/eventos/listar")
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((err) => console.error("Erro ao buscar eventos:", err));
  }, []);

  return (
    <div className="painel-wrapper">
      <aside className="painel-sidebar">
        <div>
          <div className="painel-container-logo">
            <img src={logo1} alt="Logo" className="painel-logo" />
          </div>
          <nav>
            <ul>
              <li>
                <Link to="/Aprovados" className="painel-sidebar-link">
                  Eventos Aprovados
                </Link>
              </li>
              <li>
                <Link to="/Rejeitados" className="painel-sidebar-link">
                  Eventos Rejeitados
                </Link>
              </li>
              <li className="painel-sidebar-link-sair">Sair</li>
            </ul>
          </nav>
        </div>
        <div className="painel-sidebar-footer">
          <strong>Administrador</strong>
          <p>admin.b4y.2025@gmail.com</p>
        </div>
      </aside>

      <main className="painel-main">
        <header>
          <h2>Painel de Administração</h2>
        </header>

        <div className="painel-grid">
          {eventos.map((evento) => (
            <EventoCard
              key={evento._id}
              evento={{
                ...evento,
                imagem: `http://localhost:5000/uploads/${evento.imagem}`, // Ajuste de imagem
              }}
              onAceitar={handleAceitar}
              onRejeitar={handleRejeitar}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Painel;
