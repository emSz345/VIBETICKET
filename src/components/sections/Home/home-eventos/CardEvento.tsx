// CardEvento.tsx - Corrigindo a exibição do horário
import React from 'react';
import { Link } from 'react-router-dom';
import '../../../../styles/CardEvento.css'
import { Evento } from './evento';

import { FaLocationDot } from "react-icons/fa6";


interface CardEventoProps {
    evento: Evento;
}



const CardEvento: React.FC<CardEventoProps> = ({ evento }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const imageUrl = `${apiUrl}/uploads/${evento.imagem}`;

    return (
        <Link
            to={{ pathname: `/evento/${evento._id}` }}
            state={evento}
            className="cardEvento-link"
        >
            <div className="cardEvento">
                {evento.imagem && (
                    <div className="cardEvento-imageWrapper">
                        <img src={imageUrl} alt={evento.nome} className="cardEvento-image" />
                        <span className="cardEvento-date">
                            {new Date(evento.dataInicio).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short"
                            })}
                        </span>
                    </div>
                )}
                <div className="cardEvento-content">
                    <span className="cardEvento-data">
                        {new Date(evento.dataInicio).toLocaleDateString("pt-BR", {
                            weekday: "long",
                            day: "2-digit",
                            month: "long"
                        }).toUpperCase()}
                    </span>

                    <h4 className="cardEvento-title">{evento.nome}</h4>

                    <div className="cardEvento-info">
                        <p className="cardEvento-local">
                            <FaLocationDot />
                            {evento.rua && `${evento.rua}, `}
                            {evento.cidade} - {evento.estado}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CardEvento;