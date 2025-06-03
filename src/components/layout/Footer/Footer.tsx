import React from "react";
import "./Footer.css";
import logo from '../../../assets/img-logo.png'
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="foote-container">
        <img src={logo} alt="Logo B4Y" className="logo" />
        <hr className="footer-hr" />
        <div className="footer-sections">
          <div className="fotterSection">
            <h4>Encontre estilos</h4>
            <ul>
              <li>Rock</li>
              <li>Pop</li>
              <li>Funk</li>
              <li>Rap</li>
            </ul>
          </div>
          <div className="fotterSection">
            <h4>Cidades</h4>
            <ul>
              <li>São Paulo</li>
              <li>Ribeirão Preto</li>
              <li>Taquaritinga</li>
              <li>Rio de Janeiro</li>
            </ul>
          </div>
          <div className="fotterSection">
            <h4>Produtores</h4>
            <ul>
              <li><Link to='/Duvidas' className="Link">Criar novo evento</Link></li>
              <li><Link to='/Duvidas' className="Link">Gerenciar eventos</Link></li>
              <li><Link to='/Duvidas' className="Link">Gerenciar ingressos</Link></li>
            </ul>
          </div>
          <div className="fotterSection">
            <h4>Ajuda</h4>
            <ul>
              <li><Link to='/Duvidas' className="Link">Termos e políticas</Link></li>
              <li><Link to='/Duvidas' className="Link">Dúvias e suport</Link></li>
              <li><Link to='' className="Link">Gerenciar eventos</Link></li>
              <li><Link to='' className="Link">Gerenciar ingressos</Link></li>
            </ul>
          </div>
          <div className="fotterSection">
            <h4>Páginas</h4>
            <ul>
              <li><Link to='/Duvidas' className="Link">Home</Link></li>
              <li><Link to='/Duvidas' className="Link">Categorias</Link></li>
              <li><Link to='/Duvidas' className="Link">Central produtores</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-sections2">
          <p>© 2025 B4Y. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;