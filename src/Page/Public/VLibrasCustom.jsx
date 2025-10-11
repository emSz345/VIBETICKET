// VLibrasCustom.jsx
import { useEffect } from 'react';

const VLibrasCustom = () => {
    useEffect(() => {
     const initializeVLibras = () => {
    const addVLibrasDOM = () => {
            const domStructure = `
        <div vw class="enabled">
          <div vw-access-button class="active"></div>
          <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
          </div>
        </div>
      `;
            document.body.insertAdjacentHTML('beforeend', domStructure);
        };

         const loadVLibrasScript = () => {
            const script = document.createElement('script');
            script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
            script.async = true;
            setTimeout(() => {
                if (window.VLibras) {
                    new window.VLibras.Widget('https://vlibras.gov.br/app');
                }
            }, 100); // Atraso de 100 milissegundos
        document.head.appendChild(script);
    };
  };

     if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVLibras);
  } else {
    initializeVLibras();
  }
       
        
}, []); // Executa apenas uma vez após o componente montar

return null; // Este componente não renderiza nada visível
};

export default VLibrasCustom;