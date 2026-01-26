"use client";

import React from 'react';
import { DatePickerInput as MantineDatePickerInput } from '@mantine/dates';
import { Paper, Stack, Group, Box, Text } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { dayjs } from '@/shared/utils/date.util';

interface DateInputProps {
    label: string;
    value: string | null;
    onChange: (val: string | null) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
}

export const DateInput: React.FC<DateInputProps> = ({ label, value, onChange, placeholder, required, error }) => {
    return (
        <Paper
            p="md"
            radius="20px"
            className="border-gray-100 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 transition-all border shadow-sm hover:shadow-md group"
        >
            <Stack gap="sm">
                <Group gap="xs">
                    <Box className="text-indigo-600 opacity-80 bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                        <IconCalendar size={16} />
                    </Box>
                    <Text fw={800} size="sm" className="text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                        {label} {required && <span className="text-red-500">*</span>}
                    </Text>
                </Group>

                <MantineDatePickerInput
                    placeholder={placeholder}
                    value={value ? dayjs(value).toDate() : null}
                    onChange={(date) => onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)}
                    error={error}
                    size="md"
                    radius="12px"
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
                        }
                    }}
                />
            </Stack>
        </Paper>
    );
};
