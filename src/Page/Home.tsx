import { useState } from 'react';
import '../styles/Home.css'


import Bolinhas from '../components/Bolinhas/Bolinhas';
import Carrossel from '../components/Home/Carrossel/Carrossel';
import Detalhes from '../components/Home/Detalhes/Detalhes';
import Cidades from '../components/Home/Cidades/Cidades';
import Banner from '../components/Home/Banner/Banner';
import EventCard from '../components/Home/Evento/EventoCard';
import Rodape from '../components/Footer/Footer';
import EventBanner from '../components/Home/EventBanner/EventBanner';
import NavBar from '../components/Home/NavBar/NavBar';

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

                <h3 className='title-show'>Shows...</h3>

                <Detalhes />

                <EventBanner />

                <Bolinhas />
                
                <Rodape />
            </main>
        </div>
    )
}

export default Home;