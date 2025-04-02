import React from "react";
import "./Footer.css";
import logo from '../../assets/img-logo.png'

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="container full-width">
        <img src={logo} alt="Logo B4Y" className="logo" />
        <hr className="hr" />
        <div className="footer-sections">
          <div className="section">
            <h4>Encontre estilos</h4>
            <ul>
              <li>Rock</li>
              <li>Pop</li>
              <li>Funk</li>
              <li>Rap</li>
            </ul>
          </div>
          <div className="section">
            <h4>Cidades</h4>
            <ul>
              <li>São Paulo</li>
              <li>Ribeirão Preto</li>
              <li>Taquaritinga</li>
              <li>Rio de Janeiro</li>
            </ul>
          </div>
          <div className="section">
            <h4>Produtores</h4>
            <ul>
              <li>Central de produtos</li>
              <li>Criar novo evento</li>
              <li>Gerenciar eventos</li>
              <li>Gerenciar ingressos</li>
            </ul>
          </div>
          <div className="section">
            <h4>Ajuda</h4>
            <ul>
              <li>Termos e políticas</li>
              <li>Criar novo evento</li>
              <li>Gerenciar eventos</li>
              <li>Gerenciar ingressos</li>
            </ul>
          </div>
          <div className="section">
            <h4>Páginas</h4>
            <ul>
              <li>Início</li>
              <li>Categorias</li>
              <li>Central produtores</li>
              <li>Carrinho</li>
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
