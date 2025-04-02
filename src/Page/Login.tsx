
import React, { useState } from "react";
import { auth, signInWithEmailAndPassword } from '../firebase'; // Importe a função de login do Firebase
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import SocialButton from "../components/SocialButton/SocialButton";
import Header from "../components/Header/Header";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img-logo.png";
import googleIcon from "../assets/logo-google.png";
import appleIcon from "../assets/logo-apple.png";
import facebookIcon from "../assets/logo-facebook.png";
import { signInWithGoogle } from '../firebase';
import { signInWithFacebook } from "../firebase";
import "../styles/Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const navigate = useNavigate(); 

  // Função de manipulação de alteração dos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "senha") {
      setSenha(value);
    }
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
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      console.log("Login bem-sucedido!", user);
      alert("Login bem-sucedido!");
      navigate("/Home"); 
    } catch (error: any) {
      alert(`Erro ao realizar login. Código: ${error.code}, Mensagem: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <Header />
      <div className="login-content">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <div className="form-section">
          <h2 className="title">Bem-vindo de volta</h2>

          {/* Inputs para email e senha */}
          <Input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="senha"
            placeholder="Password"
            value={senha}
            onChange={handleChange}
          />

          {/* Botão de login */}
          <Button 
            text="Entrar" 
            onClick={handleSubmit} 
          />

          <p className="ou">ou</p>

          {/* Login social */}
          <div className="social-login">
            <SocialButton icon={googleIcon} alt="Google" onClick={handleGoogleSignIn} />
            <SocialButton icon={appleIcon} alt="Apple" onClick={() => alert("Apple")} />
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
