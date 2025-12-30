"use client";

import { Stack, Text, Box, Progress, Group, Paper } from "@mantine/core";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";

interface TaskLoadingProps {
    title?: string;
    description?: string;
    progress?: number;
}

export function TaskLoading({
    title = "Đang xử lý dữ liệu",
    description = "Vui lòng đợi trong khi hệ thống hoàn tất các tác vụ...",
    progress
}: TaskLoadingProps) {
    return (
        <Paper p="xl" radius="lg" withBorder className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />

            <Stack gap="md">
                <Group justify="space-between" align="center">
                    <Group gap="sm">
                        <Box className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <IconLoader2 size={24} className="text-blue-600 animate-spin" />
                        </Box>
                        <Stack gap={2}>
                            <Text fw={700} size="lg" className="text-zinc-800 dark:text-zinc-100">
                                {title}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {description}
                            </Text>
                        </Stack>
                    </Group>
                    {progress === 100 && (
                        <Box className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                            <IconCheck size={16} className="text-green-600" stroke={3} />
                        </Box>
                    )}
                </Group>

                {progress !== undefined && (
                    <Stack gap={6}>
                        <Group justify="space-between" mb={-4}>
                            <Text size="xs" fw={700} c="blue">{progress}%</Text>
                            <Text size="xs" c="dimmed">Đang hoàn tất...</Text>
                        </Group>
                        <Progress
                            value={progress}
                            size="sm"
                            radius="xl"
                            animated={progress < 100}
                            color="blue"
                            className="bg-blue-50 dark:bg-zinc-800"
                        />
                    </Stack>
                )}

                {progress === undefined && (
                    <Progress
                        value={100}
                        size="xs"
                        radius="xl"
                        animated
                        color="blue"
                        className="bg-blue-50 dark:bg-zinc-800 opacity-50"
                    />
                )}
            </Stack>
        </Paper>
    );
}
