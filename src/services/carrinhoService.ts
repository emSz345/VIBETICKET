import { CarrinhoItem } from '../types/carrinho';

const STORAGE_KEY = 'carrinho';

export const CarrinhoService = {
  getCarrinho: (): CarrinhoItem[] => {
    const carrinho = localStorage.getItem('carrinho');
    return carrinho ? JSON.parse(carrinho) : [];
  },
  
  adicionarOuAtualizarItem: (novoItem: CarrinhoItem): void => {
    const carrinho = CarrinhoService.getCarrinho();
    const index = carrinho.findIndex(item => item.id === novoItem.id);

    if (index !== -1) {
      // Se o item já existe, atualize a quantidade
      carrinho[index].quantidade = novoItem.quantidade;
    } else {
      // Se não, adicione o novo item
      carrinho.push(novoItem);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho));
  },

  adicionarItem: (novoItem: CarrinhoItem) => {
    const carrinho = CarrinhoService.getCarrinho();
    const existingItemIndex = carrinho.findIndex(item => item.id === novoItem.id);

    if (existingItemIndex >= 0) {
      carrinho[existingItemIndex].quantidade += novoItem.quantidade;
    } else {
      carrinho.push(novoItem);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  },

  


  removerItem: (id: string) => {
    const carrinho = CarrinhoService.getCarrinho();
    const novoCarrinho = carrinho.filter(item => item.id !== id);
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    return novoCarrinho;
  },

  limparCarrinho: () => {
    localStorage.removeItem('carrinho');
  },
  verificarDisponibilidade: async (item: CarrinhoItem): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventos/verificar-estoque/${item.id.split('-')[0]}`);
      const evento = await response.json();
      
      if (item.tipoIngresso === 'Inteira') {
        return evento.quantidadeInteira >= item.quantidade;
      } else if (item.tipoIngresso === 'Meia') {
        return evento.quantidadeMeia >= item.quantidade;
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar estoque:', error);
      return false;
    }
  }
};