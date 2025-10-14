import React, { useEffect, useState, useRef } from 'react';
import './AppHeader.css';
import logoLight from '../../../../src/assets/logo.png';
import { useAuth } from '../../../Hook/AuthContext';
import { TfiMenu } from "react-icons/tfi";
import { Link, useNavigate } from 'react-router-dom';
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

export default function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // FUNÇÃO CORRIGIDA PARA TRATAR IMAGENS DO GOOGLE
  const getProfileImageUrl = () => {
    if (!user?.imagemPerfil) {
      return `${apiUrl}/uploads/blank_profile.png`;
    }
    
    // Se já é uma URL completa (Google, Facebook, etc), retorna diretamente
    if (/^https?:\/\//.test(user.imagemPerfil)) {
      return user.imagemPerfil;
    }
    
    // Se começa com /uploads, adiciona o apiUrl
    if (user.imagemPerfil.startsWith('/uploads')) {
      return `${apiUrl}${user.imagemPerfil}`;
    }
    
    // Caso contrário, assume que é um arquivo local em uploads
    return `${apiUrl}/uploads/${user.imagemPerfil}`;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  return (
    <header className={`app-header ${scrolled ? 'app-header--scrolled' : ''}`}>
      <Link to="/Home" aria-label="Página inicial">
        <img src={logoLight} alt="Logo" className="app-header__logo" />
      </Link>

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
                  <button onClick={() => navigate('/')}><FaHome /><span>Home</span></button>
                  <button onClick={() => navigate('/meus-ingressos')}><FaTicketAlt /><span>Meus ingressos</span></button>
                  <button onClick={() => navigate('/perfil')}><FaUserCircle /><span>Minha conta</span></button>
                  {user && (user.role === 'SUPER_ADMIN' || user.role === 'MANAGER_SITE') && (
                    <button onClick={() => navigate('/Painel')}>
                      <FaUserShield />
                      <span>Painel Admin</span>
                    </button>
                  )}
                  <button onClick={() => navigate('/Meus-eventos')}><FaClipboardList /><span>Meus eventos</span></button>
                  <button onClick={() => navigate('/duvidas')}><FaHeadphones /><span>Central de Duvidas</span></button>
                  <button 
                    className="user-menu__logout-button" 
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    <FaSignOutAlt /><span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mobile-menu-icon" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
      </div>

      {mobileOpen && (
        <div className="mobile-menu-overlay open" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <div className="mobile-menu-close" onClick={() => setMobileOpen(false)}>
            <FaTimes size={20} />
          </div>
        </div>

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

        <button onClick={() => { navigate('/'); setMobileOpen(false); }}>
          <FaHome /> Início
        </button>

        {isAuthenticated && (
          <>
            <button onClick={() => { navigate('/meus-ingressos'); setMobileOpen(false); }}>
              <FaTicketAlt /> Meus ingressos
            </button>
            <button onClick={() => { navigate('/perfil'); setMobileOpen(false); }}>
              <FaUserCircle /> Minha conta
            </button>
            {user && (user.role === 'SUPER_ADMIN' || user.role === 'MANAGER_SITE') && (
              <button onClick={() => { navigate('/Painel'); setMobileOpen(false); }}>
                <FaUserShield /> Painel Admin
              </button>
            )}
            <button onClick={() => { navigate('/Meus-eventos'); setMobileOpen(false); }}>
              <FaClipboardList /> Meus eventos
            </button>
          </>
        )}

        <button onClick={() => { navigate('/duvidas'); setMobileOpen(false); }}>
          <FaHeadphones /> Central de Dúvidas
        </button>
        
        {isAuthenticated && (
          <>
            <button onClick={() => { navigate('/CriarEventos'); setMobileOpen(false); }}>
              <FaPlusCircle /> Criar Evento
            </button>
            <button onClick={() => { navigate('/Carrinho'); setMobileOpen(false); }}>
              <FaShoppingCart /> Carrinho
            </button>
          </>
        )}

        {!isAuthenticated ? (
          <button onClick={() => { navigate('/Login'); setMobileOpen(false); }}>
            Login / Cadastro
          </button>
        ) : (
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate('/');
              setMobileOpen(false);
            }}
          >
            <FaSignOutAlt /> Sair
          </button>
        )}
      </div>
    </header>
  );
}