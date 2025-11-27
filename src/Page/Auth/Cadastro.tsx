import React, { useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";
import { signInWithGoogle, signInWithFacebook } from "../../services/firebase";
import { useAuth } from "../../Hook/AuthContext";

import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import SocialButton from "../../components/ui/SocialButton/SocialButton";
import TermosContent from '../../Page/Public/TermosContent';
import "../../styles/Termos.css";

import "../../styles/Login.css";
import logo from "../../assets/logo.png";
import logo1 from "../../assets/logoEmail.png";
import googleIcon from "../../assets/logo-google.png";
import facebookIcon from "../../assets/logo-facebook.png";
import IndicadorSenha from "../../components/ui/IndicadorSenha/IndicadorSenha";

interface FormData {
  nome: string;
  email: string;
  senha: string;
  confirmSenha: string;
}

const Cadastro: React.FC = () => {
  // --- Estados do Formulário ---
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
  const [aguardandoVerificacao, setAguardandoVerificacao] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // --- Função para voltar para início --- //
  const handleVoltarInicio = () => {
    navigate("/");
  };

  // --- Função para fechar o modal de termos --- //
  const fecharModal = () => setMostrarTermos(false);

  // --- Função de validação do formulário --- //
  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!termosAceitos) {
      alert("Você deve aceitar os termos e políticas para continuar.");
      return false;
    }
    if (!/^[a-zA-ZÀ-ÿ\s]{2,50}$/.test(formData.nome.trim())) {
      newErrors.nome = "Nome deve conter apenas letras";
    }
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(formData.email)) {
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

  // --- Função para manipular mudanças nos campos do formulário --- //
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // --- Função principal para envio do formulário de cadastro local --- //
  const handleSubmitLocal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const payload = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      provedor: "local",
    };

    try {
      const response = await api.post('/api/users/register', payload);

      if (response.status === 201) {
        setAguardandoVerificacao(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao registrar. Tente outro e-mail.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- Função para processar cadastro/login social (Google/Facebook) --- //
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

      const { user, token } = response.data;

      // SALVAR O TOKEN NO LOCAL STORAGE
      localStorage.setItem('token', token);

      login(user, token);
      navigate("/Home");

    } catch (error: any) {
      console.error(`Erro no login com ${provider}:`, error);
      alert(error.response?.data?.message || `Erro ao fazer login com ${provider}`);
    } finally {
      setSocialLoading(false);
    }
  };

  // Tela de confirmação de email
  if (aguardandoVerificacao) {
    return (
      <>
        {/* Botão Voltar para Início no canto superior esquerdo */}
        <div 
          className="login-voltarParaInicio"
          onClick={handleVoltarInicio}
          onKeyPress={(e) => e.key === 'Enter' && handleVoltarInicio()}
          role="button"
          tabIndex={0}
        >
          <FaArrowLeft className="voltarParaInicio-icon" />
          <span className="voltarParaInicio-text">Voltar para tela inicial</span>
        </div>

        <main className="login-container">
          <section className="form-section" style={{ textAlign: 'center' }}>
            <img src={logo1} alt="Logo" className="logo-imageEmail" style={{ marginBottom: '2rem' }} />
            <h2 className="login-bemvido">Cadastro realizado!</h2>
            <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>
              Enviamos um link de verificação para o seu e-mail: <br />
              <strong style={{ color: "#0969fb" }}>{formData.email}</strong>
            </p>
            <p style={{ marginTop: '1.5rem' }}>
              Por favor, clique no link para ativar sua conta e depois <br />
              <Link to="/login" className="login-crie-conta">faça o login</Link>.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '2rem' }}>
              Não recebeu? Verifique sua caixa de spam.
            </p>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Botão Voltar para Início no canto superior esquerdo */}
      <div 
        className="login-voltarParaInicio"
        onClick={handleVoltarInicio}
        onKeyPress={(e) => e.key === 'Enter' && handleVoltarInicio()}
        role="button"
        tabIndex={0}
      >
        <FaArrowLeft className="login-voltarParaInicio-icon" />
        <span className="login-voltarParaInicio-text">Voltar para tela inicial</span>
      </div>

      <main className="login-container">
        {/* Seção principal do cadastro */}
        <section className="login-content">

          {/* Cabeçalho com logo e link para home */}
          <header className="logo-section">
            <Link to='/Home' title="Voltar para Home">
              <img src={logo} alt="Logo" className="logo-image" />
            </Link>
          </header>

          {/* Seção do formulário de cadastro */}
          <section className="form-section">
            <h2 className="login-bemvido">Seja Bem-vindo</h2>

            {/* Formulário principal de cadastro local */}
            <form onSubmit={handleSubmitLocal}>

              {/* Campo: Nome completo */}
              <h3 className="login-title">Nome completo</h3>
              <Input
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                hasError={!!errors.nome}
              />
              <div className="login-container-error">
                {errors.nome && <p className="error">{errors.nome}</p>}
              </div>

              {/* Campo: Email */}
              <h3 className="login-title">Email</h3>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seunome@email.com"
                hasError={!!errors.email}
              />
              <div className="login-container-error">
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              {/* Campo: Senha com indicador de força */}
              <h3 className="login-title">Crie uma senha</h3>
              <Input
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Crie uma senha forte"
                hasError={!!errors.senha}
              />
              {/* Componente que mostra a força da senha em tempo real */}
              <IndicadorSenha password={formData.senha} />

              {/* Campo: Confirmação de senha */}
              <h3 className="login-title">Confirmar senha</h3>
              <Input
                name="confirmSenha"
                type="password"
                value={formData.confirmSenha}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                hasError={!!errors.confirmSenha}
              />
              <div className="login-container-error">
                {errors.confirmSenha && <p className="error">{errors.confirmSenha}</p>}
              </div>

              {/* Seção de aceitação dos termos e políticas */}
              <div className="radio-container">
                <label className="termos-label">
                  <input
                    type="checkbox"
                    className="checkbox-ajustado"
                    onClick={() => setMostrarTermos(true)}
                    checked={termosAceitos}
                    onChange={(e) => setTermosAceitos(e.target.checked)}
                  />
                  <span className="link" onClick={() => setMostrarTermos(true)}>
                    Eu concordo com os termos & políticas
                  </span>
                </label>

                {/* Modal de termos e condições - aparece quando clicado */}
                {mostrarTermos && (
                  <footer className="modal-overlay">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h3>Termos de Uso</h3>
                      </div>
                      
                      <button className="close-button" onClick={fecharModal}>&times;</button>
                      
                      <div className="modal-body">
                        <TermosContent onClose={fecharModal} />
                      </div>
                      
                      <div className="modal-footer">
                        <p style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
                          Ao clicar em "Concordo", você aceita nossos termos e condições
                        </p>
                      </div>
                    </div>
                  </footer>
                )}
              </div>

              {/* Botão de submissão do formulário */}
              <Button
                color="Blue"
                type="submit"
                text="Criar minha conta"
                loading={loading}
                disabled={loading}
              />
            </form>

            {/* Separador visual para login social */}
            <p className="ou">ou</p>

            {/* Seção de login com redes sociais */}
            <div className="social-login">
              <SocialButton
                icon={googleIcon}
                alt="Google"
                onClick={() => handleSocialLogin('google')}
                disabled={socialLoading}
              />
              <SocialButton
                icon={facebookIcon}
                alt="Facebook"
                onClick={() => handleSocialLogin('facebook')}
                disabled={socialLoading}
              />
            </div>

            {/* Link para página de login para usuários já cadastrados */}
            <p style={{ color: "#000" }}>
              Já possui uma conta? <Link to="/login" className="login-crie-conta">Faça login!</Link>
            </p>
          </section>
        </section>
      </main>
    </>
  );
};

export default Cadastro;