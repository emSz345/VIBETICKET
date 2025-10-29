import React, { useEffect, useState } from "react";
import EventoCard from "../../components/sections/Adm/EventoCard/EventoCard";
import { Evento as EventoBaseType } from "../../types/evento";
import { FaSignOutAlt, FaImages, FaUserPlus } from 'react-icons/fa';
import { useAuth } from "../../Hook/AuthContext";
import { useNavigate, Link } from 'react-router-dom';
import { CriadorPopulado } from "../../components/sections/Adm/EventoCard/EventoCard";

import logo from "../../assets/logo.png";
import "../../styles/Painel.css";

const apiUrl = process.env.REACT_APP_API_URL;

type EventoStatus = "em_analise" | "aprovado" | "rejeitado" | "em_reanalise";

type EventoComCriadorPopulado = Omit<EventoBaseType, 'criadoPor'> & {
    criadoPor: CriadorPopulado;
    // Adicione status e temMeia se não estiverem no EventoBaseType
    status: EventoStatus;
    temMeia: boolean;
};

const Painel: React.FC = () => {
    // 🔥 CORREÇÃO: Pega o objeto 'user' completo do AuthContext
    const { user, logout } = useAuth();
    const [eventos, setEventos] = useState<EventoComCriadorPopulado[]>([]);
    const [status, setStatusFilter] = useState<EventoStatus>("em_analise");
    const navigate = useNavigate();

    const fetchEventosByStatus = (status: EventoStatus) => {
        fetch(`${apiUrl}/api/eventos/listar/${status}`)
            .then((res) => res.json())
            .then((data: EventoComCriadorPopulado[]) => setEventos(data))
            .catch((err) => console.error(`Erro ao buscar eventos ${status}:`, err));
    };

    useEffect(() => {
        fetchEventosByStatus(status);
    }, [status]);

    const updateEventoStatus = async (id: string, newStatus: EventoStatus, motivo?: { titulo: string, descricao: string }) => {
        try {
            const body = motivo
                ? JSON.stringify({ status: newStatus, motivo })
                : JSON.stringify({ status: newStatus });

            await fetch(`${apiUrl}/api/eventos/atualizar-status/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: body,
            });

            setEventos((prevEventos) => prevEventos.filter((evento) => evento._id !== id));

        } catch (err) {
            console.error("Erro ao atualizar status do evento:", err);
        }
    };

    const handleAceitar = (id: string) => updateEventoStatus(id, "aprovado");
    const handleRejeitar = (id: string, motivo: { titulo: string, descricao: string }) =>
        updateEventoStatus(id, "rejeitado", motivo);

    const getAcoesPermitidas = (currentStatus: EventoStatus) => {
        let aceitar = undefined;
        let rejeitar = undefined;
        let reanalise = undefined;

        switch (currentStatus) {
            case "em_analise":
                aceitar = handleAceitar;
                rejeitar = handleRejeitar;
                break;
            case "aprovado":
                rejeitar = handleRejeitar;
                break;
            case "rejeitado":
                break;
            case "em_reanalise":
                aceitar = handleAceitar;
                rejeitar = handleRejeitar;
                break;
            default:
                break;
        }

        return { aceitar, rejeitar, reanalise };
    };

    return (
        <div className="painel-wrapper">
            <aside className="painel-sidebar">
                <div className="painel-sidebar-top">
                    <div className="painel-container-logo">
                        <Link to="/Home" aria-label="Página inicial">
                            <img src={logo} alt="Logo" className="painel-logo" />
                        </Link>
                    </div>
                </div>
                {/* 🔥 CORREÇÃO: Lógica de exibição dos botões de admin */}
                <div className="painel-sidebar-nav">
                    {/* Botão visível para SUPER_ADMIN e MANAGER_SITE */}
                    {user && (user.role === 'SUPER_ADMIN' || user.role === 'MANAGER_SITE') && (
                        <Link to="/CarrosselAdm" className="btn-gerenciar-carrossel">
                            <FaImages />
                            <p>Gerenciar Carrossel</p>
                        </Link>
                    )}
                    {/* Botão visível APENAS para SUPER_ADMIN */}
                    {user && user.role === 'SUPER_ADMIN' && (
                        <Link to="/AdicionarAdm" className="btn-gerenciar-carrossel">
                            <FaUserPlus />
                            <p>Gerenciar Admin</p>
                        </Link>
                    )}
                    <button className="btn-gerenciar-carrossel" onClick={() => {
                        logout();
                        navigate('/');
                        window.location.reload();
                    }}>
                        <FaSignOutAlt /><p>Sair</p>
                    </button>
                </div>
            </aside>

            <main className="painel-main">
                <header className="painel-main-header">
                    <div className="header-left">
                        <h2>Painel de Administração</h2>
                    </div>
                    <div className="header-center">
                        <button
                            className={`tab-button ${status === "em_analise" ? "active" : ""}`}
                            onClick={() => setStatusFilter("em_analise")}
                        >
                            Em Análise
                        </button>
                        <button
                            className={`tab-button ${status === "aprovado" ? "active" : ""}`}
                            onClick={() => setStatusFilter("aprovado")}
                        >
                            Aprovados
                        </button>
                        <button
                            className={`tab-button ${status === "rejeitado" ? "active" : ""}`}
                            onClick={() => setStatusFilter("rejeitado")}
                        >
                            Rejeitados
                        </button>
                        <button
                            className={`tab-button ${status === "em_reanalise" ? "active" : ""}`}
                            onClick={() => setStatusFilter("em_reanalise")}
                        >
                            Em Reanálise
                        </button>
                    </div>
                    <div className="header-right">
                        <strong>Administrador</strong>
                        {/* 🔥 CORREÇÃO: Usa o email do contexto, que é mais seguro */}
                        <p>{user?.email}</p>
                    </div>
                </header>

                <div className="painel-grid">
                    {eventos.map((evento) => {
                        const acoes = getAcoesPermitidas(evento.status as EventoStatus);

                        return (
                            <EventoCard
                                key={evento._id}
                                // 👇 Não precisa mais fazer a conversão aqui, pois 'evento' já tem o tipo certo
                                evento={{
                                    ...evento, // Passa o objeto evento diretamente
                                    // A imagem ainda precisa ser montada
                                    imagem: `${apiUrl}/uploads/${evento.imagem}`,
                                }}
                                onAceitar={acoes.aceitar}
                                onRejeitar={acoes.rejeitar}
                                onReanalise={acoes.reanalise}
                            />
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default Painel;