import { Link } from 'react-router-dom';

/* Icons */
import { FiChevronDown } from "react-icons/fi";
import { FaMap } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";

import './NavBar.css'

import logo from '../../../assets/img-logo.png'

const NavBar = () => {
    return (
        <nav className='home-navbar'>
            <div className='home-nav-top'>
                <div className='home-location'>
                    <FaMap className='home-iconMap' />
                    <span className='home-location-text'>Escolha seu local</span>
                    <FiChevronDown size={24} />
                    <button className='home-location-btn'>Descubra o que fazer perto de você</button>
                </div>
                <div className='home-auth'>
                    <Link to="/Login">Login</Link> | <Link to="/Cadastro">Cadastro</Link>
                </div>
            </div>
            <hr className='home-hr' />
            <div className='home-nav-main'>
                <Link to="/Home">
                    <img src={logo} alt='B4Y Logo' className='home-logo' />
                </Link>
                <div className="home-search-container">
                    <input 
                        type="text" 
                        placeholder="Pesquisar eventos, shows" 
                        className="home-search-input" 
                    />
                    <IoSearch className="home-search-icon" />
                </div>
                <div className='home-menu-links'>
                    <Link to="/Categorias">CATEGORIAS</Link>
                    <Link to="/CriarEventos">CRIAR EVENTOS</Link>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;