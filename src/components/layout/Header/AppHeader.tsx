import React, { useEffect, useState, useRef } from 'react';
import { FaPlusCircle, FaShoppingCart, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import './AppHeader.css';
import logoLight from '../../../../src/assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Hook/AuthContext';
import { TfiMenu } from "react-icons/tfi";

import {
  FaHome,
  FaTicketAlt,
  FaUserCircle,
  FaClipboardList,
  FaHeadphones,
  FaSignOutAlt,
  FaUserShield,
} from 'react-icons/fa';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  const voltar = (): void => {
    navigate("/");
    window.location.reload();
  };

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

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      {/* Logo */}
      <Link to="/Home" aria-label="Página inicial">
        <img src={logoLight} alt="Logo" className="header__logo" />
      </Link>

      {/* Busca (desktop apenas) */}
      <div className="header__search hide-mobile">
        <FaSearch aria-hidden />
        <input type="text" placeholder="Buscar eventos, artistas..." />
      </div>

      {/* Ações (desktop) */}
      <div className="header__actions hide-mobile">
        <button className="header__cta" onClick={() => navigate("/CriarEventos")}>
          <FaPlusCircle size={20} />
          CRIE SEU EVENTO
        </button>

        <div className="cart-icon" title="Carrinho de compras" aria-label="Carrinho de compras">
          <FaShoppingCart size={24} onClick={() => navigate("/Carrinho")} />
        </div>

        <div className="header__auth">
          {!isAuthenticated ? (
            <button onClick={() => navigate('/Login')} className="header_login_cadastro">
              Login / Cadastro
            </button>
          ) : (
            <div className="user-dropdown">
              {/* Trigger */}
              <div
                ref={triggerRef}
                className="user-info"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.imagemPerfil ? (
                  <div className="user-avatar-container">
                    <img
                      src={getProfileImageUrl()}
                      className="avatar"
                      alt="Avatar"
                      loading="eager"
                    />
                    <TfiMenu className="menu-icon" />
                  </div>
                ) : (
                  <div className="avatar-placeholder">
                    {user?.nome?.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              {dropdownOpen && (
                <div ref={menuRef} className="dropdown-menu">
                  <div className="dropdown-header">
                    {user?.imagemPerfil ? (
                      <img
                        src={getProfileImageUrl()}
                        className="avatar"
                        alt="Avatar"
                        loading="eager"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {user?.nome?.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="user-header">
                      <strong>{user?.nome}</strong>
                      <small>{user?.email}</small>
                    </div>
                  </div>
                  <hr />
                  <button onClick={() => voltar()}><FaHome /> <span>Início</span></button>
                  <button onClick={() => navigate('/meus-ingressos')}><FaTicketAlt /><span>Meus ingressos</span></button>
                  <button onClick={() => navigate('/perfil')}><FaUserCircle /><span>Minha conta</span></button>
                  {user?.isAdmin === true && (
                    <button onClick={() => navigate('/Painel')}>
                      <FaUserShield />
                      <span>Painel de Admin</span>
                    </button>
                  )}
                  <button onClick={() => navigate('/Meus-eventos')}><FaClipboardList /><span>Meus eventos</span></button>
                  <button onClick={() => navigate('/duvidas')}><FaHeadphones /><span>Central de Duvidas</span></button>
                  <button
                    className="logout-btn"
                    onClick={() => {
                      localStorage.clear();
                      logout();
                      navigate('/');
                      window.location.reload();
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

      <div className="mobile-menu-icon show-mobile" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <FaTimes size={26} color="#fff" /> : <FaBars size={26} color="#fff" />}
      </div>

      {/* MOBILE MENU (off-canvas) */}
      {mobileOpen && (
        <div className="mobile-menu-overlay open" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        {isAuthenticated && (
          <div className="user-info-mobile">
            <img
              src={getProfileImageUrl()}
              className="avatar"
              alt="Avatar"
              style={{ width: "50px", height: "50px" }}
            />
            <div className="mobile-user-info">
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
            {user?.isAdmin && (
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
        <button onClick={() => { navigate('/CriarEventos'); setMobileOpen(false); }}>
          <FaPlusCircle /> Criar Evento
        </button>
        <button onClick={() => { navigate('/Carrinho'); setMobileOpen(false); }}>
          <FaShoppingCart /> Carrinho
        </button>

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
              window.location.reload();
            }}
          >
            <FaSignOutAlt /> Sair
          </button>
        )}
      </div>
    </header>
  );
}