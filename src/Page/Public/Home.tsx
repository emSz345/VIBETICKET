import { useState, useEffect } from 'react';
import '../../styles/Home.css';
import Bolinhas from '../../components/ui/Bolinhas/Bolinhas';
import Carrossel from '../../components/sections/Home/Carrossel/Carrossel';
import Cidades from '../../components/sections/Home/Cidades/Cidades';
import Rodape from '../../components/layout/Footer/Footer';
import NavBar3 from '../../components/sections/Home/NavBar3/NavBar3';
import ChatBot from '../../components/sections/Chatbot/Chatbot';
import { Link } from 'react-router-dom';
import help from '../../assets/help.png';

import ListaEventos from '../../components/sections/Home/home-eventos/ListaEventos';
import { Evento } from '../../components/sections/Home/home-eventos/evento'; 

function Home() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [eventosAprovados, setEventosAprovados] = useState<Evento[]>([]);

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
  }, []);

  const eventosFunk = eventosAprovados.filter(evento => evento.categoria === 'Funk');
  const eventosSertanejo = eventosAprovados.filter(evento => evento.categoria === 'Sertanejo');
  const eventosRock = eventosAprovados.filter(evento => evento.categoria === 'Rock');
  const eventosEletronica = eventosAprovados.filter(evento => evento.categoria === 'Eletrônica');
  const eventosJazz = eventosAprovados.filter(evento => evento.categoria === 'Jazz');
  const eventosPop = eventosAprovados.filter(evento => evento.categoria === 'pop');
  const eventosRap = eventosAprovados.filter(evento => evento.categoria === 'Rap');


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
        
        {eventosFunk.length > 0 && <ListaEventos eventos={eventosFunk} titulo="Funk" />}
        {eventosSertanejo.length > 0 && <ListaEventos eventos={eventosSertanejo} titulo="Sertanejo" />}
        {eventosRock.length > 0 && <ListaEventos eventos={eventosRock} titulo="Rock" />}
        {eventosEletronica.length > 0 && <ListaEventos eventos={eventosEletronica} titulo="Eletrônica" />}
        {eventosJazz.length > 0 && <ListaEventos eventos={eventosJazz} titulo="Jazz" />}
        {eventosPop.length > 0 && <ListaEventos eventos={eventosPop} titulo="Pop" />}
        {eventosRap.length > 0 && <ListaEventos eventos={eventosRap} titulo="Rap" />}

        <div style={{ display: "flex", right: "20px", bottom: "30px", position: 'fixed', zIndex: '1000' }}>
          <ChatBot />
        </div>
        <Bolinhas />
      </main>
      <Rodape />
    </div>
  );
}

export default Home;