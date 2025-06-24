import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// ROTA AUTH
import Cadastro from "./Page/Auth/Cadastro";
import Login from './Page/Auth/Login';

// COMPONENTES E HOOKS DE AUTENTICAÇÃO
import AdminRoute from './Hook/RotaDoAdm';
import ProtectedRoute from './Hook/RotaProtegida';
import { AuthProvider, useAuth } from './Hook/AuthContext'; // Importe AuthProvider e useAuth

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

function AppRoutes() {
    // Pegamos os dados do contexto de autenticação
    const { userData, isAuthenticated } = useAuth();
    // A função checkAuth não precisa ser chamada aqui, pois já é gerenciada no AuthContext.

    // Define se o usuário é um administrador. Assume que userData.isAdmin existe e é um booleano.
    // Garante que isAdminUser seja um booleano, mesmo se userData ou isAdmin for undefined/null.
    const isAdminUser = userData?.isAdmin || false;

    return (
        <Routes>
            {/* Rotas públicas */}
            {/* Redireciona a rota raiz para /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/detalhes/:id" element={<Detalhes />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/duvidas" element={<Duvidas />} />

            {/* Rotas protegidas (usuário autenticado) */}
            {/* O ProtectedRoute verifica a autenticação antes de renderizar as rotas filhas */}
            <Route
                element={
                    <ProtectedRoute
                        isAllowed={isAuthenticated}
                        redirectPath="/login" // Redireciona para o login se não estiver autenticado
                    />
                }
            >
                <Route path="/CriarEventos" element={<CriarEventos />} />
                <Route
                    path="/perfil"
                    element={
                        <Perfil
                            name={userData?.name} // Use optional chaining para evitar erros se userData for null/undefined
                            email={userData?.email}
                            loginType={userData?.loginType}
                            avatarUrl={userData?.avatarUrl}
                        />
                    }
                />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/Meus-Ingressos" element={<MeusIngressos />} />
            </Route>

            {/* Rotas de admin */}
            {/* O AdminRoute verifica se o usuário é admin antes de renderizar as rotas filhas */}
            <Route
                element={
                    <AdminRoute
                        isAdmin={isAdminUser}
                        redirectPath="/home" // Redireciona para a home se não for admin
                    />
                }
            >
                <Route path="/painel" element={<Painel />} />
                <Route path="/aprovados" element={<Aprovados />} />
                <Route path="/rejeitados" element={<Rejeitados />} />
            </Route>

            {/* Rota de fallback para qualquer caminho não definido, redireciona para /home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            {/* AuthProvider deve envolver AppRoutes para que o contexto esteja disponível */}
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
