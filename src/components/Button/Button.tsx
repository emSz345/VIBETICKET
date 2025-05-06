import React from "react";
import "./Button.css";

interface ButtonProps {
  text: string;
  color: string
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, color }) => {

  if (color === "Red") {
    return (
      <button className="red-button" onClick={onClick}>
        {text}
      </button>
    );
  } else if (color === "Blue") {
    return (
      <button className="custom-button" onClick={onClick}>
        {text}
      </button>
    );
  }
};

export default Button;