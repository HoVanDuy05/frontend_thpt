"use client";

import React from 'react';
import { Radio as MantineRadio, Paper, Stack, Group, Box, Text, SimpleGrid } from '@mantine/core';
import { IconListCheck } from '@tabler/icons-react';

interface RadioInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: any[];
    required?: boolean;
    error?: string;
}

export const RadioInput: React.FC<RadioInputProps> = ({ label, value, onChange, options, required, error }) => {
    return (
        <Paper
            p="md"
            radius="20px"
            className="border-gray-100 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 transition-all border shadow-sm hover:shadow-md group"
        >
            <Stack gap="sm">
                <Group gap="xs">
                    <Box className="text-indigo-600 opacity-80 bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                        <IconListCheck size={16} />
                    </Box>
                    <Text fw={800} size="sm" className="text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                        {label} {required && <span className="text-red-500">*</span>}
                    </Text>
                </Group>

                <MantineRadio.Group value={value} onChange={onChange} error={error}>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" mt="xs">
                        {options.map((opt: any) => (
                            <Paper
                                key={opt.value || opt}
                                withBorder
                                radius="md"
                                p="sm"
                                className="bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:border-indigo-200 hover:bg-indigo-50/10 transition-all cursor-pointer"
                            >
                                <MantineRadio
                                    value={opt.value || opt}
                                    label={opt.label || opt}
                                    size="xs"
                                    fw={700}
                                    color="indigo"
                                    styles={{
                                        label: { cursor: 'pointer' },
                                        radio: { cursor: 'pointer' }
                                    }}
                                />
                            </Paper>
                        ))}
                    </SimpleGrid>
                </MantineRadio.Group>
            </Stack>
        </Paper>
    );
};
