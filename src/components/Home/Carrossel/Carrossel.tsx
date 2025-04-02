import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "./Carrossel.css"; 
import logo1 from "../../../assets/img1.png";

const CarrosselEventos = () => {
  return (
    <div className="carrossel-container">
      <Swiper
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={logo1} alt="Evento 1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={logo1} alt="Evento 2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={logo1} alt="Evento 3" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default CarrosselEventos;
