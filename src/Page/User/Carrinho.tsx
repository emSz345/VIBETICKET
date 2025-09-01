import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiCheck } from 'react-icons/fi';
import AppHeader from '../../components/layout/Header/AppHeader';
import "../../styles/Carrinho.css";
import { CarrinhoItem } from '../../types/carrinho';
import { CarrinhoService } from '../../services/carrinhoService';

const Carrinho = () => {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>(() => {
    return CarrinhoService.getCarrinho();
  });

  const [carrinhoShowSuccess, setCarrinhoShowSuccess] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const carrinhoAumentarQuantidade = (id: string) => {
    setCarrinho(prev => {
      const novoCarrinho = prev.map(item =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      );
      localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
      return novoCarrinho;
    });
  };

  const carrinhoDiminuirQuantidade = (id: string) => {
    setCarrinho(prev => {
      const novoCarrinho = prev.map(item =>
        item.id === id && item.quantidade > 1 
          ? { ...item, quantidade: item.quantidade - 1 } 
          : item
      );
      localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
      return novoCarrinho;
    });
  };

  const carrinhoRemoverItem = (id: string) => {
    setCarrinho(prev => {
      const novoCarrinho = prev.filter(item => item.id !== id);
      localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
      return novoCarrinho;
    });
  };

  const carrinhoCalcularSubtotal = () => {
    return carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  };

  const carrinhoCalcularTaxas = () => {
    return 5.99;
  };

  const carrinhoCalcularTotal = () => {
    return carrinhoCalcularSubtotal() + carrinhoCalcularTaxas();
  };

  const carrinhoFinalizarCompra = async () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    for (const item of carrinho) {
    const disponivel = await CarrinhoService.verificarDisponibilidade(item);
    if (!disponivel) {
      alert(`Desculpe, não há ingressos ${item.tipoIngresso} suficientes para ${item.nomeEvento}`);
      return;
    }
  }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/compras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itens: carrinho,
          total: carrinhoCalcularTotal()
        })
      });

      if (response.ok) {
        setCarrinhoShowSuccess(true);
        CarrinhoService.limparCarrinho();
        setTimeout(() => {
          setCarrinhoShowSuccess(false);
          navigate('/meus-ingressos');
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(`Erro ao finalizar compra: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao finalizar compra');
    }
  };

  // Corrigir URLs das imagens
  const getImageUrl = (imagem: string) => {
    if (imagem.startsWith('http')) {
      return imagem;
    }
    return `${apiUrl}/uploads/${imagem}`;
  };

  return (
    <>
      <AppHeader />
      <div className="carrinho-container">
        <h1 className="carrinho-titulo">Seu Carrinho</h1>

        {carrinho.length === 0 ? (
          <div className="carrinho-vazio">
            <h2 className="carrinho-vazio-titulo">Seu carrinho está vazio</h2>
            <p className="carrinho-vazio-texto">Parece que você ainda não adicionou nenhum ingresso ao carrinho.</p>
            <button
              className="carrinho-btn-voltar"
              onClick={() => navigate('/eventos')}
            >
              <FiArrowLeft /> Ver Eventos
            </button>
          </div>
        ) : (
          <>
            <div className="carrinho-itens">
              {carrinho.map((item) => (
                <div key={item.id} className="carrinho-item">
                  <div className="carrinho-item-imagem">
                    <img src={getImageUrl(item.imagem)} alt={item.nomeEvento} />
                  </div>

                  <div className="carrinho-item-info">
                    <h3 className="carrinho-item-nome">{item.nomeEvento}</h3>
                    <p className="carrinho-item-meta">
                      <span className="carrinho-item-data">{item.dataEvento}</span> • 
                      <span className="carrinho-item-local">{item.localEvento}</span>
                    </p>
                    <div className="carrinho-item-tipo">
                      <span>{item.tipoIngresso}</span>
                    </div>
                  </div>

                  <div className="carrinho-item-preco">
                    R$ {item.preco.toFixed(2)}
                  </div>

                  <div className="carrinho-item-quantidade">
                    <button
                      className="carrinho-item-quantidade-btn"
                      onClick={() => carrinhoDiminuirQuantidade(item.id)}
                      disabled={item.quantidade <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="carrinho-item-quantidade-valor">{item.quantidade}</span>
                    <button
                      className="carrinho-item-quantidade-btn"
                      onClick={() => carrinhoAumentarQuantidade(item.id)}
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <div className="carrinho-item-subtotal">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </div>

                  <button
                    className="carrinho-item-remover"
                    onClick={() => carrinhoRemoverItem(item.id)}
                    aria-label="Remover item"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            <div className="carrinho-resumo">
              <div className="carrinho-resumo-detalhes">
                <h3 className="carrinho-resumo-titulo">Resumo do Pedido</h3>

                <div className="carrinho-resumo-linha">
                  <span className="carrinho-resumo-label">Subtotal ({carrinho.reduce((acc, item) => acc + item.quantidade, 0)} itens)</span>
                  <span className="carrinho-resumo-valor">R$ {carrinhoCalcularSubtotal().toFixed(2)}</span>
                </div>

                <div className="carrinho-resumo-linha">
                  <span className="carrinho-resumo-label">Taxa de serviço</span>
                  <span className="carrinho-resumo-valor">R$ {carrinhoCalcularTaxas().toFixed(2)}</span>
                </div>

                <div className="carrinho-resumo-total">
                  <span className="carrinho-resumo-total-label">Total</span>
                  <span className="carrinho-resumo-total-valor">R$ {carrinhoCalcularTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="carrinho-resumo-acoes">
                <button
                  className="carrinho-btn-continuar"
                  onClick={() => navigate('/eventos')}
                >
                  <FiArrowLeft /> Continuar Comprando
                </button>

                <button
                  className="carrinho-btn-finalizar"
                  onClick={carrinhoFinalizarCompra}
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </>
        )}

        {carrinhoShowSuccess && (
          <div className="carrinho-sucesso">
            <div className="carrinho-sucesso-conteudo">
              <FiCheck className="carrinho-sucesso-icone" />
              <p className="carrinho-sucesso-texto">Compra finalizada com sucesso!</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Carrinho;