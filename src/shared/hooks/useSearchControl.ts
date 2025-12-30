import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

/**
 * Hook to manage search input state with debounce capabilities.
 * 
 * @param onSearch - Callback function to execute when search term is confirmed (debounced or Enter pressed).
 * @param delay - Debounce delay in milliseconds (default: 500ms).
 */
export const useSearchControl = (onSearch: (term: string) => void, delay: number = 500) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Create a memoized debounced version of the onSearch callback
    const debouncedSearch = useCallback(
        debounce((term: string) => {
            onSearch(term);
        }, delay),
        [onSearch, delay]
    );

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    /**
     * Handler for input change event.
     * Updates local state immediately and triggers debounced search.
     */
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement> | string) => {
        const value = typeof event === 'string' ? event : event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    /**
     * Immediate search trigger (e.g., on Enter key or button click).
     * Cancels any pending debounce and executes immediately.
     */
    const handleSearchImmediate = () => {
        debouncedSearch.cancel();
        onSearch(searchTerm);
    };

    return {
        searchTerm,
        setSearchTerm,
        handleSearchChange,
        handleSearchImmediate,
    };
};
