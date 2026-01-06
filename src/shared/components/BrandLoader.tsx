"use client";

import { Box, Stack, Text, Center } from "@mantine/core";
import { IconSchool } from "@tabler/icons-react";

interface BrandLoaderProps {
    size?: "sm" | "md" | "lg";
    message?: string;
    fullscreen?: boolean;
    minHeight?: string | number;
}

export function BrandLoader({ size = "md", message, fullscreen = false, minHeight }: BrandLoaderProps) {
    const iconSize = size === "sm" ? 18 : size === "lg" ? 32 : 24;
    const boxSize = size === "sm" ? 32 : size === "lg" ? 60 : 48;

    const loader = (
        <Stack align="center" gap="md">
            <Box className="relative">
                {/* Background Pulsing Ring */}
                <Box
                    className="absolute -inset-2 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/10 animate-pulse"
                />
                {/* Logo Box */}
                <Box
                    className="relative flex items-center justify-center bg-indigo-600 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-500/20"
                    style={{ width: boxSize, height: boxSize }}
                >
                    <IconSchool
                        size={iconSize}
                        color="white"
                        stroke={2}
                        className="animate-bounce duration-[2000ms]"
                    />
                </Box>
            </Box>
            {message && (
                <Text size="xs" fw={800} className="uppercase tracking-[0.2em] text-indigo-600/60 dark:text-indigo-400/60 animate-pulse">
                    {message}
                </Text>
            )}
        </Stack>
    );

    if (fullscreen) {
        return (
            <Box
                className="fixed inset-0 z-[1000] bg-[var(--mantine-color-body)] flex items-center justify-center"
            >
                {loader}
            </Box>
        );
    }

    return (
        <Center py="xl" style={{ minHeight }}>
            {loader}
        </Center>
    );
}
