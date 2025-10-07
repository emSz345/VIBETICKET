import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CarrinhoService } from '../services/carrinhoService';
import { CarrinhoItem } from '../types/carrinho';
import { useAuth } from '../Hook/AuthContext';

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

    // 🔥 CORREÇÃO: Função para salvar no localStorage
    const saveCartToLocalStorage = useCallback((items: CarrinhoItem[]) => {
        try {
            localStorage.setItem('localCart', JSON.stringify(items));
            console.log('Carrinho salvo no localStorage:', items);
        } catch (error) {
            console.error('Erro ao salvar carrinho local:', error);
        }
    }, []);

    // 🔥 CORREÇÃO: Função para carregar do localStorage
    const loadCartFromLocalStorage = useCallback(() => {
        try {
            const localCart = localStorage.getItem('localCart');
            if (localCart) {
                const items = JSON.parse(localCart) as CarrinhoItem[];
                console.log('Carrinho carregado do localStorage:', items);
                setCartItems(items);
                const totalCount = items.reduce((sum, item) => sum + item.quantidade, 0);
                setCartItemsCount(totalCount);
                return items;
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho local:', error);
        }
        return [];
    }, []);

    // 🔥 CORREÇÃO: Função para carregar do backend
    const loadCartFromBackend = useCallback(async () => {
        try {
            setIsLoading(true);
            const items = await CarrinhoService.getCarrinho();
            console.log('Carrinho carregado do backend:', items);
            setCartItems(items);
            const totalCount = items.reduce((sum, item) => sum + item.quantidade, 0);
            setCartItemsCount(totalCount);
            
            // 🔥 IMPORTANTE: Salva também no localStorage como backup
            if (items.length > 0) {
                saveCartToLocalStorage(items);
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho do backend:', error);
            setCartItems([]);
            setCartItemsCount(0);
        } finally {
            setIsLoading(false);
        }
    }, [saveCartToLocalStorage]);

    // 🔥 CORREÇÃO: Sincronização inteligente - MERGE do carrinho local com servidor
    const syncLocalCartToServer = useCallback(async () => {
        if (!isAuthenticated || !user) return;

        try {
            const localCart = localStorage.getItem('localCart');
            if (localCart) {
                const localItems = JSON.parse(localCart) as CarrinhoItem[];
                
                if (localItems.length > 0) {
                    console.log('Fazendo MERGE do carrinho local com servidor...', localItems);
                    
                    // 🔥 CORREÇÃO: Primeiro carrega o carrinho do servidor
                    const serverItems = await CarrinhoService.getCarrinho();
                    console.log('Carrinho atual do servidor:', serverItems);
                    
                    // 🔥 CORREÇÃO: Faz merge dos dois carrinhos
                    const mergedItemsMap = new Map();
                    
                    // Adiciona itens do servidor primeiro
                    serverItems.forEach(item => {
                        const key = `${item.eventoId}-${item.tipoIngresso}`;
                        mergedItemsMap.set(key, { ...item });
                    });
                    
                    // Adiciona/atualiza com itens locais
                    localItems.forEach(localItem => {
                        const key = `${localItem.eventoId}-${localItem.tipoIngresso}`;
                        if (mergedItemsMap.has(key)) {
                            // Se já existe no servidor, mantém a maior quantidade
                            const existing = mergedItemsMap.get(key);
                            const maxQuantity = Math.max(existing.quantidade, localItem.quantidade);
                            mergedItemsMap.set(key, { ...existing, quantidade: maxQuantity });
                        } else {
                            // Se não existe, adiciona do local
                            mergedItemsMap.set(key, { ...localItem });
                        }
                    });
                    
                    const mergedItems = Array.from(mergedItemsMap.values());
                    console.log('Carrinho após merge:', mergedItems);
                    
                    // 🔥 CORREÇÃO: Limpa o carrinho no servidor e adiciona os itens merged
                    await CarrinhoService.limparCarrinho();
                    
                    for (const item of mergedItems) {
                        try {
                            await CarrinhoService.adicionarItem({
                                eventoId: item.eventoId,
                                tipoIngresso: item.tipoIngresso,
                                quantidade: item.quantidade
                            });
                        } catch (error) {
                            console.error(`Erro ao sincronizar item ${item.eventoId}:`, error);
                        }
                    }
                    
                    // 🔥 CORREÇÃO: Atualiza o localStorage com o carrinho merged
                    saveCartToLocalStorage(mergedItems);
                    console.log('Merge concluído - carrinho local limpo');
                }
                
                // 🔥 CORREÇÃO: Agora carrega o carrinho final do servidor
                await loadCartFromBackend();
            } else {
                // Se não tem carrinho local, apenas carrega do servidor
                await loadCartFromBackend();
            }
        } catch (error) {
            console.error('Erro na sincronização do carrinho:', error);
            // Em caso de erro, mantém o carrinho local
            loadCartFromLocalStorage();
        }
    }, [isAuthenticated, user, loadCartFromBackend, loadCartFromLocalStorage, saveCartToLocalStorage]);

    // 🔥 CORREÇÃO: Effect para gerenciar autenticação e carrinho
    useEffect(() => {
        console.log('Estado de autenticação mudou:', { isAuthenticated, user: user?.email });
        
        if (isAuthenticated && user) {
            // Usuário fez LOGIN - sincroniza carrinho
            console.log('Usuário logado, sincronizando carrinho...');
            syncLocalCartToServer();
        } else {
            // Usuário fez LOGOUT - carrega carrinho local
            console.log('Usuário deslogado, carregando carrinho local...');
            loadCartFromLocalStorage();
        }
    }, [isAuthenticated, user, syncLocalCartToServer, loadCartFromLocalStorage]);

    // 🔥 CORREÇÃO: Effect para salvar automaticamente no localStorage quando o carrinho muda
    useEffect(() => {
        if (cartItems.length > 0) {
            console.log('Carrinho modificado, salvando no localStorage:', cartItems);
            saveCartToLocalStorage(cartItems);
            
            // Atualiza contagem
            const totalCount = cartItems.reduce((sum, item) => sum + item.quantidade, 0);
            setCartItemsCount(totalCount);
        }
    }, [cartItems, saveCartToLocalStorage]);

    const addItemToCart = async (item: CarrinhoItem) => {
        console.log('Adicionando item ao carrinho:', item, 'Usuário logado:', isAuthenticated);
        
        if (isAuthenticated) {
            try {
                setIsLoading(true);
                await CarrinhoService.adicionarItem({
                    eventoId: item.eventoId,
                    tipoIngresso: item.tipoIngresso,
                    quantidade: item.quantidade
                });
                await loadCartFromBackend();
            } catch (error) {
                console.error('Erro ao adicionar item:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        } else {
            const newItems = [...cartItems];
            const existingItemIndex = newItems.findIndex(i => 
                i.eventoId === item.eventoId && i.tipoIngresso === item.tipoIngresso
            );

            if (existingItemIndex !== -1) {
                newItems[existingItemIndex].quantidade += item.quantidade;
            } else {
                newItems.push({
                    ...item,
                    id: `${item.eventoId}-${item.tipoIngresso}-${Date.now()}`
                });
            }

            setCartItems(newItems);
            console.log('Item adicionado ao carrinho local:', newItems);
        }
    };

    const updateItemQuantity = async (id: string, quantity: number) => {
        if (quantity <= 0) {
            await removeItemFromCart(id);
            return;
        }

        if (isAuthenticated) {
            try {
                setIsLoading(true);
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
