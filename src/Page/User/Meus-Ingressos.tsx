import React from 'react';
import { IngressoCard } from '../../components/sections/User/IngressoCard/IngresseCard';
import '../../styles/Meus-Ingressos.css';
import { Link } from 'react-router-dom';

import logo from "../../assets/img-logo.png";

import { Ingresso } from '../../types/Ingresso';


const ingressos: Ingresso[] = [
    {
        id: 1,
        evento: "End of the Year Hangout",
        dataEvento: "03/12/2024 às 14:00",
        valor: 19.98,
        status: "Pago",
        cliente: "Sullie Eloso",
        email: "sullie@wpforms.com",
        dataCompra: "28/11/2024 16:10:45",
    },
    {
        id: 2,
        evento: "End of the Year Hangout",
        dataEvento: "03/12/2024 às 14:00",
        valor: 19.98,
        status: "Pago",
        cliente: "Sullie Eloso",
        email: "sullie@wpforms.com",
        dataCompra: "28/11/2024 16:10:45",
    },
    {
        id: 3,
        evento: "End of the Year Hangout",
        dataEvento: "03/12/2024 às 14:00",
        valor: 19.98,
        status: "Pago",
        cliente: "Sullie Eloso",
        email: "sullie@wpforms.com",
        dataCompra: "28/11/2024 16:10:45",
    },
    // outros ingressos...
];

const MeusIngressos: React.FC = () => {
    return (
        <>
            <header className="meus-ingressos-duvidas-header">
                <div className="meus-ingressos-duvidas-header-conteudo">
                    <Link to="/Home" title="Voltar">
                        <img src={logo} alt="Logo" className="meus-ingressos-duvidas-header-logo" />
                    </Link>
                    <hr className="meus-ingressos-duvidas-hr" />
                    <h3 className="meus-ingressos-duvidas-title">Meus Ingressos</h3>
                </div>
            </header>
            <div className="meus-ingressos-pagina-meus-ingressos">
                {ingressos.length === 0 ? (
                    <p className="meus-ingressos-mensagem-vazia">Você ainda não comprou nenhum ingresso.</p>
                ) : (
                    <div className="meus-ingressos-lista-ingressos">
                        {ingressos.map((ingresso) => (
                            <IngressoCard key={ingresso.id} ingresso={ingresso} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};


export default MeusIngressos;