import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // This should typically correspond to the `[locale]` segment
    let locale = await requestLocale;
    console.log('[i18n] Request locale:', locale);

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
        console.log('[i18n] Fallback to default locale:', locale);
    }

    try {
        const messages = (await import(`../locales/${locale}/translation.json`)).default;
        return {
            locale,
            messages
        };
    } catch (error) {
        console.error(`[i18n] Error loading messages for locale ${locale}:`, error);
        return {
            locale,
            messages: {}
        };
    }
});
