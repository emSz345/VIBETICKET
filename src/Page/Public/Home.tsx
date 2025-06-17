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
import NavBar3 from '../../components/sections/Home/NavBar3/NavBar3';
import Eletonica from '../../components/sections/Home/Shows/Eletrônica/Eletrônica';
import Jazz from '../../components/sections/Home/Shows/Jazz/Jazz';

function Home() {

    // const [menuOpen, setMenuOpen] = useState(false);

    // const toggleMenu = () => {
    //     setMenuOpen(!menuOpen);
    // };

    return (
        <div className='container'>
            <header>
                <NavBar3 />
            </header>
            <main className='main'>

                <Carrossel />

                <Cidades />

                <Banner />

                <h3 className='title-show'>Funk</h3>
                <Funk />

                <h3 className='title-show'>Sertanejo</h3>
                <Sertanejo />

                <h3 className='title-show'>Rock</h3>
                <Detalhes />

                <h3 className='title-show'>Eletrônica</h3>
                <Eletonica />

                <h3 className='title-show'>Jazz</h3>
                <Jazz />

                <Bolinhas />

                <Rodape />
            </main>
        </div>
    )
}

export default Home;