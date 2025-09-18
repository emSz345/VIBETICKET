import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CarrinhoService } from '../services/carrinhoService';

// Define a interface para o que o contexto irá fornecer
interface CartContextType {
    cartItemsCount: number;
    updateCartCount: () => void;
    // Adicionando a função para adicionar itens
    addItemToCart: (item: any) => void;
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

    // Funções para manipular a contagem do carrinho
    const updateCartCount = () => {
        const items = CarrinhoService.getCarrinho();
        const totalCount = items.reduce((sum: number, item) => sum + item.quantidade, 0);
        setCartItemsCount(totalCount);
    };

    // Nova função para adicionar um item ao carrinho
    const addItemToCart = (item: any) => {
        // 1. Adiciona o item usando o serviço
        CarrinhoService.adicionarItem(item);
        // 2. Chama a função de atualização para refletir a mudança
        updateCartCount();
    };

    // Efeito para carregar a contagem do localStorage ao montar o componente
    useEffect(() => {
        updateCartCount();
    }, []);

    const value = {
        cartItemsCount,
        updateCartCount,
        addItemToCart // Incluindo a nova função aqui
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};