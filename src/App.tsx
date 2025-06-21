import React, { useEffect } from 'react';
// ROTA AUTH
import Cadastro from "./Page/Auth/Cadastro";
import Login from './Page/Auth/Login';

// COMPONENTES E HOOKS DE AUTENTICAÇÃO
 // Importe o AuthProvider
import AdminRoute from './Hook/RotaDoAdm';
import ProtectedRoute from './Hook/RotaProtegida';
import { AuthProvider, useAuth } from './Hook/AuthContext';

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

function AppRoutes() {
    const { userData } = useAuth();
  const { isAuthenticated, checkAuth } = useAuth();

  // Verificação adicional quando o componente monta
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
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
      <Route element={<ProtectedRoute />}>
        <Route path="/CriarEventos" element={<CriarEventos />} />
        <Route 
          path="/perfil" 
          element={
            <Perfil 
              name={userData.name}
              email={userData.email}
              loginType={userData.loginType}
              avatarUrl={userData.avatarUrl}
            />
          }  />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/Meus-Ingressos" element={<MeusIngressos />} />
      </Route>

      {/* Rotas de admin */}
      <Route element={<AdminRoute isAdmin={userData.isAdmin} />}>
        <Route path="/painel" element={<Painel />} />
        <Route path="/aprovados" element={<Aprovados />} />
        <Route path="/rejeitados" element={<Rejeitados />} />
      </Route>

      {/* Rota de fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider> {/* Envolve tudo com o AuthProvider */}
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;