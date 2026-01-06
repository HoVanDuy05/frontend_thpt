import dayjs from 'dayjs';

export const formatSocialTime = (date: string, t: any) => {
    const now = dayjs();
    const then = dayjs(date);
    const diffInSeconds = now.diff(then, 'second');

    if (diffInSeconds < 60) {
        return t('time.just_now');
    }

    const diffInMinutes = now.diff(then, 'minute');
    if (diffInMinutes < 60) {
        return t('time.minutes', { count: diffInMinutes }) + (t('time.suffix') ? ` ${t('time.suffix')}` : '');
    }

    const diffInHours = now.diff(then, 'hour');
    if (diffInHours < 24) {
        return t('time.hours', { count: diffInHours }) + (t('time.suffix') ? ` ${t('time.suffix')}` : '');
    }

    const diffInDays = now.diff(then, 'day');
    if (diffInDays < 7) {
        return t('time.days', { count: diffInDays }) + (t('time.suffix') ? ` ${t('time.suffix')}` : '');
    }

    const diffInWeeks = now.diff(then, 'week');
    if (diffInWeeks < 4) {
        return t('time.weeks', { count: diffInWeeks }) + (t('time.suffix') ? ` ${t('time.suffix')}` : '');
    }

    const diffInMonths = now.diff(then, 'month');
    if (diffInMonths < 12) {
        return t('time.months', { count: diffInMonths }) + (t('time.suffix') ? ` ${t('time.suffix')}` : '');
    }

    const diffInYears = now.diff(then, 'year');
    return t('time.years', { count: diffInYears }) + (t('time.suffix') ? ` ${t('time.suffix')}` : '');
};
