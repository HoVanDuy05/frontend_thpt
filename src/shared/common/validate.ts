// Validation utilities for form inputs

export type ValidationResult = string | null;

// ============ Basic Validators ============

export const required = (message = "Trường này là bắt buộc") => (value: any): ValidationResult => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return message;
    }
    return null;
};

export const minLength = (min: number, message?: string) => (value: string): ValidationResult => {
    if (!value || value.length < min) {
        return message || `Tối thiểu ${min} ký tự`;
    }
    return null;
};

export const maxLength = (max: number, message?: string) => (value: string): ValidationResult => {
    if (value && value.length > max) {
        return message || `Tối đa ${max} ký tự`;
    }
    return null;
};

export const pattern = (regex: RegExp, message: string) => (value: string): ValidationResult => {
    if (value && !regex.test(value)) {
        return message;
    }
    return null;
};

// ============ Specific Field Validators ============

export const validateUsername = (value: string): ValidationResult => {
    if (!value || value.trim() === '') {
        return 'Tên đăng nhập là bắt buộc';
    }
    if (value.length < 3) {
        return 'Tên đăng nhập ít nhất 3 ký tự';
    }
    if (value.length > 50) {
        return 'Tên đăng nhập tối đa 50 ký tự';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return 'Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới';
    }
    return null;
};

export const validateEmail = (value: string): ValidationResult => {
    if (!value || value.trim() === '') {
        return 'Email là bắt buộc';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return 'Email không hợp lệ';
    }
    return null;
};

export const validatePassword = (value: string): ValidationResult => {
    if (!value || value.trim() === '') {
        return 'Mật khẩu là bắt buộc';
    }
    if (value.length < 6) {
        return 'Mật khẩu ít nhất 6 ký tự';
    }
    if (value.length > 100) {
        return 'Mật khẩu tối đa 100 ký tự';
    }
    return null;
};

export const validateConfirmPassword = (password: string) => (value: string): ValidationResult => {
    if (!value || value.trim() === '') {
        return 'Vui lòng xác nhận mật khẩu';
    }
    if (value !== password) {
        return 'Mật khẩu không khớp';
    }
    return null;
};

export const validatePhoneNumber = (value: string): ValidationResult => {
    if (!value) return null; // Optional field
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return 'Số điện thoại không hợp lệ (10-11 chữ số)';
    }
    return null;
};

export const validateDate = (value: string | Date): ValidationResult => {
    if (!value) return null; // Optional field
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
    }
    return null;
};

export const validateAge = (minAge: number, maxAge?: number) => (value: string | Date): ValidationResult => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
    }

    const age = Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    if (age < minAge) {
        return `Tuổi tối thiểu ${minAge}`;
    }
    if (maxAge && age > maxAge) {
        return `Tuổi tối đa ${maxAge}`;
    }
    return null;
};

export const validateUrl = (value: string): ValidationResult => {
    if (!value) return null; // Optional field
    try {
        new URL(value);
        return null;
    } catch {
        return 'URL không hợp lệ';
    }
};

export const validateNumber = (min?: number, max?: number) => (value: any): ValidationResult => {
    const num = Number(value);
    if (isNaN(num)) {
        return 'Giá trị phải là số';
    }
    if (min !== undefined && num < min) {
        return `Giá trị tối thiểu ${min}`;
    }
    if (max !== undefined && num > max) {
        return `Giá trị tối đa ${max}`;
    }
    return null;
};

// ============ Composite Validators ============

export const compose = (...validators: Array<(value: any) => ValidationResult>) => (value: any): ValidationResult => {
    for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
    }
    return null;
};

// ============ Helper Functions ============

export const createValidator = (rules: Record<string, (value: any) => ValidationResult>) => {
    return (values: Record<string, any>) => {
        const errors: Record<string, string> = {};
        for (const [field, validator] of Object.entries(rules)) {
            const error = validator(values[field]);
            if (error) {
                errors[field] = error;
            }
        }
        return Object.keys(errors).length > 0 ? errors : null;
    };
};

// ============ Example Usage ============
/*
import { validateEmail, validatePassword, validateConfirmPassword, compose, minLength, required } from '@/shared/common/validate';

const form = useForm({
    validate: {
        email: validateEmail,
        password: validatePassword,
        confirmPassword: validateConfirmPassword(form.values.password),
        username: compose(
            required('Tên đăng nhập là bắt buộc'),
            minLength(3, 'Tối thiểu 3 ký tự')
        ),
    }
});
*/
