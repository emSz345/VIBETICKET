import React, { useEffect, useRef } from "react";
import sp from "../../../../assets/estados/estado-sp.jpg";
import rj from "../../../../assets/estados/estados-rj.jpg";
import mg from "../../../../assets/estados/estado-mg.jpg";
import prn from "../../../../assets/estados/estados-prn.jpg";
import mrn from "../../../../assets/estados/estado_mrn.jpg";
import pr from "../../../../assets/estados/estado_pr.jpg";
import sc from "../../../../assets/estados/estado_sc.jpg";
import rgs from "../../../../assets/estados/estado_rgs.jpg";
import df from "../../../../assets/estados/estado_df.jpg";
import "./Cidades.css";

interface Cidade {
  nome: string;
  img: string;
}

const Cidades: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const directionRef = useRef(1); // 1 = direita, -1 = esquerda
  const scrollSpeed = 2.5;

  const cidades: Cidade[] = [
    { nome: "São Paulo", img: sp },
    { nome: "Rio de Janeiro", img: rj },
    { nome: "Maranhão", img: mrn },
    { nome: "Minas Gerais", img: mg },
    { nome: "Pará", img: pr },
    { nome: "Paraná", img: prn },
    { nome: "Santa Catarina", img: sc },
    { nome: "Rio Grande do Sul", img: rgs },
    { nome: "Brasilia", img: df },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleInteraction = () => {
      isPausedRef.current = true;
      setTimeout(() => { isPausedRef.current = false; }, 2000);
    };

    const events = [
      { type: 'mouseenter', handler: () => { isPausedRef.current = true; } },
      { type: 'mouseleave', handler: () => { isPausedRef.current = false; } },
      { type: 'touchstart', handler: handleInteraction },
      { type: 'wheel', handler: handleInteraction }
    ];

    events.forEach(({ type, handler }) => {
      container.addEventListener(type, handler);
    });

    const animate = () => {
      if (!isPausedRef.current && container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const maxScroll = scrollWidth - clientWidth;
        const threshold = 50; // Margem para começar a inverter antes de chegar no final

        if (scrollLeft >= maxScroll - threshold) {
          directionRef.current = -1; // Inverte para esquerda
        } else if (scrollLeft <= threshold) {
          directionRef.current = 1; // Inverte para direita
        }

        container.scrollLeft += scrollSpeed * directionRef.current;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    // Inicia com um pequeno delay para evitar conflitos com o render inicial
    const startDelay = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(startDelay);
      cancelAnimationFrame(animationRef.current);
      events.forEach(({ type, handler }) => {
        container.removeEventListener(type, handler);
      });
    };
  }, []);

  return (
   <div className="cidades-container" id="estados">
      <h3 className="cidades-title">Estados com mais shows</h3>
      <div className="cidades-grid" ref={containerRef}>
        {[...cidades].map((cidade, i) => (
          <div key={`${cidade.nome}-${i}`} className="cidade-card">
            <img src={cidade.img} alt={cidade.nome} loading="lazy" />
            <div className="estado-overlay"></div>
            <div className="texto-sobre-imagem">{cidade.nome}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cidades;