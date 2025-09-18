import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';

// Seus componentes de navegação
import NavBar3 from './components/sections/Home/NavBar3/NavBar3';
import AppHeader from './components/layout/Header/AppHeader';// **Ajuste o caminho para o seu AppHeader**
import './App.css';

// ROTA AUTH
import Cadastro from "./Page/Auth/Cadastro";
import Login from './Page/Auth/Login';
import MeusEventos from './Page/User/Meus-eventos';
import EditarEvento from './Page/User/EditarEvento';

// COMPONENTES E HOOKS DE AUTENTICAÇÃO
import AdminRoute from './Hook/RotaDoAdm';
import ProtectedRoute from './Hook/RotaProtegida';
import { AuthProvider } from './Hook/AuthContext';
import { CartProvider } from './Hook/CartContext';

// Suas outras páginas
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
import AdicionarAdm from "./Page/Admin/AdicionarAdm";
import ResetPassword from './Page/Auth/ResetPassword';

// ==================================================================
// COMPONENTES DE LAYOUT
// ==================================================================

// Layout com a NavBar3
function LayoutWithNavBar3() {
    return (
        <div>
            <NavBar3 />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

// Layout com apenas o AppHeader
function LayoutWithAppHeader() {
    return (
        <div>
            <AppHeader />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

// Layout sem nenhuma navbar
function LayoutWithoutHeader() {
    return (
        <main className="main-content full-screen">
            <Outlet />
        </main>
    );
}

// ==================================================================
// COMPONENTE DE ROTAS
// ==================================================================
function AppRoutes() {
    return (
        <Routes>
            {/* ROTAS PROTEGIDAS SEM NENHUM CABEÇALHO */}
            <Route element={<ProtectedRoute />}>
                <Route path="/CriarEventos" element={<CriarEventos />} />
            </Route>

            <Route element={<AdminRoute />}>
                <Route path="/painel" element={<Painel />} />
                <Route path="/CarrosselAdm" element={<CarrosselAdm />} />
                <Route path="/AdicionarAdm" element={<AdicionarAdm />} />
            </Route>

            <Route path="/duvidas" element={<Duvidas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* ROTAS SEM NENHUM CABEÇALHO */}
            <Route element={<LayoutWithoutHeader />}>
                <Route path="/carrinho" element={<Carrinho />} />
            </Route>

            {/* ROTAS COM A NAVBART3 */}
            <Route element={<LayoutWithNavBar3 />}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/evento/:id" element={<Detalhes />} />
                <Route path="/categorias" element={<Categorias />} />

                {/* Rotas protegidas com NavBar3 */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/editar-evento/:id" element={<EditarEvento />} />
                    <Route path="/perfil" element={<Perfil />} />
                </Route>
            </Route>

            {/* ROTAS COM APENAS O AppHeader */}
            <Route element={<LayoutWithAppHeader />}>
                <Route path="/termos" element={<Termos />} />
                {/* Rota protegida com AppHeader */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/meus-eventos" element={<MeusEventos />} />
                    <Route path="/meus-ingressos" element={<MeusIngressos />} />
                </Route>
            </Route>

            {/* Redirecionamento de fallback para qualquer rota não encontrada */}
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}

// ==================================================================
// COMPONENTE PRINCIPAL APP
// ==================================================================
function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <AppRoutes />
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;