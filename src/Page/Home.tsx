import { useState } from 'react';
import '../styles/Home.css'
import { Link } from 'react-router-dom';

import logo from '../assets/img-logo.png'

import { IoSearch, IoMenu, IoClose } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FaMap } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

import Bolinhas from '../components/Bolinhas/Bolinhas';
import Carrossel from '../components/Carrossel/Carrossel';
import Detalhes from '../components/Detalhes/Detalhes';
import Cidades from '../components/Cidades/Cidades';
import Banner from '../components/Banner/Banner';
import EventCard from '../components/Evento/EventoCard';
import Rodape from '../components/Rodape/Footer';
import EventBanner from '../components/EventBanner/Footer';

function Home() {

    // const [menuOpen, setMenuOpen] = useState(false);

    // const toggleMenu = () => {
    //     setMenuOpen(!menuOpen);
    // };

    return (
        <div className='container'>
            <header>
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
                        <img src={logo} alt='B4Y Logo' className='home-logo' />
                        <div className="home-search-container">
                            <input type="text" placeholder="Pesquisar eventos, shows" className="home-search-input" />
                            <IoSearch className="home-search-icon" />
                        </div>
                        <div className='home-menu-links'>
                            <Link to="/Categorias">CATEGORIAS</Link>
                            <Link to="/CriarEventos">CRIAR EVENTOS</Link>
                        </div>
                    </div>
                </nav>
            </header>
            <main className='main'>

                <Carrossel />

                <Cidades />

                <Banner />

                <h3 className='title-show'>Shows...</h3>

                <Detalhes />

                <Detalhes />

                <br /> <br />

                <EventCard />

                <EventBanner />

                <Rodape />

                <Bolinhas />
            </main>
        </div>
    )
}

export default Home;