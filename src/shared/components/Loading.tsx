"use client";

import { Stack, Text, Loader, Box } from "@mantine/core";
import { IconSchool } from "@tabler/icons-react";

interface LoadingProps {
    message?: string;
    subMessage?: string;
    fullScreen?: boolean;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function Loading({
    message = "Đang tải...",
    subMessage = "Vui lòng đợi trong giây lát",
    fullScreen = false,
    size = "md"
}: LoadingProps) {
    const content = (
        <Stack align="center" gap="xl">
            {/* Animated School Icon with Loader */}
            <Box className="relative w-32 h-32">
                {/* Outer ping animation */}
                <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-ping opacity-75" />

                {/* Rotating loader */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader size="xl" color="blue" />
                </div>

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-full shadow-2xl animate-pulse">
                        <IconSchool size={32} className="text-white" stroke={2.5} />
                    </div>
                </div>
            </Box>

            {/* Loading Text */}
            <Stack align="center" gap="xs">
                {message && (
                    <Text size="xl" fw={700} className="text-gray-800 dark:text-gray-100 animate-pulse">
                        {message}
                    </Text>
                )}
                {subMessage && (
                    <Text size="sm" c="dimmed">
                        {subMessage}
                    </Text>
                )}
            </Stack>

            {/* Animated Dots */}
            <div className="flex gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </Stack>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
                {content}
            </div>
        );
    }

    return content;
}
