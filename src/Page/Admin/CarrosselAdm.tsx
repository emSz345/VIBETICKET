// src/pages/CarrosselAdm.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaTrashAlt, FaPlus } from 'react-icons/fa';
import '../../styles/CarrosselAdm.css';

const apiUrl = process.env.REACT_APP_API_URL;

const CarrosselAdm: React.FC = () => {
    const [eventosAprovados, setEventosAprovados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [_doadoresPendentes, setDoadoresPendentes] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const navigate = useNavigate();

    const fetchCarrosselImages = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/carrossel`);
            if (response.ok) {
                const data = await response.json();
                setImages(data.map((img: string) => `${apiUrl}/uploads/carrossel/${img}`));
            }
        } catch (error) {
            console.error('Erro ao buscar imagens do carrossel:', error);
        }
    };

    useEffect(() => {
        fetchEventosAprovados();
        fetchCarrosselImages();
        fetchDoadoresPendentes();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch(`${apiUrl}/api/carrossel/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    fetchCarrosselImages();
                } else {
                    console.log("Erro ao adicionar imagem")
                }
            } catch (error) {
                console.error('Erro ao enviar imagem:', error);
                alert('Erro na comunicação com o servidor.');
            }
        }
    };

    const fetchEventosAprovados = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/api/eventos/aprovados-carrossel`);
            if (response.ok) {
                const data = await response.json();
                setEventosAprovados(data);
            }
        } catch (error) {
            console.error('Erro ao buscar eventos aprovados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEventoToCarrossel = async (evento: any) => {
        try {
            let imageUrl = evento.imagem;
            if (!imageUrl.startsWith('http')) {
                imageUrl = `${apiUrl}/uploads/${imageUrl}`;
            }

            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

            const blob = await response.blob();
            const fileExtension = imageUrl.split('.').pop() || 'jpg';
            const fileName = `evento_${evento._id}_${Date.now()}.${fileExtension}`;
            const file = new File([blob], fileName, { type: blob.type });

            const formData = new FormData();
            formData.append('image', file);

            const uploadResponse = await fetch(`${apiUrl}/api/carrossel/upload`, {
                method: 'POST',
                body: formData,
            });

            if (uploadResponse.ok) {
                fetchCarrosselImages();
                alert('Evento adicionado ao carrossel com sucesso!');
            } else {
                throw new Error('Falha no upload da imagem');
            }
        } catch (error) {
            console.error('Erro ao adicionar evento ao carrossel:', error);
            alert('Não foi possível adicionar o evento ao carrossel.');
        }
    };

    const fetchDoadoresPendentes = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/eventos/doadores/pendentes`);
            if (response.ok) {
                const data = await response.json();
                setDoadoresPendentes(data);
            }
        } catch (error) {
            console.error('Erro ao buscar doadores pendentes:', error);
        }
    };

    const handleRemoveImage = async (imageName: string) => {
        try {
            const response = await fetch(`${apiUrl}/api/carrossel/delete/${imageName}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchCarrosselImages();
            } else {
                console.log("Erro ao remover imagem");
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

            <div className="carrossel-adm-sections">
                <div className="carrossel-adm-content">
                    <div className="upload-section-container">
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
                    </div>

                    <div className="carousel-section-container">
                        <div className="carousel-preview-section">
                            <h3>Carrossel Atual</h3>
                            {images.length > 0 ? (
                                <div className="carousel-preview">
                                    {images.map((image, index) => {
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

                <div className="eventos-section-container">
                    <div className="eventos-aprovados-section">
                        <h3>Eventos Aprovados</h3>
                        {loading ? (
                            <p className="loading-message">Carregando eventos...</p>
                        ) : eventosAprovados.length > 0 ? (
                            <div className="eventos-aprovados-list">
                                {eventosAprovados.map((evento) => (
                                    <div key={evento._id} className="evento-card">
                                        <img
                                            src={`${apiUrl}/uploads/${evento.imagem}`}
                                            alt={evento.nome}
                                            className="evento-image"
                                        />
                                        <div className="evento-info">
                                            <h4 className="evento-nome">{evento.nome}</h4>
                                            <p className="evento-criador">Por: {evento.criadoPor?.nome}</p>
                                            <p className="evento-categoria">{evento.categoria}</p>
                                        </div>
                                        <div className="evento-actions">
                                            <button
                                                onClick={() => handleAddEventoToCarrossel(evento)}
                                                className="btn-adicionar-carrossel"
                                            >
                                                <FaPlus /> Adicionar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-eventos-message">Nenhum evento aprovado encontrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarrosselAdm;