import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AppHeader.css';

// Hooks
import { useAuth } from '../../../Hook/AuthContext';

// Ícones
import { TfiMenu } from "react-icons/tfi";
import {
  FaHome,
  FaTicketAlt,
  FaUserCircle,
  FaClipboardList,
  FaHeadphones,
  FaSignOutAlt,
  FaUserShield,
  FaBars,
  FaTimes,
  FaPlusCircle,
  FaShoppingCart,
} from 'react-icons/fa';

// Assets
import logoLight from '../../../../src/assets/logo.png';

export default function AppHeader() {
  // STATE HOOKS
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // REFS E CONTEXT
  const { user, isAuthenticated, logout } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // EFFECT HOOKS
  // Detecta scroll da página
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FUNÇÕES AUXILIARES
  // Função para obter URL da imagem de perfil
  const getProfileImageUrl = () => {
    if (!user?.imagemPerfil) {
      return `${apiUrl}/uploads/blank_profile.png`;
    }
    
    if (/^https?:\/\//.test(user.imagemPerfil)) {
      return user.imagemPerfil;
    }
    
    if (user.imagemPerfil.startsWith('/uploads')) {
      return `${apiUrl}${user.imagemPerfil}`;
    }
    
    return `${apiUrl}/uploads/${user.imagemPerfil}`;
  };

  // HANDLER FUNCTIONS
  // Função para navegar no menu DESKTOP
  const handleDesktopNavigation = (path: string) => {
    navigate(path);
    setDropdownOpen(false);
  };

  // Função para navegar no menu MOBILE
  const handleMobileNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Função para logout
  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className={`app-header ${scrolled ? 'app-header--scrolled' : ''}`}>
      <Link to="/Home" aria-label="Página inicial">
        <img src={logoLight} alt="Logo" className="app-header__logo" />
      </Link>

      {/* MENU DESKTOP   */}
      <div className="app-header__actions">
        <div className="app-header__auth">
          {!isAuthenticated ? (
            <button onClick={() => navigate('/Login')} className="app-header__login-button">
              Login / Cadastro
            </button>
          ) : (
            <div className="user-menu">
              <div 
                ref={triggerRef}
                className="user-menu__trigger" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.imagemPerfil ? (
                  <div className="user-menu__avatar-container">
                    <img 
                      src={getProfileImageUrl()} 
                      className="user-menu__avatar-image" 
                      alt="Avatar" 
                      onError={(e) => {
                        e.currentTarget.src = `${apiUrl}/uploads/blank_profile.png`;
                      }}
                    />
                    <TfiMenu className="user-menu__icon" />
                  </div>
                ) : (
                  <div className="user-menu__avatar-placeholder">
                    {user?.nome?.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              {dropdownOpen && (
                <div ref={menuRef} className="user-menu__content">
                  <div className="user-menu__header">
                    <img 
                      src={getProfileImageUrl()} 
                      className="user-menu__avatar-image" 
                      alt="Avatar" 
                      onError={(e) => {
                        e.currentTarget.src = `${apiUrl}/uploads/blank_profile.png`;
                      }}
                    />
                    <div className="user-menu__user-info">
                      <strong>{user?.nome}</strong>
                      <small>{user?.email}</small>
                    </div>
                  </div>
                  <hr />
                  <button onClick={() => handleDesktopNavigation('/')}><FaHome /><span>Início</span></button>
                  <button onClick={() => handleDesktopNavigation('/meus-ingressos')}><FaTicketAlt /><span>Meus ingressos</span></button>
                  <button onClick={() => handleDesktopNavigation('/perfil')}><FaUserCircle /><span>Minha conta</span></button>
                  {user && (user.role === 'SUPER_ADMIN' || user.role === 'MANAGER_SITE') && (
                    <button onClick={() => handleDesktopNavigation('/Painel')}>
                      <FaUserShield />
                      <span>Painel Admin</span>
                    </button>
                  )}
                  <button onClick={() => handleDesktopNavigation('/Meus-eventos')}><FaClipboardList /><span>Meus eventos</span></button>
                  <button onClick={() => handleDesktopNavigation('/duvidas')}><FaHeadphones /><span>Central de Duvidas</span></button>
                  <button 
                    className="user-menu__logout-button" 
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt /><span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================= */}
      {/* MENU MOBILE                                */}
      {/* ========================================= */}
      
      {/* Ícone do Menu Mobile */}
      <div className="mobile-menu-icon" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
      </div>

      {/* Overlay do Menu Mobile */}
      {mobileOpen && (
        <div className="mobile-menu-overlay open" onClick={() => setMobileOpen(false)} />
      )}

      {/* Menu Mobile */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <div className="mobile-menu-close" onClick={() => setMobileOpen(false)}>
            <FaTimes size={20} />
          </div>
        </div>

        {/* Informações do usuário (mobile) */}
        {isAuthenticated && (
          <div className="user-info-mobile">
            <img
              src={getProfileImageUrl()}
              className="avatar"
              alt="Avatar"
              style={{ width: "50px", height: "50px" }}
              onError={(e) => {
                e.currentTarget.src = `${apiUrl}/uploads/blank_profile.png`;
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <strong>{user?.nome}</strong>
              <small>{user?.email}</small>
            </div>
          </div>
        )}

        {/* Itens do menu mobile */}
        <button onClick={() => handleMobileNavigation('/')}>
          <FaHome /> Início
        </button>

        {isAuthenticated && (
          <>
            <button onClick={() => handleMobileNavigation('/meus-ingressos')}>
              <FaTicketAlt /> Meus ingressos
            </button>
            <button onClick={() => handleMobileNavigation('/perfil')}>
              <FaUserCircle /> Minha conta
            </button>
            {user && (user.role === 'SUPER_ADMIN' || user.role === 'MANAGER_SITE') && (
              <button onClick={() => handleMobileNavigation('/Painel')}>
                <FaUserShield /> Painel Admin
              </button>
            )}
            <button onClick={() => handleMobileNavigation('/Meus-eventos')}>
              <FaClipboardList /> Meus eventos
            </button>
          </>
        )}

        <button onClick={() => handleMobileNavigation('/duvidas')}>
          <FaHeadphones /> Central de Dúvidas
        </button>
        
        {isAuthenticated && (
          <>
            <button onClick={() => handleMobileNavigation('/CriarEventos')}>
              <FaPlusCircle /> Criar Evento
            </button>
            <button onClick={() => handleMobileNavigation('/Carrinho')}>
              <FaShoppingCart /> Carrinho
            </button>
          </>
        )}

        {/* Botão de Login/Logout */}
        {!isAuthenticated ? (
          <button onClick={() => handleMobileNavigation('/Login')}>
            Login / Cadastro
          </button>
        ) : (
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Sair
          </button>
        )}
      </div>
    </header>
  );
}