import React from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/Home/NavBar/NavBar";

const Detalhes: React.FC = () => {
    const { state } = useLocation();

    if (!state) {
        return <h2>Evento não encontrado!</h2>;
    }

    return (
        <div className="detalhes-container">
            <NavBar />
            <h1>{state.titulo}</h1>
            <img src={state.imagem} alt={state.titulo} />
            <p><strong>Data:</strong> {state.data}</p>
            <p><strong>Local:</strong> {state.local}</p>
            <p><strong>Ingressos vendidos:</strong> {state.vendidos}</p>
        </div>
    );
};

export default Detalhes;