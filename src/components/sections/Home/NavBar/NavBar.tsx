import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMap,
  FaBars,
  FaHome,
  FaStar,
  FaTicketAlt,
  FaCog,
  FaStore,
  FaHeadphones,
  FaSignOutAlt,
  FaShoppingCart,
  FaPlusCircle
} from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';
import { CgProfile } from "react-icons/cg";

import './NavBar.css';
import logo from '../../../../assets/img-logo.png';
import Perfil from '../../../../Page/User/Perfil';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const [mostrarPerfilTela, setMostrarPerfilTela] = useState(false);


  const emailUsuario = localStorage.getItem("userEmail") || "usuario@email.com";
  const tipoLogin = (localStorage.getItem("tipoLogin") as "email" | "google" | "facebook") || "email";

  useEffect(() => {
    const token = localStorage.getItem("firebaseToken");
    const nome = localStorage.getItem("userName");
    if (token && nome) {
      setUsuarioLogado(true);
      setNomeUsuario(nome);
    } else {
      setUsuarioLogado(false);
      setNomeUsuario("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUsuarioLogado(false);
    setDropdownOpen(false);
    setNomeUsuario("");
  };

  return (
    <>
      <nav className="home-navbar">
        <div className="home-nav-top">
          {usuarioLogado && (
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <FaBars size={22} />
            </div>
          )}

          <div className={`home-auth ${menuOpen ? 'mobile-hide' : ''}`}>
            {!usuarioLogado ? (
              <>
                <Link to="/Login">Login</Link> | <Link to="/Cadastro">Cadastro</Link>
              </>
            ) : (
              <div className="usuario-menu">
                <div className="usuario-topo" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="avatar" />
                  <span>{localStorage.getItem("userName")}</span>
                  <FiChevronDown size={20} />
                </div>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/home" className="menu-item"><FaHome /> Home</Link>
                    <Link to="/favoritos" className="menu-item"><FaStar /> Favoritos</Link>
                    <Link to="/meus-ingressos" className="menu-item"><FaTicketAlt /> Meus ingressos</Link>
                    <div className="menu-item" onClick={() => setMostrarPerfilTela(true)}>
                      <CgProfile /> Meu perfil
                    </div>
                    <Link to="/gerenciar-eventos" className="menu-item"><FaStore /> Gerenciar eventos</Link>
                    <Link to="/Duvidas" className="menu-item"><FaHeadphones /> Suporte</Link>
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
              <div className='navbar-criar-evento'>
                <Link to="/Login">
                  <FaPlusCircle className="criar-evento-icone" />
                  <span className="criar-evento-texto">CRIAR EVENTOS</span>
                </Link>
              </div>
            ) : (
              <div className='navbar-criar-evento'>
                <Link to="/CriarEventos">
                  <FaPlusCircle className="criar-evento-icone" />
                  <span className="criar-evento-texto">CRIAR EVENTOS</span>
                </Link>
              </div>
            )}
            {usuarioLogado && (
              <Link to="/carrinho"><FaShoppingCart size={28} /></Link>
            )}
          </div>
        </div>
      </nav>

      {mostrarPerfilTela && (
        <div className="modal perfil-tela">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setMostrarPerfilTela(false)}
            >
              X
            </button>

            <Perfil nomeUsuario={nomeUsuario} emailUsuario={emailUsuario} tipoLogin={tipoLogin} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
