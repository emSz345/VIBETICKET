import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from "react-router-dom";
import "./Footer.css";
import logo from '../../../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-wrapper">
        {/* Cabeçalho com logo e redes sociais */}
        <div className="footer-header">
          <div className="footer-logo-container">
            <img src={logo} alt="Logo NaVibe" className="footer-logo" />
          </div>
          <div className="footer-social-container">
            <button className="footer-social-link"><FaFacebook /></button>
            <button className="footer-social-link"><FaInstagram /></button>
            <button className="footer-social-link"><FaXTwitter /></button>
            <button className="footer-social-link"><FaWhatsapp /></button>
          </div>
        </div>

        {/* Seções de conteúdo */}
        <div className="footer-sections-grid">
          {/* Seção 1 - Explore */}
          <div className="footer-section">
            <h4 className="footer-section-title">Explore</h4>
            <ul className="footer-section-list">
              <li className="footer-section-item"><Link to="/eventos/rock" className="footer-link">Eventos de Rock</Link></li>
              <li className="footer-section-item"><Link to="/eventos/pop" className="footer-link">Eventos de Pop</Link></li>
              <li className="footer-section-item"><Link to="/eventos/funk" className="footer-link">Eventos de Funk</Link></li>
              <li className="footer-section-item"><Link to="/eventos/eletronica" className="footer-link">Eventos Eletrônicos</Link></li>
              <li className="footer-section-item"><Link to="/eventos" className="footer-link footer-link-highlight">Todos os Eventos →</Link></li>
            </ul>
          </div>

          {/* Seção 2 - Por Local */}
          <div className="footer-section">
            <h4 className="footer-section-title">Por Local</h4>
            <ul className="footer-section-list">
              <li className="footer-section-item"><Link to="/eventos/sao-paulo" className="footer-link">São Paulo</Link></li>
              <li className="footer-section-item"><Link to="/eventos/rio-de-janeiro" className="footer-link">Rio de Janeiro</Link></li>
              <li className="footer-section-item"><Link to="/eventos/minas-gerais" className="footer-link">Minas Gerais</Link></li>
              <li className="footer-section-item"><Link to="/eventos/parana" className="footer-link">Paraná</Link></li>
              <li className="footer-section-item"><a
                href="#estados"
                className="footer-link footer-link-highlight"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('estados');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}> Ver todos os estados →
              </a>
              </li>
            </ul>
          </div>

          {/* Seção 3 - Produtores */}
          <div className="footer-section">
            <h4 className="footer-section-title">Produtores</h4>
            <ul className="footer-section-list">
              <li className="footer-section-item"><Link to="/criarEeventos" className="footer-link">Criar Evento</Link></li>
              <li className="footer-section-item"><Link to="/gerenciar-eventos" className="footer-link">Gerenciar Eventos</Link></li>
              <li className="footer-section-item"><Link to="/duvidas-produtores" className="footer-link">Dúvidas para Produtores</Link></li>
            </ul>
          </div>

          {/* Seção 4 - Ajuda */}
          <div className="footer-section">
            <h4 className="footer-section-title">Ajuda</h4>
            <ul className="footer-section-list">
              <li className="footer-section-item"><Link to="/duvidas" className="footer-link">Central de Ajuda</Link></li>
              <li className="footer-section-item"><Link to="/termos" className="footer-link">Termos de Uso</Link></li>
              <li className="footer-section-item"><Link to="/politica-privacidade" className="footer-link">Política de Privacidade</Link></li>
              <li className="footer-section-item"><Link to="/reembolsos" className="footer-link">Política de Reembolso</Link></li>
            </ul>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="footer-bottom">
          <p className="footer-copyright">© {new Date().getFullYear()} NaVibe. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;