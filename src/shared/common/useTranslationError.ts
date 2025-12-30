import { useTranslations } from "next-intl";

export const useTranslationError = () => {
    const vt = useTranslations("validation");

    const translateError = (error: any): string => {
        const data = error?.response?.data;
        const message = data?.message;

        if (!message) return "Đã có lỗi xảy ra. Vui lòng thử lại.";

        // Special case: "Login failed" is too generic, let's look for specific keys
        if (message === "Unauthorized") return vt("unauthorized") || "Đăng nhập không thành công";

        // Handle array of errors (from NestJS ValidationPipe)
        if (Array.isArray(message)) {
            return message.map(msg => {
                if (typeof msg === 'string' && msg.includes('validation.')) {
                    // Extract key even if it's buried in a string or is the whole string
                    const key = msg.split('.').pop(); // Simple extraction logic if it follows validation.xxx
                    return vt(key as any) || msg;
                }
                return msg;
            }).join(', ');
        }

        // Handle single error string
        if (typeof message === 'string') {
            if (message.includes('validation.')) {
                const key = message.split('.').pop();
                return vt(key as any) || message;
            }

            // Try translating the message itself as a fallback key
            const directKey = message.toLowerCase().replace(/\s+/g, '_');
            try {
                const translated = vt(directKey as any);
                if (translated !== directKey) return translated;
            } catch (e) { }
        }

        return message;
    };

    return translateError;
};
