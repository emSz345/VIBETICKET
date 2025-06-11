import React, { useState, ChangeEvent } from "react";
import { auth, createUserWithEmailAndPassword } from "../../services/firebase";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import SocialButton from "../../components/ui/SocialButton/SocialButton";

import { signInWithGoogle, signInWithFacebook } from "../../services/firebase";

import "../../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import TermosContent from '../../Page/Public/TermosContent'
import logo from "../../assets/img-logo.png";
import googleIcon from "../../assets/logo-google.png";
import facebookIcon from "../../assets/logo-facebook.png";

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
  const [termosAceitos, setTermosAceitos] = useState(false);
  // const [termosPopupAberto, setTermosPopupAberto] = useState(false); // Unused state
  const [imagemPerfil, setImagemPerfil] = useState<File | null>(null);
  const [mostrarTermos, setMostrarTermos] = useState(false);
  // const [mensagem, setMensagem] = useState(""); // Unused state

  const fecharModal = () => {
    setMostrarTermos(false);
  };

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!termosAceitos) {
      alert("Você deve aceitar os termos e políticas para continuar.");
      return false;
    }

    if (!/^[a-zA-ZÀ-ÿ\s]{10,}$/.test(formData.nome)) {
      newErrors.nome = "Nome deve conter pelo menos 10 letras e nenhum número.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      formData.email.length < 10
    ) {
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
    setErrors({ ...errors, [name]: "" }); // This correctly clears the error, which will make the hint reappear
  };


  const handleSubmitLocal = async () => {
    if (!validate()) return;

    const { nome, email, senha } = formData;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nome", nome);
      formDataToSend.append("email", email);
      formDataToSend.append("senha", senha);
      formDataToSend.append("provedor", "local");

      if (imagemPerfil) {
        formDataToSend.append("imagemPerfil", imagemPerfil);
      }

      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao registrar no servidor.");
        return;
      }

      localStorage.setItem("userName", data.user.nome);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("imagemPerfil", data.user.imagemPerfil);
      localStorage.setItem("id", data.user._id);
      localStorage.setItem("token", data.token);

      navigate("/Home");
    } catch (error) {
      alert("Erro de conexão com o servidor.");
      console.error(error);
    }
  };

  // This second submit handler might be redundant. Ensure you are calling the correct one.
  const handleSubmit = async () => {
    // ... same logic
  };

  return (
    <div className="login-container">
      <header className="header">
        <Link to="/Home" title="Voltar">
          <img src={logo} alt="Logo" className="header-logo" />
        </Link>
      </header>
      <div className="login-content">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="logo-image" />
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

          {/* --- CONFIRMAR SENHA (No hint needed here, so it remains the same) --- */}
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