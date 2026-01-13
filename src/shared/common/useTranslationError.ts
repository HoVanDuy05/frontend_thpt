import { useTranslations } from "next-intl";

export const useTranslationError = () => {
    const vt = useTranslations();

    const safeTranslate = (key: string, fallback: string) => {
        try {
            // Check if key exists (some versions of next-intl support has())
            // For now, use try-catch to be safe
            const translated = vt(key as any);
            return translated;
        } catch (e) {
            return fallback;
        }
    };

    const translateError = (error: any): string => {
        const data = error?.response?.data;
        const message = data?.message;

        if (!message) return safeTranslate("validation.unknown_error", "Đã có lỗi xảy ra. Vui lòng thử lại.");

        // Special case: "Unauthorized" or specific failure strings
        if (message === "Unauthorized") return safeTranslate("validation.unauthorized", "Xác thực không thành công");

        // Handle array of errors (from NestJS ValidationPipe)
        if (Array.isArray(message)) {
            return message.map(msg => {
                if (typeof msg === 'string' && msg.startsWith('validation.')) {
                    return safeTranslate(msg, msg);
                }
                return msg;
            }).join(', ');
        }

        // Handle single error string
        if (typeof message === 'string') {
            if (message.startsWith('validation.')) {
                return safeTranslate(message, message);
            }

            // Legacy support for plain strings that match keys
            const directKey = `validation.${message.toLowerCase().replace(/\s+/g, '_')}`;
            const translated = safeTranslate(directKey, "");
            if (translated && translated !== directKey) return translated;
        }

        return message;
    };

    return translateError;
};
