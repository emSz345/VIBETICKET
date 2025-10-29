// src/services/api.ts

import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

// Cria a instância do Axios
const api = axios.create({
  baseURL: apiUrl,
  // 'withCredentials: true' pode ser removido se você SÓ usa token JWT no localStorage
  // Mantenha se você usa cookies para ALGUMA outra coisa
  withCredentials: true,
});

// =======================================================
// INTERCEPTOR DE REQUISIÇÃO (Adiciona o Token)
// =======================================================
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage ANTES de cada requisição
    const token = localStorage.getItem('token');

    // Se o token existir, adiciona ao header Authorization
    if (token) {
      // Garante que config.headers seja um objeto antes de adicionar a propriedade
      // Se for undefined, ele cria um objeto vazio. Se já existir, ele o usa.
      config.headers = config.headers || {};

      // Adiciona o header Authorization usando a notação de colchetes
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Retorna a configuração modificada
    return config;
  },
  (error) => {
    // Trata erro da requisição (opcional)
    return Promise.reject(error);
  }
);

// =======================================================
// (Opcional, mas Recomendado) INTERCEPTOR DE RESPOSTA (Trata 401/403 Globalmente)
// =======================================================
api.interceptors.response.use(
  (response) => response, // Se a resposta for OK, apenas a retorna
  (error) => {
    // Se o erro for 401 ou 403 (Não Autorizado/Proibido), desloga o usuário
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("🔒 Erro de autenticação detectado pelo interceptor:", error.response.status);

      // Limpa o storage
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Se você guarda dados do usuário

      // Redireciona para o login (evita loops se já estiver no login)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
        // Mostra alerta APENAS se não estiver já tentando logar
        alert("Sua sessão expirou ou é inválida. Por favor, faça login novamente.");
      }
    }
    // Rejeita a promessa para que o .catch() no componente ainda funcione, se necessário
    return Promise.reject(error);
  }
);


export default api; // Exporta a instância CONFIGURADA