import axios from "axios";
import { useAppStore } from "@/providers/store/useAppStore";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        // Retrieve token fromzustand store
        // We assume the token is stored in the user object or a separate state
        // For now, let's assume it's in a cookie or we might need to add it to the state
        const state = useAppStore.getState();
        // If we decide to store token in the state, we should access it here
        // For now, let's look for 'token' in the user object IF we add it there
        // Or if the user wants token handled separately.
        // Let's assume we store it as 'token' in the store for convenience.
        const token = (state as any).token;
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

