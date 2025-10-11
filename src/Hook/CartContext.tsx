import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CarrinhoService } from '../services/carrinhoService';
import { CarrinhoItem } from '../types/carrinho';
import { useAuth } from '../Hook/AuthContext';

// Assumindo que esta interface CarrinhoItem é a correta
// type CarrinhoItem = {
//     id: string; // ID local ou do item no DB
//     eventoId: string;
//     nomeEvento: string;
//     tipoIngresso: string;
//     preco: number;
//     quantidade: number;
//     imagem: string;
//     dataEvento: string;
//     localEvento: string;
// };

interface CartContextType {
    cartItemsCount: number;
    cartItems: CarrinhoItem[];
    isLoading: boolean;
    updateCartCount: () => void;
    addItemToCart: (item: CarrinhoItem) => Promise<void>;
    removeItemFromCart: (id: string) => Promise<void>;
    updateItemQuantity: (id: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getCartItems: () => CarrinhoItem[];
    refreshCart: () => Promise<void>;
    syncLocalCartToServer: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CarrinhoItem[]>([]);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();

    // Função para salvar no localStorage
    const saveCartToLocalStorage = useCallback((items: CarrinhoItem[]) => {
        try {
            localStorage.setItem('localCart', JSON.stringify(items));
        } catch (error) {
            console.error('Erro ao salvar carrinho local:', error);
        }
    }, []);

    // Função para carregar do localStorage
    const loadCartFromLocalStorage = useCallback(() => {
        try {
            const localCart = localStorage.getItem('localCart');
            if (localCart) {
                const items = JSON.parse(localCart) as CarrinhoItem[];
                setCartItems(items);
                const totalCount = items.reduce((sum, item) => sum + item.quantidade, 0);
                setCartItemsCount(totalCount);
                return items;
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho local:', error);
        }
        setCartItems([]);
        setCartItemsCount(0);
        return [];
    }, []);

    // Função para carregar do backend
    const loadCartFromBackend = useCallback(async () => {
        try {
            setIsLoading(true);
            const items = await CarrinhoService.getCarrinho();
            setCartItems(items);
            const totalCount = items.reduce((sum, item) => sum + item.quantidade, 0);
            setCartItemsCount(totalCount);
            
            // Salva no localStorage como backup ou para consistência
            saveCartToLocalStorage(items);
        } catch (error) {
            console.error('Erro ao carregar carrinho do backend. Tentando carregar local...', error);
            // Em caso de falha no backend, garante que o local é carregado como fallback
            loadCartFromLocalStorage();
        } finally {
            setIsLoading(false);
        }
    }, [saveCartToLocalStorage, loadCartFromLocalStorage]);

    // 🔥 Lógica de Sincronização Corrigida e Otimizada
    const syncLocalCartToServer = useCallback(async () => {
        if (!isAuthenticated || !user) return;

        try {
            setIsLoading(true);
            const localCart = localStorage.getItem('localCart');
            const localItems = localCart ? (JSON.parse(localCart) as CarrinhoItem[]) : [];
            
            // Se não há itens locais, apenas carrega do backend
            if (localItems.length === 0) {
                await loadCartFromBackend();
                return;
            }
            
            // 1. Carrega itens atuais do servidor
            const serverItems = await CarrinhoService.getCarrinho();
            
            // 2. Faz o merge dos dois carrinhos (local tem precedência na quantidade)
            const mergedItemsMap = new Map<string, CarrinhoItem>();
            
            // Adiciona itens do servidor
            serverItems.forEach(item => {
                const key = `${item.eventoId}-${item.tipoIngresso}`;
                mergedItemsMap.set(key, { ...item });
            });
            
            // Adiciona/atualiza com itens locais
            localItems.forEach(localItem => {
                const key = `${localItem.eventoId}-${localItem.tipoIngresso}`;
                if (mergedItemsMap.has(key)) {
                    // Item existe em ambos, soma as quantidades
                    const existing = mergedItemsMap.get(key)!;
                    const maxQuantity = Math.max(existing.quantidade, localItem.quantidade);
                    mergedItemsMap.set(key, { ...existing, quantidade: maxQuantity });
                } else {
                    // Item só existe localmente, adiciona
                    mergedItemsMap.set(key, { ...localItem });
                }
            });
            
            const mergedItems = Array.from(mergedItemsMap.values());
            
            // 3. Sincroniza item por item de forma segura (Assumindo backend corrigido)
            await CarrinhoService.limparCarrinho(); // Limpa o carrinho do servidor
            
            for (const item of mergedItems) {
                 // Chama o addItemToCart, que contém a lógica de backend
                 // Se o backend estiver corrigido, isso apenas adiciona o item ao array de itens do usuário.
                 await CarrinhoService.adicionarItem({ 
                    eventoId: item.eventoId, 
                    tipoIngresso: item.tipoIngresso, 
                    quantidade: item.quantidade 
                 });
            }

            // 4. Carrega o estado final do backend e limpa o local
            await loadCartFromBackend();
            saveCartToLocalStorage([]); // Limpa o local após sincronização de sucesso

        } catch (error) {
            console.error('Erro na sincronização do carrinho:', error);
            // Em caso de erro, apenas carrega o que puder do servidor (ou local)
            loadCartFromBackend(); 
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user, loadCartFromBackend, saveCartToLocalStorage]);

    // Effect para gerenciar autenticação e carrinho
    useEffect(() => {
        if (isAuthenticated && user) {
            // Usuário fez LOGIN - sincroniza carrinho
            syncLocalCartToServer();
        } else {
            // Usuário fez LOGOUT/Não logado - carrega carrinho local
            loadCartFromLocalStorage();
        }
        // Dependências atualizadas para loadCartFromLocalStorage
    }, [isAuthenticated, user, syncLocalCartToServer, loadCartFromLocalStorage]);

    // Effect para atualizar contagem e salvar no localStorage (para não logados)
    useEffect(() => {
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantidade, 0);
        setCartItemsCount(totalCount);
        
        // Se o usuário não está logado, salva no local toda vez que o estado muda
        if (!isAuthenticated) {
            saveCartToLocalStorage(cartItems);
        }
    }, [cartItems, isAuthenticated, saveCartToLocalStorage]);
    
    // 🔥 Função de Adicionar Item
    const addItemToCart = async (item: CarrinhoItem) => {
        // Se estiver autenticado, chama o serviço do backend
        if (isAuthenticated) {
            try {
                setIsLoading(true);
                // ESTE É O PONTO CRÍTICO: Esta função DEVE ATUALIZAR o item no array de itens do carrinho
                // no banco de dados do usuário logado.
                await CarrinhoService.adicionarItem({
                    eventoId: item.eventoId,
                    tipoIngresso: item.tipoIngresso,
                    quantidade: item.quantidade
                });
                await loadCartFromBackend(); // Recarrega o carrinho atualizado
            } catch (error) {
                console.error('Erro ao adicionar item via backend:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        } else {
            // Lógica para usuários não logados: gerencia o estado local
            const newItems = [...cartItems];
            const existingItemIndex = newItems.findIndex(i => 
                i.eventoId === item.eventoId && i.tipoIngresso === item.tipoIngresso
            );

            if (existingItemIndex !== -1) {
                newItems[existingItemIndex].quantidade += item.quantidade;
            } else {
                newItems.push({
                    ...item,
                    id: `${item.eventoId}-${item.tipoIngresso}-${Date.now()}` // Garante um ID único local
                });
            }

            setCartItems(newItems);
            // O useEffect acima irá salvar automaticamente no localStorage
        }
    };

    // As funções de remoção e atualização foram mantidas,
    // mas dependem da correção do backend (uso do ID correto do item no DB)

    const updateItemQuantity = async (id: string, quantity: number) => {
        if (quantity <= 0) {
            await removeItemFromCart(id);
            return;
        }

        if (isAuthenticated) {
            try {
                setIsLoading(true);
                // ID aqui deve ser o ID do item DENTRO do array 'itens' do carrinho no DB
                await CarrinhoService.atualizarQuantidade(id, quantity);
                await loadCartFromBackend();
            } catch (error) {
                console.error('Erro ao atualizar quantidade:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        } else {
            const newItems = cartItems.map(item => 
                item.id === id ? { ...item, quantidade: quantity } : item
            );
            setCartItems(newItems);
        }
    };

    const removeItemFromCart = async (id: string) => {
        if (isAuthenticated) {
            try {
                setIsLoading(true);
                await CarrinhoService.removerItem(id);
                await loadCartFromBackend();
            } catch (error) {
                console.error('Erro ao remover item:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        } else {
            const newItems = cartItems.filter(item => item.id !== id);
            setCartItems(newItems);
        }
    };

    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                setIsLoading(true);
                await CarrinhoService.limparCarrinho();
                setCartItems([]);
                setCartItemsCount(0);
                saveCartToLocalStorage([]);
            } catch (error) {
                console.error('Erro ao limpar carrinho:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        } else {
            setCartItems([]);
            setCartItemsCount(0);
            saveCartToLocalStorage([]);
        }
    };

    const getCartItems = (): CarrinhoItem[] => {
        return cartItems;
    };

    const refreshCart = async () => {
        if (isAuthenticated) {
            await loadCartFromBackend();
        } else {
            loadCartFromLocalStorage();
        }
    };

    const updateCartCount = useCallback(() => {
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantidade, 0);
        setCartItemsCount(totalCount);
    }, [cartItems]);

    const value: CartContextType = {
        cartItemsCount,
        cartItems,
        isLoading,
        updateCartCount,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        getCartItems,
        refreshCart,
        syncLocalCartToServer
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};