"use client";

import { Box, Text, Stack } from "@mantine/core";
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
        <Stack align="center" gap="md" className="relative z-10">
            <Box className="relative">
                <Box
                    className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-zinc-800"
                />
                <Box
                    className="absolute inset-0 w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"
                />
            </Box>

            <Stack align="center" gap={4}>
                <Text
                    size="lg"
                    fw={700}
                    className="text-gray-900 dark:text-white tracking-wide"
                >
                    {message || "Đang tải dữ liệu"}
                    <span className="inline-block w-8 text-left">{dots}</span>
                </Text>
                <Text size="sm" c="dimmed" className="font-medium">
                    Vui lòng đợi trong giây lát...
                </Text>
            </Stack>
        </Stack>
    );

    if (fullScreen) {
        return (
            <Box
                className="fixed inset-0 flex items-center justify-center z-[9999] transition-all duration-300 bg-white/80 dark:bg-black/80 backdrop-blur-sm"
            >
                {content}
            </Box>
        );
    }

    return (
        <Box className="flex items-center justify-center p-8 w-full h-full min-h-[200px]">
            {content}
        </Box>
    );
}
