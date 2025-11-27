import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";
import { useAuth } from "../../Hook/AuthContext";
import { signInWithGoogle, signInWithFacebook } from '../../services/firebase';

// --- Components --- //
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import SocialButton from "../../components/ui/SocialButton/SocialButton";
import logo from "../../assets/logo.png";
import googleIcon from "../../assets/logo-google.png";
import facebookIcon from "../../assets/logo-facebook.png";
import "../../styles/Login.css";

const Login: React.FC = () => {
  // --- Estados do Formulário e UI ---
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [senhaError, setSenhaError] = useState<string>("");
  const [socialLoading, setSocialLoading] = useState(false);
  const [bloqueado, setBloqueado] = useState<boolean>(false);
  const [tempoRestante, setTempoRestante] = useState<number>(0);

  const authContext = useAuth();
  const navigate = useNavigate();

  // --- Lógica de Bloqueio --- //
  const getUnlockTime = useCallback(() => parseInt(localStorage.getItem("unlockTime") || "0"), []);
  const getFalhas = useCallback(() => parseInt(localStorage.getItem("loginFalhas") || "0"), []);
  const getTentativas = useCallback(() => parseInt(localStorage.getItem("loginTentativas") || "0"), []);

  // --- Estados do Modal --- //
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<string>("");

  // --- Função para voltar para início --- //
  const handleVoltarInicio = () => {
    navigate("/");
  };

  // --- Função para bloquear o login após múltiplas tentativas falhas --- //
  const bloquearLogin = (falhasAtualizadas: number) => {
    const minutosBloqueio = falhasAtualizadas;
    const tempoBloqueioMs = minutosBloqueio * 60 * 1000;
    const tempoDesbloqueio = Date.now() + tempoBloqueioMs;
    localStorage.setItem("unlockTime", tempoDesbloqueio.toString());
    localStorage.setItem("loginFalhas", falhasAtualizadas.toString());
    localStorage.setItem("loginTentativas", "0");
    setBloqueado(true);
    setTempoRestante(tempoBloqueioMs);
    setTimeout(() => {
      setBloqueado(false);
      setTempoRestante(0);
      localStorage.removeItem("unlockTime");
    }, tempoBloqueioMs);
    alert(`Muitas tentativas falhas. Tente novamente em ${minutosBloqueio} minuto(s).`);
  };

  // --- Função principal para realizar login local (email/senha) --- //
  const handleLocalLogin = useCallback(async () => {
    if (bloqueado) {
      alert("Login temporariamente bloqueado. Tente novamente em alguns segundos.");
      return;
    }

    setEmailError("");
    setSenhaError("");

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email || !senha) {
      if (!email) setEmailError("Digite seu e-mail.");
      if (!senha) setSenhaError("Digite sua senha.");
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Digite um email válido.");
      return;
    }
    if (senha.length < 6) {
      setSenhaError("A senha deve conter pelo menos 6 caracteres.");
      return;
    }

    try {
      const response = await api.post('/api/users/login', {
        email,
        senha,
      });

      // Extraia o token e o usuário da resposta
      const { user, token } = response.data;

      localStorage.setItem('token', token);

      authContext.login(user, token);
      navigate("/Home");

    } catch (error: any) {
      setSenhaError(error.response?.data?.message || "Erro ao fazer login local.");
      const novasTentativas = getTentativas() + 1;
      localStorage.setItem("loginTentativas", novasTentativas.toString());
      if (novasTentativas >= 5) {
        const novasFalhas = getFalhas() + 1;
        bloquearLogin(novasFalhas);
      }
    }
  }, [email, senha, bloqueado, navigate, authContext, getTentativas, getFalhas]);

  // --- Efeito para capturar tecla Enter e acionar login --- //
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !bloqueado) {
        handleLocalLogin();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [bloqueado, handleLocalLogin]);

  // --- Efeito para verificar se há bloqueio ativo ao carregar o componente --- //
  useEffect(() => {
    const unlockTime = getUnlockTime();
    const now = Date.now();
    if (unlockTime > now) {
      const restante = unlockTime - now;
      setBloqueado(true);
      setTempoRestante(restante);
      const timeout = setTimeout(() => {
        setBloqueado(false);
        setTempoRestante(0);
        localStorage.removeItem("unlockTime");
      }, restante);
      return () => clearTimeout(timeout);
    }
  }, [getUnlockTime]);

  // --- Efeito para contagem regressiva do tempo de bloqueio --- //
  useEffect(() => {
    if (!bloqueado || tempoRestante <= 0) return;
    const interval = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setBloqueado(false);
          localStorage.removeItem("unlockTime");
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [bloqueado, tempoRestante]);

  // --- Função para manipular mudanças nos campos de input --- //
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "senha") setSenha(value);
  };

  // --- Função para processar login social (Google/Facebook) --- //
  const handleSocialLogin = async (provider: 'google' | 'facebook', userData: any) => {
    setSocialLoading(true);
    try {
      if (!userData.email) {
        throw new Error("E-mail não disponível na conta social");
      }

      const response = await api.post('/api/users/social-login', {
        provider,
        userData: {
          nome: userData.displayName || "Usuário",
          email: userData.email,
          imagemPerfil: userData.photoURL || "",
        }
      });

      const { user, token } = response.data;

      localStorage.setItem('token', token);

      authContext.login(user, token);
      navigate("/Home");

    } catch (error: any) {
      console.error("Erro no login social:", error);
      alert(error.response?.data?.message || "Erro ao fazer login com " + provider);
    } finally {
      setSocialLoading(false);
    }
  };

  // --- Função específica para login com Google --- //
  const handleGoogleSignIn = async () => {
    try {
      const userData = await signInWithGoogle();
      await handleSocialLogin('google', userData);
    } catch (error) {
      console.error("Erro no login com Google:", error);
    }
  };

  // ---Função específica para login com Facebook --- //
  const handleFacebookSignIn = async () => {
    try {
      const userData = await signInWithFacebook();
      await handleSocialLogin('facebook', userData);
    } catch (error) {
      console.error("Erro no login com Facebook:", error);
      alert("Erro ao fazer login com Facebook");
    }
  };

  // --- Função para lidar com solicitação de redefinição de senha --- //
  const handleReset = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Digite seu e-mail para redefinir a senha");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Digite um email válido");
      return;
    }

    // Abre o modal de carregamento
    setShowResetModal(true);
    setResetMessage("");

    try {
      await api.post('/api/users/forgot-password', { email });

      // Atualiza para mensagem de sucesso
      setResetMessage("E-mail de redefinição enviado com sucesso! Verifique sua caixa de entrada.");

      // Fecha automaticamente após 3 segundos
      setTimeout(() => {
        setShowResetModal(false);
      }, 3000);

    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      // Fecha o modal em caso de erro
      setShowResetModal(false);
      alert(error.response?.data?.message || "Erro ao solicitar redefinição de senha");
    }
  };

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
        {/* Seção de alerta quando o login está bloqueado por tentativas excessivas */}
        {bloqueado && (
          <section className="login-bloqueado-msg">
            <p>Login bloqueado. Tente novamente em <strong>{Math.ceil(tempoRestante / 1000)}</strong> segundo(s).</p>
          </section>
        )}

        {/* Conteúdo principal do formulário de login */}
        <section className="login-content">

          {/* Cabeçalho com logo e navegação para home */}
          <header className="logo-section">
            <Link to='/Home' title="Voltar para Home">
              <img src={logo} alt="Logo" className="logo-image" />
            </Link>
          </header>

          {/* Seção do formulário de login */}
          <section className="form-section">

            {/* Título de boas-vindas */}
            <h2 className="login-bemvido">Bem-vindo</h2>

            {/* Campo de email */}
            <h3 className="login-title">Email</h3>
            <Input
              type="email"
              name="email"
              placeholder="seunome@email.com"
              value={email}
              onChange={handleChange}
            />
            <div className="login-container-error">
              {emailError && <p className="error"> {emailError} </p>}
            </div>

            {/* Campo de senha */}
            <h3 className="login-title">Senha</h3>
            <Input
              type="password"
              name="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={handleChange}
            />
            <div className="login-container-error">
              {senhaError && <p className="error"> {senhaError} </p>}
            </div>

            {/* Link para recuperação de senha */}
            <div className="login-recuperar-senha">
              <a
                href="#redefinir"
                onClick={handleReset}
                style={{
                  textDecoration: 'none',
                  fontFamily: "sans-serif",
                  color: "#0969fb",
                  fontWeight: "bolder",
                  cursor: "pointer"
                }}
              >
                Esqueci minha senha!
              </a>
            </div>

            <br />

            {/* Botão principal de login */}
            <Button
              text="Entrar"
              color="Blue"
              onClick={handleLocalLogin}
            />

            <p className="ou">ou</p>

            {/* Seção de login com redes sociais */}
            <div className="social-login">
              <SocialButton
                icon={googleIcon}
                alt="Google"
                onClick={handleGoogleSignIn}
                disabled={socialLoading}
              />
              <SocialButton
                icon={facebookIcon}
                alt="Facebook"
                onClick={handleFacebookSignIn}
                disabled={socialLoading}
              />
            </div>

            {/* Link para página de cadastro para novos usuários */}
            <p style={{ color: "#000" }}>
              Ainda não tem uma conta? <Link to="/Cadastro" className="login-crie-conta">Crie uma!</Link>
            </p>
          </section>
        </section>

        {/* Modal de redefinição de senha - aparece quando solicitado */}
        {showResetModal && (
          <footer className="login-modal-overlay">
            <div className="login-modal">
              <div className="login-modal-content">
                <div className="login-modal-icon">
                  {resetMessage ? '✓' : <div className="login-modal-spinner"></div>}
                </div>

                <h3 className="login-modal-title">
                  {resetMessage ? 'E-mail Enviado!' : 'Enviando...'}
                </h3>

                {resetMessage && <p className="login-modal-message">{resetMessage}</p>}
              </div>

              {/* Barra de progresso que aparece após o envio bem-sucedido */}
              {resetMessage && (
                <div className="login-modal-progress">
                  <div className="login-modal-progress-bar"></div>
                </div>
              )}
            </div>
          </footer>
        )}
      </main>
    </>
  );
};

export default Login;