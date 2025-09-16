import { useState, useEffect } from 'react';
import '../../styles/Home.css';
import Bolinhas from '../../components/ui/Bolinhas/Bolinhas';
import Carrossel from '../../components/sections/Home/Carrossel/Carrossel';
import Cidades from '../../components/sections/Home/Cidades/Cidades';
import Rodape from '../../components/layout/Footer/Footer';
import NavBar3 from '../../components/sections/Home/NavBar3/NavBar3';
import ChatBot from '../../components/sections/Chatbot/Chatbot';
import help from '../../assets/help.png';

import ListaEventos from '../../components/sections/Home/home-eventos/ListaEventos';
import { Evento } from '../../components/sections/Home/home-eventos/evento'; 
import CookieNotice from '../../components/layout/CookieNotice/CookieNotice';

function Home() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [eventosAprovados, setEventosAprovados] = useState<Evento[]>([]);

  // 1. Hook para gerenciar a URL e rolar a página

  useEffect(() => {
    const buscarEventos = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/eventos/aprovados`);
        const data: Evento[] = await response.json();
        setEventosAprovados(data);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };
    buscarEventos();
  }, [apiUrl]);

  const eventosFunk = eventosAprovados.filter(evento => evento.categoria.toLowerCase() === 'funk');
  const eventosSertanejo = eventosAprovados.filter(evento => evento.categoria.toLowerCase() === 'sertanejo');
  const eventosRock = eventosAprovados.filter(evento => evento.categoria.toLowerCase() === 'rock');
  const eventosEletronica = eventosAprovados.filter(evento => evento.categoria.toLowerCase() === 'eletrônica'); //ELETRONICA ESTÁ CADASTRADO COM O ACÉNTO
  const eventosJazz = eventosAprovados.filter(evento => evento.categoria.toLowerCase() === 'jazz');
  const eventosPop = eventosAprovados.filter(evento => evento.categoria.toLowerCase() === 'pop');
  const eventosRap = eventosAprovados.filter(evento => evento.categoria.toLowerCase() === 'rap');

  return (
    <div className='container'>
      <header>
        <NavBar3 />
      </header>
      <main className='main'>
        <Carrossel />
        <Cidades />
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
        
        {/* Adicione um `id` para cada seção para que o link de âncora funcione */}
        {eventosFunk.length > 0 && <div id="funk"><ListaEventos eventos={eventosFunk} titulo="Funk" /></div>}
        {eventosSertanejo.length > 0 && <div id="sertanejo"><ListaEventos eventos={eventosSertanejo} titulo="Sertanejo" /></div>}
        {eventosRock.length > 0 && <div id="rock"><ListaEventos eventos={eventosRock} titulo="Rock" /></div>}
        {eventosEletronica.length > 0 && <div id="eletronica"><ListaEventos eventos={eventosEletronica} titulo="Eletrônica" /></div>}
        {eventosJazz.length > 0 && <div id="jazz"><ListaEventos eventos={eventosJazz} titulo="Jazz" /></div>}
        {eventosPop.length > 0 && <div id="pop"><ListaEventos eventos={eventosPop} titulo="Pop" /></div>}
        {eventosRap.length > 0 && <div id="rap"><ListaEventos eventos={eventosRap} titulo="Rap" /></div>}

        <div style={{ display: "flex", right: "20px", bottom: "30px", position: 'fixed', zIndex: '1000' }}>
          <ChatBot />
        </div>
        <CookieNotice />
        <Bolinhas />
      </main>
      <Rodape />
    </div>
  );
}

export default Home;