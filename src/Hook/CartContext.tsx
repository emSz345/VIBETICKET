import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CarrinhoService } from '../services/carrinhoService';
import { CarrinhoItem } from '../types/carrinho';
import { useAuth } from '../Hook/AuthContext';
import { useCallback } from 'react';


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

     const syncLocalCartToServer = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const localCart = localStorage.getItem('localCart');
            if (localCart) {
                const localItems = JSON.parse(localCart) as CarrinhoItem[];
                
                if (localItems.length > 0) {
                    console.log('Sincronizando carrinho local com servidor...', localItems);
                    
                    // Para cada item local, adicionar ao carrinho do servidor
                    for (const item of localItems) {
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
                    
                    // Limpar carrinho local após sincronização bem-sucedida
                    localStorage.removeItem('localCart');
                    console.log('Carrinho local sincronizado e limpo');
                }
                
                // Recarregar carrinho do servidor
                await loadCartFromBackend();
            } else {
                // Se não há carrinho local, apenas carregar do backend
                await loadCartFromBackend();
            }
        } catch (error) {
            console.error('Erro na sincronização do carrinho:', error);
            // Em caso de erro, manter o carrinho local
            loadCartFromLocalStorage();
        }
    },[isAuthenticated]);

    // 🔥 CORREÇÃO: Sincronizar carrinho quando o usuário fizer login
    useEffect(() => {
        if (isAuthenticated && user) {
            syncLocalCartToServer();
        }
    }, [isAuthenticated, user, syncLocalCartToServer]);

    const loadCartFromBackend = async () => {
        try {
            setIsLoading(true);
            const items = await CarrinhoService.getCarrinho();
            setCartItems(items);
            updateCartCount(items);
        } catch (error) {
            console.error('Erro ao carregar carrinho do backend:', error);
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCartFromLocalStorage = () => {
        try {
            const localCart = localStorage.getItem('localCart');
            if (localCart) {
                const items = JSON.parse(localCart) as CarrinhoItem[];
                setCartItems(items);
                updateCartCount(items);
            } else {
                setCartItems([]);
                setCartItemsCount(0);
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho local:', error);
            setCartItems([]);
            setCartItemsCount(0);
        }
    };

    const saveCartToLocalStorage = (items: CarrinhoItem[]) => {
        try {
            localStorage.setItem('localCart', JSON.stringify(items));
        } catch (error) {
            console.error('Erro ao salvar carrinho local:', error);
        }
    };

    // 🔥 CORREÇÃO: Função de sincronização melhorada
   

    const updateCartCount = (items?: CarrinhoItem[]) => {
        const cartItemsToCount = items || cartItems;
        const totalCount = cartItemsToCount.reduce((sum: number, item) => sum + item.quantidade, 0);
        setCartItemsCount(totalCount);
    };

    // 🔥 CORREÇÃO: Carregar carrinho baseado no status de autenticação
    useEffect(() => {
        if (isAuthenticated) {
            loadCartFromBackend();
        } else {
            loadCartFromLocalStorage();
        }
    }, [isAuthenticated, loadCartFromBackend]);

    const addItemToCart = async (item: CarrinhoItem) => {
        if (isAuthenticated) {
            // Usuário logado: salvar no servidor
            try {
                setIsLoading(true);
                await CarrinhoService.adicionarItem({
                    eventoId: item.eventoId,
                    tipoIngresso: item.tipoIngresso,
                    quantidade: item.quantidade
                });
                // Recarregar carrinho completo após adicionar
                await loadCartFromBackend();
            } catch (error) {
                console.error('Erro ao adicionar item:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        } else {
            // Usuário não logado: salvar localmente
            const newItems = [...cartItems];
            const existingItemIndex = newItems.findIndex(i => 
                i.eventoId === item.eventoId && i.tipoIngresso === item.tipoIngresso
            );

            if (existingItemIndex !== -1) {
                // Atualizar quantidade do item existente
                newItems[existingItemIndex].quantidade += item.quantidade;
            } else {
                // Adicionar novo item
                newItems.push({
                    ...item,
                    id: `${item.eventoId}-${item.tipoIngresso}-${Date.now()}`
                });
            }

            setCartItems(newItems);
            updateCartCount(newItems);
            saveCartToLocalStorage(newItems);
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
            updateCartCount(newItems);
            saveCartToLocalStorage(newItems);
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
            updateCartCount(newItems);
            saveCartToLocalStorage(newItems);
        }
    };

    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                setIsLoading(true);
                await CarrinhoService.limparCarrinho();
                setCartItems([]);
                setCartItemsCount(0);
            } catch (error) {
                console.error('Erro ao limpar carrinho:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        } else {
            setCartItems([]);
            setCartItemsCount(0);
            localStorage.removeItem('localCart');
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