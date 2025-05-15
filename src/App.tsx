import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cadastro from "./Page/Cadastro";
import Home from './Page/Home';
import Login from './Page/Login';
import CriarEventos from './Page/CriarEventos';
import Categorias from "./Page/Categorias";
import Termos from './Page/Termos';
import Detalhes from './Page/Detalhes'
import Duvidas from './Page/Duvidas'

import Perfil from './Page/Auth/Perfil';

function App() {
  //MONGODB
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    axios.get('http://localhost:27017/api/mensagem')
      .then((res) => setMensagem(res.data.mensagem))
      .catch((err) => console.error('Erro:', err));
  }, []);

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


      </Routes>
    </Router>
  );
}

export default App;
