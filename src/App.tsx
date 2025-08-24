import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import AppHeader from './components/layout/Header/AppHeader';
import './App.css';

// ROTA AUTH
import Cadastro from "./Page/Auth/Cadastro";
import Login from './Page/Auth/Login';
import MeusEventos from './Page/User/Meus-eventos';
import EditarEvento from './Page/User/EditarEvento';

// COMPONENTES E HOOKS DE AUTENTICAÇÃO
import AdminRoute from './Hook/RotaDoAdm';
import ProtectedRoute from './Hook/RotaProtegida';
import { AuthProvider, useAuth } from './Hook/AuthContext'; // Hook que já corrigimos

// ... (seus outros imports de páginas permanecem os mesmos) ...
import CarrosselAdm from './Page/Admin/CarrosselAdm';
import Detalhes from './Page/Eventos/Detalhes';
import CriarEventos from './Page/Eventos/CriarEventos';
import Home from './Page/Public/Home';
import Categorias from "./Page/Public/Categorias";
import Termos from './Page/Public/Termos';
import Duvidas from './Page/Public/Duvidas';
import Perfil from './Page/User/Perfil';
import Carrinho from './Page/User/Carrinho';
import MeusIngressos from './Page/User/Meus-Ingressos';
import Painel from './Page/Admin/Painel';
import Rejeitados from "./Page/Admin/Rejeitados";
import ResetPassword from './Page/Auth/ResetPassword';


// ==================================================================
// COMPONENTE DE LAYOUT (permanece o mesmo, está perfeito)
// Ele renderiza o Header e depois a página da rota atual.
// ==================================================================
function LayoutWithHeader() {
  return (
    <div>
      <AppHeader />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

// ==================================================================
// COMPONENTE DE ROTAS (aqui estão as principais mudanças)
// ==================================================================
function AppRoutes() {
  // 1. REMOVEMOS O useEffect e o checkAuth daqui.
  // O nosso novo AuthContext já faz isso internamente e de forma mais eficiente.
  const { user } = useAuth(); // Pegamos o 'user' para passar para as rotas que precisam.

  return (
    <Routes>
      {/* ================================================================== */}
      {/* MUDANÇA PRINCIPAL: Grupo de rotas QUE TÊM a Navbar */}
      {/* Todas as rotas filhas de `LayoutWithHeader` terão a navbar no topo. */}
      {/* ================================================================== */}

      <Route element={<ProtectedRoute />}>
        <Route path="/CriarEventos" element={<CriarEventos />} />
         <Route path="/editar-evento/:id" element={<EditarEvento />} />
      </Route>


      <Route element={<LayoutWithHeader />}>

        {/* --- Rotas Públicas (acessíveis a todos) --- */}
        <Route path="/home" element={<Home />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/evento/:id" element={<Detalhes />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/duvidas" element={<Duvidas />} />
        <Route path="/carrinho" element={<Carrinho />} />
        
        {/* --- Rotas Protegidas (só para usuários logados) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/perfil" element={<Perfil />} /> {/* O Perfil pode pegar os dados do useAuth() internamente */}
          <Route path="/meus-ingressos" element={<MeusIngressos />} />
           <Route path="/meus-eventos" element={<MeusEventos />} />
           
        </Route>

        {/* --- Rotas de Admin (só para usuários logados E que são admin) --- */}
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/painel" element={<Painel />} />
         <Route path="/CarrosselAdm" element={<CarrosselAdm />} />
        <Route path="/rejeitados" element={<Rejeitados />} />
      </Route>


      {/* ================================================================== */}
      {/* Grupo de rotas QUE NÃO TÊM a Navbar (tela cheia) */}
      {/* ================================================================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Redirecionamentos e rotas de fallback */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

// ==================================================================
// COMPONENTE PRINCIPAL APP (permanece o mesmo)
// ==================================================================
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;