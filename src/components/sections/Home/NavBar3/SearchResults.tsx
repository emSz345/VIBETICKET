// SearchResults.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface Event {
  _id: string;
  nome: string;
  imagem: string;
  cidade: string;
  estado: string;
  dataInicio: string;
  horaInicio: string;
}

interface SearchResultsProps {
  results: Event[];
  onSelect: () => void;
  apiUrl: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelect, apiUrl }) => {
  if (results.length === 0) return null;

  return (
    <div className="search-results-container">
      {results.map(event => (
        <Link 
          key={event._id} 
          to={`/evento/${event._id}`} 
          className="search-result-item"
          onClick={onSelect}
        >
          <img 
            src={`${apiUrl}/uploads/${event.imagem}`} 
            alt={event.nome}
            className="search-result-image"
          />
          <div className="search-result-info">
            <h4>{event.nome}</h4>
            <p>{event.cidade} - {event.estado}</p>
            <p>{new Date(event.dataInicio).toLocaleDateString()} às {event.horaInicio}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResults;