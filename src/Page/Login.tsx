import React, { useState } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithGoogle,
  signInWithFacebook
} from '../firebase';
import { sendPasswordResetEmail } from "firebase/auth";

import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import SocialButton from "../components/SocialButton/SocialButton";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/img-logo.png";
import googleIcon from "../assets/logo-google.png";
import facebookIcon from "../assets/logo-facebook.png";





import "../styles/Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [senhaError, setSenhaError] = useState<string>("");
  const [tempoBloqueado, setTempoBloqueado] = useState(100000);
  const [falhas, setFalhas] = useState<number>(() => {
    const stored = localStorage.getItem("loginFalhas");
    return stored ? parseInt(stored) : 0;
  });
  const [tentativas, setTentativas] = useState<number>(() => {
    const stored = localStorage.getItem("loginTentativas");
    return stored ? parseInt(stored) : 0;
  });
  const [bloqueado, setBloqueado] = useState<boolean>(false);
  const [tempoRestante, setTempoRestante] = useState<number>(0);


  const [showGoogleAlert, setShowGoogleAlert] = useState(false);
  const [showFacebookAlert, setShowFacebookAlert] = useState<boolean>(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [facebookError, setFacebookError] = useState<string | null>(null);



  useEffect(() => {
    const storedUnlockTime = localStorage.getItem("unlockTime");
    const now = Date.now();

    if (storedUnlockTime && parseInt(storedUnlockTime) > now) {
      setBloqueado(true);
      const timeLeft = parseInt(storedUnlockTime) - now;
      setTempoRestante(timeLeft);

      const timeout = setTimeout(() => {
        setBloqueado(false);
        setTentativas(0);
        setFalhas(prev => {
          const novo = prev + 1;
          localStorage.setItem("loginFalhas", novo.toString());
          return novo;
        });
        localStorage.removeItem("loginTentativas");
        localStorage.removeItem("unlockTime");
      }, timeLeft);

      return () => clearTimeout(timeout);
    }
  }, []);



  const navigate = useNavigate();



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "senha") setSenha(value);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowGoogleAlert(true);
      setTimeout(() => {
        setShowGoogleAlert(false);
        navigate("/Home");
      }, 2000);
    } catch (error) {
      setGoogleError("Erro ao realizar login com Google.");
      console.error(error);
      setTimeout(() => setGoogleError(null), 3000);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      setShowFacebookAlert(true);
      setTimeout(() => {
        setShowFacebookAlert(false);
        navigate("/Home");
      }, 2000);
    } catch (error) {
      setFacebookError("Erro ao realizar login com Facebook.");
      console.error(error);
      setTimeout(() => setFacebookError(null), 3000);
    }
  };

  const handleReset = async () => {
    try {
      if (!email) {
        setEmailError("Digite seu email para redefinir sua senha")
      } else {
        await sendPasswordResetEmail(auth, email)
        alert("Email de redefinição enviado!")
      }
    } catch (err) {
      alert("Erro ao enviar email de redefinição")
    }

  }

  const handleSubmit = async () => {

    if (bloqueado) {
      alert("Login temporariamente bloqueado. Tente novamente em alguns segundos.");
      return;
    }


    setEmailError("");
    setSenhaError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senhaForteRegex = /^.{6,}$/;;
    ;

    // Verificação de campos vazios
    if (!email || !senha) {
      if (!email) setEmailError("Digite seu e-mail.");
      if (!senha) setSenhaError("Digite sua senha.");
      return;
    }

    // Validação do e-mail
    if (email.length < 6 || !emailRegex.test(email)) {
      setEmailError("Digite um email válido com pelo menos 6 caracteres.");
      return;
    }

    if (!senhaForteRegex.test(senha)) {
      setSenhaError("A senha deve conter pelo menos 6 caractere.");
      return;
    }
    //Token temporarario
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);

      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem("firebaseToken", token);

      const response = await axios.get(`http://localhost:5000/api/users/me?email=${user.email}`);
      localStorage.setItem("userName", response.data.nome || user.email);

      alert('Login feito com sucesso')
      navigate("/Home");
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        setSenhaError("Senha incorreta.");
      } else if (error.code === "auth/user-not-found") {
        setEmailError("Usuário não encontrado.");
      } else {
        setSenhaError("Erro ao realizar login. Tente novamente.");
        console.error(error);
      }
    }

    setTentativas(prev => {
      const novoValor = prev + 1;
      localStorage.setItem("loginTentativas", novoValor.toString());

      if (novoValor >= 5) {
        const falhasAtual = falhas + 1;
        const minutosBloqueio = 1 * falhasAtual; // Aumenta progressivamente: 1min, 2min, 3min...

        const tempo = minutosBloqueio * 60 * 1000;
        const desbloqueio = Date.now() + tempo;

        localStorage.setItem("unlockTime", desbloqueio.toString());

        setBloqueado(true);
        setTempoRestante(tempo);
        alert(`Muitas tentativas falhas. Tente novamente em ${minutosBloqueio} minuto(s).`);

        setFalhas(falhasAtual);
      }

      return novoValor;
    });

  };

  return (
    <div className="login-container">
      <header className="header">
        <Link to="/Home">
          <img src={logo} alt="Logo" className="header-logo" />
        </Link>
      </header>
      <div className="login-content">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <div className="form-section">
          <h2 className="login-bemvido">Bem-vindo</h2>

          <h3 className="login-title">Email</h3>
          <Input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={handleChange}
          />
          <div className="login-container-error">
            {emailError && <p className="error">{emailError}</p>}
          </div>


          <h3 className="login-title">Senha</h3>
          <Input
            type="password"
            name="senha"
            placeholder="Digite sua senha"
            value={senha}
            onChange={handleChange}
          />
          <div className="login-container-error">
            {senhaError && <p className="error">{senhaError}</p>}
          </div>
          <div className="login-recuperar-senha">
            <p>Esqueceu sua senha? <a className="redefinir" href="#" onClick={handleReset}>Clique aqui!</a></p>
          </div>
          <br />
          <Button text="Entrar" color="Blue" onClick={handleSubmit} />

          <p className="ou">ou</p>

          <div className="social-login">
            <SocialButton icon={googleIcon} alt="Google" onClick={handleGoogleSignIn} />
            <SocialButton icon={facebookIcon} alt="Facebook" onClick={handleFacebookSignIn} />
          </div>

          <p>
            Ainda não tem uma conta? <Link to="/Cadastro" className="crie-conta">Crie uma!</Link>
          </p>
        </div>
      </div>

      {/* ALERTA DE LOGIN GOOGLE E FACEBOOK */}
      {showGoogleAlert && (
        <div className="login-alerta-google">
          <span className="login-check">✔</span>
          <span>Login com Google realizado com sucesso!</span>
        </div>
      )}
      {googleError && (
        <div className="login-alerta-erro-google">
          <span className="login-error-icon">⚠</span>
          <span>{googleError}</span>
        </div>
      )}

      {/* ALERTA DE LOGIN FACEBOOK */}
      {showFacebookAlert && (
        <div className="login-alerta-facebook">
          <span className="login-check">✔</span>
          <span>Login com Facebook realizado com sucesso!</span>
        </div>
      )}
      {facebookError && (
        <div className="login-alerta-erro-facebook">
          <span className="login-error-icon">⚠</span>
          <span>{facebookError}</span>
        </div>
      )}
      
    </div>
  );
};

export default Login;
