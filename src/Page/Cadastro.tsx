import React, { useState, ChangeEvent } from "react";
import { auth, createUserWithEmailAndPassword } from "../firebase";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import SocialButton from "../components/SocialButton/SocialButton";
import Header from "../components/Header/Header";

import { signInWithGoogle, signInWithFacebook } from "../firebase";

import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/img-logo.png";
import googleIcon from "../assets/logo-google.png";
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

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!/^[a-zA-ZÀ-ÿ\s]{10,}$/.test(formData.nome)) {
      newErrors.nome = "Nome deve conter pelo menos 10 letras e nenhum número.";
    }

    // Validação corrigida do email
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      formData.email.length < 10
    ) {
      newErrors.email = "Email deve estar em formato válido e conter pelo menos 10 caracteres.";
    }

    if (!/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(formData.senha)) {
      newErrors.senha = "A senha deve ter no mínimo 6 caracteres e conter letras e números.";
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
    setErrors({ ...errors, [name]: "" }); // limpa erro ao digitar
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.senha);
      const user = userCredential.user;

      const { nome, email, senha } = formData;
      const provedor = "local";

      await axios.post("http://localhost:5000/api/users/register", {
        nome,
        email,
        senha,
        provedor,
      });

      const token = await user.getIdToken();
      localStorage.setItem("firebaseToken", token);
      localStorage.setItem("userName", nome);

      alert("Conta criada com sucesso!");
      navigate("/Home");
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
          <h2 className="title">Bem-vindo</h2>

          <h3 className="login-title">Nome completo</h3>
          <Input
            type="text"
            placeholder="Paulo da Silva"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            isValid={formData.nome.length >= 10 && !errors.nome}
            hasError={!!errors.nome}
          />
          <div className="login-container-error">
            {errors.nome && <p className="error">{errors.nome}</p>}
          </div>

          <h3 className="login-title">Email</h3>
          <Input
            type="email"
            placeholder="exemplo@gmail.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isValid={formData.email.includes("@") && !errors.email}
            hasError={!!errors.email}
          />
          <div className="login-container-error">
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

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
            {errors.senha && <p className="error">{errors.senha}</p>}
          </div>

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
          <div className="login-container-error">
            {errors.confirmSenha && <p className="error">{errors.confirmSenha}</p>}
          </div>

          <div className="radio-container">
            <input type="radio" id="termos" name="termos" required />
            <label htmlFor="termos">
              Eu concordo com os <Link to="/Termos" className="Termos">termos & políticas</Link>
            </label>
          </div>

          <Button text="criar minha conta" onClick={handleSubmit} />

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
