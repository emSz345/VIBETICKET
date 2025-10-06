import api from './api';
import { CarrinhoItem } from '../types/carrinho';

export class CarrinhoService {
    static async getCarrinho(): Promise<CarrinhoItem[]> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return [];
            }

            const response = await api.get('/api/carrinho', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // 🔥 CORREÇÃO: Garantir que sempre retorne um array
            if (response.data && response.data.itens) {
                return response.data.itens.map((item: any) => ({
                    id: item._id || item.id,
                    eventoId: item.eventoId,
                    nomeEvento: item.nomeEvento,
                    tipoIngresso: item.tipoIngresso,
                    preco: item.preco,
                    quantidade: item.quantidade,
                    imagem: item.imagem,
                    dataEvento: item.dataEvento,
                    localEvento: item.localEvento
                }));
            }
            return [];
        } catch (error) {
            console.error('Erro ao buscar carrinho:', error);
            return [];
        }
    }

    static async adicionarItem(itemData: {
        eventoId: string;
        tipoIngresso: string;
        quantidade: number;
    }): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            await api.post('/api/carrinho/itens', itemData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            throw error;
        }
    }

    static async atualizarQuantidade(itemId: string, quantidade: number): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            await api.put(`/api/carrinho/itens/${itemId}`, { 
                quantidade 
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            throw error;
        }
    }

    static async removerItem(itemId: string): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            await api.delete(`/api/carrinho/itens/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Erro ao remover item:', error);
            throw error;
        }
    }

    static async limparCarrinho(): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            await api.delete('/api/carrinho', {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
            throw error;
        }
    }

    // 🔥 CORREÇÃO: Método para sincronizar múltiplos itens de uma vez
    static async sincronizarCarrinho(itens: CarrinhoItem[]): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            // Primeiro limpa o carrinho atual no servidor
            await this.limparCarrinho();

            // Depois adiciona todos os itens do carrinho local
            for (const item of itens) {
                try {
                    await this.adicionarItem({
                        eventoId: item.eventoId,
                        tipoIngresso: item.tipoIngresso,
                        quantidade: item.quantidade
                    });
                } catch (error) {
                    console.error(`Erro ao sincronizar item ${item.eventoId}:`, error);
                    // Continua com os próximos itens mesmo se um falhar
                }
            }
        } catch (error) {
            console.error('Erro na sincronização do carrinho:', error);
            throw error;
        }
    }
}