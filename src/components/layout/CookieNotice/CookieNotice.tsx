import React, { useState, useEffect } from "react";
import "./CookieNotice.css";
import Cookie from "../../../assets/Cookie.png";

const CookieNotice: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);


    const checkCookieAcceptance = () => {
        const alreadySeen = localStorage.getItem("cookie_notice_seen");
        return !!alreadySeen; // Retorna true se já aceitou, false se não
    };

    useEffect(() => {
        // Verificar a cada segundo se o usuário já aceitou
        const interval = setInterval(() => {
            const hasAccepted = checkCookieAcceptance();
            if (!hasAccepted && !visible) {
                setVisible(true);
            } else if (hasAccepted && visible) {
                setVisible(false);
            }
        }, 1000);

        // Verificação inicial após 2 segundos
        const timer = setTimeout(() => {
            if (!checkCookieAcceptance()) {
                setVisible(true);
            }
        }, 2000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [visible]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            localStorage.setItem("cookie_notice_seen", "true");
            setVisible(false);
            setIsClosing(false);
        }, 300);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (!visible) return null;

    return (
        <>
            {/* Aviso Principal - usando SEU CSS */}
            <div className={`cookie-consent ${isClosing ? 'cookie-closing' : ''}`}>
                <div className="cookie-content">
                    <div className="cookie-header">
                        <img src={Cookie} alt="Cookie" className="cookie-image" />
                        <div className="cookie-text">
                            <h3>Cookies Necessários</h3>
                            <p>
                                Usamos cookies essenciais para manter seu login seguro e
                                o carrinho de compras funcionando.
                            </p>
                        </div>
                    </div>

                    <div className="cookie-actions">
                        <button
                            className="btn-learn-more"
                            onClick={handleOpenModal}
                        >
                            Saber mais
                        </button>
                        <button
                            className="btn-accept"
                            onClick={handleClose}
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Detalhes */}
            {showModal && (
                <div className="cookie-modal-overlay" onClick={handleCloseModal}>
                    <div className="cookie-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="cookie-modal-header">
                            <h2>🍪 Política de Cookies</h2>
                            <button className="cookie-modal-close" onClick={handleCloseModal}>
                                ×
                            </button>
                        </div>

                        <div className="cookie-modal-body">
                            <div className="cookie-info-section">
                                <h3>Cookies que Utilizamos</h3>
                                <ul>
                                    <li><strong>Sessão de usuário</strong> - Mantém seu login seguro</li>
                                    <li><strong>Carrinho de compras</strong> - Guarda seus ingressos</li>
                                    <li><strong>Segurança</strong> - Protege contra fraudes</li>
                                    <li><strong>Preferências</strong> - Suas configurações</li>
                                </ul>
                            </div>

                            <div className="cookie-explanation">
                                <h4>Por que não pedimos consentimento?</h4>
                                <p>
                                    Estes cookies são <strong>estritamente necessários</strong>
                                    para o funcionamento da plataforma. Sem eles, não podemos
                                    fornecer nossos serviços.
                                </p>
                            </div>

                            <div className="cookie-transparency">
                                <h4>Transparência Total</h4>
                                <p>
                                    Não usamos cookies de marketing, analytics ou de terceiros.
                                    Somente o necessário para você comprar ingressos com segurança.
                                </p>
                            </div>
                        </div>

                        <div className="cookie-modal-footer">
                            <button className="btn-accept" onClick={handleCloseModal}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieNotice;