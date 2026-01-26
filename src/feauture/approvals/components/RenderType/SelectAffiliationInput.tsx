"use client";

import React from 'react';
import { Select as MantineSelect, Paper, Stack, Group, Box, Text } from '@mantine/core';
import { IconBriefcase } from '@tabler/icons-react';

interface SelectAffiliationInputProps {
    label: string;
    value: string | null;
    onChange: (val: string | null) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
}

export const SelectAffiliationInput: React.FC<SelectAffiliationInputProps> = ({ label, value, onChange, placeholder, required, error }) => {
    // Note: In a real app, this would fetch data from an API
    const mockAffiliations = [
        { value: 'PB001', label: 'Phòng Đào Tạo' },
        { value: 'PB002', label: 'Phòng Công tác Sinh viên' },
        { value: 'PB003', label: 'Khoa Công nghệ Thông tin' },
    ];

    return (
        <Paper
            p="md"
            radius="20px"
            className="border-gray-100 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 transition-all border shadow-sm hover:shadow-md group"
        >
            <Stack gap="sm">
                <Group gap="xs">
                    <Box className="text-indigo-600 opacity-80 bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                        <IconBriefcase size={16} />
                    </Box>
                    <Text fw={800} size="sm" className="text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                        {label} {required && <span className="text-red-500">*</span>}
                    </Text>
                </Group>

                <MantineSelect
                    placeholder={placeholder || "Chọn đơn vị/bộ phận"}
                    value={value}
                    onChange={onChange}
                    data={mockAffiliations}
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
            </Stack>
        </Paper>
    );
};
