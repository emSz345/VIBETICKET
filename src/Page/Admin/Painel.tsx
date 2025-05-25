import React from "react";
import EventoCard from "../../components/sections/Adm/EventoCard/EventoCard";
import { Evento } from "../../types/evento";

import logo1 from "../../assets/img-logo.png"
import logo from "../../assets/img1.png"

import Aprovados from "./Aprovados";
import Rejeitado from "./Rejeitados";

import "../../styles/Painel.css";
import { Link } from "react-router-dom";

const eventosFake: Evento[] = [
    {
        id: 1,
        nome: "Show do Artista X",
        imagem: logo,
        data: "2025-06-01",
        hora: "20:30",
        descricao: "Um show gratuito para toda a família!",
        categoria: "Música",
        ingressos: 500,
        criador: {
            nome: "João Silva",
            email: "joao@email.com"
        },
        local: {
            rua: "Rua das Flores, 123",
            bairro: "Centro",
            cidade: "Taquaritinga",
            estado: "SP",
            urlMaps: "https://maps.google.com/?q=Taquaritinga+SP"
        }
    },
    {
        id: 2,
        nome: "Show do Artista X",
        imagem: logo,
        data: "2025-06-01",
        hora: "20:30",
        descricao: "Um show gratuito para toda a família!",
        categoria: "Música",
        ingressos: 500,
        criador: {
            nome: "João Silva",
            email: "joao@email.com"
        },
        local: {
            rua: "Rua das Flores, 123",
            bairro: "Centro",
            cidade: "Taquaritinga",
            estado: "SP",
            urlMaps: "https://maps.google.com/?q=Taquaritinga+SP"
        }
    },
    {
        id: 3,
        nome: "Show do Artista X",
        imagem: logo,
        data: "2025-06-01",
        hora: "20:30",
        descricao: "Um show gratuito para toda a família!",
        categoria: "Música",
        ingressos: 500,
        criador: {
            nome: "João Silva",
            email: "joao@email.com"
        },
        local: {
            rua: "Rua das Flores, 123",
            bairro: "Centro",
            cidade: "Taquaritinga",
            estado: "SP",
            urlMaps: "https://maps.google.com/?q=Taquaritinga+SP"
        }
    },
    {
        id: 4,
        nome: "Show do Artista X",
        imagem: logo,
        data: "2025-06-01",
        hora: "20:30",
        descricao: "Um show gratuito para toda a família!",
        categoria: "Música",
        ingressos: 500,
        criador: {
            nome: "João Silva",
            email: "joao@email.com"
        },
        local: {
            rua: "Rua das Flores, 123",
            bairro: "Centro",
            cidade: "Taquaritinga",
            estado: "SP",
            urlMaps: "https://maps.google.com/?q=Taquaritinga+SP"
        }
    },
    {
        id: 5,
        nome: "Show do Artista X",
        imagem: logo,
        data: "2025-06-01",
        hora: "20:30",
        descricao: "Um show gratuito para toda a família!",
        categoria: "Música",
        ingressos: 500,
        criador: {
            nome: "João Silva",
            email: "joao@email.com"
        },
        local: {
            rua: "Rua das Flores, 123",
            bairro: "Centro",
            cidade: "Taquaritinga",
            estado: "SP",
            urlMaps: "https://maps.google.com/?q=Taquaritinga+SP"
        }
    }
];


const Painel: React.FC = () => {
    const handleAceitar = (id: number) => console.log("Aceito:", id);
    const handleRejeitar = (id: number) => console.log("Rejeitado:", id);

    return (
        <div className="painel-wrapper">
            <aside className="painel-sidebar">
                <div>
                    <div className="painel-container-logo">
                        <img src={logo1} alt="Logo" className="painel-logo" />
                    </div>
                    <nav>
                        <ul>
                            <li><Link to="/Aprovados" className="painel-sidebar-link">Eventos Aprovados</Link></li>
                            <li><Link to="/Rejeitados" className="painel-sidebar-link">Eventos Rejeitados</Link></li>
                            <li className="painel-sidebar-link-sair">Sair</li>
                        </ul>
                    </nav>
                </div>

                {/* Rodapé do menu */}
                <div className="painel-sidebar-footer">
                    <strong>Administrador</strong>
                    <p>admin.b4y.2025@gmail.com</p>
                </div>
            </aside>
            <main className="painel-main">
                <header>
                    <h2>Painel de Administração</h2>
                </header>
                <div className="painel-grid">
                    {eventosFake.map((evento) => (
                        <EventoCard
                            key={evento.id}
                            evento={evento}
                            onAceitar={handleAceitar}
                            onRejeitar={handleRejeitar}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Painel;