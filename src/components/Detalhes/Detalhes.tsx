import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Detalhes.css";
import logo from '../../assets/img1.png'

const Detalhes = () => {
    const navigate = useNavigate();

    const eventos = [
        {
            id: 1,
            imagem: logo,
            titulo: "Nome do evento",
            data: "Qui, 20 de fev - 19:00",
            local: "local do evento",
            vendidos: "+ 100 mil vendidos",
        },
        {
            id: 2,
            imagem: logo,
            titulo: "Outro evento",
            data: "Sex, 15 de mar - 21:00",
            local: "outro local",
            vendidos: "+ 80 mil vendidos",
        },
        {
            id: 3,
            imagem: logo,
            titulo: "Outro evento",
            data: "Sex, 15 de mar - 21:00",
            local: "outro local",
            vendidos: "+ 80 mil vendidos",
        },
        {
            id: 4,
            imagem: logo,
            titulo: "Outro evento",
            data: "Sex, 15 de mar - 21:00",
            local: "outro local",
            vendidos: "+ 80 mil vendidos",
        },
    ];

    return (
        <div className="carousel-container">
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={20}
                slidesPerView={3}
            >
                {eventos.map((evento) => (
                    <SwiperSlide key={evento.id}>
                        <div className="evento-card" onClick={() => navigate(`/Termos/${evento.id}`)}>
                            <img src={evento.imagem} alt={evento.titulo} className="evento-img" />
                            <div className="evento-info">
                                <p className="evento-data">{evento.data}</p>
                                <h3 className="evento-titulo">{evento.titulo}</h3>
                                <p className="evento-local">{evento.local}</p>
                                <p className="evento-vendidos">{evento.vendidos}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Detalhes;
