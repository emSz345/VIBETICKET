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

import ListaEventos from '../home-eventos/ListaEventos';
import { Evento } from '../home-eventos/evento'; // Verifique o caminho da sua interface

function Home() {
  // Tipa o estado como um array da interface Evento
  const [eventosAprovados, setEventosAprovados] = useState<Evento[]>([]);

  useEffect(() => {
    const buscarEventos = async () => {
      try {
        // Altere esta linha para incluir o status "aprovado"
         const response = await fetch('http://localhost:5000/api/eventos/aprovados');
        const data: Evento[] = await response.json();

        // O filtro não é mais necessário, pois a API já retorna os eventos aprovados
        // const eventosFiltrados = data.filter(evento => evento.status === 'aprovado');
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
        <ListaEventos eventos={eventosFunk} titulo="Funk" />
        <ListaEventos eventos={eventosSertanejo} titulo="Sertanejo" />
        <ListaEventos eventos={eventosRock} titulo="Rock" />
        <ListaEventos eventos={eventosEletronica} titulo="Eletrônica" />
        <ListaEventos eventos={eventosJazz} titulo="Jazz" />

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