
import React, { useState, ChangeEvent } from "react";
import { auth, createUserWithEmailAndPassword, signInWithApple } from "../firebase"; // Importe as funções do Firebase
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import SocialButton from "../components/SocialButton/SocialButton";
import Header from "../components/Header/Header";
import { signInWithGoogle } from "../firebase";
import "../styles/Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img-logo.png";
import googleIcon from "../assets/logo-google.png";
import appleIcon from "../assets/logo-apple.png";
import { signInWithFacebook } from "../firebase";

import facebookIcon from "../assets/logo-facebook.png";
import axios from "axios";

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
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    if (formData.senha !== formData.confirmSenha) {
      alert("As senhas não coincidem!");
      return;
    }
  
    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.senha);
      const user = userCredential.user;
  
      
      const nome = formData.nome || "Usuário"; 
      const email = formData.email;
      const senha = formData.senha; 
      const provedor = 'local';
  
      
      await axios.post('http://localhost:5000/api/users/register', {
        nome,
        email,
        senha,
        provedor
      });
  
      alert("Conta criada com sucesso!");

      //salva o token no navegador 
      const token = await user.getIdToken();
      localStorage.setItem("firebaseToken", token);
      localStorage.setItem("userName", nome);

      navigate("/Home");
      console.log(user);
    } catch (error: any) {
      alert("Erro ao registrar. Verifique os dados e tente novamente.");
      console.error(error.message);
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

          <Input type="text" placeholder="Nome" name="nome" value={formData.nome} onChange={handleChange} />
          <Input type="email" placeholder="example@gmail.com" name="email" value={formData.email} onChange={handleChange} />
          <Input type="password" placeholder="Password" name="senha" value={formData.senha} onChange={handleChange} />
          <Input type="password" placeholder="Confirm password" name="confirmSenha" value={formData.confirmSenha} onChange={handleChange} />

          <input type="radio" value="Radio" />
          <label htmlFor="Radio">
            Eu concordo com os <Link to="/Termos" className="Termos">termos & políticas</Link>
          </label>

          <Button text="Registrar" onClick={handleSubmit} />

          <p className="ou">ou</p>

          <div className="social-login">
            <SocialButton icon={googleIcon} alt="Google" onClick={handleGoogleSignIn} />
          
            <SocialButton icon={facebookIcon} alt="Facebook" onClick={handleFacebookSignIn} />
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
