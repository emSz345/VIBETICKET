import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';
import AppHeader from '../../components/layout/Header/AppHeader';
import "../../styles/Carrinho.css";
import { CarrinhoItem } from '../../types/carrinho';
import { CarrinhoService } from '../../services/carrinhoService';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { useAuth } from '../../Hook/AuthContext'; // Importe o hook useAuth
import LogoMP from "../../assets/SVGs/Logo_MP.svg";


const Carrinho = () => {
  const { user } = useAuth(); // Chame o hook para obter o objeto user
  const apiUrl = process.env.REACT_APP_API_URL;
  const MP_KEY_PUBLIC = process.env.MP_PUBLIC_KEY;
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>(() => {
    return CarrinhoService.getCarrinho();
  });

  initMercadoPago(`${MP_KEY_PUBLIC}`);

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    if (status === 'approved') {
      alert('Pagamento aprovado! Seus ingressos estão sendo gerados.');
      CarrinhoService.limparCarrinho();
      setCarrinho([]);
      navigate('/meus-ingressos');
    } else if (status === 'pending') {
      alert('Pagamento pendente. A compra será confirmada assim que o pagamento for processado.');
    } else if (status === 'rejected') {
      alert('Pagamento rejeitado. Por favor, tente novamente ou use outro método de pagamento.');
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }, [navigate]);

  const handleFinalizarCompra = async () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    // Adicionamos a verificação do usuário
    if (!user) {
      alert("Você precisa estar logado para finalizar a compra.");
      return;
    }

    try {
      const items = carrinho.map(item => ({
        title: item.nomeEvento,
        quantity: item.quantidade,
        unit_price: item.preco,
      }));

      const userId = user._id; // O objeto 'user' agora está disponível aqui

      const response = await fetch(`${apiUrl}/api/pagamento/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, userId }),
      });

      if (response.ok) {
        const data = await response.json();
        window.open(data.preference_url, '_blank');
      } else {
        const errorData = await response.json();
        console.error('Falha ao criar preferência:', response.statusText, errorData);
        alert(`Erro ao iniciar o pagamento: ${errorData.error || response.statusText}. Tente novamente.`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão. Verifique sua rede.');
    }
  };

  const carrinhoAumentarQuantidade = (id: string) => {
    const limiteIngressos = 8;
    setCarrinho(prev => {
      const novoCarrinho = prev.map(item => {
        if (item.id === id && item.quantidade < limiteIngressos) {
          return { ...item, quantidade: item.quantidade + 1 };
        }
        return item;
      });
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

  const carrinhoCalcularTotal = () => {
    return carrinhoCalcularSubtotal()
  };

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
                  <span className="carrinho-resumo-label">Obs: Taxas de serviço já inclusa</span>
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
                  onClick={handleFinalizarCompra}
                >
                  Finalizar Compra
                </button>
              </div>
              <div className="mercadopago-info">
                <p>Pagamento seguro via Mercado Pago</p>
                <img src={LogoMP} alt="Logo do Mercado Pago" className="mercadopago-logo" />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Carrinho;