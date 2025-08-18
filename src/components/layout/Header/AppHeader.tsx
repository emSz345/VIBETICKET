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
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
   const { user, isAuthenticated, logout } = useAuth();
  const [emailUsuario, setEmailUsuario] = useState('');
  const [imagemPerfil, setImagemPerfil] = useState('');


  const getProfileImageUrl = () => {
    if (!user?.imagemPerfil) {
      return 'http://localhost:5000/uploads/blank_profile.png';
    }

    // Se já é uma URL completa (http ou https)
    if (/^https?:\/\//.test(user.imagemPerfil)) {
      return user.imagemPerfil;
    }

    // Se começa com /uploads (caminho relativo)
    if (user.imagemPerfil.startsWith('/uploads')) {
      return `http://localhost:5000${user.imagemPerfil}`;
    }

    // Padrão para imagens locais
    return `http://localhost:5000/uploads/${user.imagemPerfil}`;
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    const nome = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const imagem = localStorage.getItem('imagemPerfil');

    if (token && nome && email) {
      setUsuarioLogado(true);
      setNomeUsuario(nome);
      setEmailUsuario(email);
      // --- CORREÇÃO AQUI: Monta a URL da imagem corretamente
      setImagemPerfil(imagem ? `http://localhost:5000${imagem}` : '');
    } else {
      setUsuarioLogado(false);
    }
  }, []);

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
          {!usuarioLogado ? (
            <button onClick={() => navigate('/Login')} className="app-header__login-button">Login / Cadastro</button>
          ) : (
            <div className="user-menu">
              <div className="user-menu__trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {imagemPerfil ? (
                  <div className="user-menu__avatar-container">
                    {/* CORREÇÃO AQUI */}
                    <img src={getProfileImageUrl()} className="user-menu__avatar-image" alt="Avatar" />
                    <TfiMenu className="user-menu__icon" />
                  </div>
                ) : (
                  <div className="user-menu__avatar-placeholder">
                    {nomeUsuario?.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              {dropdownOpen && (
                <div className="user-menu__content">
                  <div className="user-menu__header">
                    {/* CORREÇÃO AQUI */}
                    <img src={getProfileImageUrl()} className="user-menu__avatar-image" alt="Avatar" />
                    <div className="user-menu__user-info">
                      <strong>{nomeUsuario}</strong>
                      <small>{emailUsuario}</small>
                    </div>
                  </div>
                  <hr />
                  <button onClick={() => navigate('/')}><FaHome /><span>Home</span></button>
                  <button onClick={() => navigate('/meus-ingressos')}><FaTicketAlt /><span>Meus ingressos</span></button>
                  <button onClick={() => navigate('/perfil')}><FaUserCircle /><span>Minha conta</span></button>
                  <button onClick={() => navigate('/favoritos')}><FaClipboardList /><span>Gerenciar eventos</span></button>
                  <button onClick={() => navigate('/duvidas')}><FaHeadphones /><span>Central de Duvidas</span></button>
                  <button className="user-menu__logout-button" onClick={() => {
                    localStorage.clear();
                    setUsuarioLogado(false);
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
