import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';

// Seus componentes de navegação
import NavBar3 from './components/sections/Home/NavBar3/NavBar3';
import AppHeader from './components/layout/Header/AppHeader';
import './App.css';

// ROTA AUTH
import Cadastro from "./Page/Auth/Cadastro";
import Login from './Page/Auth/Login';
import ResetPassword from './Page/Auth/ResetPassword';

// COMPONENTES E HOOKS DE AUTENTICAÇÃO
import { AuthProvider } from './Hook/AuthContext';
import { CartProvider } from './Hook/CartContext';
import RotaDoUsuario from './Hook/RotaDoUsuario'; // O protetor de rotas de usuário
import AdminRoute from './Hook/RotaDoAdm'; // O protetor de rotas de admin
import CookieNotice from './components/layout/CookieNotice/CookieNotice';

// Suas outras páginas
import Home from './Page/Public/Home';
import Detalhes from './Page/Eventos/Detalhes';
import Categorias from "./Page/Public/Categorias";
import Termos from './Page/Public/Termos';
import PoliticaReembolso from './Page/Public/PoliticaReembolso';
import Duvidas from './Page/Public/Duvidas';
// Páginas de Usuário
import CriarEventos from './Page/Eventos/CriarEventos';
import EditarEvento from './Page/User/EditarEvento';
import MeusEventos from './Page/User/Meus-eventos';
import Perfil from './Page/User/Perfil';
import Carrinho from './Page/User/Carrinho';
import MeusIngressos from './Page/User/Meus-Ingressos';
// Páginas de Admin
import Painel from './Page/Admin/Painel';
import CarrosselAdm from './Page/Admin/CarrosselAdm';
import AdicionarAdm from "./Page/Admin/AdicionarAdm";

// ==================================================================
// COMPONENTES DE LAYOUT (Estes permanecem iguais)
// ==================================================================
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

// ==================================================================
// COMPONENTE DE ROTAS (Com o Grupo 3 Corrigido)
// ==================================================================
function AppRoutes() {
    return (
        <Routes>
            {/* ======================================= */}
            {/* GRUPO 1: ROTAS PÚBLICAS (Acessíveis a todos) */}
            {/* ======================================= */}

            {/* Rotas públicas com a NavBar3 */}
            <Route path="/evento/:id" element={<Detalhes />} />
            <Route element={<LayoutWithNavBar3 />}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/categorias" element={<Categorias />} />
            </Route>

            {/* Rotas públicas com o AppHeader */}
            <Route element={<LayoutWithAppHeader />}>
                <Route path="/termos" element={<Termos />} />
                <Route path="/PoliticaReembolso" element={<PoliticaReembolso />} />
            </Route>

            {/* Rotas públicas sem layout específico */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/duvidas" element={<Duvidas />} />


            {/* ================================================= */}
            {/* GRUPO 2: ROTAS PROTEGIDAS PARA USUÁRIOS (Admins são bloqueados) */}
            {/* ================================================= */}
            <Route element={<RotaDoUsuario />}>
                {/* Rotas de usuário com a NavBar3 */}
                <Route element={<LayoutWithNavBar3 />}>
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/meus-eventos" element={<MeusEventos />} />
                    <Route path="/meus-ingressos" element={<MeusIngressos />} />
                </Route>

                {/* Rotas de usuário sem layout específico */}
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/CriarEventos" element={<CriarEventos />} />
                <Route path="/editar-evento/:id" element={<EditarEvento />} />
            </Route>


            {/* ================================================== */}
            {/* GRUPO 3: ROTAS PROTEGIDAS PARA ADMINS (Com permissões específicas) */}
            {/* ================================================== */}
            
            {/* Rotas que AMBOS os admins podem acessar */}
            <Route element={<AdminRoute allowedRoles={['SUPER_ADMIN', 'MANAGER_SITE']} />}>
                <Route path="/painel" element={<Painel />} />
                <Route path="/CarrosselAdm" element={<CarrosselAdm />} />
            </Route>

            {/* Rotas que APENAS o SUPER_ADMIN pode acessar */}
            <Route element={<AdminRoute allowedRoles={['SUPER_ADMIN']} />}>
                <Route path="/AdicionarAdm" element={<AdicionarAdm />} />
            </Route>


            {/* Redirecionamento de fallback para qualquer rota não encontrada */}
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}

// ==================================================================
// COMPONENTE PRINCIPAL APP (Permanece igual)
// ==================================================================
function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <CookieNotice />
                    <AppRoutes />
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;