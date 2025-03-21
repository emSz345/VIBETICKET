import React from 'react';
import './Cidades.css';
import sp from '../../assets/img-sp.jpg'
import bahia from '../../assets/img-bahia.jpg'
import rp from '../../assets/img-rp.jpg'
import rj from '../../assets/img-rj.jpg'

const Cidades = () => {
    const cidades = [
        { nome: "São Paulo", img: sp },
        { nome: "Bahia", img: sp },
        { nome: "Ribeirão Preto", img: rp },
        { nome: "Rio de Janeiro", img: rj },
        // { nome: "Taquaritinga", img: '' }
    ];

    return (
        <div className="cidades-container">
            <h2>Busque por cidades</h2>
            <div className="cidades-grid">
                {cidades.map((cidade, index) => (
                    <div key={index} className="cidade-card">
                        <img src={cidade.img} alt={cidade.nome} />
                        <span>{cidade.nome}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cidades;