import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import "../../styles/ResetPassword.css";

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false); // estado para loading do botão
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/users/verify-reset-token/${token}`
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

        setSubmitting(true); // inicia loading do botão
        try {
            await axios.post(
                "http://localhost:5000/api/users/reset-password",
                { token, newPassword }
            );
            
            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao redefinir senha");
        } finally {
            setSubmitting(false); // encerra loading
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
                <p className="error-message">{error}</p>
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
            <h2>Redefinir Senha</h2>
            <form onSubmit={handleSubmit}>
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
                {error && <p className="error-message">{error}</p>}
                <Button 
                    text={submitting ? "Redefinindo..." : "Redefinir Senha"}
                    color="Blue"
                    onClick={() => {}}
                    disabled={submitting}
                />
            </form>
        </div>
    );
};

export default ResetPassword;