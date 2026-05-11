import axios from 'axios';
import { API_URL } from '../Config/BaseUrl';

const apiClient = axios.create({
    baseURL: API_URL, 
    headers: {
        'Content-Type': 'application/json'
    }
});

// Automatically add JWT Token to every request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
