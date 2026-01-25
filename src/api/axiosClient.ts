import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useAppStore } from "@/providers/store/useAppStore";

// Custom Axios instance that unwraps response.data automatically
interface UnwrappedAxiosInstance extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'patch' | 'delete'> {
    get<T = any>(url: string, config?: any): Promise<T>;
    post<T = any>(url: string, data?: any, config?: any): Promise<T>;
    put<T = any>(url: string, data?: any, config?: any): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
    delete<T = any>(url: string, config?: any): Promise<T>;
}

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
}) as UnwrappedAxiosInstance;

// Add a request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        // Skip adding token for auth endpoints to prevent issues with invalid tokens on public routes
        if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
            return config;
        }

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

        // Detect locale from URL in browser, default to 'vi'
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            const localeMatch = path.match(/^\/(vi|en)/);
            const locale = localeMatch ? localeMatch[1] : 'vi';
            config.headers['x-custom-lang'] = locale;
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
        // Handle 401 Unauthorized (token expired or invalid)
        if (error.response?.status === 401) {
            // Ignore 401s from login endpoint (invalid credentials)
            const isLoginRequest = error.config?.url?.includes('/auth/login');

            // Only handle if we're in the browser AND user was previously authenticated AND not logging in
            if (typeof window !== 'undefined' && !isLoginRequest) {
                const state = useAppStore.getState();
                const wasAuthenticated = !!state.token || !!state.user;

                // Only trigger session expired if user was authenticated
                // This prevents triggering on login failures
                if (wasAuthenticated) {
                    // Clear auth state
                    state.logout();

                    // Clear persisted state
                    try {
                        localStorage.removeItem('auth_store');
                    } catch (e) {
                        console.error('Failed to clear auth storage:', e);
                    }

                    // Get current path and locale for redirect after login
                    const currentPath = window.location.pathname;

                    // Don't redirect if we are already on login page
                    if (currentPath.includes('/auth/login')) {
                        return Promise.reject(error);
                    }

                    // Extract locale from path (e.g., /vi/student -> vi)
                    const localeMatch = currentPath.match(/^\/(vi|en)/);
                    const locale = localeMatch ? localeMatch[1] : 'vi';

                    // Import notifications dynamically to avoid SSR issues
                    import('@mantine/notifications').then(({ notifications }) => {
                        notifications.show({
                            title: 'Phiên đăng nhập hết hạn',
                            message: 'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.',
                            color: 'red',
                            autoClose: 5000,
                        });
                    });

                    // Redirect to login page with return URL (preserve locale)
                    // Use setTimeout to ensure notification is shown before redirect
                    setTimeout(() => {
                        window.location.href = `/${locale}/auth/login?redirect=${encodeURIComponent(currentPath)}`;
                    }, 100);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
