import React, { useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api"; // USAR SEMPRE A INSTÂNCIA CONFIGURADA DO AXIOS
import { signInWithGoogle, signInWithFacebook } from "../../services/firebase";
import { useAuth } from "../../Hook/AuthContext";

// Seus componentes
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import SocialButton from "../../components/ui/SocialButton/SocialButton";
import TermosContent from '../../Page/Public/TermosContent';

// Estilos e assets
import "../../styles/Login.css";
import logo from "../../assets/logo.png";
import logo1 from "../../assets/logo-blue1.png";
import googleIcon from "../../assets/logo-google.png";
import facebookIcon from "../../assets/logo-facebook.png";

interface FormData {
  nome: string;
  email: string;
  senha: string;
  confirmSenha: string;
}

const Cadastro: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
  });

  const [termosAceitos, setTermosAceitos] = useState(false);
  const [mostrarTermos, setMostrarTermos] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  
  // Estado para a tela de "Verifique seu e-mail"
  const [aguardandoVerificacao, setAguardandoVerificacao] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // Usando a função 'login' simplificada do contexto

  const fecharModal = () => setMostrarTermos(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!termosAceitos) {
      alert("Você deve aceitar os termos e políticas para continuar.");
      return false;
    }
    if (!/^[a-zA-ZÀ-ÿ\s]{10,}$/.test(formData.nome)) {
      newErrors.nome = "É necessário inserir o seu nome completo.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email deve estar em formato válido.";
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{6,}$/.test(formData.senha)) {
      newErrors.senha = "A senha deve ter no mínimo 6 caracteres, letras, números e caractere especial.";
    }
    if (formData.confirmSenha !== formData.senha) {
      newErrors.confirmSenha = "As senhas não coincidem.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  
  // --- FLUXO DE CADASTRO LOCAL SIMPLIFICADO ---
  const handleSubmitLocal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Usamos um objeto simples para enviar como JSON, pois o backend espera 'Content-Type': 'application/json' para esta rota.
    // Se sua rota de registro espera 'FormData' (para imagem), ajuste aqui.
    const payload = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      provedor: "local",
    };

    try {
      // Usando a instância 'api'
      const response = await api.post('/api/users/register', payload);

      if (response.status === 201) {
        // Mostra a tela de sucesso pedindo para o usuário verificar o e-mail.
        setAguardandoVerificacao(true); 
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao registrar. Tente outro e-mail.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // --- FLUXO DE CADASTRO/LOGIN SOCIAL CORRIGIDO ---
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    if (!termosAceitos) {
      alert("Você deve aceitar os termos e políticas para continuar.");
      return;
    }
    setSocialLoading(true);

    try {
      let socialUserData;
      if (provider === 'google') {
        socialUserData = await signInWithGoogle();
      } else {
        socialUserData = await signInWithFacebook();
      }
      
      if (!socialUserData || !socialUserData.email) {
        throw new Error("Não foi possível obter os dados do provedor social.");
      }

      const response = await api.post('/api/users/social-login', {
        provider,
        userData: {
          nome: socialUserData.displayName || "Usuário",
          email: socialUserData.email,
          imagemPerfil: socialUserData.photoURL || "",
        }
      });
      
      const { user } = response.data; // O backend define o cookie e retorna o usuário

      // USA A FUNÇÃO CORRETA E SIMPLIFICADA DO CONTEXTO
      login(user);
      
      navigate("/Home");

    } catch (error: any) {
      console.error(`Erro no login com ${provider}:`, error);
      alert(error.response?.data?.message || `Erro ao fazer login com ${provider}`);
    } finally {
      setSocialLoading(false);
    }
  };

  // TELA DE SUCESSO PÓS-CADASTRO
  if (aguardandoVerificacao) {
    return (
      <div className="login-container">
        <div className="form-section" style={{ textAlign: 'center' }}>
          <img src={logo1} alt="Logo" className="logo-image" style={{ marginBottom: '2rem' }} />
          <h2 className="login-bemvido">Cadastro realizado!</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>
            Enviamos um link de verificação para o seu e-mail: <br />
            <strong style={{ color: "#0969fb" }}>{formData.email}</strong>
          </p>
          <p style={{ marginTop: '1.5rem' }}>
            Por favor, clique no link para ativar sua conta e depois <br/>
            <Link to="/login" className="crie-conta">faça o login</Link>.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '2rem' }}>
            Não recebeu? Verifique sua caixa de spam.
          </p>
        </div>
      </div>
    );
  }

  // TELA PADRÃO DE CADASTRO
  return (
    <div className="login-container">
      <div className="login-content">
        <div className="logo-section">
          <Link to='/Home' title="Voltar para Home">
            <img src={logo} alt="Logo" className="logo-image" />
          </Link>
        </div>

        <div className="form-section">
          <h2 className="login-bemvido">Seja Bem-vindo</h2>
          <form onSubmit={handleSubmitLocal}>
            <h3 className="login-title">Nome completo</h3>
            <Input name="nome" type="text" value={formData.nome} onChange={handleChange} placeholder="Digite seu nome completo" hasError={!!errors.nome} />
            {errors.nome && <p className="error">{errors.nome}</p>}
            
            <h3 className="login-title">Email</h3>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="seu-email@gmail.com" hasError={!!errors.email} />
            {errors.email && <p className="error">{errors.email}</p>}
            
            <h3 className="login-title">Crie uma senha</h3>
            <Input name="senha" type="password" value={formData.senha} onChange={handleChange} placeholder="Crie uma senha forte" hasError={!!errors.senha} />
            {errors.senha && <p className="error">{errors.senha}</p>}
            
            <h3 className="login-title">Confirmar senha</h3>
            <Input name="confirmSenha" type="password" value={formData.confirmSenha} onChange={handleChange} placeholder="Confirme sua senha" hasError={!!errors.confirmSenha} />
            {errors.confirmSenha && <p className="error">{errors.confirmSenha}</p>}

            <div className="radio-container">
              <label className="termos-label">
                <input type="checkbox" className="checkbox-ajustado" checked={termosAceitos} onChange={(e) => setTermosAceitos(e.target.checked)} />
                <span className="link" onClick={() => setMostrarTermos(true)}>
                  Eu concordo com os termos & políticas
                </span>
              </label>
              {mostrarTermos && (
                <div className="modal">
                  <div className="modal-content">
                    <button className="close-button" onClick={fecharModal}>&times;</button>
                    <TermosContent onClose={fecharModal} />
                  </div>
                </div>
              )}
            </div>

            <Button color="Blue" type="submit" text="Criar minha conta" loading={loading} disabled={loading} />
          </form>

          <p className="ou">ou</p>
          <div className="social-login">
            <SocialButton icon={googleIcon} alt="Google" onClick={() => handleSocialLogin('google')} disabled={socialLoading} />
            <SocialButton icon={facebookIcon} alt="Facebook" onClick={() => handleSocialLogin('facebook')} disabled={socialLoading} />
          </div>

          <p>Já possui uma conta? <Link to="/login" className="crie-conta">Faça login!</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;