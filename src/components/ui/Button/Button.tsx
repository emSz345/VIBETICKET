import React from "react";
import "./Button.css";

interface ButtonProps {
  text: string;
  color: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean; 
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ text, onClick, color, loading = false, disabled = false, type }) => {
  const className = color === "Red" ? "red-button" : "custom-button";

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      type={type || 'button'}
    >
      {loading ? (
        <span className="btn-loading">
          <span className="spinner"></span> Carregando...
        </span>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;