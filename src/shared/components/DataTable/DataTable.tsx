"use client";

import { Table, Paper, Text, Stack, TextInput, Group, Button, Skeleton } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState, useMemo } from 'react';

export type ColumnAlignment = 'left' | 'center' | 'right';

export interface DataTableColumn<T> {
    key: string;
    header: string;
    width?: number | string;
    align?: ColumnAlignment;
    render: (item: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    isLoading?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchKeys?: (keyof T)[];
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    minWidth?: number;
    skeletonRows?: number;
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    isLoading = false,
    searchable = false,
    searchPlaceholder = 'Search...',
    searchKeys = [],
    onRowClick,
    emptyMessage = 'No data available',
    minWidth = 800,
    skeletonRows = 5,
}: DataTableProps<T>) {
    const [search, setSearch] = useState('');

    const filteredData = useMemo(() => {
        if (!searchable || !search || searchKeys.length === 0) {
            return data;
        }

        return data.filter((item) =>
            searchKeys.some((key) => {
                const value = item[key];
                if (value == null) return false;
                return String(value).toLowerCase().includes(search.toLowerCase());
            })
        );
    }, [data, search, searchable, searchKeys]);

    const renderSkeletonRows = () => {
        return Array(skeletonRows)
            .fill(0)
            .map((_, rowIndex) => (
                <Table.Tr key={`skeleton-${rowIndex}`}>
                    {columns.map((col, colIndex) => (
                        <Table.Td key={`skeleton-${rowIndex}-${colIndex}`}>
                            <Skeleton height={20} />
                        </Table.Td>
                    ))}
                </Table.Tr>
            ));
    };

    return (
        <Stack gap="sm">
            {searchable && (
                <TextInput
                    placeholder={searchPlaceholder}
                    leftSection={<IconSearch size={16} />}
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    size="sm"
                    style={{ maxWidth: 300 }}
                />
            )}

            <Paper withBorder radius="md">
                <Table.ScrollContainer minWidth={minWidth}>
                    <Table verticalSpacing="sm" highlightOnHover={!!onRowClick}>
                        <Table.Thead>
                            <Table.Tr>
                                {columns.map((col) => (
                                    <Table.Th
                                        key={col.key}
                                        w={col.width}
                                        style={{ textAlign: col.align || 'left' }}
                                    >
                                        {col.header}
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {isLoading ? (
                                renderSkeletonRows()
                            ) : filteredData.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={columns.length}>
                                        <Text p="xl" c="dimmed" ta="center" size="sm">
                                            {emptyMessage}
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                filteredData.map((item, index) => (
                                    <Table.Tr
                                        key={index}
                                        style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                                        onClick={() => onRowClick?.(item)}
                                    >
                                        {columns.map((col) => (
                                            <Table.Td
                                                key={col.key}
                                                style={{ textAlign: col.align || 'left' }}
                                            >
                                                {col.render(item, index)}
                                            </Table.Td>
                                        ))}
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Paper>
        </Stack>
    );
}
