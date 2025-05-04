import React, { useState } from "react";
import { 
  auth, 
  signInWithEmailAndPassword, 
  signInWithGoogle, 
  signInWithFacebook 
} from '../firebase';

import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import SocialButton from "../components/SocialButton/SocialButton";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/img-logo.png";
import googleIcon from "../assets/logo-google.png";
import facebookIcon from "../assets/logo-facebook.png";

import "../styles/Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [senhaError, setSenhaError] = useState<string>("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "senha") setSenha(value);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      alert("Login com Google bem-sucedido!");
      navigate("/Home");
    } catch (error) {
      alert("Erro ao realizar login com Google.");
      console.error(error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      alert("Login com Facebook bem-sucedido!");
      navigate("/Home");
    } catch (error) {
      alert("Erro ao realizar login com Facebook.");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
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

      alert("Login bem-sucedido!");
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
          

          <Button text="Entrar" onClick={handleSubmit} />

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
    </div>
  );
};

export default Login;
