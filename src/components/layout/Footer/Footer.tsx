import React, { useState } from "react";
import "./Footer.css";
import logo from '../../../assets/logo.png'
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const [usuarioLogado, setUsuarioLogado] = useState(true);

  return (
    <footer className="footer-container">
      <div className="foote-container">
        <img src={logo} alt="Logo NaVibe" className="logo" />
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
            <h4>Estados</h4>
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
            </ul>
          </div>
          <div className="fotterSection">
            <h4>Ajuda</h4>
            <ul>
              <li><Link to='/Termos' className="Link">Termos e políticas</Link></li>
              <li><Link to='/Duvidas' className="Link">Central de duvidas</Link></li>
            </ul>
          </div>
          <div className="fotterSection">
            <h4>Páginas</h4>
            <ul>
              <li><Link to='/' className="Link">Home</Link></li>
              <li><Link to='/Categorias' className="Link">Estados</Link></li>
              <li><Link to='/Carrinho' className="Link">Carrinho</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-sections2">
          <p style={{ fontFamily: 'Poppins', }}>© 2025 NaVibe. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;