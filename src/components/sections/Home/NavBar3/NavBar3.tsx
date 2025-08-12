import React, { useEffect, useState } from 'react';
import { FaPlusCircle, FaShoppingCart, FaSearch } from 'react-icons/fa';
import './NavBar3.css';
import logoLight from '../../../../assets/logo.png';
import { Link } from 'react-router-dom';

import { TfiMenu } from "react-icons/tfi";

import { useNavigate } from 'react-router-dom';

import {
  FaHome,
  FaTicketAlt,
  FaUserCircle,
  FaClipboardList,
  FaHeadphones,
  FaSignOutAlt,
  FaUserShield,
} from 'react-icons/fa';

export default function NavBar3() {
  const [scrolled, setScrolled] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [imagemPerfil, setImagemPerfil] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nome = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const imagem = localStorage.getItem('imagemPerfil');
    const adminStatus = localStorage.getItem('isAdmin');

    if (token && nome && email) {
      setUsuarioLogado(true);
      setNomeUsuario(nome);
      setEmailUsuario(email);
      setImagemPerfil(imagem || '');
      setIsAdmin(adminStatus === 'true');
    } else {
      setUsuarioLogado(false);
      setIsAdmin(false);
    }
  }, []);

 const voltar = (): void => {
  navigate("/")
  window.location.reload();
 }

  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      {/* Logo */}
      <Link to="/Home" aria-label="Página inicial">
        <img src={scrolled ? logoLight : logoLight} alt="Logo" className="app-header__logo"/>
      </Link>

      {/* Busca */}
      <div className="nav__search">
        <FaSearch aria-hidden />
        <input type="text" placeholder="Buscar eventos, artistas..." />
      </div>

      {/* Ações */}
      <div className="nav__actions">
        <button className="nav__cta" onClick={() => navigate("/CriarEventos")}>
          <FaPlusCircle size={20} />
          CRIE SEU EVENTO
        </button>

        <div className="cart-icon" title="Carrinho de compras" aria-label="Carrinho de compras">
          <FaShoppingCart size={24} onClick={() => navigate("/Carrinho")} />
        </div>

        <div className="nav__auth">
          {!usuarioLogado ? (
            <button onClick={() => navigate('/Login')} className="nav_login_cadastro">Login / Cadastro</button>
          ) : (
            <div className="user-dropdown">
              <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {imagemPerfil ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: "10px", fontWeight: 1, border: "2px solid white", borderRadius: "20px", padding: "5px", cursor: "pointer" }}>
                    <img src={`http://localhost:5000/uploads/${imagemPerfil}`} className="avatar" alt="Avatar" style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "50%", border: "2px solid var(--primary)" }} />
                    <TfiMenu style={{ color: "#fff", fontSize: "24px" }} />
                  </div>
                ) : (
                  <div className="avatar-placeholder">
                    {nomeUsuario?.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <img src={`http://localhost:5000/uploads/${imagemPerfil}`} className="avatar" alt="Avatar" />
                    <div className="user-header">
                      <strong>{nomeUsuario}</strong>
                      <small>{emailUsuario}</small>
                    </div>
                  </div>
                  <hr />
                  <button onClick={() => voltar()}>          <FaHome />         <span>Home</span></button>
                  <button onClick={() => navigate('/meus-ingressos')}><FaTicketAlt /><span>Meus ingressos</span></button>
                  <button onClick={() => navigate('/perfil')}>    <FaUserCircle />   <span>Minha conta</span></button>
                  {isAdmin && ( 
                    <button onClick={() => navigate('/Painel')}>
                      <FaUserShield />
                      <span>Painel de Admin</span>
                    </button>
                  )}
                  <button onClick={() => navigate('/favoritos')}> <FaClipboardList />        <span>Gerenciar eventos</span></button>
                  <button onClick={() => navigate('/duvidas')}>   <FaHeadphones />   <span>Central de Duvidas</span></button>
                  <button className="logout-btn" onClick={() => {
                    localStorage.clear();
                    setUsuarioLogado(false);
                    setIsAdmin(false);
                    navigate('/');
                    window.location.reload();
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