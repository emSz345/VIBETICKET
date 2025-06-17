import React, { useState, ChangeEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithGoogle, signInWithFacebook } from "../../services/firebase";

import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import SocialButton from "../../components/ui/SocialButton/SocialButton";
import TermosContent from '../../Page/Public/TermosContent';

import "../../styles/Login.css";
import logo from "../../assets/logo.png";
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
  const [imagemPerfil, setImagemPerfil] = useState<File | null>(null);
  const [mostrarTermos, setMostrarTermos] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const navigate = useNavigate();

  // NOVO: Estados para controlar o fluxo de verificação
  const [aguardandoVerificacao, setAguardandoVerificacao] = useState(false);
  const [emailParaVerificar, setEmailParaVerificar] = useState('');

  const fecharModal = () => {
    setMostrarTermos(false);
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!termosAceitos) {
      alert("Você deve aceitar os termos e políticas para continuar.");
      return false;
    }
    // ... (suas outras validações continuam iguais)
    if (!/^[a-zA-ZÀ-ÿ\s]{10,}$/.test(formData.nome)) {
      newErrors.nome = "Nome deve conter pelo menos 10 letras e nenhum número.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) || formData.email.length < 10) {
      newErrors.email = "Email deve estar em formato válido e conter pelo menos 10 caracteres.";
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{6,}$/.test(formData.senha)) {
      newErrors.senha = "A senha deve ter no mínimo 6 caracteres e conter letras, números e caractere special.";
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

  // ALTERADO: Lógica de envio do formulário de cadastro
  const handleSubmitLocal = async () => {
    if (!validate()) return;

    const { nome, email, senha } = formData;
    const formDataToSend = new FormData();
    formDataToSend.append("nome", nome);
    formDataToSend.append("email", email);
    formDataToSend.append("senha", senha);
    formDataToSend.append("provedor", "local");
    if (imagemPerfil) {
      formDataToSend.append("imagemPerfil", imagemPerfil);
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        // Exibe a mensagem de erro do backend (ex: "E-mail já em uso")
        alert(data.message || "Erro ao registrar no servidor.");
        return;
      }

      // Se o cadastro foi bem-sucedido (status 201), iniciamos o modo de espera
      if (response.status === 201) {
        setEmailParaVerificar(email); // Guarda o e-mail para a verificação
        setAguardandoVerificacao(true); // Ativa a tela de "Aguardando verificação"
      }

    } catch (error) {
      alert("Erro de conexão com o servidor.");
      console.error(error);
    }
  };

  // NOVO: Efeito que verifica o status do e-mail em intervalos regulares
  useEffect(() => {
    // Só executa se estivermos aguardando verificação
    if (!aguardandoVerificacao) return;

    // Inicia um "poller" que vai checar o status do usuário a cada 5 segundos
    const intervalId = setInterval(async () => {
      try {
        const statusResponse = await fetch(`http://localhost:5000/api/users/me?email=${emailParaVerificar}`);
        const userData = await statusResponse.json();

        // Se o backend confirmar que o usuário foi verificado...
        if (userData && userData.isVerified) {
          clearInterval(intervalId); // Para de verificar

          // ...agora fazemos o login para obter o token
          const loginResponse = await fetch("http://localhost:5000/api/users/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, senha: formData.senha }),
          });
          
          const loginData = await loginResponse.json();

          if (!loginResponse.ok) {
            alert(loginData.message || "Erro ao fazer login após verificação.");
            setAguardandoVerificacao(false); // Volta para a tela de cadastro
            return;
          }

          // Login bem-sucedido, salva os dados e navega
          localStorage.setItem("userName", loginData.user.nome);
          localStorage.setItem("email", loginData.user.email);
          localStorage.setItem("imagemPerfil", loginData.user.imagemPerfil);
          localStorage.setItem("id", loginData.user._id);
          localStorage.setItem("token", loginData.token);

          navigate("/Home");
        }
      } catch (error) {
        console.error("Erro ao verificar status do usuário:", error);
      }
    }, 5000); // Verifica a cada 5 segundos

    // Função de limpeza: para o intervalo se o componente for desmontado
    return () => clearInterval(intervalId);
  }, [aguardandoVerificacao, emailParaVerificar, formData.email, formData.senha, navigate]);

  // NOVO: Renderização condicional da tela de espera
  if (aguardandoVerificacao) {
    return (
      <div className="login-container">
        <div className="form-section" style={{ textAlign: 'center' }}>
          <img src={logo} alt="Logo" className="logo-image" style={{ marginBottom: '2rem' }} />
          <h2 className="login-bemvido">Quase lá!</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>
            Enviamos um link de verificação para o seu e-mail: <br />
            <strong>{emailParaVerificar}</strong>
          </p>
          <p style={{ marginTop: '1.5rem' }}>
            Por favor, clique no link para ativar sua conta. <br />
            Assim que você verificar, faremos seu login automaticamente.
          </p>
          <div className="loader" style={{ margin: '2rem auto' }}></div>
          <p style={{ fontSize: '0.9rem', color: '#999' }}>
            Não recebeu? Verifique sua caixa de spam.
          </p>
        </div>
      </div>
    );
  }

  // Renderização padrão do formulário de cadastro
  return (
    <div className="login-container">
      {/* ... seu JSX do formulário continua exatamente o mesmo aqui ... */}
      <div className="login-content">
        <div className="logo-section">
          <Link to='/Home' title="Voltar para Home">
           <img src={logo} alt="Logo" className="logo-image" />
          </Link>
        </div>

        <div className="form-section">
          <h2 className="login-bemvido">Seja Bem-vindo</h2>

          {/* --- NOME --- */}
          <h3 className="login-title">Nome completo</h3>
          <Input
            type="text"
            placeholder="Digite seu nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            isValid={formData.nome.length >= 10 && !errors.nome}
            hasError={!!errors.nome}
          />
          <div className="login-container-error">
            {errors.nome ? (
              <p className="error">{errors.nome}</p>
            ) : (
              <span className="password-hint">Nome deve conter pelo menos 10 letras e nenhum número.</span>
            )}
          </div>

          {/* --- EMAIL --- */}
          <h3 className="login-title">Email</h3>
          <Input
            type="email"
            placeholder="seu-email@gmail.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isValid={formData.email.includes("@") && !errors.email}
            hasError={!!errors.email}
          />
          <div className="login-container-error">
            {errors.email ? (
               <p className="error">{errors.email}</p>
            ) : (
               <span className="password-hint">Email deve estar em formato válido e conter pelo menos 10 caracteres.</span>
            )}
          </div>

          {/* --- SENHA --- */}
          <h3 className="login-title">Crie uma senha</h3>
          <Input
            type="password"
            placeholder="Crie uma senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            isValid={formData.senha.length >= 6 && !errors.senha}
            hasError={!!errors.senha}
          />
          <div className="login-container-error">
            {errors.senha ? (
               <p className="error">{errors.senha}</p>
            ) : (
               <span className="password-hint">A senha deve ter no mínimo 6 caracteres e conter letras, números e caractere special.</span>
            )}
          </div>

          {/* --- CONFIRMAR SENHA --- */}
          <h3 className="login-title">Confirmar senha</h3>
          <Input
            type="password"
            placeholder="Confirme sua senha"
            name="confirmSenha"
            value={formData.confirmSenha}
            onChange={handleChange}
            isValid={
              formData.confirmSenha === formData.senha &&
              formData.confirmSenha.length >= 6 &&
              !errors.confirmSenha
            }
            hasError={!!errors.confirmSenha}
          />
          <div className="login-container-error" >
            {errors.confirmSenha && <p className="error">{errors.confirmSenha}</p>}
          </div>

          <div className="radio-container">
            <label className="termos-label">
              <input
                type="checkbox"
                className="checkbox-ajustado"
                checked={termosAceitos}
                onChange={(e) => {
                  setTermosAceitos(e.target.checked);
                  if (e.target.checked) setMostrarTermos(true);
                }}
              />
              <span>
                Eu concordo com os <span className="link">termos & políticas</span>
              </span>
            </label>

            {mostrarTermos && (
              <div className="modal">
                <div className="modal-content">
                  <button className="close-button" onClick={fecharModal}></button>
                  <TermosContent onClose={fecharModal} />
                </div>
              </div>
            )}
          </div>

          <Button color="Blue" text="criar minha conta" onClick={handleSubmitLocal} />

          <p className="ou">ou</p>

          <div className="social-login">
            <SocialButton icon={googleIcon} alt="Google" onClick={signInWithGoogle} />
            <SocialButton icon={facebookIcon} alt="Facebook" onClick={signInWithFacebook} />
          </div>

          <p>
            Já possui uma conta? <Link to="/Login" className="crie-conta">Faça login!</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;