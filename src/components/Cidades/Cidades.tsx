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
        { nome: "Taquaritinga", img: sp }
    ];

    return (
        <div className="cidades-container">
            <h3 className='title'>Busque por cidades</h3>
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
}

export default Cidades;