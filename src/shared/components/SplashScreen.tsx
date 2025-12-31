"use client";

import { Box, Text, Stack } from "@mantine/core";
import { useEffect, useState } from "react";

export function SplashScreen() {
    const [dots, setDots] = useState("");
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);

        // Start fade out after 2 seconds
        const fadeTimeout = setTimeout(() => {
            setFadeOut(true);
        }, 2000);

        return () => {
            clearInterval(interval);
            clearTimeout(fadeTimeout);
        };
    }, []);

    return (
        <Box
            className={`fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 dark:from-blue-700 dark:via-indigo-700 dark:to-violet-800 z-[9999] transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        >
            <Stack align="center" gap="xl">
                {/* Animated Rings */}
                <Box className="relative w-32 h-32">
                    {/* Outer ring - ping */}
                    <Box className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping" />

                    {/* Middle ring - spin */}
                    <Box
                        className="absolute inset-3 border-4 border-white/50 border-t-white rounded-full animate-spin"
                        style={{ animationDuration: "1.5s" }}
                    />

                    {/* Inner ring - pulse */}
                    <Box className="absolute inset-6 border-4 border-white/70 rounded-full animate-pulse" />

                    {/* Center dot */}
                    <Box className="absolute inset-0 flex items-center justify-center">
                        <Box className="w-8 h-8 bg-white rounded-full shadow-2xl" />
                    </Box>
                </Box>

                {/* Loading Text */}
                <Stack align="center" gap="xs">
                    <Text size="2xl" fw={900} className="text-white tracking-wide">
                        Nguyễn Huệ Academy
                    </Text>
                    <Text size="lg" className="text-white/90">
                        Đang khởi động
                        <span className="inline-block w-8 text-left">{dots}</span>
                    </Text>
                </Stack>

                {/* Animated Dots */}
                <Box className="flex gap-2 mt-4">
                    <Box className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <Box className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <Box className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </Box>
            </Stack>
        </Box>
    );
}
