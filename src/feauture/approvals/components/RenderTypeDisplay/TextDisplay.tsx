"use client";

import React from 'react';
import { Box, Text } from '@mantine/core';

interface TextDisplayProps {
    label: string;
    value: any;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({ label, value }) => {
    return (
        <Box className="group">
            <Text size="xs" fw={850} c="dimmed" tt="uppercase" lts={1.2} mb={10} className="group-hover:text-indigo-600 transition-colors">
                {label}
            </Text>
            <Text fw={750} size="md" className="text-gray-900 dark:text-gray-100 leading-snug">
                {String(value || "N/A")}
            </Text>
            <Box h={2} className="bg-gray-50 dark:bg-zinc-800 mt-4 rounded-full" />
        </Box>
    );
};
