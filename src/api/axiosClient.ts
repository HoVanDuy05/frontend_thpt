import axios from "axios";
import { useAppStore } from "@/providers/store/useAppStore";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
});

// Add a request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        // Try to get token from Zustand store first
        const state = useAppStore.getState();
        let token = state.token;

        // Fallback: Try to get token from localStorage (persisted state)
        if (!token) {
            try {
                const persistedState = localStorage.getItem('auth_store');
                if (persistedState) {
                    const parsed = JSON.parse(persistedState);
                    token = parsed?.state?.token;
                }
            } catch (e) {
                console.error('Failed to parse persisted auth state:', e);
            }
        }

        // Add token to request headers if available
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;

