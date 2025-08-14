import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // Importe os estilos do autoplay
import { MdViewCarousel } from "react-icons/md";

// Importe o módulo Autoplay junto com os outros
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "./Carrossel.css";

const CarrosselEventos = () => {
    const [imagens, setImagens] = useState<string[]>([]);

    useEffect(() => {
        // Função para buscar as imagens do carrossel no backend
        const fetchImagensCarrossel = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/carrossel'); // Endpoint para buscar imagens
                if (response.ok) {
                    const data: string[] = await response.json();
                    // Constrói a URL completa da imagem para o frontend
                    setImagens(data.map((img: string) => `http://localhost:5000/uploads/carrossel/${img}`));
                }
            } catch (error) {
                console.error('Erro ao buscar imagens do carrossel:', error);
            }
        };

        fetchImagensCarrossel();
    }, []);

    return (
        <div className="carrossel-container">
            {imagens.length > 0 ? (
                <Swiper
                    navigation
                    pagination={{ clickable: true }}
                    // Adicione o módulo Autoplay aqui
                    modules={[Navigation, Pagination, Autoplay]}
                    className="mySwiper"
                    // Adicione a propriedade autoplay para configurar o tempo de troca
                    autoplay={{
                        delay: 2500, // Tempo em milissegundos (2.5 segundos) para a troca
                        disableOnInteraction: false, // O carrossel continua girando mesmo se o usuário interagir
                    }}
                >
                    {imagens.map((imagemUrl, index) => (
                        <SwiperSlide key={index}>
                            <img src={imagemUrl} alt={`Carrossel Imagem ${index + 1}`} />
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
