import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./VoltarParaInicio.css";

// INTERFACES E TIPOS
interface VoltarParaInicioProps {
  texto?: string;
  destino?: string;
}


// COMPONENTE PRINCIPAL
const VoltarParaInicio: React.FC<VoltarParaInicioProps> = ({
  texto = "Voltar para tela inicial",
  destino = "/",
}) => {
  // HOOKS E STATE
  const navigate = useNavigate();

  // HANDLER FUNCTIONS
  const handleClick = () => {
    navigate(destino);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      navigate(destino);
    }
  };

  return (
    <div
      className="voltarParaInicio-container"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
    >
      <FaArrowLeft className="voltarParaInicio-icon" />
      <span className="voltarParaInicio-text">{texto}</span>
    </div>
  );
};

export default VoltarParaInicio;