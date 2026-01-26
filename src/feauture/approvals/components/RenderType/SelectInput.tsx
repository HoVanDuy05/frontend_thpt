"use client";

import React from 'react';
import { Select as MantineSelect, Paper, Stack, Group, Box, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

interface SelectInputProps {
    label: string;
    value: string | null;
    onChange: (val: string | null) => void;
    data: any[];
    placeholder?: string;
    required?: boolean;
    error?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, value, onChange, data, placeholder, required, error }) => {
    return (
        <Paper
            p="md"
            radius="20px"
            className="border-gray-100 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 transition-all border shadow-sm hover:shadow-md group"
        >
            <Stack gap="sm">
                <Group gap="xs">
                    <Box className="text-indigo-600 opacity-80 bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                        <IconChevronDown size={16} />
                    </Box>
                    <Text fw={800} size="sm" className="text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                        {label} {required && <span className="text-red-500">*</span>}
                    </Text>
                </Group>

                <MantineSelect
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    data={data}
                    error={error}
                    size="md"
                    radius="12px"
                    searchable
                    clearable
                    styles={{
                        input: {
                            backgroundColor: 'var(--mantine-color-body)',
                            border: '1px solid var(--mantine-color-default-border)',
                            height: '50px',
                            fontSize: '14px',
                            fontWeight: 500,
                            paddingLeft: '16px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:focus': {
                                borderColor: 'var(--mantine-color-indigo-6)',
                                boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.08)',
                            },
                        },
                        dropdown: {
                            borderRadius: '12px',
                            border: '1px solid var(--mantine-color-default-border)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        }
                    }}
                />
            </Stack>
        </Paper>
    );
};
