// NavBar2.tsx
import React, { useEffect, useState } from 'react';
import { FaPlusCircle, FaShoppingCart, FaSearch } from 'react-icons/fa';
import './NavBar3.css';
import logoLight from '../../../../assets/logo.png';
import logoDark from '../../../../assets/logo-blue2.png';
import { useNavigate } from 'react-router-dom';

export default function NavBar3() {
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      {/* Logo */}
      <img src={scrolled ? logoLight : logoLight} alt="Logo" className="nav__logo" />

      {/* Busca */}
      <div className="nav__search">
        <FaSearch aria-hidden />
        <input type="text" placeholder="Buscar eventos, artistas..." />
      </div>

      {/* Ações */}
      <div className="nav__actions">
        <button className="nav__cta">
          <FaPlusCircle size={20} />
          CRIE SEU EVENTO
        </button>

        <div className="cart-icon" title="Carrinho de compras" aria-label="Carrinho de compras">
          <FaShoppingCart size={24} />
        </div>

        <div className="nav__auth">
          <button onClick={() => navigate('/Login')}>
            Login / Cadastro
          </button>
        </div>
      </div>

    </header>
  );
}
