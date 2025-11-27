import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaArrowRight } from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from "react-router-dom";
import "./Footer.css";
import { HashLink } from 'react-router-hash-link';

// Assets
import logo from '../../../assets/logo.png';

// Importe os SVGs de pagamento
import pix from '../../../assets/SVGs/ic-payment-pix.svg';
import boleto from '../../../assets/SVGs/ic-payment-boleto.svg';
import visa from '../../../assets/SVGs/ic-payment-visa.svg';
import mastercard from '../../../assets/SVGs/ic-payment-master-card.svg';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-wrapper">
        
        {/* ========================================= */}
        {/* CABEÇALHO COM LOGO E REDES SOCIAIS        */}
        {/* ========================================= */}
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

        {/* ========================================= */}
        {/* SEÇÕES DE CONTEÚDO                        */}
        {/* ========================================= */}
        <div className="footer-sections-grid">
          
          {/* Seção 1 - Explore */}
          <div className="footer-section">
            <h4 className="footer-section-title">Explore</h4>
            <ul className="footer-section-list">
              <li className="footer-section-item">
                <HashLink to="#rock" className="footer-link">Eventos de Rock</HashLink>
              </li>
              <li className="footer-section-item">
                <HashLink to="#pop" className="footer-link">Eventos de Pop</HashLink>
              </li>
              <li className="footer-section-item">
                <HashLink to="#funk" className="footer-link">Eventos de Funk</HashLink>
              </li>
              <li className="footer-section-item">
                <HashLink to="#eletronica" className="footer-link">Eventos Eletrônicos</HashLink>
              </li>
              <li className="footer-section-item">
                <Link
                  to="/categorias"
                  className="footer-link footer-link-highlight"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  Todos os Eventos
                  <FaArrowRight size={15} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Seção 2 - Por Local */}
          <div className="footer-section">
            <h4 className="footer-section-title">Por Local</h4>
            <ul className="footer-section-list">
              <li className="footer-section-item">
                <Link to="/categorias?estado=SP" className="footer-link">São Paulo</Link>
              </li>
              <li className="footer-section-item">
                <Link to="/categorias?estado=RJ" className="footer-link">Rio de Janeiro</Link>
              </li>
              <li className="footer-section-item">
                <Link to="/categorias?estado=MG" className="footer-link">Minas Gerais</Link>
              </li>
              <li className="footer-section-item">
                <Link to="/categorias?estado=PR" className="footer-link">Paraná</Link>
              </li>
              <li className="footer-section-item">
                <Link
                  to="/categorias"
                  className="footer-link footer-link-highlight"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  Ver todos os estados
                  <FaArrowRight size={15} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Seção 3 - Produtores */}
          <div className="footer-section">
            <h4 className="footer-section-title">Produtores</h4>
            <ul className="footer-section-list">
              <li className="footer-section-item"><Link to="/criarEeventos" className="footer-link">Criar Evento</Link></li>
              <li className="footer-section-item"><Link to="/meus-eventos" className="footer-link">Gerenciar Eventos</Link></li>
            </ul>
          </div>

          {/* Seção 4 - Ajuda */}
          <div className="footer-section">
            <h4 className="footer-section-title">Ajuda</h4>
            <ul className="footer-section-list">
              <li className="footer-section-item"><Link to="/duvidas" className="footer-link">Central de Ajuda</Link></li>
              <li className="footer-section-item"><Link to="/termos" className="footer-link">Termos de Uso</Link></li>
              <li className="footer-section-item"><Link to="/politica-privacidade" className="footer-link">Política de Privacidade</Link></li>
              <li className="footer-section-item"><Link to="/PoliticaReembolso" className="footer-link">Política de Reembolso</Link></li>
            </ul>
          </div>

          {/* Seção 5 - Métodos de Pagamento */}
          <div className="footer-section">
            <h4 className="footer-section-title">Métodos de pagamento</h4>
            <div className="payment-icons-container">
              <img src={pix} alt="Pagamento via Pix" className="payment-icon" />
              <img src={boleto} alt="Pagamento via Boleto" className="payment-icon" />
              <img src={visa} alt="Pagamento via Visa" className="payment-icon" />
              <img src={mastercard} alt="Pagamento via Mastercard" className="payment-icon" />
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* RODAPÉ INFERIOR                           */}
        {/* ========================================= */}
        <div className="footer-bottom">
          <p className="footer-copyright">© {new Date().getFullYear()} VibeTicket. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;