"use client";

import { Stack, Text, Box, Group, RingProgress, Paper, ActionIcon } from "@mantine/core";
import { IconCloudUpload, IconFileCheck, IconX } from "@tabler/icons-react";

interface UploadLoadingProps {
    fileName?: string;
    fileSize?: string;
    progress: number;
    onCancel?: () => void;
}

export function UploadLoading({
    fileName = "document.pdf",
    fileSize = "2.4 MB",
    progress,
    onCancel
}: UploadLoadingProps) {
    const isCompleted = progress === 100;

    return (
        <Paper p="md" radius="md" withBorder className="bg-zinc-50 dark:bg-zinc-900 border-dashed border-2">
            <Group justify="space-between" wrap="nowrap">
                <Group gap="md" wrap="nowrap">
                    <Box className={`p-3 rounded-xl transition-colors ${isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                        {isCompleted ? (
                            <IconFileCheck size={28} className="text-green-600" />
                        ) : (
                            <IconCloudUpload size={28} className="text-blue-600 animate-bounce" />
                        )}
                    </Box>

                    <Stack gap={0}>
                        <Text size="sm" fw={700} className="line-clamp-1 text-zinc-800 dark:text-zinc-200">
                            {fileName}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {fileSize} • {isCompleted ? 'Đã tải lên' : 'Đang tải lên...'}
                        </Text>
                    </Stack>
                </Group>

                <Group gap="sm">
                    <RingProgress
                        size={56}
                        thickness={5}
                        roundCaps
                        sections={[{ value: progress, color: isCompleted ? 'green' : 'blue' }]}
                        label={
                            <Center>
                                <Text size="xs" fw={700} className={isCompleted ? 'text-green-600' : 'text-blue-600'}>
                                    {progress}%
                                </Text>
                            </Center>
                        }
                    />

                    {!isCompleted && onCancel && (
                        <ActionIcon variant="subtle" color="gray" onClick={onCancel} radius="xl">
                            <IconX size={16} />
                        </ActionIcon>
                    )}
                </Group>
            </Group>
        </Paper>
    );
}

// Helper to center RingProgress label
function Center({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {children}
        </div>
    );
}
