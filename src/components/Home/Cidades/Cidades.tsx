import React from 'react';
import './Cidades.css';
import sp from '../../../assets/img-sp.jpg';
import rp from '../../../assets/img-rp.jpg';
import rj from '../../../assets/img-rj.jpg';

const Cidades = () => {
    const cidades = [
        { nome: "São Paulo", img: sp },
        { nome: "Rio de Janeiro", img: sp },
        { nome: "Maranhão", img: rp },
        { nome: "Minas Gerais", img: rj },
        { nome: "Pará", img: sp },
        { nome: "Paraná", img: sp },
    ];

    return (
        <div className="cidades-container">
            <h3 className="title">Busque por cidades</h3>
            <div className="cidades-grid">
                {cidades.map((cidade, index) => (
                    <div key={index} className="cidade-card">
                        <div className="imagem-container">
                            <img src={cidade.img} alt={cidade.nome} />
                            <h3 className="texto-sobre-imagem">{cidade.nome}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cidades;
