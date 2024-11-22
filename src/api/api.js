import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080', // URL KE API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menggunakan JWT secara otomatis
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
