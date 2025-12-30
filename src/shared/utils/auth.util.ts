// Auth redirect utility
export const saveRedirectUrl = (url: string) => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('pms_redirect', url);
    }
};

export const getRedirectUrl = (): string => {
    if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem('pms_redirect');
        sessionStorage.removeItem('pms_redirect');
        return saved || '/';
    }
    return '/';
};

export const requireAuth = (currentPath: string): string | null => {
    // If user is accessing a protected route while not logged in
    // save the current path and redirect to login
    const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
    saveRedirectUrl(currentPath);
    return loginUrl;
};
