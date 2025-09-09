import React from "react";
import "./SocialButton.css";

interface SocialButtonProps {
  icon: string;
  alt: string;
  onClick: () => void;
  disabled?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, alt, onClick, disabled }) => {
  return (
    // CORREÇÃO 2: Passe a prop 'disabled' para o botão real
    <button onClick={onClick} className="social-button" disabled={disabled}>
      <img src={icon} alt={alt} />
    </button>
  );
};

export default SocialButton;
