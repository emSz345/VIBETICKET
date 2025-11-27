import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    // Extrai o 'pathname' (ex: "/termos-de-uso") do objeto de localização
    const { pathname } = useLocation();

    // Este 'useEffect' será executado toda vez que o 'pathname' mudar
    useEffect(() => {
        // Rola a janela para o topo (posição 0, 0)
        window.scrollTo(0, 0);
    }, [pathname]); // O array de dependência garante que isso só rode se o pathname mudar

    // Este componente não renderiza nada visível
    return null;
}