import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

/**
 * Defines the structure of the control parameters.
 * Extend this interface if your application requires specific global params.
 */
export interface ControlParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    [key: string]: any; // Allow for dynamic filters
}

/**
 * Hook to manage URL query parameters for controlling list views (pagination, search, sort, filters).
 * 
 * @param defaultParams - Initial fallback values if URL params are missing.
 * @returns An object containing current params and a function to update them.
 */
export const useControlParams = (defaultParams: ControlParams = { page: 1, pageSize: 10 }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Parse current params from URL or fallback to defaults
    const params: ControlParams = useMemo(() => {
        const p: ControlParams = { ...defaultParams };
        searchParams.forEach((value, key) => {
            // Automatic number conversion for common pagination keys
            if (key === 'page' || key === 'pageSize') {
                p[key] = Number(value);
            } else {
                p[key] = value;
            }
        });
        return p;
    }, [searchParams, defaultParams]);

    /**
     * Updates the URL query parameters without reloading the page.
     * Merges new parameters with existing ones.
     * 
     * @param newParams - The partial params to update.
     */
    const setParams = useCallback((newParams: Partial<ControlParams>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                current.delete(key);
            } else {
                current.set(key, String(value));
            }
        });

        // Reset page to 1 if search or filters change (optional but recommended UX)
        if (newParams.search !== undefined || newParams.sort !== undefined) {
            // Check if page logic is needed here or handled by component
            // Usually we keep current page unless explicitly reset, or strictly reset on search.
            // Let's decide to NOT auto-reset page here to keep it pure, unless 'page' is passed.
        }

        const search = current.toString();
        const query = search ? `?${search}` : '';

        router.push(`${pathname}${query}`, { scroll: false });
    }, [pathname, router, searchParams]);

    return { params, setParams };
};
