import React from 'react';
// ROTA AUTH
import Cadastro from "./Page/Auth/Cadastro";
import Login from './Page/Auth/Login';

// ROTA EVENTOS
import Detalhes from './Page/Eventos/Detalhes';
import CriarEventos from './Page/Eventos/CriarEventos';

// ROTA HOME
import Home from './Page/Public/Home';
import Categorias from "./Page/Public/Categorias";
import Termos from './Page/Public/Termos';
import Duvidas from './Page/Public/Duvidas'

// ROTAS USERS
import Perfil from './Page/User/Perfil';

// ROTAS ADM
import Painel from './Page/Admin/Painel';
import Aprovados from "./Page/Admin/Aprovados";
import Rejeitados from "./Page/Admin/Rejeitados";
import Carrinho from './Page/User/Carrinho';
import MeusIngressos from './Page/User/Meus-Ingressos';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Importe suas páginas normalmente...

function App() {
  // Função simples para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return localStorage.getItem("token") || localStorage.getItem("firebaseToken");
  };

  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="/Categorias" element={<Categorias />} />
        <Route path="/Termos" element={<Termos />} />
        <Route path="/Detalhes/:id" element={<Detalhes />} />
        <Route path="/Duvidas" element={<Duvidas />} />

       
        <Route path="/Criareventos" element={
          isAuthenticated() ? <CriarEventos /> : <Navigate to="/Login" />
        } />
        
        <Route path="/Perfil" element={
          isAuthenticated() ? 
            <Perfil
              nomeUsuario={localStorage.getItem("userName") || "Usuário"}
              emailUsuario={localStorage.getItem("userEmail") || "usuario@email.com"}
              tipoLogin={localStorage.getItem("tipoLogin") as "email" | "google" | "facebook" || "email"}
            /> 
            : <Navigate to="/Login" />
        } />
        
        <Route path="/Carrinho" element={
          isAuthenticated() ? <Carrinho /> : <Navigate to="/Login" />
        } />
        
        <Route path="/Meus-Ingressos" element={
          isAuthenticated() ? <MeusIngressos /> : <Navigate to="/Login" />
        } />

        
        <Route path="/Painel" element={
          isAuthenticated() ? <Painel /> : <Navigate to="/Home" />
        } />
        
        <Route path="/Aprovados" element={
          isAuthenticated() ? <Aprovados /> : <Navigate to="/Home" />
        } />
        
        <Route path="/Rejeitados" element={
          isAuthenticated() ? <Rejeitados /> : <Navigate to="/Home" />
        } />

        
        <Route path="*" element={<Navigate to="/Home" />} />
      </Routes>
    </Router>
  );
}

export default App;