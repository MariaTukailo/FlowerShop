import axios from 'axios';

const api = axios.create({
    baseURL: window.location.hostname === 'localhost'
        ? 'http://localhost:8080'
        : 'https://flowershop-production-f107.up.railway.app'
});

export default api;