import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBars,
  FaHome,
  FaStar,
  FaTicketAlt,
  FaStore,
  FaHeadphones, // Corrigido o nome do ícone
  FaSignOutAlt,
  FaShoppingCart,
  FaPlusCircle
} from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { getUserInfo } from '../../../../Data/DadosLocal';
import { IoSearch } from 'react-icons/io5';
import { CgProfile } from "react-icons/cg";

import './NavBar.css';
import logo from '../../../../assets/img-logo.png';
import Perfil from '../../../../Page/User/Perfil';

type LoginType = "email" | "google" | "facebook";

interface UserData {
  nome: string;
  email: string;
  tipoLogin: LoginType;
  imagemPerfil?: string;
}

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    nome: "",
    email: "usuario@email.com",
    tipoLogin: "email"
  });

  // Carrega dados do usuário ao montar o componente
  useEffect(() => {
    const loadUserData = () => {
      const token = localStorage.getItem("token");
      const nome = localStorage.getItem("userName") || "";
      const email = localStorage.getItem("email") || "usuario@email.com";
      const tipoLogin = (localStorage.getItem("tipoLogin") as LoginType) || "email";
      const imagemPerfil = localStorage.getItem("imagemPerfil");

      setUsuarioLogado(!!token);
      setUserData({
        nome,
        email,
        tipoLogin,
        imagemPerfil: imagemPerfil || undefined
      });
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    // Limpa todos os dados de autenticação
    ["firebaseToken", "token", "userEmail", "userName", "tipoLogin", "imagemPerfil"].forEach(
      key => localStorage.removeItem(key)
    );
    
    setUsuarioLogado(false);
    setDropdownOpen(false);
    setUserData(prev => ({ ...prev, nome: "" }));
  };

  const getAvatarUrl = () => {
    if (!userData.imagemPerfil) return undefined;
    return `http://localhost:5000/uploads/${userData.imagemPerfil}`;
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
                <div 
                  className="usuario-topo" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  {userData.imagemPerfil ? (
                    <img 
                      className='avatar' 
                      src={getAvatarUrl()} 
                      alt={`Avatar de ${userData.nome}`} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {userData.nome.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{userData.nome || "Usuário"}</span>
                  <FiChevronDown size={20} />
                </div>
                
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/home" className="menu-item"><FaHome /> Home</Link>
                    <Link to="/favoritos" className="menu-item"><FaStar /> Favoritos</Link>
                    <Link to="/Meus-Ingressos" className="menu-item"><FaTicketAlt /> Meus ingressos</Link>
                    <button 
                      className="menu-item" 
                      onClick={() => {
                        setMostrarPerfil(true);
                        setDropdownOpen(false);
                      }}
                    >
                      <CgProfile /> Meu perfil
                    </button>
                    <Link to="/gerenciar-eventos" className="menu-item"><FaStore /> Gerenciar eventos</Link>
                    <Link to="/Duvidas" className="menu-item"><FaHeadphones /> Suporte</Link>
                    <button className="menu-item sair" onClick={handleLogout}>
                      <FaSignOutAlt /> Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <hr className="home-hr" />

        <div className="home-nav-main">
          <Link to="/Home" aria-label="Página inicial">
            <img src={logo} alt="Logo" className="home-logo" />
          </Link>

          <div className="home-search-container">
            <input
              type="text"
              placeholder="Pesquisar eventos, shows"
              className="home-search-input"
              aria-label="Pesquisar eventos"
            />
            <IoSearch className="home-search-icon" />
          </div>

          <div className={`home-menu-links ${menuOpen ? 'active' : ''}`}>
            <div className='navbar-criar-evento'>
              <Link to={usuarioLogado ? "/CriarEventos" : "/Login"}>
                <FaPlusCircle className="criar-evento-icone" />
                <span className="criar-evento-texto">CRIAR EVENTOS</span>
              </Link>
            </div>
           
            <Link to="/Carrinho" aria-label="Carrinho de compras">
              <FaShoppingCart size={28} />
            </Link>
          </div>
        </div>
      </nav>

        {mostrarPerfil && (
        <div className="modal perfil-tela">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setMostrarPerfil(false)}
              aria-label="Fechar perfil"
            >
              &times;
            </button>

            <Perfil 
              {...getUserInfo()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;