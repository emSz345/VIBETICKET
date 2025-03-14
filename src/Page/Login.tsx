import React from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import SocialButton from "../components/SocialButton/SocialButton";
import Header from "../components/Header/Header";

import "../styles/Login.css";
import { Link } from "react-router-dom";

import logo from "../assets/img-logo.png";
import googleIcon from "../assets/logo-google.png";
import appleIcon from "../assets/logo-apple.png";
import facebookIcon from "../assets/logo-facebook.png";

function Login() {
  return (
    <div className="login-container">
      <Header />
      <div className="login-content">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <div className="form-section">
          <h2 className="title">Bem-vindo de volta</h2>
          <Input  type="email"    placeholder="example@gmail.com" />
          <Input  type="password" placeholder="password" />
          <Button text="Entrar"   onClick={() => alert("Login")} />

            <p className="ou">ou</p>

          <div className="social-login">
            <SocialButton icon={googleIcon}   alt="Google"   onClick={() => alert("Google")} />
            <SocialButton icon={appleIcon}    alt="Apple"    onClick={() => alert("Apple")} />
            <SocialButton icon={facebookIcon} alt="Facebook" onClick={() => alert("Facebook")} />
          </div>
          <p>Ainda não tem uma conta? <Link to='/Cadastro' className="crie-conta">Crie uma!</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;