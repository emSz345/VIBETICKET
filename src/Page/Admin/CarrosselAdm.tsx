// src/pages/CarrosselAdm.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaTrashAlt } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import '../../styles/CarrosselAdm.css'; // Vamos criar este arquivo de estilo

// Supondo que as imagens do carrossel sejam do tipo string (URLs)
const CarrosselAdm: React.FC = () => {
  // Agora o estado vai armazenar as URLs das imagens que vêm do backend
  const [images, setImages] = useState<string[]>([]); 
  const navigate = useNavigate();

  // Função para buscar as imagens existentes no backend
  const fetchCarrosselImages = async () => {
      try {
          const response = await fetch('http://localhost:5000/api/carrossel'); // Endpoint para buscar imagens
          if (response.ok) {
              const data = await response.json();
              setImages(data.map((img: string) => `http://localhost:5000/uploads/carrossel/${img}`));
          }
      } catch (error) {
          console.error('Erro ao buscar imagens do carrossel:', error);
      }
  };

  // Chamada inicial para buscar as imagens quando o componente for montado
  useEffect(() => {
      fetchCarrosselImages();
  }, []);

  // Função para enviar uma nova imagem para o backend
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          const formData = new FormData();
          formData.append('image', file);

          try {
              const response = await fetch('http://localhost:5000/api/carrossel/upload', {
                  method: 'POST',
                  body: formData,
              });

              if (response.ok) {
                  // Após o upload, busca a lista atualizada de imagens
                  fetchCarrosselImages(); 
                  
              } else {
                  alert('Erro ao adicionar imagem.');
              }
          } catch (error) {
              console.error('Erro ao enviar imagem:', error);
              alert('Erro na comunicação com o servidor.');
          }
      }
  };

  // Função para remover uma imagem
  const handleRemoveImage = async (imageName: string) => {
      try {
          const response = await fetch(`http://localhost:5000/api/carrossel/delete/${imageName}`, {
              method: 'DELETE',
          });

          if (response.ok) {
              // Após a remoção, busca a lista atualizada de imagens
              fetchCarrosselImages();
              alert('Imagem removida com sucesso!');
          } else {
              alert('Erro ao remover imagem.');
          }
      } catch (error) {
          console.error('Erro ao remover imagem:', error);
          alert('Erro na comunicação com o servidor.');
      }
  };

  return (
      <div className="carrossel-adm-container">
          <header className="carrossel-adm-header">
              <button onClick={() => navigate('/painel')} className="back-button">
                  <FaArrowLeft /> Voltar
              </button>
              <h2>Gerenciamento do Carrossel</h2>
          </header>
          
          <div className="carrossel-adm-content">
              <div className="image-upload-section">
                  <h3>Trocar Imagens</h3>
                  <div className="upload-box">
                      <label htmlFor="file-upload" className="custom-file-upload">
                          <FaUpload /> Escolher Imagem
                      </label>
                      <input id="file-upload" type="file" onChange={handleImageUpload} accept="image/*" />
                  </div>
                  <p className="upload-info">Clique para adicionar novas imagens ao carrossel.</p>
              </div>

              <div className="carousel-preview-section">
                  <h3>Carrossel Atual</h3>
                  {images.length > 0 ? (
                      <div className="carousel-preview">
                          {images.map((image, index) => {
                              // Extrai o nome do arquivo para a função de remover
                              const imageName = image.substring(image.lastIndexOf('/') + 1);
                              return (
                                  <div key={index} className="image-preview-card">
                                      <img src={image} alt={`Carrossel Imagem ${index + 1}`} />
                                      <button onClick={() => handleRemoveImage(imageName)} className="remove-image-button">
                                          <FaTrashAlt />
                                      </button>
                                  </div>
                              );
                          })}
                      </div>
                  ) : (
                      <p className="no-images-message">Nenhuma imagem no carrossel. Adicione uma para começar!</p>
                  )}
              </div>
          </div>
      </div>
  );
};

export default CarrosselAdm;