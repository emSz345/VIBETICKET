import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import "../../styles/AdicionarAdm.css"; // Vamos criar este arquivo de CSS depois

const apiUrl = process.env.REACT_APP_API_URL;

const PromoverAdmin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const navigate = useNavigate();

    const handlePromoverAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${apiUrl}/api/auth/promover-admin`, {
                method: 'PATCH', // Usamos PATCH para atualizar um recurso
                headers: {
                    'Content-Type': 'application/json',
                    // Pode ser necessário incluir um token de autenticação aqui, se o seu backend exigir
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Usuário promovido a administrador com sucesso!');
                setEmail('');
            } else {
                setError(data.message || 'Erro ao promover o usuário. Verifique se o e-mail está correto.');
            }
        } catch (err) {
            console.error('Erro na requisição:', err);
            setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="promover-admin-container">
            <header className="promover-admin-header">
                <button style={{display:"flex", position:"absolute", left:"40px", top:"40px"}} onClick={() => navigate(-1)} className="back-button">
                    <FaArrowLeft /> Voltar
                </button>
                <h2>Promover a Administrador</h2>
            </header>

            <form onSubmit={handlePromoverAdmin} className="promover-admin-form">
                <p>Digite o e-mail da conta que você deseja promover para administrador.</p>
                <div className="form-group">
                    <label htmlFor="email">E-mail do Usuário:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? 'Promovendo...' : 'Promover'}
                </button>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
};

export default PromoverAdmin;