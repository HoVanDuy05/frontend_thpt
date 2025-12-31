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
        <Stack align="center" gap="lg" className="relative z-10">
            {/* Professional Loading Spinner */}
            <Box className="relative w-16 h-16">
                <Box
                    className="absolute inset-0 rounded-full border-[3px] border-slate-100"
                />
                <Box
                    className="absolute inset-0 rounded-full border-[3px] border-indigo-600 border-t-transparent animate-spin"
                    style={{ animationDuration: '0.8s' }}
                />
                <Box className="absolute inset-0 flex items-center justify-center">
                    <Box className="w-2 h-2 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)] animate-pulse" />
                </Box>
            </Box>

            <Stack align="center" gap={4}>
                <Text
                    size="md"
                    fw={700}
                    className="text-slate-900 tracking-[0.1em]"
                >
                    {message || "Đang xử lý"}
                    <span className="inline-block w-8 text-left">{dots}</span>
                </Text>
                <Text size="xs" className="text-slate-400 font-medium uppercase tracking-[0.15em]">
                    Vui lòng đợi trong giây lát
                </Text>
            </Stack>
        </Stack>
    );

    if (fullScreen) {
        return (
            <Box
                className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            >
                <Box className="absolute inset-0 backdrop-blur-[2px]" />
                <Box
                    className="p-12 bg-white rounded-[32px] shadow-[0_20px_70px_rgba(0,0,0,0.06)] border border-slate-50"
                >
                    {content}
                </Box>
            </Box>
        );
    }

    return (
        <Box className="flex items-center justify-center p-12">
            {content}
        </Box>
    );
}
