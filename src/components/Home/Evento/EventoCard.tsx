import React from "react";
import "./EventoCard.css";
import EventImg from "../../../assets/img-show.png";

const EventCard: React.FC = () => {
  return (
    <div className="event-container">
      <h3 className="event-title">Eventos em destaque</h3>
      <div className="event-card">
        <div className="event-info">
          <p className="event-date">
            <span className="event-day">Qui, 20 de fev • 19:00</span> • +10 mil vendidos
          </p>
          <h2 className="event-name">Anitta music</h2>
          <p className="event-location">local do evento</p>
          <div className="event-buttons">
            <button className="btn btn-outline">Comprar ingressos</button>
            <button className="btn btn-primary">Comprar presentes</button>
          </div>
        </div>
        <img
          src={EventImg}
          alt="Evento"
          className="event-image"
        />
      </div>
    </div>
  );
};

export default EventCard;
