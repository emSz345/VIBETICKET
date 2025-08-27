import React, { useEffect, useState } from 'react';
import './AppHeader.css'; // <-- ATUALIZE O NOME DO ARQUIVO CSS AQUI
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
} from 'react-icons/fa';

// Renomeado para AppHeader para maior clareza
export default function AppHeader() {
  const [scrolled, setScrolled] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
   const { user, isAuthenticated, logout } = useAuth();
  


  const getProfileImageUrl = () => {
    if (!user?.imagemPerfil) {
      return `${apiUrl}/uploads/blank_profile.png`;
    }

    // Se já é uma URL completa (http ou https)
    if (/^https?:\/\//.test(user.imagemPerfil)) {
      return user.imagemPerfil;
    }

    // Se começa com /uploads (caminho relativo)
    if (user.imagemPerfil.startsWith('/uploads')) {
      return `${apiUrl}${user.imagemPerfil}`;
    }

    // Padrão para imagens locais
    return `${apiUrl}/uploads/${user.imagemPerfil}`;
  };

 

 

  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`app-header ${scrolled ? 'app-header--scrolled' : ''}`}>
      {/* Logo */}

      <Link to="/Home" aria-label="Página inicial">
        <img src={scrolled ? logoLight : logoLight} alt="Logo" className="app-header__logo" />
      </Link>

      {/* Ações do Usuário */}
      <div className="app-header__actions">
        <div className="app-header__auth">
          {!isAuthenticated ? (
            <button onClick={() => navigate('/Login')} className="app-header__login-button">Login / Cadastro</button>
          ) : (
            <div className="user-menu">
              <div className="user-menu__trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user?.imagemPerfil ? (
                  <div className="user-menu__avatar-container">
                    {/* CORREÇÃO AQUI */}
                    <img src={getProfileImageUrl()} className="user-menu__avatar-image" alt="Avatar" />
                    <TfiMenu className="user-menu__icon" />
                  </div>
                ) : (
                  <div className="user-menu__avatar-placeholder">
                    {user?.nome?.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              {dropdownOpen && (
                <div className="user-menu__content">
                  <div className="user-menu__header">
                    {/* CORREÇÃO AQUI */}
                    <img src={getProfileImageUrl()} className="user-menu__avatar-image" alt="Avatar" />
                    <div className="user-menu__user-info">
                      <strong>{user?.nome}</strong>
                      <small>{user?.email}</small>
                    </div>
                  </div>
                  <hr />
                  <button onClick={() => navigate('/')}><FaHome /><span>Home</span></button>
                  <button onClick={() => navigate('/meus-ingressos')}><FaTicketAlt /><span>Meus ingressos</span></button>
                  <button onClick={() => navigate('/perfil')}><FaUserCircle /><span>Minha conta</span></button>
                  <button onClick={() => navigate('/favoritos')}><FaClipboardList /><span>Gerenciar eventos</span></button>
                  <button onClick={() => navigate('/duvidas')}><FaHeadphones /><span>Central de Duvidas</span></button>
                  <button className="user-menu__logout-button" onClick={() => {
                    logout()
                    navigate('/');
                  }}>
                    <FaSignOutAlt /><span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
