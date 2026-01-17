import { dayjs } from './date.util';
import { parseQueryParams, replaceDynamicValues } from './api.util';

export { parseQueryParams, replaceDynamicValues };

export const convertStartDateToISO = (date?: string | null): string | undefined => {
    if (!date) return undefined;
    const d = dayjs(date);
    if (!d.isValid()) return undefined;
    return d.startOf('day').toISOString();
};

export const convertEndDateToISO = (date?: string | null): string | undefined => {
    if (!date) return undefined;
    const d = dayjs(date);
    if (!d.isValid()) return undefined;
    return d.endOf('day').toISOString();
};

export function parseTime(
    time: string | number | Date | null | undefined,
    format = 'DD/MM/YYYY'
): string {
    if (!time) return '';
    const parsed = dayjs(time);
    return parsed.isValid() ? parsed.format(format) : '';
}

export function convertToISOString(date: string | Date | null | undefined): string {
    if (!date) return '';
    const parsedDate = dayjs(date);
    return parsedDate.isValid() ? parsedDate.toISOString() : '';
}

export function formatLocaleNumber(
    value: number | string,
    locale = 'vi-VN',
    options?: Intl.NumberFormatOptions
): string {
    let v: number;

    if (typeof value === 'string') {
        v = parseFloat(value);
        if (Number.isNaN(v)) return '';
    } else {
        v = value;
    }

    try {
        return new Intl.NumberFormat(locale, options).format(v);
    } catch {
        return String(v);
    }
}

export const getThousandSeparator = (locale = 'vi-VN'): string => {
    try {
        const parts = new Intl.NumberFormat(locale).formatToParts(1000);
        const group = parts.find((p) => p.type === 'group')?.value;
        return group ?? ',';
    } catch {
        return ',';
    }
};

export const getDecimalSeparator = (locale = 'vi-VN'): string => {
    try {
        const parts = new Intl.NumberFormat(locale).formatToParts(1.1);
        const decimal = parts.find((p) => p.type === 'decimal')?.value;
        return decimal ?? '.';
    } catch {
        return '.';
    }
};

export function humanFileSize(size: number) {
    if (!Number.isFinite(size) || size < 0) return '0 B';
    const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    const i =
        size === 0
            ? 0
            : Math.min(units.length - 1, Math.floor(Math.log(size) / Math.log(1024)));
    const hasFraction = size % Math.pow(1024, i) !== 0;
    const val = (size / Math.pow(1024, i)).toFixed(hasFraction ? 2 : 0);
    return `${val} ${units[i]}`;
}

export function hasFileExtension(filename: string) {
    const base = filename.split(/[?#]/)[0];
    const lastDotIndex = base.lastIndexOf('.');
    return lastDotIndex > 0 && lastDotIndex < base.length - 1;
}

export function countCharacters(str: string | null | undefined) {
    if (!str) return 0;
    return str.trim().length;
}

export function normalize(s: string) {
    return s.replace(/\r\n/g, '\n').replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
}
