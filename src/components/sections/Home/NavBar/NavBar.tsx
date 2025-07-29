import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaBars,
  FaHome,
  FaStar,
  FaTicketAlt,
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

// 1. A INTERFACE PARA OS DADOS DO USUÁRIO FICA AQUI
interface UserData {
  nome: string;
  imagemPerfil?: string;
}

const NavBar = () => {
  // 2. A NAVBAR VOLTA A TER SEU PRÓPRIO ESTADO LOCAL
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  // Estados locais para controlar a UI (menus abertos/fechados)
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // Hook para detectar mudanças de URL

  // 3. O useEffect LÊ O localStorage TODA VEZ QUE A ROTA MUDA
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (token && userString) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userString));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [location]); // O array de dependência [location] faz este código rodar a cada mudança de página

  // 4. A FUNÇÃO DE LOGOUT AGORA É LOCAL
  const handleLogout = () => {
    // Limpa todos os dados de autenticação do localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("imagemPerfil");
    localStorage.removeItem("userId");

    // Atualiza o estado local para refletir o logout
    setIsAuthenticated(false);
    setUser(null);
    setDropdownOpen(false);
    navigate('/login'); // Redireciona para a página de login
  };

  const getAvatarUrl = () => {
    if (!user || !user.imagemPerfil) return undefined;
    return `http://localhost:5000/uploads/${user.imagemPerfil}`;
  };

  return (
    <nav className="home-navbar">
      <div className="home-nav-top">
        {isAuthenticated && (
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars size={22} />
          </div>
        )}

        <div className={`home-auth ${menuOpen ? 'mobile-hide' : ''}`}>
          {/* 5. O JSX AGORA USA O ESTADO LOCAL 'isAuthenticated' e 'user' */}
          {!isAuthenticated ? (
            <>
              <Link to="/Login">Login</Link> | <Link to="/Cadastro">Cadastro</Link>
            </>
          ) : (
            user && (
              <div className="usuario-menu">
                <div 
                  className="usuario-topo" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  {user.imagemPerfil ? (
                    <img className='avatar' src={getAvatarUrl()} alt={`Avatar de ${user.nome}`} />
                  ) : (
                    <div className="avatar-placeholder">{user.nome.charAt(0).toUpperCase()}</div>
                  )}
                  <span>{user.nome}</span>
                  <FiChevronDown size={20} />
                </div>
                
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/home" className="menu-item" onClick={() => setDropdownOpen(false)}><FaHome /> Home</Link>
                    <Link to="/favoritos" className="menu-item" onClick={() => setDropdownOpen(false)}><FaStar /> Favoritos</Link>
                    <Link to="/Meus-Ingressos" className="menu-item" onClick={() => setDropdownOpen(false)}><FaTicketAlt /> Meus ingressos</Link>
                    <Link to="/perfil" className="menu-item" onClick={() => setDropdownOpen(false)}>
                      <CgProfile /> Meu perfil
                    </Link>
                    <Link to="/gerenciar-eventos" className="menu-item" onClick={() => setDropdownOpen(false)}><FaStore /> Gerenciar eventos</Link>
                    <Link to="/Duvidas" className="menu-item" onClick={() => setDropdownOpen(false)}><FaHeadphones /> Suporte</Link>
                    <button className="menu-item sair" onClick={handleLogout}>
                      <FaSignOutAlt /> Sair
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      <hr className="home-hr" />

      <div className="home-nav-main">
        {/* ... o resto do seu JSX permanece o mesmo ... */}
        <Link to="/Home" aria-label="Página inicial"><img src={logo} alt="Logo" className="home-logo" /></Link>
        <div className="home-search-container">
          <input type="text" placeholder="Pesquisar eventos, shows" className="home-search-input" />
          <IoSearch className="home-search-icon" />
        </div>
        <div className={`home-menu-links ${menuOpen ? 'active' : ''}`}>
          <div className='navbar-criar-evento'>
            <Link to={isAuthenticated ? "/CriarEventos" : "/Login"}>
              <FaPlusCircle className="criar-evento-icone" />
              <span className="criar-evento-texto">CRIAR EVENTOS</span>
            </Link>
          </div>
          <Link to="/Carrinho" aria-label="Carrinho de compras"><FaShoppingCart size={28} /></Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;