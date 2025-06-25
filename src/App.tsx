import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import AppHeader from './components/layout/Header/AppHeader'; // <-- VERIFIQUE SE ESTE CAMINHO ESTÁ CORRETO
import './App.css'; // <-- VAMOS CRIAR ESTE ARQUIVO NO PRÓXIMO PASSO

// ROTA AUTH
import Cadastro from "./Page/Auth/Cadastro";
import Login from './Page/Auth/Login';

// COMPONENTES E HOOKS DE AUTENTICAÇÃO
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
import Duvidas from './Page/Public/Duvidas';

// ROTAS USERS
import Perfil from './Page/User/Perfil';
import Carrinho from './Page/User/Carrinho';
import MeusIngressos from './Page/User/Meus-Ingressos';

// ROTAS ADM
import Painel from './Page/Admin/Painel';
import Aprovados from "./Page/Admin/Aprovados";
import Rejeitados from "./Page/Admin/Rejeitados";

// ==================================================================
// 1. CRIAMOS UM COMPONENTE DE LAYOUT
// Este componente inclui a navbar e um espaço para o conteúdo da página.
// O <Outlet /> é um placeholder do React Router que renderiza a rota filha.
// ==================================================================
function MainLayout() {
  return (
    <div>
      <AppHeader />
      {/* A classe 'main-content' é crucial para o espaçamento */}
      <main className="main-content">
        <Outlet /> 
      </main>
    </div>
  );
}


function AppRoutes() {
    const { userData, isAuthenticated } = useAuth();
    const isAdminUser = userData?.isAdmin || false;

    return (
        <Routes>
            {/* ================================================================== */}
            {/* 2. AGRUPAMOS AS ROTAS QUE USARÃO O LAYOUT PRINCIPAL */}
            {/* Todas as rotas dentro deste elemento terão a navbar fixa no topo. */}
            {/* ================================================================== */}
            <Route element={<MainLayout />}>
                {/* Rotas públicas com navbar */}
                <Route path="/home" element={<Home />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/detalhes/:id" element={<Detalhes />} />
                <Route path="/termos" element={<Termos />} />
                <Route path="/duvidas" element={<Duvidas />} />

                {/* Rotas protegidas com navbar */}
                <Route element={<ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login" />}>
                    <Route path="/CriarEventos" element={<CriarEventos />} />
                    <Route
                        path="/perfil"
                        element={
                            <Perfil
                                name={userData?.name}
                                email={userData?.email}
                                loginType={userData?.loginType}
                                avatarUrl={userData?.avatarUrl}
                            />
                        }
                    />
                    <Route path="/carrinho" element={<Carrinho />} />
                    <Route path="/Meus-Ingressos" element={<MeusIngressos />} />
                </Route>

                {/* Rotas de admin com navbar */}
                <Route element={<AdminRoute isAdmin={isAdminUser} redirectPath="/home" />}>
                    <Route path="/painel" element={<Painel />} />
                    <Route path="/aprovados" element={<Aprovados />} />
                    <Route path="/rejeitados" element={<Rejeitados />} />
                </Route>
            </Route>

            {/* ================================================================== */}
            {/* 3. ROTAS SEM LAYOUT (TELA CHEIA) */}
            {/* Login e Cadastro não terão a navbar, o que é comum. */}
            {/* ================================================================== */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            {/* Redirecionamentos e rotas de fallback */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}

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