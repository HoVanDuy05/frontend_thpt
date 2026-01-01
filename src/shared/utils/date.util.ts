import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';

// Configure plugins
dayjs.extend(weekOfYear);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

/**
 * Format a date string or object
 * @param date Date string or object
 * @param format Format string (default: DD/MM/YYYY)
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date | undefined | null, format: string = 'DD/MM/YYYY'): string => {
    if (!date) return '';
    return dayjs(date).format(format);
};

/**
 * Get current week number of the year
 * @returns Week number
 */
export const getCurrentWeek = (): number => {
    return dayjs().week();
};

/**
 * Format date relative to now (e.g. "2 hours ago")
 * @param date Date string or object
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date | undefined | null): string => {
    if (!date) return '';
    return dayjs(date).fromNow();
};

// Export configured dayjs instance for advanced usage
export { dayjs };
