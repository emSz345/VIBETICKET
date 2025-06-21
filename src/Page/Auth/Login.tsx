import React, { useState } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithGoogle,
  signInWithFacebook
} from '../../services/firebase';
import { sendPasswordResetEmail } from "firebase/auth";

import Input from "../../components/ui/Input/Input"
import Button from "../../components/ui/Button/Button";
import SocialButton from "../../components/ui/SocialButton/SocialButton";
import axios from "axios";
import { Link, Links, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../../assets/logo.png";
import googleIcon from "../../assets/logo-google.png";
import facebookIcon from "../../assets/logo-facebook.png";

import "../../styles/Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [senhaError, setSenhaError] = useState<string>("");
  const modoLocal = true;
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


  const getUnlockTime = () => parseInt(localStorage.getItem("unlockTime") || "0");
  const getFalhas = () => parseInt(localStorage.getItem("loginFalhas") || "0");
  const getTentativas = () => parseInt(localStorage.getItem("loginTentativas") || "0");

  const bloquearLogin = (falhasAtualizadas: number) => {
    const minutosBloqueio = falhasAtualizadas; // 1 min por falha consecutiva
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
  }, []);

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
    const senhaForteRegex = /^.{6,}$/;

    if (!email || !senha) {
      if (!email) setEmailError("Digite seu e-mail.");
      if (!senha) setSenhaError("Digite sua senha.");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Digite um email válido.");
      return;
    }

    if (!senhaForteRegex.test(senha)) {
      setSenhaError("A senha deve conter pelo menos 6 caracteres.");
      return;
    }

    try {
      if (modoLocal) {
        // LOGIN LOCAL
        const response = await axios.post("http://localhost:5000/api/users/login", {
          email,
          senha,
        });

        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.nome);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("imagemPerfil", user.imagemPerfil || "");

        navigate("/Home");
      } else {
        // LOGIN COM FIREBASE
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        const token = await user.getIdToken();
        const uid = user.uid;

        localStorage.setItem("firebaseToken", token);

        const response = await axios.get(`http://localhost:5000/api/users/me?email=${user.email}`);
        localStorage.setItem("userName", response.data.nome || user.email);
        localStorage.setItem("id", uid);

        navigate("/Home");
      }
    } catch (error: any) {
      if (modoLocal) {
        setSenhaError(error.response?.data?.message || "Erro ao fazer login local.");
      } else {
        if (error.code === "auth/wrong-password") {
          setSenhaError("Senha incorreta.");
        } else if (error.code === "auth/user-not-found") {
          setEmailError("Usuário não encontrado.");
        } else {
          setSenhaError("Erro ao realizar login. Tente novamente.");
        }
      }

      const novasTentativas = getTentativas() + 1;
      localStorage.setItem("loginTentativas", novasTentativas.toString());
      setTentativas(novasTentativas);

      if (novasTentativas >= 5) {
        const novasFalhas = getFalhas() + 1;
        setFalhas(novasFalhas);
        bloquearLogin(novasFalhas);
      }
    }
  };


  return (
    <div className="login-container">
      {bloqueado && (
        <div className="login-bloqueado-msg">
          <p>
            Login bloqueado. Tente novamente em{" "}
            <strong>{Math.ceil(tempoRestante / 1000)}</strong> segundo(s).
          </p>
        </div>
      )}
      <div className="login-content">
        <div className="logo-section">
          <Link to='/Home' title="Voltar para Home">
            <img src={logo} alt="Logo" className="logo-image" />
          </Link>
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
