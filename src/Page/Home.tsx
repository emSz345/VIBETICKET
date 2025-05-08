import { useState } from 'react';
import '../styles/Home.css'


import Bolinhas from '../components/Bolinhas/Bolinhas';
import Carrossel from '../components/Home/Carrossel/Carrossel';
import Detalhes from '../components/Home/Shows/Rock/Rock';
import Cidades from '../components/Home/Cidades/Cidades';
import Banner from '../components/Home/Banner/Banner';
import EventCard from '../components/Home/Evento/EventoCard';
import Rodape from '../components/Footer/Footer';
import EventBanner from '../components/Home/EventBanner/EventBanner';
import NavBar from '../components/Home/NavBar/NavBar';
import { Link } from 'react-router-dom';

import { MdOutlineContactSupport } from 'react-icons/md';
import Funk from '../components/Home/Shows/Funk/Funk';
import Sertanejo from '../components/Home/Shows/Sertanejo/Sertanejo';

function Home() {

    // const [menuOpen, setMenuOpen] = useState(false);

    // const toggleMenu = () => {
    //     setMenuOpen(!menuOpen);
    // };

    return (
        <div className='container'>
            <header>
                <NavBar />
            </header>
            <main className='main'>

                <Carrossel />

                <EventCard />

                <Cidades />

                <Banner />

                <h3 className='title-show'>Rock</h3>

                <Detalhes />

                <h3 className='title-show'>Funk</h3>

                <Funk />

                <h3 className='title-show'>Sertanejo</h3>

                <Sertanejo />

                <EventBanner />

                <Link to={'/Duvidas'}>
                    <div className="home-duvidas" title='Tire sua dúvida'>
                        <MdOutlineContactSupport size={30} style={{ color: '#fff' }} />
                    </div>
                </Link>

                <Bolinhas />

                <Rodape />
            </main>
        </div>
    )
}

export default Home;