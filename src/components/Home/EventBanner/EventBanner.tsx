import React from "react";
import "./EventBanner.css";
import { FaRegCalendarAlt } from "react-icons/fa";

const EventBanner: React.FC = () => {
  return (
    <div className="event-banner">
      <div className="event-content">
        <FaRegCalendarAlt className="icon" />
        <div className="text">
          <p>Está pensando em criar um evento?</p>
          <span>Seja um parceiro <b>B4Y</b></span>
        </div>
      </div>
      <button className="start-button">Começar agora →</button>
    </div>
  );
};

export default EventBanner;
