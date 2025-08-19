import React from 'react';
import { Link } from 'react-router-dom'; 
import '../../styles/CardEvento.css';
import { Evento } from './evento';

interface CardEventoProps {
    evento: Evento;
}

const CardEvento: React.FC<CardEventoProps> = ({ evento }) => {
    // Certifique-se de que a propriedade `evento.imagem` contém um valor válido
    const imageUrl = `http://localhost:5000/uploads/${evento.imagem}`;

    return (
        <Link 
            // Acessa a rota com o ID do evento na URL e passa o objeto completo no `state`
            to={{ pathname: `/evento/${evento._id}` }}
            state={evento} 
            className="card-evento-link"
        >
            <div className="card-evento">
                {/* Exibe a imagem apenas se a URL for válida */}
                {evento.imagem && (
                    <img src={imageUrl} alt={evento.nome} className="card-image" />
                )}
                <div className="card-content">
                    <h4>{evento.nome}</h4>
                    <p>{evento.cidade} - {evento.estado}</p>
                    <p>{evento.dataInicio}</p>
                </div>
            </div>
        </Link>
    );
};

export default CardEvento;