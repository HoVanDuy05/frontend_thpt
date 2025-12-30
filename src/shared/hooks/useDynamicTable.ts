import { ReactNode } from 'react';

export interface TableColumn<T> {
    accessor: keyof T | string; // Key to access data in row object
    title: string;             // Header title
    width?: string | number;   // Column width
    render?: (record: T) => ReactNode; // Custom render function
    align?: 'left' | 'center' | 'right';
}

export interface UseDynamicTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
}

/**
 * Hook to helper manage dynamic table generation.
 * Mainly serves as a type-safe configuration builder currently.
 * Can be expanded to handle sorting state per column.
 */
export const useDynamicTable = <T extends object>({ columns, data }: UseDynamicTableProps<T>) => {

    // Future: Handle local sorting logic here if needed

    return {
        columns,
        data,
        // Add helpers like 'visibleColumns', 'reorderColumns' here if needed
    };
};
