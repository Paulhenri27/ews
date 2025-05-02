// src/services/authService.js
import axios from 'axios';

const API_URL = 'https://mamanmakuetchehelene.site'; // Replace with your Spring Boot backend URL

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

export const getUser = async (token) => {
    const response = await axios.get(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};