import { useState } from 'react';
import '../../styles/Home.css'


import Bolinhas from '../../components/ui/Bolinhas/Bolinhas';
import Carrossel from '../../components/sections/Home/Carrossel/Carrossel';
import Detalhes from '../../components/sections/Home/Shows/Rock/Rock';
import Cidades from '../../components/sections/Home/Cidades/Cidades';
import Banner from '../../components/sections/Home/Banner/Banner';
import EventCard from '../../components/sections/Home/Evento/EventoCard';
import Rodape from '../../components/layout/Footer/Footer';
import EventBanner from '../../components/sections/Home/EventBanner/EventBanner';
import NavBar from '../../components/sections/Home/NavBar/NavBar';
import { Link } from 'react-router-dom';

import { MdOutlineContactSupport } from 'react-icons/md';
import Funk from '../../components/sections/Home/Shows/Funk/Funk';
import Sertanejo from '../../components/sections/Home/Shows/Sertanejo/Sertanejo';

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

                <Bolinhas />

                <Rodape />
            </main>
        </div>
    )
}

export default Home;