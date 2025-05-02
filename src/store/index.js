// src/store/authStore.js
import { createStore } from 'vuex';
import { decodeToken } from '../utils/jwtUtil';

export default createStore({
    state: {
        token: localStorage.getItem('token') || null,
        user: JSON.parse(localStorage.getItem('user')) || null, // Parse user from localStorage
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
            localStorage.setItem('token', token);

            // Decode the token and set the user
            const decoded = decodeToken(token);

            console.log('Decoded token:', decoded); // Debugging line
            if (decoded) {
                state.user = {
                    role: decoded.role,
                    email : decoded.sub,
                };
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
        LOGOUT(state) {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user'); // Clear user from localStorage
        },
    },
    actions: {
        setToken({ commit }, token) {
            commit('SET_TOKEN', token);
        },
        logout({ commit }) {
            commit('LOGOUT');
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
});