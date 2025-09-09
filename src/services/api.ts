// src/services/api.ts

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Ex: http://localhost:5000
  withCredentials: true, // ESSENCIAL: Permite que o axios envie cookies automaticamente
});

export default api;