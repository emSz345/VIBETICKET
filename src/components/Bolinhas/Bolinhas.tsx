import React from "react";
import "./Bolinhas.css"

const Bolinhas = () => {
  const bubbles = Array.from({ length: 100 });

  return (
    <div className="bubble-container">
      {bubbles.map((_, index) => (
        <span key={index} className="bubble"></span>
      ))}
    </div>
  );
};

export default Bolinhas;
