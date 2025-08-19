// src/components/ListaEventos.tsx

import React from 'react';
import CardEvento from './CardEvento'; 
import { Evento } from './evento'; // Verifique o caminho da sua interface

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
          <p>Nenhum evento de {titulo} disponível no momento.</p>
        )}
      </div>
    </section>
  );
};

export default ListaEventos;