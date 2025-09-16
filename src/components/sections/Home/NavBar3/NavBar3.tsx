import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FaPlusCircle, FaShoppingCart, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import './NavBar3.css';
import logoLight from '../../../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../Hook/AuthContext';
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

interface Event {
  _id: string;
  nome: string;
  imagem: string;
  cidade: string;
  estado: string;
  dataInicio: string;
  horaInicio: string;
}

interface SearchResultsProps {
  results: Event[];
  onSelect: () => void;
  apiUrl: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelect, apiUrl }) => {
  if (results.length === 0) return null;

  return (
    <div className="search-results-container">
      {results.map(event => (
        <Link 
          key={event._id} 
          to={`/evento/${event._id}`} 
          className="search-result-item"
          onClick={onSelect}
        >
          <img 
            src={`${apiUrl}/uploads/${event.imagem}`} 
            alt={event.nome}
            className="search-result-image"
          />
          <div className="search-result-info">
            <h4>{event.nome}</h4>
            <p>{event.cidade} - {event.estado}</p>
            <p>{new Date(event.dataInicio).toLocaleDateString('pt-BR')} às {event.horaInicio}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default function NavBar3() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [showResults, setShowResults] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
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

  // Função para buscar eventos
  const fetchSearchResults = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/eventos/aprovados?search=${encodeURIComponent(term)}`);
      const data = await response.json();
      setSearchResults(data.slice(0, 5));
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      setSearchResults([]);
    }
  }, [apiUrl]);

  // Debounce para evitar muitas requisições
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchSearchResults(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchSearchResults]);

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

      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setShowResults(true);
    }
  };

  const handleSearchFocus = () => {
    if (searchTerm) {
      setShowResults(true);
    }
  };

  const handleResultSelect = () => {
    setShowResults(false);
    setSearchTerm('');
  };

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      {/* Logo */}
      <Link to="/Home" aria-label="Página inicial">
        <img src={logoLight} alt="Logo" className="app-header__logo" />
      </Link>

      {/* Busca (desktop apenas) */}
      <div className="nav__search hide-mobile" ref={searchRef}>
        <FaSearch aria-hidden />
        <input 
          className='nav_input' 
          type="text" 
          placeholder="Buscar eventos, artistas..." 
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
        />
        {showResults && (
          <SearchResults 
            results={searchResults} 
            onSelect={handleResultSelect}
            apiUrl={apiUrl || ''}
          />
        )}
      </div>

      {/* Ações (desktop) */}
      <div className="nav__actions hide-mobile">
        <button className="nav__cta" onClick={() => navigate("/CriarEventos")}>
          <FaPlusCircle size={20} />
          CRIE SEU EVENTO
        </button>

        <div className="cart-icon" title="Carrinho de compras" aria-label="Carrinho de compras">
          <FaShoppingCart size={24} onClick={() => navigate("/Carrinho")} />
        </div>

        <div className="nav__auth">
          {!isAuthenticated ? (
            <button onClick={() => navigate('/Login')} className="nav_login_cadastro">
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
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: "10px",
                    border: "2px solid white",
                    borderRadius: "20px",
                    padding: "5px",
                    cursor: "pointer"
                  }}>
                    <img
                      src={getProfileImageUrl()}
                      className="avatar"
                      alt="Avatar"
                      style={{
                        width: "42px",
                        height: "42px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid var(--primary)"
                      }}
                      loading="eager"
                    />
                    <TfiMenu style={{ color: "#fff", fontSize: "24px" }} />
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
        {/* Cabeçalho com "MENU" na esquerda e "X" na direita */}
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