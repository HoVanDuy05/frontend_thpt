import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export interface UseParamControllerOptions {
    defaultParams?: Record<string, string>;
}

export function useParamController(options: UseParamControllerOptions = {}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    // Get current params as an object
    const params = useMemo(() => {
        const current: Record<string, string> = { ...options.defaultParams };
        searchParams.forEach((value, key) => {
            current[key] = value;
        });
        return current;
    }, [searchParams, options.defaultParams]);

    // Get a single param value
    const getParam = useCallback(
        (key: string, defaultValue?: string): string | undefined => {
            return searchParams.get(key) ?? defaultValue;
        },
        [searchParams]
    );

    // Set a single param
    const setParam = useCallback(
        (key: string, value: string | number | boolean | null | undefined) => {
            const newParams = new URLSearchParams(searchParams.toString());

            if (value === null || value === undefined || value === '') {
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }

            router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
        },
        [searchParams, pathname, router]
    );

    // Set multiple params at once
    const setParams = useCallback(
        (updates: Record<string, string | number | boolean | null | undefined>) => {
            const newParams = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    newParams.delete(key);
                } else {
                    newParams.set(key, String(value));
                }
            });

            router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
        },
        [searchParams, pathname, router]
    );

    // Delete a param
    const deleteParam = useCallback(
        (key: string) => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete(key);
            router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
        },
        [searchParams, pathname, router]
    );

    // Clear all params
    const clearParams = useCallback(() => {
        router.push(pathname, { scroll: false });
    }, [pathname, router]);

    return {
        params,
        getParam,
        setParam,
        setParams,
        deleteParam,
        clearParams,
    };
}
