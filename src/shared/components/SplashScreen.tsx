"use client";

import { Box, Text, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function SplashScreen() {
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [visible, setVisible] = useState(true);
    const t = useTranslations("common.loading");

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) return 100;
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 90);
            });
        }, 150);

        const fadeTimeout = setTimeout(() => {
            setProgress(100);
            setFadeOut(true);
            setTimeout(() => setVisible(false), 700);
        }, 2200);

        return () => {
            clearInterval(timer);
            clearTimeout(fadeTimeout);
        };
    }, []);

    if (!visible) return null;

    return (
        <Box
            className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-700 bg-white dark:bg-black ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <Stack align="center" gap="xl" className="relative z-10 p-4">
                {/* Logo Section */}
                <Box className="animate-bounce duration-[2000ms]">
                    <Box className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/10 p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/favicon.png"
                            alt="Logo"
                            className="w-full h-full object-contain"
                        />
                    </Box>
                </Box>

                {/* Typography Section */}
                <Stack align="center" gap={4} className="w-full">
                    <Title
                        order={1}
                        className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 text-center whitespace-nowrap"
                    >
                        Nguyễn Huệ
                    </Title>
                    <Text
                        size="sm"
                        fw={600}
                        className="text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] text-center whitespace-nowrap"
                    >
                        Trường THPT Nguyễn Huệ
                    </Text>
                </Stack>

                {/* Progress Indicators */}
                <Stack align="center" gap="xs" className="w-64 sm:w-80 mt-8">
                    <Box className="relative w-full h-1 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <Box
                            className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-200 ease-linear rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </Box>
                    <Text size="xs" c="dimmed" className="font-bold uppercase tracking-wider whitespace-nowrap">
                        {t('starting')}
                    </Text>
                </Stack>
            </Stack>

            {/* Footer */}
            <Box className="absolute bottom-8 w-full text-center">
                <Text size="xs" fw={700} c="dimmed" className="uppercase tracking-[0.2em] opacity-50">
                    {t('smart_system')}
                </Text>
            </Box>
        </Box>
    );
}
