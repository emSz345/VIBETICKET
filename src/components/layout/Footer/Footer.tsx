import React, { useState } from "react";
import "./Footer.css";
import logo from '../../../assets/img-logo.png'
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const [usuarioLogado, setUsuarioLogado] = useState(true);

  return (
    <footer className="footer-container">
      <div className="foote-container">
        <img src={logo} alt="Logo B4Y" className="logo" />
        <hr className="footer-hr" />
        <div className="footer-sections">
          <div className="fotterSection">
            <h4>Encontre estilos</h4>
            <ul>
              <li><Link to='' className="Link">Rock</Link></li>
              <li><Link to='' className="Link">Pop</Link></li>
              <li><Link to='' className="Link">Funk</Link></li>
              <li><Link to='' className="Link">Rap</Link></li>
              <li><Link to='' className="Link">Jazz</Link></li>
              <li><Link to='' className="Link">Eletônica</Link></li>
            </ul>
          </div>
          <div className="fotterSection">
            <h4>Cidades</h4>
            <ul>
              <li><Link to='' className="Link">São Paulo</Link></li>
              <li><Link to='' className="Link">Rio de Janeiro</Link></li>
              <li><Link to='' className="Link">Maranhão</Link></li>
              <li><Link to='' className="Link">Minhas Gerais</Link></li>
              <li><Link to='' className="Link">Pará</Link></li>
              <li><Link to='' className="Link">Paraná</Link></li>
            </ul>
          </div>
          <div className="fotterSection">
            <h4>Produtores</h4>
            <ul>
              {!usuarioLogado ? (
                <Link to="/Login">
                  <li><Link to='/CriarEventos' className="Link">Criar novo evento</Link></li>
                </Link>
              ) : (
                <li><Link to='/CriarEventos' className="Link">Criar novo evento</Link></li>
              )}
              <li><Link to='/Duvidas' className="Link">Gerenciar eventos</Link></li>
              <li><Link to='/Duvidas' className="Link">Gerenciar ingressos</Link></li>
            </ul>
          </div>
          <div className="fotterSection">
            <h4>Ajuda</h4>
            <ul>
              <li><Link to='/Termos' className="Link">Termos e políticas</Link></li>
              <li><Link to='/Duvidas' className="Link">Dúvidas e Suporte</Link></li>
              <li><Link to='' className="Link">Gerenciar eventos</Link></li>
              <li><Link to='' className="Link">Gerenciar ingressos</Link></li>
            </ul>
          </div>
          <div className="fotterSection">
            <h4>Páginas</h4>
            <ul>
              <li><Link to='/' className="Link">Home</Link></li>
              <li><Link to='/Categorias' className="Link">Busque por cidade</Link></li>
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