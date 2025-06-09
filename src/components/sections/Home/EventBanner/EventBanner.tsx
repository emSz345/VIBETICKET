import React from "react";
import "./EventBanner.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EventBanner: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const tokenFirebase = localStorage.getItem("firebaseToken");
    const tokenLocal = localStorage.getItem("token");
    if (tokenFirebase || tokenLocal) {
      navigate("/CriarEventos");
    } else {
      navigate("/Login");
    }
  };
  

  return (
    <div className="event-banner">
      <div className="event-content">
        <FaRegCalendarAlt className="icon" />
        <div className="text">
          <p>Está pensando em criar um evento?</p>
          <span>Seja um parceiro <b>B4Y</b></span>
        </div>
      </div>
      <button className="start-button" onClick={handleClick}>
        Começar agora →
      </button>
    </div>
  );
};

export default EventBanner;
