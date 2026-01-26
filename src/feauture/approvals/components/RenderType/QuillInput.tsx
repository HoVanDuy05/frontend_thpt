"use client";

import React from 'react';
import { Paper, Stack, Group, Box, Text, Textarea } from '@mantine/core';
import { IconForms } from '@tabler/icons-react';

interface QuillInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
}

export const QuillInput: React.FC<QuillInputProps> = ({ label, value, onChange, placeholder, required, error }) => {
    return (
        <Paper
            p="md"
            radius="20px"
            className="border-gray-100 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 transition-all border shadow-sm hover:shadow-md group"
        >
            <Stack gap="sm">
                <Group gap="xs">
                    <Box className="text-indigo-600 opacity-80 bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                        <IconForms size={16} />
                    </Box>
                    <Text fw={800} size="sm" className="text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                        {label} {required && <span className="text-red-500">*</span>}
                    </Text>
                </Group>

                <Box className="relative">
                    <Textarea
                        placeholder={placeholder || "Nhập nội dung văn bản giàu định dạng..."}
                        value={value}
                        onChange={(e) => onChange(e.currentTarget.value)}
                        error={error}
                        size="md"
                        radius="12px"
                        minRows={6}
                        styles={{
                            input: {
                                backgroundColor: 'var(--mantine-color-body)',
                                border: '1px solid var(--mantine-color-default-border)',
                                fontSize: '14px',
                                fontWeight: 500,
                                paddingLeft: '16px',
                                paddingTop: '12px',
                                minHeight: '180px',
                                borderTop: '4px solid var(--mantine-color-indigo-6)'
                            }
                        }}
                    />
                    <Box className="absolute top-0 right-0 p-2 pointer-events-none">
                        <Text size="xs" fw={700} c="indigo" className="uppercase tracking-widest opacity-30">Quill Mode</Text>
                    </Box>
                </Box>
            </Stack>
        </Paper>
    );
};
