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
  const [termosPopupAberto, setTermosPopupAberto] = useState(false);
  const [mostrarTermos, setMostrarTermos] = useState(false);
  const [mensagem, setMensagem] = useState("");

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

    // Validação corrigida do email
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
    setErrors({ ...errors, [name]: "" }); // limpa erro ao digitar
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.senha);
      const user = userCredential.user;
      const UsuarioID = user.uid;
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
      localStorage.setItem("id", UsuarioID);

      
      navigate("/Home")
    } catch (error: any) {
      alert("Erro ao registrar. Verifique os dados e tente novamente.");
      console.error(error.message);
    }
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
                  <button className="close-button" ></button>
                  <TermosContent onClose={fecharModal} />

                </div>
              </div>
            )}
          </div>

          <Button color="Blue" text="criar minha conta" onClick={handleSubmit} />

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
