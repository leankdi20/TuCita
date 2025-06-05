import axios from 'axios';
import { getAuthToken } from './auth';

const axiosInstance = axios.create({
   baseURL :   'http://localhost:8000/api/',
   headers: {
    'Content-Type' : 'application/json',
   },
});

// En Este bloque agrega automaticamente el token a cada request si está guardado
axiosInstance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});


export default axiosInstance; 