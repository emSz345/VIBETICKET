import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import "../../styles/ResetPassword.css";

const apiUrl = process.env.REACT_APP_API_URL;

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/users/verify-reset-token/${token}`
                );

                if (response.data.valid) {
                    setTokenValid(true);
                } else {
                    setError("Token inválido ou expirado");
                }
            } catch (err) {
                setError("Erro ao verificar token");
                console.error("Erro na verificação:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            verifyToken();
        } else {
            setError("Token não fornecido");
            setLoading(false);
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setError("Preencha todos os campos");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        if (newPassword.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(`${apiUrl}/api/users/reset-password`, {
                token,
                newPassword,
            });

            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao redefinir senha");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="reset-password-container">
                <h2>Verificando token...</h2>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="reset-password-container">
                <h2>Erro na redefinição de senha</h2>
                <p className="reset-password-error-message">{error}</p>
                <p>Por favor, solicite um novo link de redefinição de senha.</p>
                <Button
                    text="Voltar para Login"
                    color="Blue"
                    onClick={() => navigate("/login")}
                />
            </div>
        );
    }

    if (success) {
        return (
            <div className="reset-password-container">
                <h2>Senha redefinida com sucesso!</h2>
                <p>Redirecionando para a página de login...</p>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                {/* Formulário no centro */}
                <form onSubmit={handleSubmit} className="reset-password-form">
                    <h2>Redefinir Senha</h2>
                    <Input
                        type="password"
                        name="newPassword"
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        hasError={!!error}
                    />
                    <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirme a nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        hasError={!!error}
                    />
                    {error && <p className="reset-password-error-message">{error}</p>}
                    <Button
                        text={submitting ? "Redefinindo..." : "Redefinir Senha"}
                        color="Blue"
                        type="submit"
                        onClick={() => {}}
                        disabled={submitting}
                    />
                </form>

                {/* Card de dicas ao lado */}
                <div className="reset-password-tips">
                    <p className="reset-password-tips-title">Atente-se para criar uma senha segura</p>
                    <div className="reset-password-tips-box">
                        <p className="reset-password-tips-subtitle">Dicas de segurança:</p>
                        <ul>
                            <li>
                                Sua senha deve conter <b>6 caracteres</b> entre letras e números.
                            </li>
                            <li>
                                Sua senha deve ter pelo menos <b>1 caractere especial</b> (Ex: !@#$%&*).
                            </li>
                            <li>
                                Sua senha <b>não deve</b> conter informações pessoais (E-mail, nome, data de nascimento).
                            </li>
                            <li>
                                <b>Anote sua senha em um local seguro</b>, você precisará dela para entrar outras vezes.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;