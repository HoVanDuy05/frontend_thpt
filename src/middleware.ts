import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

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
