"use client";

import { Box, Loader, Text, Stack } from "@mantine/core";
import { useEffect, useState } from "react";

interface LoadingProps {
    fullScreen?: boolean;
    message?: string;
}

export function Loading({ fullScreen = false, message }: LoadingProps) {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const content = (
        <Stack align="center" gap="xl">
            {/* Modern animated loader */}
            <Box className="relative">
                {/* Outer ring */}
                <Box className="absolute inset-0 w-24 h-24 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-ping opacity-20" />

                {/* Middle ring */}
                <Box className="absolute inset-2 w-20 h-20 border-4 border-blue-300 dark:border-blue-800 rounded-full animate-spin"
                    style={{ animationDuration: "1.5s" }} />

                {/* Inner loader */}
                <Box className="relative w-24 h-24 flex items-center justify-center">
                    <Loader size="lg" color="blue" />
                </Box>
            </Box>

            {/* Loading text */}
            <Stack align="center" gap="xs">
                <Text size="lg" fw={600} className="text-gray-700 dark:text-gray-300">
                    {message || "Đang tải"}
                    <span className="inline-block w-8 text-left">{dots}</span>
                </Text>
                <Text size="sm" c="dimmed">
                    Vui lòng đợi trong giây lát
                </Text>
            </Stack>
        </Stack>
    );

    if (fullScreen) {
        return (
            <Box className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 z-50">
                {content}
            </Box>
        );
    }

    return (
        <Box className="flex items-center justify-center p-12">
            {content}
        </Box>
    );
}
