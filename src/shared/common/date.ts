/**
 * Common date utilities
 */

/**
 * Format date to Vietnamese locale string
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string or 'N/A' if invalid
 */
export const formatDate = (
    date: string | Date | undefined | null,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
): string => {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('vi-VN', options);
    } catch {
        return 'N/A';
    }
};

/**
 * Format date with weekday
 * @param date - Date string or Date object
 * @returns Formatted date string with weekday
 */
export const formatDateWithWeekday = (date: string | Date | undefined | null): string => {
    return formatDate(date, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Format short date (DD/MM/YYYY)
 * @param date - Date string or Date object
 * @returns Formatted short date string
 */
export const formatShortDate = (date: string | Date | undefined | null): string => {
    return formatDate(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

/**
 * Format date range
 * @param startDate - Start date string or Date object
 * @param endDate - End date string or Date object
 * @returns Formatted date range string
 */
export const formatDateRange = (
    startDate: string | Date | undefined | null,
    endDate: string | Date | undefined | null
): string => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} - ${end}`;
};
