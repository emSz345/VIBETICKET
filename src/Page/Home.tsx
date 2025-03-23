import '../styles/Home.css'
import { Link } from 'react-router-dom';

import logo from '../assets/img-logo.png'
import { IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import Bolinhas from '../components/Bolinhas/Bolinhas';
import Carrossel from '../components/Carrossel/Carrossel';
import Detalhes from '../components/Detalhes/Detalhes';
import Cidades from '../components/Cidades/Cidades';
import Banner from '../components/Banner/Banner';
import EventCard from '../components/Evento/EventoCard';
import Rodape from '../components/Rodape/Footer';
import EventBanner from '../components/EventBanner/Footer';

function Home() {
    return (
        <div className='container'>
            <header>
                <nav className='navbar'>
                    <div className='nav-top'>
                        <div className='location'>
                            <span className='location'>Escolha seu local</span>
                            <button className='location-btn'>Descubra o que fazer perto de você</button>
                        </div>
                        <div className='auth'>
                            <Link to="/Login">Login</Link> | <Link to="/Cadastro">Cadastro</Link>
                        </div>
                    </div>
                    <hr className='hr' />
                    <div className='nav-main'>
                        <img src={logo} alt='B4Y Logo' className='logo' />
                        <div className="search-container">
                            <input type="text" placeholder="Pesquisar eventos, shows" className="search-input" />
                            <IoSearch className="search-icon" />
                        </div>
                        <div className='menu-links'>
                            <Link to="/Categorias">CATEGORIAS</Link>
                            <Link to="/CriarEventos">CRIAR EVENTOS</Link>
                            {/* <FaCartShopping className="search-icon"/> */}
                        </div>
                    </div>
                </nav>
            </header>
            <main className='main'>

                <Carrossel />

                <Cidades />

                <Banner/>

                <Detalhes />

                <Detalhes />
                <br/><br/>

                <EventCard/>

                <EventBanner/>

                <Rodape/>

                <Bolinhas />
            </main>
        </div>
    )
}

export default Home