// src/components/Carrossel.tsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { MdViewCarousel } from "react-icons/md";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "./Carrossel.css";
import { useNavigate } from "react-router-dom";

interface CarrosselImage {
  filename: string;
  eventoId?: string;
}

const CarrosselEventos = () => {
    const [imagens, setImagens] = useState<CarrosselImage[]>([]);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchImagensCarrossel = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/carrossel`);
                if (response.ok) {
                    const data: CarrosselImage[] = await response.json();
                    setImagens(data);
                }
            } catch (error) {
                console.error('Erro ao buscar imagens do carrossel:', error);
            }
        };
    
        fetchImagensCarrossel();
    }, [apiUrl]);

    const handleImageClick = (imagem: CarrosselImage) => {
        if (imagem.eventoId) {
            navigate(`/evento/${imagem.eventoId}`);
        }
    };

    return (
        <div className="carrossel-container">
            {imagens.length > 0 ? (
                <Swiper
                    navigation
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination, Autoplay]}
                    className="mySwiper"
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                >
                    {imagens.map((imagem, index) => (
                        <SwiperSlide 
                            key={index} 
                            onClick={() => handleImageClick(imagem)}
                            style={{ cursor: imagem.eventoId ? 'pointer' : 'default' }}
                        >
                            <img 
                                src={`${apiUrl}/uploads/carrossel/${imagem.filename}`} 
                                alt={`Carrossel Imagem ${index + 1}`} 
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center"}}>
                    <MdViewCarousel size={100} color="#696969" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}/>
                    <p style={{ color: "#696969" }}>Nenhuma imagem no carrossel.</p>
                 </div>
            )}
        </div>
    );
};

export default CarrosselEventos;