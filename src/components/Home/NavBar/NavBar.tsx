import { useEffect, useState } from 'react';
import axios from 'axios'; // certifique-se que está instalado
import { Link } from 'react-router-dom';
import {
  FaMap, FaBars, FaHome, FaStar, FaTicketAlt,
  FaCog, FaStore, FaHeadphones, FaSignOutAlt, FaShoppingCart
} from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';

import './NavBar.css';
import logo from '../../../assets/img-logo.png';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("firebaseToken");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsuarioLogado(true);
      setNomeUsuario(payload.nome);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("firebaseToken");
    setUsuarioLogado(false);
    setDropdownOpen(false);
    setNomeUsuario("");
  };

  return (
    <nav className="home-navbar">
      <div className="home-nav-top">
        {usuarioLogado && (
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars size={22} />
          </div>
        )}

        <div className="home-location">
          <FaMap className="home-iconMap" />
          <span className="home-location-text">Escolha seu local</span>
          <FiChevronDown size={24} />
          <button className="home-location-btn">Descubra o que fazer perto de você</button>
        </div>

        <div className={`home-auth ${menuOpen ? 'mobile-hide' : ''}`}>
          {!usuarioLogado ? (
            <>
              <Link to="/Login">Login</Link> | <Link to="/Cadastro">Cadastro</Link>
            </>
          ) : (
            <div className="usuario-menu">
              <div className="usuario-topo" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="avatar" />
                <span>{localStorage.getItem("userName") || "Usuário"}</span>
                <FiChevronDown size={20} />
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/home" className="menu-item"><FaHome /> Home</Link>
                  <Link to="/favoritos" className="menu-item"><FaStar /> Favoritos</Link>
                  <Link to="/meus-ingressos" className="menu-item"><FaTicketAlt /> Meus ingressos</Link>
                  <Link to="/configuracoes" className="menu-item"><FaCog /> Configurações</Link>
                  <Link to="/gerenciar-eventos" className="menu-item"><FaStore /> Gerenciar eventos</Link>
                  <Link to="/suporte" className="menu-item"><FaHeadphones /> Suporte</Link>
                  <div className="menu-item sair" onClick={handleLogout}>
                    <FaSignOutAlt /> Sair
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <hr className="home-hr" />

      <div className="home-nav-main">
        <Link to="/Home">
          <img src={logo} alt="Logo" className="home-logo" />
        </Link>

        <div className="home-search-container">
          <input
            type="text"
            placeholder="Pesquisar eventos, shows"
            className="home-search-input"
          />
          <IoSearch className="home-search-icon" />
        </div>

        <div className={`home-menu-links ${menuOpen ? 'active' : ''}`}>
        {!usuarioLogado ? (
          <div>
            <Link to="/Login">CRIAR EVENTOS</Link>
          </div>
        ):(
        <div>
          <Link to="/CriarEventos">CRIAR EVENTOS</Link>
        </div>
        )}
          {usuarioLogado && (
            <Link to="/carrinho"><FaShoppingCart size={28} /></Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
