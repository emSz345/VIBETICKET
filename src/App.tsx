import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

import Cadastro from './Page/Cadastro';
import Home from './Page/Home';
import Login from './Page/Login';
import CriarEventos from './Page/CriarEventos';
import Categorias from './Page/Cadastro';

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
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/criareventos" element={<CriarEventos />} />
                <Route path="/categorias" element={<Categorias />} />
            </Routes>
        </Router>  
  );
}

export default App;
