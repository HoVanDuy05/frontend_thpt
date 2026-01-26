"use client";

import React from 'react';
import { Box, Title, Divider, Stack } from '@mantine/core';

interface SectionHeaderProps {
    label: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ label }) => {
    return (
        <Box className="pt-10 pb-6 first:pt-0">
            <Stack align="center" gap="xs">
                <Box className="w-12 h-1.5 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
                <Title order={3} className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-center text-gray-900 dark:text-white px-4">
                    {label}
                </Title>
                <Box className="w-full max-w-xs h-0.5 bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-800 to-transparent my-2" />
            </Stack>
        </Box>
    );
};
