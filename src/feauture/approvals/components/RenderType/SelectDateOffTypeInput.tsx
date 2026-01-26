"use client";

import React from 'react';
import { Select as MantineSelect, Paper, Stack, Group, Box, Text, Badge } from '@mantine/core';
import { IconCalendarStats } from '@tabler/icons-react';

interface SelectDateOffTypeInputProps {
    label: string;
    value: string | null;
    onChange: (val: string | null) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
}

export const SelectDateOffTypeInput: React.FC<SelectDateOffTypeInputProps> = ({ label, value, onChange, placeholder, required, error }) => {
    // Mock data for leave types and balances
    const leaveTypes = [
        { value: 'AL', label: 'Nghỉ phép năm', balance: 12 },
        { value: 'SL', label: 'Nghỉ ốm', balance: 5 },
        { value: 'UL', label: 'Nghỉ không lương', balance: null },
    ];

    const data = leaveTypes.map(type => ({
        value: type.value,
        label: `${type.label} ${type.balance !== null ? `(${type.balance} ngày còn lại)` : ''}`
    }));

    return (
        <Paper
            p="md"
            radius="20px"
            className="border-gray-100 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 transition-all border shadow-sm hover:shadow-md group"
        >
            <Stack gap="sm">
                <Group gap="xs">
                    <Box className="text-indigo-600 opacity-80 bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                        <IconCalendarStats size={16} />
                    </Box>
                    <Text fw={800} size="sm" className="text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                        {label} {required && <span className="text-red-500">*</span>}
                    </Text>
                </Group>

                <MantineSelect
                    placeholder={placeholder || "Chọn loại ngày nghỉ"}
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
                        }
                    }}
                />

                {value && (
                    <Box className="mt-1">
                        <Badge variant="light" color="indigo" radius="sm">
                            Đã chọn: {leaveTypes.find(t => t.value === value)?.label}
                        </Badge>
                    </Box>
                )}
            </Stack>
        </Paper>
    );
};
