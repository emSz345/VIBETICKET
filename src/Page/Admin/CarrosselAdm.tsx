// src/pages/CarrosselAdm.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaTrashAlt, FaPlus, FaCheck } from 'react-icons/fa';
import '../../styles/CarrosselAdm.css';

const apiUrl = process.env.REACT_APP_API_URL;

interface CarrosselImage {
  filename: string;
  eventoId?: string;
}

const CarrosselAdm: React.FC = () => {
    const [eventosAprovados, setEventosAprovados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<CarrosselImage[]>([]);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const fetchCarrosselImages = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/carrossel`);
            if (response.ok) {
                const data: CarrosselImage[] = await response.json();
                setImages(data);
            }
        } catch (error) {
            console.error('Erro ao buscar imagens do carrossel:', error);
        }
    };

    useEffect(() => {
        fetchEventosAprovados();
        fetchCarrosselImages();
    }, []);

    useEffect(() => {
        if (showModal) {
            const timer = setTimeout(() => {
                setShowModal(false);
            }, 900);
            return () => clearTimeout(timer);
        }
    }, [showModal]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            
            // Verificar limite de imagens
            if (images.length >= 10) {
                alert(`Limite de 10 imagens no carrossel atingido. Remova algumas imagens antes de adicionar novas.`);
                e.target.value = '';
                return;
            }

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch(`${apiUrl}/api/carrossel/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    fetchCarrosselImages();
                    setModalMessage('Imagem adicionada com sucesso!');
                    setShowModal(true);
                    e.target.value = '';
                } else {
                    if (response.status === 400 || response.status === 413) {
                        alert('Limite de imagens atingido ou arquivo muito grande. Remova algumas imagens antes de adicionar novas.');
                    } else {
                        alert('Erro ao adicionar imagem.');
                    }
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
            // Verificar limite antes de adicionar
            if (images.length >= 10) {
                alert(`Limite de 10 imagens no carrossel atingido. Remova algumas imagens antes de adicionar novas.`);
                return;
            }
            
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
            formData.append('eventoId', evento._id);

            const uploadResponse = await fetch(`${apiUrl}/api/carrossel/upload`, {
                method: 'POST',
                body: formData,
            });

            if (uploadResponse.ok) {
                fetchCarrosselImages();
                setModalMessage('Evento adicionado ao carrossel com sucesso!');
                setShowModal(true);
            } else {
                if (uploadResponse.status === 400 || uploadResponse.status === 413) {
                    alert('Limite de imagens atingido. Remova algumas imagens antes de adicionar novas.');
                } else {
                    throw new Error('Falha no upload da imagem');
                }
            }
        } catch (error) {
            console.error('Erro ao adicionar evento ao carrossel:', error);
            alert('Não foi possível adicionar o evento ao carrossel.');
        }
    };

    const handleRemoveImage = async (imageName: string) => {
        try {
            const encodedImageName = encodeURIComponent(imageName);
            const response = await fetch(`${apiUrl}/api/carrossel/delete/${encodedImageName}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchCarrosselImages();
                setModalMessage('Imagem removida com sucesso!');
                setShowModal(true);
            } else {
                const errorData = await response.json();
                alert(`Erro ao remover imagem: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro ao remover imagem:', error);
            alert('Erro na comunicação com o servidor.');
        }
    };

    // Função para mostrar status do limite
    const getLimitStatus = () => {
        const current = images.length;
        const limit = 10;
        
        if (current >= limit) {
            return { status: 'full', message: `Limite atingido (${current}/${limit})` };
        } else if (current >= limit - 2) {
            return { status: 'warning', message: `Quase no limite (${current}/${limit})` };
        } else {
            return { status: 'ok', message: `${current}/${limit} imagens` };
        }
    };

    return (
        <div className="carrossel-adm-container">
            {showModal && (
                <div className="carrossel-modal-overlay">
                    <div className="carrossel-modal">
                        <div className="carrossel-modal-content">
                            <FaCheck className="carrossel-modal-icon" />
                            <p className="carrossel-modal-message">{modalMessage}</p>
                        </div>
                    </div>
                </div>
            )}

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
                            
                            <div className={`limit-indicator limit-${getLimitStatus().status}`}>
                                {getLimitStatus().message}
                            </div>
                            
                            <div className="upload-box">
                                <label htmlFor="file-upload" className="custom-file-upload">
                                    <FaUpload /> Escolher Imagem
                                </label>
                                <input 
                                    id="file-upload" 
                                    type="file" 
                                    onChange={handleImageUpload} 
                                    accept="image/*" 
                                />
                            </div>
                            <p className="upload-info">Clique para adicionar novas imagens ao carrossel.</p>
                        </div>
                    </div>

                    <div className="carousel-section-container">
                        <div className="carousel-preview-section">
                            <h3>Carrossel Atual</h3>
                            {images.length > 0 ? (
                                <div className="carousel-preview">
                                    {images.map((image, index) => (
                                        <div key={index} className="image-preview-card">
                                            <img 
                                                src={`${apiUrl}/uploads/carrossel/${image.filename}`} 
                                                alt={`Carrossel Imagem ${index + 1}`} 
                                            />
                                            <button onClick={() => handleRemoveImage(image.filename)} className="remove-image-button">
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    ))}
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
                                                disabled={images.length >= 10}
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