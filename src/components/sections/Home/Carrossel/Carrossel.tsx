import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";

import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "./Carrossel.css";
import { useNavigate } from "react-router-dom";

interface CarrosselImage {
  filename: string;
  eventoId?: string;
}

const CarrosselEventos = () => {
  const [imagens, setImagens] = useState<CarrosselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchImagensCarrossel = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${apiUrl}/api/carrossel`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data: CarrosselImage[] = await response.json();
        setImagens(data);
      } catch (error) {
        console.error("Erro ao buscar imagens do carrossel:", error);
        setError("Não foi possível carregar as imagens do carrossel.");
      } finally {
        setLoading(false);
      }
    };

    fetchImagensCarrossel();
  }, [apiUrl]);

  const handleImageClick = (imagem: CarrosselImage) => {
    if (imagem.eventoId) {
      navigate(`/evento/${imagem.eventoId}`);
    }
  };

  // Estado de loading
  if (loading) {
    return (
      <div className="carrossel-container">
        <div className="carrossel-loading">
          Carregando eventos...
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="carrossel-container">
        <div className="carrossel-empty">
          {error}
        </div>
      </div>
    );
  }

  // Sem imagens
  if (imagens.length === 0) {
    return (
      <div className="carrossel-container">
        <div className="carrossel-empty">
          Nenhum evento disponível no momento.
        </div>
      </div>
    );
  }

  return (
    <div className="carrossel-container">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 150,
          modifier: 2,
          slideShadows: true
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={imagens.length > 1}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="coverflowSwiper"
      >
        {imagens.map((imagem, index) => (
          <SwiperSlide
            key={`${imagem.filename}-${index}`}
            onClick={() => handleImageClick(imagem)}
            className="coverflow-slide"
          >
            <img
              src={`${apiUrl}/uploads/carrossel/${imagem.filename}`}
              alt={`Evento ${index + 1}`}
              loading="lazy"
              onError={(e) => {
                // Fallback para imagem quebrada
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjgwIiBoZWlnaHQ9IjQyMCIgdmlld0JveD0iMCAwIDY4MCA0MjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2ODAiIGhlaWdodD0iNDIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNDAgMjEwQzM1My4yNTUgMjEwIDM2NCAxOTkuMjU1IDM2NCAxODZDMzY0IDE3Mi43NDUgMzUzLjI1NSAxNjIgMzQwIDE2MkMzMjYuNzQ1IDE2MiAzMTYgMTcyLjc0NSAzMTYgMTg2QzMxNiAxOTkuMjU1IDMyNi43NDUgMjEwIDM0MCAyMTBaIiBmaWxsPSIjQ0VDRkQxIi8+CjxwYXRoIGQ9Ik0yODAgMjU0TDMwMiAyMzJMMzI2IDI1NkwzNTAgMjMyTDM3OCAyNTRMMzk2IDIzNkMzOTcuMjU1IDIzNiAzOTggMjM2Ljc0NSAzOTggMjM4VjMwOEMzOTggMzE5LjI1NSAzODguMjU1IDMyOSAzNzcgMzI5SDMwM0MyOTEuNzQ1IDMyOSAyODIgMzE5LjI1NSAyODIgMzA4VjIzOEMyODIgMjM2Ljc0NSAyODIuNzQ1IDIzNiAyODQgMjM2TDI4MCAyMzRWMjU0WiIgZmlsbD0iI0NFQ0ZEMSIvPgo8L3N2Zz4K';
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarrosselEventos;