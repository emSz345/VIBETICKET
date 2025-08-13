import { useState, useEffect } from 'react';
import '../../styles/Home.css';
import Bolinhas from '../../components/ui/Bolinhas/Bolinhas';
import Carrossel from '../../components/sections/Home/Carrossel/Carrossel';
import Detalhes from '../../components/sections/Home/Shows/Rock/Rock';
import Cidades from '../../components/sections/Home/Cidades/Cidades';
import Rodape from '../../components/layout/Footer/Footer';
import NavBar3 from '../../components/sections/Home/NavBar3/NavBar3';
import Funk from '../../components/sections/Home/Shows/Funk/Funk';
import Sertanejo from '../../components/sections/Home/Shows/Sertanejo/Sertanejo';
import Eletonica from '../../components/sections/Home/Shows/Eletrônica/Eletrônica';
import Jazz from '../../components/sections/Home/Shows/Jazz/Jazz';
import ChatBot from '../../components/sections/Chatbot/Chatbot';
import { MdOutlineContactSupport } from 'react-icons/md';
import { Link } from 'react-router-dom';
import help from '../../assets/help.png'; // Ajuste o caminho conforme necessário

function Home() {
  return (
    <div className='container'>
      <header>
        <NavBar3 />
      </header>

      <main className='main'>
        <Carrossel />

        <Cidades />

        {/* Banner incorporado diretamente */}
        <div className="banner">
          <div className="banner-content">
            <img src={help} alt="Ajuda" className="banner-image" />
            <div className="banner-text">
              <p className="banner-title">Ajude a transformar vidas</p>
              <p className="banner-subtitle">
                Doe na compra de ingressos e apoie projetos que fazem a diferença.
              </p>
            </div>
          </div>
        </div>

        <section className="shows-section">
          <h3 className='title-show'>Funk</h3>
          <Funk />
        </section>

        <section className="shows-section">
          <h3 className='title-show'>Sertanejo</h3>
          <Sertanejo />
        </section>

        <section className="shows-section">
          <h3 className='title-show'>Rock</h3>
          <Detalhes />
        </section>

        <section className="shows-section">
          <h3 className='title-show'>Eletrônica</h3>
          <Eletonica />
        </section>

        <section className="shows-section">
          <h3 className='title-show'>Jazz</h3>
          <Jazz />
        </section>
        <div style={{ display: "flex", right: "20px", bottom: "30px", position: 'fixed', zIndex: '1000' }}>
          <ChatBot />
        </div>
        <Bolinhas />
      </main>

      <Rodape />
    </div>
  )
}

export default Home;