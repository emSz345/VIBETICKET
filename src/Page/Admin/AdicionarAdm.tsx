// src/Page/Admin/AdicionarAdm.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../Hook/AuthContext'; // Precisamos saber quem é o admin logado
import api from '../../services/api'; // Usaremos a instância do axios configurada
import "../../styles/AdicionarAdm.css";

// Interface para definir a estrutura do objeto de usuário
interface User {
    _id: string;
    nome: string;
    email: string;
    role: 'USER' | 'MANAGER_SITE' | 'SUPER_ADMIN';
}

const AdicionarAdm: React.FC = () => {
    // Pega o usuário logado para evitar que ele mude a própria role
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    // Estados para gerenciar a UI
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Função para buscar todos os usuários da API
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/admin/users'); // Rota que busca todos os usuários
            setUsers(response.data);
        } catch (err) {
            setError('Falha ao carregar a lista de usuários.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Busca os usuários quando o componente é montado
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Função para lidar com a mudança de cargo de um usuário
    const handleRoleChange = async (email: string, newRole: User['role']) => {
        setError(null);
        setSuccess(null);

        try {
            const response = await api.patch('/api/admin/update-role', { email, newRole });

            if (response.status === 200) {
                setSuccess(response.data.message);
                // Atualiza a lista de usuários localmente para refletir a mudança instantaneamente
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.email === email ? { ...user, role: newRole } : user
                    )
                );
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao atualizar o cargo do usuário.');
        }
    };

    if (loading) {
        return <div className="loading-container">Carregando usuários...</div>;
    }

    return (
        <div className="gerenciar-admin-container">
            <header className="gerenciar-admin-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <FaArrowLeft /> Voltar ao Painel
                </button>
                <h2>Gerenciar Administradores</h2>
            </header>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="user-list-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Cargo Atual</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.nome}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.email, e.target.value as User['role'])}
                                        // Desabilita a alteração para o próprio SUPER_ADMIN logado
                                        disabled={currentUser?.email === user.email}
                                        className="role-select"
                                    >
                                        <option value="USER">Usuário</option>
                                        <option value="MANAGER_SITE">Manager (Site)</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdicionarAdm;