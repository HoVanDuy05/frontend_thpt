import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default async function middleware(request: any) {
    console.log('Middleware running:', request.nextUrl.pathname);
    const response = createMiddleware(routing)(request);
    return response;
}

export const config = {
    // Match only internationalized pathnames
    matcher: [
        // Exclude internal paths
        '/((?!api|_next|_vercel|socket\\.io|.*\\..*).*)',
        // Support locale prefixes
        '/(vi|en)/:path*',
        // Match root
        '/'
    ]
};
