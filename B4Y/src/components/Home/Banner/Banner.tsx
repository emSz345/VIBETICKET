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
          <p className="banner-title">Está perdido?</p>
          <p className="banner-subtitle">
            Use o filtro para pesquisas específicas!
          </p>
        </div>
      </div>
      <button className="filter-button">
        <Filter className="filter-icon" />
      </button>
    </div>
  );
};

export default Banner;
