import React from "react";
import "./Bolinhas.css";

const Palcos = () => {
  // Gerar 20 palcos com propriedades controladas
  const stages = Array.from({ length: 10 }).map((_, index) => {
    const width = Math.floor(Math.random() * 30 + 20); // Largura entre 20px e 50px
    const height = width / 2; // Proporção de um palco
    const left = Math.random() * 100; // Posição horizontal aleatória
    const duration = Math.random() * 8 + 5; // Duração da animação entre 5s e 13s
    const delay = Math.random() * 5; // Atraso inicial entre 0s e 5s
    const color = `hsl(${Math.random() * 360}, 30%, 70%)`; // Cores pastéis

    return {
      width,
      height,
      left,
      duration,
      delay,
      color,
    };
  });

  return (
    <div className="stage-container">
      {stages.map((stage, index) => (
        <div
          key={index}
          className="stage"
          style={{
            width: `${stage.width}px`,
            height: `${stage.height}px`,
            left: `${stage.left}%`,
            backgroundColor: stage.color,
            animationDuration: `${stage.duration}s`,
            animationDelay: `${stage.delay}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Palcos;