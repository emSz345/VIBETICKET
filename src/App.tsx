import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

import Cadastro from "./Page/Auth/Cadastro";
import Home from './Page/Public/Home';
import Login from './Page/Auth/Login';
import CriarEventos from './Page/Eventos/CriarEventos';
import Categorias from "./Page/Public/Categorias";
import Termos from './Page/Public/Termos';
import Detalhes from './Page/Eventos/Detalhes'
import Duvidas from './Page/Public/Duvidas'

import Perfil from './Page/User/Perfil';
import { ImOmega } from 'react-icons/im';

import Painel from './Page/Admin/Painel';

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


      </Routes>
    </Router>
  );
}

export default App;