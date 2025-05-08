import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { fetchEventos } from "../../../../services/api";
import { Evento } from "../../../../types/event";
import "./Sertanejo.css";

const Sertanejo: React.FC = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    const carregarEventos = async () => {
      const dados = await fetchEventos();
      setEventos(dados);
    };

    carregarEventos();
  }, []);

  return (
    <div className="carousel-container">
      <Swiper
        modules={[Navigation]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={20}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          480: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {eventos.map((evento) => (
          <SwiperSlide key={evento.id}>
            <div className="evento-card" onClick={() => navigate(`/detalhes/${evento.id}`, { state: evento })}>
              <img src={evento.imagem} alt={evento.titulo} className="evento-img" />
              <div className="evento-info">
                <p className="evento-data">{evento.data}</p>
                <h3 className="evento-titulo">{evento.titulo}</h3>
                <p className="evento-local">{evento.local}</p>
              </div>
              <p className="evento-vendidos">{evento.vendidos}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Sertanejo;