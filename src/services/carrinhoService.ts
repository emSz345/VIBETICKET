// services/carrinhoService.ts - ATUALIZADO
import { CarrinhoItem } from '../types/carrinho';

const API_URL = process.env.REACT_APP_API_URL;

// 🔥 FUNÇÃO PARA OBTER TOKEN (do localStorage ou de onde você salva)
const getToken = (): string | null => {
  // Tenta pegar do localStorage (que é onde você está salvando pelo contexto)
  return localStorage.getItem('token');
};

export const CarrinhoService = {
  // 🔥 OBTER CARRINHO DO BACKEND
  getCarrinho: async (): Promise<CarrinhoItem[]> => {
    try {
      const token = getToken();
      if (!token) {
        console.log('❌ Nenhum token encontrado para buscar carrinho');
        return [];
      }

      const response = await fetch(`${API_URL}/api/carrinho`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const carrinhoData = await response.json();
        console.log('✅ Carrinho carregado do backend:', carrinhoData.itens);
        
        // Converter para formato padrão
        return carrinhoData.itens.map((item: any) => ({
          id: item._id, // 🔥 AGORA usa o _id do MongoDB
          eventoId: item.eventoId._id || item.eventoId,
          nomeEvento: item.nomeEvento,
          tipoIngresso: item.tipoIngresso,
          preco: item.preco,
          quantidade: item.quantidade,
          imagem: item.imagem,
          dataEvento: item.dataEvento,
          localEvento: item.localEvento
        }));
      } else {
        console.error('❌ Erro ao buscar carrinho:', response.status);
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      return [];
    }
  },

  // 🔥 ADICIONAR ITEM VIA BACKEND
  adicionarItem: async (novoItem: CarrinhoItem): Promise<CarrinhoItem[]> => {
    try {
      const token = getToken();
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${API_URL}/api/carrinho/itens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          eventoId: novoItem.eventoId,
          tipoIngresso: novoItem.tipoIngresso,
          quantidade: novoItem.quantidade
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao adicionar item');
      }

      const carrinhoData = await response.json();
      return carrinhoData.itens.map((item: any) => ({
        id: item._id,
        eventoId: item.eventoId._id || item.eventoId,
        nomeEvento: item.nomeEvento,
        tipoIngresso: item.tipoIngresso,
        preco: item.preco,
        quantidade: item.quantidade,
        imagem: item.imagem,
        dataEvento: item.dataEvento,
        localEvento: item.localEvento
      }));
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      throw error;
    }
  },

  // ... (as outras funções permanecem iguais ao exemplo anterior)
  atualizarQuantidade: async (itemId: string, quantidade: number): Promise<CarrinhoItem[]> => {
    try {
      const token = getToken();
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${API_URL}/api/carrinho/itens/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantidade })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar quantidade');
      }

      const carrinhoData = await response.json();
      return carrinhoData.itens.map((item: any) => ({
        id: item._id,
        eventoId: item.eventoId._id || item.eventoId,
        nomeEvento: item.nomeEvento,
        tipoIngresso: item.tipoIngresso,
        preco: item.preco,
        quantidade: item.quantidade,
        imagem: item.imagem,
        dataEvento: item.dataEvento,
        localEvento: item.localEvento
      }));
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw error;
    }
  },

  removerItem: async (itemId: string): Promise<CarrinhoItem[]> => {
    try {
      const token = getToken();
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${API_URL}/api/carrinho/itens/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao remover item');
      }

      const carrinhoData = await response.json();
      return carrinhoData.itens.map((item: any) => ({
        id: item._id,
        eventoId: item.eventoId._id || item.eventoId,
        nomeEvento: item.nomeEvento,
        tipoIngresso: item.tipoIngresso,
        preco: item.preco,
        quantidade: item.quantidade,
        imagem: item.imagem,
        dataEvento: item.dataEvento,
        localEvento: item.localEvento
      }));
    } catch (error) {
      console.error('Erro ao remover item:', error);
      throw error;
    }
  },

  limparCarrinho: async (): Promise<void> => {
    try {
      const token = getToken();
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch(`${API_URL}/api/carrinho`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao limpar carrinho');
      }
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw error;
    }
  }
};