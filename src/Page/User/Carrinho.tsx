import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';
import AppHeader from '../../components/layout/Header/AppHeader';
import "../../styles/Carrinho.css";
import { CarrinhoItem } from '../../types/carrinho';
import { CarrinhoService } from '../../services/carrinhoService'; // Mantido para limpeza pós-pagamento e getCart na inicialização
import { initMercadoPago } from '@mercadopago/sdk-react';
import { useAuth } from '../../Hook/AuthContext';
import { useCart } from '../../Hook/CartContext'; // Usaremos o Contexto
import LogoMP from "../../assets/SVGs/Logo_MP.svg";

const Carrinho = () => {
  // Usando Hooks do amigo e do seu
  const { user } = useAuth();
  const { cartItems, updateItemQuantity, removeItemFromCart, refreshCart } = useCart();

  const apiUrl = process.env.REACT_APP_API_URL;
  const MP_KEY_PUBLIC = process.env.MP_PUBLIC_KEY;

  // O estado local 'carrinho' agora usa 'cartItems' do Contexto (Melhor prática)
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>(cartItems);
  // Estado de carregamento do amigo
  const [isLoading, setIsLoading] = useState(false);

  // Inicialização do Mercado Pago (Sua correção, verificando a chave)
  useEffect(() => {
    if (MP_KEY_PUBLIC) {
      initMercadoPago(MP_KEY_PUBLIC);
    }
  }, [MP_KEY_PUBLIC]);

  const navigate = useNavigate();

  // SINCRONIZAÇÃO (Do seu amigo): Atualize o estado local quando o contexto mudar
  useEffect(() => {
    setCarrinho(cartItems);
  }, [cartItems]);

  // EFEITO DE PAGAMENTO (Combinação do seu e do seu amigo)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    if (status) {
      window.history.replaceState({}, document.title, window.location.pathname);

      if (status === 'approved') {
        // Sua mensagem mais detalhada
        alert('Pagamento aprovado! Seus ingressos estão sendo gerados. Verifique "Meus Ingressos".');
        CarrinhoService.limparCarrinho();
        setCarrinho([]); // Limpa o estado local
        navigate('/meus-ingressos', { replace: true }); // Sua navegação com replace
      } else if (status === 'pending') {
        alert('Pagamento pendente. A compra será confirmada assim que o pagamento for processado.');
      } else if (status === 'rejected') {
        alert('Pagamento rejeitado. Por favor, tente novamente ou use outro método de pagamento.');
      }
    }
  }, [navigate]);

  // FUNÇÃO PRINCIPAL: Finalizar Compra (Com suas melhorias de autenticação)
  const handleFinalizarCompra = async () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    // Sua verificação de login mais robusta
    if (!user || !user._id) {
      alert("Você precisa estar logado para finalizar a compra.");
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true); // Adicionado loading para o fetch

      const items = carrinho.map(item => ({
        title: item.nomeEvento,
        quantity: item.quantidade,
        unit_price: item.preco,
      }));

      const userId = user._id;

      const response = await fetch(`${apiUrl}/api/pagamento/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Sua CORREÇÃO CRÍTICA para cookies
        credentials: 'include',
        body: JSON.stringify({ items, userId }),
      });

      if (response.ok) {
        const data = await response.json();
        window.open(data.preference_url, '_blank');
      } else {
        // Seu tratamento de erro melhorado
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error('Falha ao criar preferência:', response.status, errorData);

        if (response.status === 401 || response.status === 403) {
          alert("Sessão expirada. Por favor, faça login novamente.");
          navigate('/login');
          return;
        }

        alert(`Erro ao iniciar o pagamento: ${errorData.message || response.statusText}. Tente novamente.`);
      }
    } catch (error) {
      console.error('Erro de rede ou desconhecido:', error);
      alert('Erro de conexão. Verifique sua rede e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // FUNÇÕES DE CARRINHO: Usando as funções assíncronas do Contexto (Do seu amigo)

  const carrinhoAumentarQuantidade = async (id: string) => {
    const item = carrinho.find(item => item.id === id);
    if (item) {
      try {
        setIsLoading(true);
        // Usa a função do contexto para atualizar o backend/contexto
        await updateItemQuantity(id, item.quantidade + 1);
        // Atualiza o carrinho do contexto (Se a lógica dele for back-end)
        await refreshCart();
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Erro ao aumentar quantidade');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const carrinhoDiminuirQuantidade = async (id: string) => {
    const item = carrinho.find(item => item.id === id);
    if (item && item.quantidade > 1) {
      try {
        setIsLoading(true);
        await updateItemQuantity(id, item.quantidade - 1);
        await refreshCart();
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Erro ao diminuir quantidade');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const carrinhoRemoverItem = async (id: string) => {
    try {
      setIsLoading(true);
      await removeItemFromCart(id);
      await refreshCart();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao remover item');
    } finally {
      setIsLoading(false);
    }
  };

  // Funções de cálculo
  const carrinhoCalcularSubtotal = () => {
    return carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  };

  const carrinhoCalcularTotal = () => {
    return carrinhoCalcularSubtotal();
  };

  const getTotalItens = () => {
    return carrinho.reduce((acc, item) => acc + item.quantidade, 0);
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

        {/* Indicador de carregamento do amigo */}
        {isLoading && (
          <div className="carrinho-loading">
            <p>Atualizando carrinho...</p>
          </div>
        )}

        {carrinho.length === 0 ? (
          <div className="carrinho-vazio">
            <h2 className="carrinho-vazio-titulo">Seu carrinho está vazio</h2>
            <p className="carrinho-vazio-texto">Parece que você ainda não adicionou nenhum ingresso ao carrinho.</p>
            <button
              className="carrinho-btn-voltar"
              onClick={() => navigate('/eventos')}
              disabled={isLoading}
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
                      disabled={item.quantidade <= 1 || isLoading}
                    >
                      <FiMinus />
                    </button>
                    <span className="carrinho-item-quantidade-valor">{item.quantidade}</span>
                    <button
                      className="carrinho-item-quantidade-btn"
                      onClick={() => carrinhoAumentarQuantidade(item.id)}
                      disabled={item.quantidade >= 8 || isLoading} // Limite de 8 do seu código
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
                    disabled={isLoading}
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
                  {/* Usando getTotalItens do amigo */}
                  <span className="carrinho-resumo-label">Subtotal ({getTotalItens()} itens)</span>
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
                  disabled={isLoading}
                >
                  <FiArrowLeft /> Continuar Comprando
                </button>

                <button
                  className="carrinho-btn-finalizar"
                  onClick={handleFinalizarCompra}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Finalizar Compra'}
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