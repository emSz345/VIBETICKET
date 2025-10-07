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

    // 🔥 CORREÇÃO: Memoizar a função de carregar do backend
    const loadCartFromBackend = useCallback(async () => {
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
    }, []); // 🔥 Removidas dependências desnecessárias

    // 🔥 CORREÇÃO: Memoizar a função de sincronização
    const syncLocalCartToServer = useCallback(async () => {
        if (!isAuthenticated || !user) return;

        try {
            const localCart = localStorage.getItem('localCart');
            if (localCart) {
                const localItems = JSON.parse(localCart) as CarrinhoItem[];
                
                if (localItems.length > 0) {
                    console.log('Sincronizando carrinho local com servidor...', localItems);
                    
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
                    
                    localStorage.removeItem('localCart');
                    console.log('Carrinho local sincronizado e limpo');
                }
                
                await loadCartFromBackend();
            } else {
                await loadCartFromBackend();
            }
        } catch (error) {
            console.error('Erro na sincronização do carrinho:', error);
            loadCartFromLocalStorage();
        }
    }, [isAuthenticated, user, loadCartFromBackend]); // 🔥 Dependências corretas

    const loadCartFromLocalStorage = useCallback(() => {
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
    }, []);

    const saveCartToLocalStorage = useCallback((items: CarrinhoItem[]) => {
        try {
            localStorage.setItem('localCart', JSON.stringify(items));
        } catch (error) {
            console.error('Erro ao salvar carrinho local:', error);
        }
    }, []);

    const updateCartCount = useCallback((items?: CarrinhoItem[]) => {
        const cartItemsToCount = items || cartItems;
        const totalCount = cartItemsToCount.reduce((sum: number, item) => sum + item.quantidade, 0);
        setCartItemsCount(totalCount);
    }, [cartItems]);

    // 🔥 CORREÇÃO: Effect único para gerenciar o carrinho baseado na autenticação
    useEffect(() => {
        if (isAuthenticated) {
            loadCartFromBackend();
        } else {
            loadCartFromLocalStorage();
        }
    }, [isAuthenticated, loadCartFromBackend, loadCartFromLocalStorage]);

    // 🔥 CORREÇÃO: Effect separado para sincronização quando usuário faz login
    useEffect(() => {
        if (isAuthenticated && user) {
            syncLocalCartToServer();
        }
    }, [isAuthenticated, user, syncLocalCartToServer]);

    const addItemToCart = async (item: CarrinhoItem) => {
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
