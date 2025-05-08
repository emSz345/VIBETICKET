import React from "react";
import { Filter } from "lucide-react";
import "./Banner.css";
import help from '../../../assets/help.png'

const Banner: React.FC = () => {
  return (
    <div className="banner">
      <div className="banner-content">
        <img src={help} alt="Ajuda" className="banner-image" />
        <div>
          <p className="banner-title">Ajude a transformar vidas</p>
          <p className="banner-subtitle">
          Doe na compra de ingressos e apoie projetos que fazem a diferença.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
