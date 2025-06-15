import React, { useState } from 'react';
import "../../styles/Carrinho.css";
import NavBar from '../../components/sections/Home/NavBar/NavBar';

import logo from '../../assets/img-logo.png'

interface CarrinhoItem {
    id: string;
    nomeEvento: string;
    tipoIngresso: string;
    preco: number;
    quantidade: number;
    imagem: string;
}

const Carrinho = () => {
    const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([
        {
            id: '1',
            nomeEvento: 'Show do Artista X',
            tipoIngresso: 'inteira',
            preco: 100,
            quantidade: 1,
            imagem: logo,
        },
        {
            id: '2',
            nomeEvento: 'Show do Artista X',
            tipoIngresso: 'meia',
            preco: 50,
            quantidade: 2,
            imagem: logo,
        },
    ]);

    const aumentarQuantidade = (id: string) => {
        setCarrinho(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
            )
        );
    };

    const diminuirQuantidade = (id: string) => {
        setCarrinho(prev =>
            prev.map(item =>
                item.id === id && item.quantidade > 1
                    ? { ...item, quantidade: item.quantidade - 1 }
                    : item
            )
        );
    };

    const removerItem = (id: string) => {
        setCarrinho(prev => prev.filter(item => item.id !== id));
    };

    const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    return (
        <>
            <NavBar />
            <div className="carrinho-container">
                <table className="carrinho-tabela">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Preço Unitário</th>
                            <th>Quantidade</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrinho.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="carrinho-produto-info">
                                        <img src={item.imagem} alt={item.nomeEvento} />
                                        <div>
                                            <strong>{item.nomeEvento}</strong>
                                            <p>Estoque: Disponível</p>
                                        </div>
                                    </div>
                                </td>
                                <td>R$ {item.preco.toFixed(2)}</td>
                                <td>
                                    <div className="carrinho-quantidade-controls">
                                        <button onClick={() => diminuirQuantidade(item.id)}>-</button>
                                        <span>{item.quantidade}</span>
                                        <button onClick={() => aumentarQuantidade(item.id)}>+</button>
                                    </div>
                                </td>
                                <td>
                                    <button className="carrinho-remover-btn" onClick={() => removerItem(item.id)}>🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="carrinho-acoes">
                    <button className="carrinho-continuar">Continuar comprando</button>
                    <div className="carrinho-total">
                        <span>Subtotal:</span>
                        <strong>R$ {total.toFixed(2)}</strong>
                    </div>
                    <button className="carrinho-finalizar">Finalizar compra</button>
                </div>
            </div>
        </>
    );
};

export default Carrinho;