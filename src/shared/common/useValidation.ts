// Hook to get validators with i18n messages
import { useTranslations } from "next-intl";

export type ValidationResult = string | null;

export const useValidation = () => {
    const t = useTranslations("validation");

    return {
        // Basic validators
        required: (field?: string) => (value: any): ValidationResult => {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                return field ? t(`${field}.required`) : t("required");
            }
            return null;
        },

        minLength: (min: number, field?: string) => (value: string): ValidationResult => {
            if (!value || value.length < min) {
                return field ? t(`${field}.minLength`) : t("minLength", { min });
            }
            return null;
        },

        maxLength: (max: number, field?: string) => (value: string): ValidationResult => {
            if (value && value.length > max) {
                return field ? t(`${field}.maxLength`) : t("maxLength", { max });
            }
            return null;
        },

        // Specific field validators
        username: (value: string): ValidationResult => {
            if (!value || value.trim() === '') {
                return t("username.required");
            }
            if (value.length < 3) {
                return t("username.minLength");
            }
            if (value.length > 50) {
                return t("username.maxLength");
            }
            if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                return t("username.invalid");
            }
            return null;
        },

        email: (value: string): ValidationResult => {
            if (!value || value.trim() === '') {
                return t("email.required");
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return t("email.invalid");
            }
            return null;
        },

        password: (value: string): ValidationResult => {
            if (!value || value.trim() === '') {
                return t("password.required");
            }
            if (value.length < 6) {
                return t("password.minLength");
            }
            if (value.length > 100) {
                return t("password.maxLength");
            }
            return null;
        },

        confirmPassword: (password: string) => (value: string): ValidationResult => {
            if (!value || value.trim() === '') {
                return t("confirmPassword.required");
            }
            if (value !== password) {
                return t("confirmPassword.notMatch");
            }
            return null;
        },

        phone: (value: string): ValidationResult => {
            if (!value) return null; // Optional
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                return t("phone.invalid");
            }
            return null;
        },

        date: (value: string | Date): ValidationResult => {
            if (!value) return null; // Optional
            const date = value instanceof Date ? value : new Date(value);
            if (isNaN(date.getTime())) {
                return t("date.invalid");
            }
            return null;
        },

        age: (minAge: number, maxAge?: number) => (value: string | Date): ValidationResult => {
            if (!value) return null;
            const date = value instanceof Date ? value : new Date(value);
            if (isNaN(date.getTime())) {
                return t("date.invalid");
            }

            const age = Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

            if (age < minAge) {
                return t("age.min", { min: minAge });
            }
            if (maxAge && age > maxAge) {
                return t("age.max", { max: maxAge });
            }
            return null;
        },

        url: (value: string): ValidationResult => {
            if (!value) return null; // Optional
            try {
                new URL(value);
                return null;
            } catch {
                return t("url.invalid");
            }
        },

        number: (min?: number, max?: number) => (value: any): ValidationResult => {
            const num = Number(value);
            if (isNaN(num)) {
                return t("number.invalid");
            }
            if (min !== undefined && num < min) {
                return t("number.min", { min });
            }
            if (max !== undefined && num > max) {
                return t("number.max", { max });
            }
            return null;
        },

        // Compose multiple validators
        compose: (...validators: Array<(value: any) => ValidationResult>) => (value: any): ValidationResult => {
            for (const validator of validators) {
                const error = validator(value);
                if (error) return error;
            }
            return null;
        },
    };
};

// Example usage:
/*
import { useValidation } from '@/shared/common/useValidation';

export default function MyForm() {
    const validate = useValidation();
    
    const form = useForm({
        validate: {
            username: validate.username,
            email: validate.email,
            password: validate.password,
            confirmPassword: (value, values) => validate.confirmPassword(values.password)(value),
        }
    });
}
*/
