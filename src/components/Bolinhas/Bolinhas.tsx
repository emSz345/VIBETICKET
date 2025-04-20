import React from "react";
import "./Bolinhas.css";

const Bolinhas = () => {
  const bubbles = Array.from({ length: 15 }).map((_, index) => {
    const size = Math.random() * 40 + 20; // Tamanho entre 20px e 60px
    const left = Math.random() * 100; // Posição horizontal
    const delay = Math.random() * 5; // Delay da animação
    const duration = Math.random() * 10 + 5; // Duração entre 5s e 15s

    return (
      <div
        key={index}
        className="bubble"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      ></div>
    );
  });

  return <div className="bubble-container">{bubbles}</div>;
};

export default Bolinhas;