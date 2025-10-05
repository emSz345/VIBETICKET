import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CarrinhoService } from '../services/carrinhoService';
import { CarrinhoItem } from '../types/carrinho';

// Define a interface para o que o contexto irá fornecer
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
}

// Cria o contexto com um valor inicial indefinido
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado para facilitar o acesso ao contexto do carrinho
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// Componente Provedor do Contexto
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Estado para a contagem de itens no carrinho
    const [cartItemsCount, setCartItemsCount] = useState(0);
    // Estado para armazenar os itens do carrinho
    const [cartItems, setCartItems] = useState<CarrinhoItem[]>([]);
    // Estado para loading
    const [isLoading, setIsLoading] = useState(false);

    // 🔥 CORRIGIDO: Carregar carrinho completo do BACKEND ao inicializar
    useEffect(() => {
        loadCartFromBackend();
    }, []);

    const loadCartFromBackend = async () => {
        try {
            setIsLoading(true);
            const items = await CarrinhoService.getCarrinho();
            setCartItems(items);
            updateCartCount(items);
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔥 NOVA FUNÇÃO: Recarregar carrinho do backend
    const refreshCart = async () => {
        await loadCartFromBackend();
    };

    // Funções para manipular a contagem do carrinho
    const updateCartCount = (items?: CarrinhoItem[]) => {
        const cartItemsToCount = items || cartItems;
        const totalCount = cartItemsToCount.reduce((sum: number, item) => sum + item.quantidade, 0);
        setCartItemsCount(totalCount);
    };

    // 🔥 CORRIGIDA: Função assíncrona para adicionar um item ao carrinho
    const addItemToCart = async (item: CarrinhoItem) => {
        try {
            setIsLoading(true);
            const novoCarrinho = await CarrinhoService.adicionarItem(item);
            setCartItems(novoCarrinho);
            updateCartCount(novoCarrinho);
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            throw error; // Propaga o erro para o componente
        } finally {
            setIsLoading(false);
        }
    };

    // 🔥 CORRIGIDA: Função assíncrona para remover item
    const removeItemFromCart = async (id: string) => {
        try {
            setIsLoading(true);
            const novoCarrinho = await CarrinhoService.removerItem(id);
            setCartItems(novoCarrinho);
            updateCartCount(novoCarrinho);
        } catch (error) {
            console.error('Erro ao remover item:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 🔥 CORRIGIDA: Função assíncrona para atualizar quantidade
    const updateItemQuantity = async (id: string, quantity: number) => {
        if (quantity <= 0) {
            await removeItemFromCart(id);
            return;
        }

        try {
            setIsLoading(true);
            const novoCarrinho = await CarrinhoService.atualizarQuantidade(id, quantity);
            setCartItems(novoCarrinho);
            updateCartCount(novoCarrinho);
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 🔥 CORRIGIDA: Função assíncrona para limpar carrinho
    const clearCart = async () => {
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
    };

    const getCartItems = (): CarrinhoItem[] => {
        return cartItems;
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
        refreshCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};