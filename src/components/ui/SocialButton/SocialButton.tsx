import React from "react";
import "./SocialButton.css";

interface SocialButtonProps {
  icon: string;
  alt: string;
  onClick: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, alt, onClick }) => {
  return (
    <button className="social-button" onClick={onClick}>
      <img src={icon} alt={alt} className="social-icon"/>
    </button>
  );
};

export default SocialButton;
