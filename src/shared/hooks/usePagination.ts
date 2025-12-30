import { useMemo } from 'react';

export interface PaginationMeta {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
}

export interface UsePaginationProps {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    onChange: (page: number) => void;
}

/**
 * Hook to encapsulate pagination logic.
 * Calculates total pages and provides navigation helpers.
 */
export const usePagination = ({ totalItems, pageSize, currentPage, onChange }: UsePaginationProps) => {
    const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;

    const nextPage = () => {
        if (hasNext) onChange(currentPage + 1);
    };

    const prevPage = () => {
        if (hasPrev) onChange(currentPage - 1);
    };

    const setPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onChange(page);
        }
    };

    return {
        totalPages,
        hasNext,
        hasPrev,
        nextPage,
        prevPage,
        setPage,
        // Helper to generate range of pages for UI (e.g., [1, 2, ..., 10]) can be added here
    };
};
