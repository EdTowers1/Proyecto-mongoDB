import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://tu-dominio.com/api' // Cambia esta URL para producción
    : 'http://localhost:3000/api',  // URL local para desarrollo
});

export default api;