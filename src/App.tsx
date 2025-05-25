import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

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


function App() {
  //MONGODB
  const [mensagem, setMensagem] = useState('');

  //ROTAS
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="/Criareventos" element={<CriarEventos />} />
        <Route path="/Categorias" element={<Categorias />} />
        <Route path="/Termos" element={<Termos />} />
        <Route path="/Detalhes/:id" element={<Detalhes />} />
        <Route path="/Duvidas" element={<Duvidas />} />
        <Route
          path="/Perfil"
          element={
            <Perfil
              nomeUsuario={localStorage.getItem("userName") || "Usuário"}
              emailUsuario={localStorage.getItem("userEmail") || "usuario@email.com"}
              tipoLogin={localStorage.getItem("tipoLogin") as "email" | "google" | "facebook" || "email"}
            />
          }
        />

        <Route path="/Painel" element={<Painel />} />
        <Route path="/Aprovados" element={<Aprovados />} />
        <Route path="/Rejeitados" element={<Rejeitados />} />


      </Routes>
    </Router>
  );
}

export default App;