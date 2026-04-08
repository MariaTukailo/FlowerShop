import axios from 'axios';

const api = axios.create({
    baseURL: 'https://flowershop-production-f107.up.railway.app'
});

export default api;