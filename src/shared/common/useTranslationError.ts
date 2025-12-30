import { useTranslations } from "next-intl";

export const useTranslationError = () => {
    const vt = useTranslations("validation");

    const translateError = (error: any): string => {
        const message = error?.response?.data?.message;

        if (!message) return "Something went wrong";

        // Handle array of errors (from NestJS ValidationPipe)
        if (Array.isArray(message)) {
            return message.map(msg => {
                if (typeof msg === 'string' && msg.startsWith('validation.')) {
                    // msg is like "validation.email.invalid"
                    // we need to pass the part after "validation." to the translation function
                    const key = msg.replace('validation.', '');
                    return vt(key);
                }
                return msg;
            }).join(', ');
        }

        // Handle single error string
        if (typeof message === 'string' && message.startsWith('validation.')) {
            const key = message.replace('validation.', '');
            return vt(key);
        }

        return message;
    };

    return translateError;
};
