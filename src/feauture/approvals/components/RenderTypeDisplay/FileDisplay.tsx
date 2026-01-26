"use client";

import React from 'react';
import { Box, Text, Group, ActionIcon, Paper, Image } from '@mantine/core';
import { IconFileDescription, IconDownload, IconExternalLink } from '@tabler/icons-react';

interface FileDisplayProps {
    label: string;
    value: any;
    isImage?: boolean;
}

export const FileDisplay: React.FC<FileDisplayProps> = ({ label, value, isImage }) => {
    // If value is a string (URL or filename), we display it gracefully
    const fileName = typeof value === 'string' ? value.split('/').pop() : 'Tệp đính kèm';

    return (
        <Box className="group col-span-full">
            <Text size="xs" fw={850} c="dimmed" tt="uppercase" lts={1.2} mb={10} className="group-hover:text-indigo-600 transition-colors">
                {label}
            </Text>

            {value ? (
                <Stack gap="sm">
                    {isImage ? (
                        <Paper withBorder radius="lg" className="overflow-hidden border-gray-100 max-w-sm">
                            <Image
                                src={typeof value === 'string' ? value : URL.createObjectURL(value)}
                                alt={label}
                                fallbackSrc="https://placehold.co/600x400?text=No+Image"
                            />
                        </Paper>
                    ) : (
                        <Paper withBorder p="sm" radius="md" className="bg-gray-50/50 border-gray-100 dark:border-zinc-800 dark:bg-zinc-800/30">
                            <Group justify="space-between">
                                <Group gap="sm">
                                    <IconFileDescription size={20} className="text-indigo-600" />
                                    <Text size="sm" fw={700}>{fileName}</Text>
                                </Group>
                                <Group gap="xs">
                                    <ActionIcon variant="subtle" color="gray" size="sm">
                                        <IconExternalLink size={16} />
                                    </ActionIcon>
                                    <ActionIcon variant="light" color="indigo" size="sm">
                                        <IconDownload size={16} />
                                    </ActionIcon>
                                </Group>
                            </Group>
                        </Paper>
                    )}
                </Stack>
            ) : (
                <Text fw={750} size="md" c="dimmed">Không có tệp đính kèm</Text>
            )}

            <Box h={2} className="bg-gray-50 dark:bg-zinc-800 mt-4 rounded-full" />
        </Box>
    );
};

// Add Stack import which was missing in previous thought but needed for JSX
import { Stack } from '@mantine/core';
