import React from 'react';
import CardEvento from './CardEvento'; 
import { MdEventBusy } from "react-icons/md";
import { Evento } from './evento';
interface ListaEventosProps {
    eventos: Evento[]; 
    titulo: string;
}

const ListaEventos: React.FC<ListaEventosProps> = ({ eventos, titulo }) => {
  return (
    <section className="shows-section">
      <h3 className='title-show'>{titulo}</h3>
      <div className="lista-eventos-container">
        {eventos.length > 0 ? (
          eventos.map(evento => (
            // Use o ID único do evento como key
            <CardEvento key={evento._id} evento={evento} />
          ))
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <MdEventBusy size={65} color="#696969" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}/>
            <p style={{ color: "#696969" }}>Nenhum evento de {titulo} disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ListaEventos;