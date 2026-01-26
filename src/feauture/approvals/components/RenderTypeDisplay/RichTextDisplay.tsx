"use client";

import React from 'react';
import { Box, Text, Paper, TypographyStylesProvider } from '@mantine/core';

interface RichTextDisplayProps {
    label: string;
    value: any;
}

export const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ label, value }) => {
    return (
        <Box className="group col-span-full">
            <Text size="xs" fw={850} c="dimmed" tt="uppercase" lts={1.2} mb={10} className="group-hover:text-indigo-600 transition-colors">
                {label}
            </Text>

            <Paper withBorder p="md" radius="lg" className="bg-gray-50/30 border-gray-100 dark:border-zinc-800/50">
                <TypographyStylesProvider>
                    <div dangerouslySetInnerHTML={{ __html: String(value || "<i>Không có nội dung</i>") }} />
                </TypographyStylesProvider>
            </Paper>

            <Box h={2} className="bg-gray-50 dark:bg-zinc-800 mt-4 rounded-full" />
        </Box>
    );
};
