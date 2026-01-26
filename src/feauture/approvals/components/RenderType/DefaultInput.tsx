"use client";

import React from 'react';
import { Paper, Stack, Group, Box, Text, Group as MantineGroup, Divider } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { dayjs } from '@/shared/utils/date.util';

interface DefaultInputProps {
    label: string;
    value: string;
    optionValue: any;
    required?: boolean;
}

export const DefaultInput: React.FC<DefaultInputProps> = ({ label, value, optionValue, required }) => {
    // Mock data based on the user's DefaultInput logic
    const monthlyData = [
        { month: dayjs().format('YYYYMM'), available: 12, total: 12 },
        { month: dayjs().add(1, 'month').format('YYYYMM'), available: 10, total: 12 },
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
                        <IconInfoCircle size={16} />
                    </Box>
                    <Text fw={800} size="sm" className="text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                        {label} {required && <span className="text-red-500">*</span>}
                    </Text>
                </Group>

                <Stack gap="xs" className="pl-9">
                    {monthlyData.map((data) => (
                        <Box key={data.month} className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700">
                            <MantineGroup justify="space-between">
                                <Text fw={700} size="sm">
                                    Tháng {dayjs(data.month, 'YYYYMM').format('MM/YYYY')}:
                                </Text>
                                <Text size="sm" c="indigo" fw={800}>
                                    {data.available} / {data.total} (còn lại)
                                </Text>
                            </MantineGroup>
                        </Box>
                    ))}

                    <Text size="xs" c="dimmed" fs="italic">
                        Dữ liệu được tính toán tự động dựa trên cấu hình: {optionValue}
                    </Text>
                </Stack>
            </Stack>
        </Paper>
    );
};
