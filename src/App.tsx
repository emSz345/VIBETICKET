import React from 'react';
// ROTA AUTH
import Cadastro from "./Page/Auth/Cadastro";
import Login from './Page/Auth/Login';

//VERIFICAÇÃO DE ROTA
import AdminRoute from './Page/Hook/RotaDoAdm';
import ProtectedRoute from './Page/Hook/RotaProtegida';
import { isAdmin } from './Data/DadosLocal';
import { isAuthenticated } from './Data/DadosLocal';
import { getUserInfo } from './Data/DadosLocal';

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



function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/detalhes/:id" element={<Detalhes />} />
        <Route path="/duvidas" element={<Duvidas />} />

        {/* Rotas protegidas (usuário autenticado) */}
        <Route element={<ProtectedRoute isAllowed={isAuthenticated()} />}>
          <Route path="/criar-eventos" element={<CriarEventos />} />
          <Route path="/perfil" element={<Perfil {...getUserInfo()} />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/meus-ingressos" element={<MeusIngressos />} />
        </Route>

        {/* Rotas de admin */}
        <Route element={<AdminRoute isAdmin={isAdmin()} />}>
          <Route path="/painel" element={<Painel />} />
          <Route path="/aprovados" element={<Aprovados />} />
          <Route path="/rejeitados" element={<Rejeitados />} />
        </Route>

        {/* Rota de fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;