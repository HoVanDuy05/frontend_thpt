"use client";

import { Box, Text, Stack, Group } from "@mantine/core";
import { useEffect, useState } from "react";

export function SplashScreen() {
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) return 100;
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 90);
            });
        }, 200);

        const fadeTimeout = setTimeout(() => {
            setProgress(100);
            setFadeOut(true);
            setTimeout(() => setVisible(false), 800);
        }, 3200);

        return () => {
            clearInterval(timer);
            clearTimeout(fadeTimeout);
        };
    }, []);

    if (!visible) return null;

    return (
        <Box
            className={`fixed inset-0 flex items-center justify-center z-[9999] transition-all duration-700 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{
                backgroundColor: "#ffffff",
            }}
        >
            {/* Subtle Gradient Background */}
            <Box
                className="absolute inset-0 opacity-40"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, #f0f7ff 0%, #ffffff 100%)'
                }}
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fade-up {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                @keyframes pulse-subtle {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.02); opacity: 0.95; }
                }
            `}} />

            <Stack align="center" gap={40} className="relative z-10">
                {/* Logo Section */}
                <Box
                    style={{
                        animation: 'fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    }}
                >
                    <Box
                        className="w-32 h-32 p-4 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center justify-center"
                        style={{ animation: 'pulse-subtle 3s infinite ease-in-out' }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/favicon.png"
                            alt="Academy Logo"
                            className="w-full h-full object-contain"
                        />
                    </Box>
                </Box>

                {/* Typography Section */}
                <Stack align="center" gap={8} style={{ animation: 'fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards', opacity: 0 }}>
                    <Text
                        fw={800}
                        className="text-slate-900 tracking-[0.15em] uppercase text-center"
                        style={{ fontSize: '2.2rem', letterSpacing: '0.25em' }}
                    >
                        Nguyễn Huệ
                    </Text>
                    <Group gap="md" align="center">
                        <Box className="h-px w-8 bg-slate-200" />
                        <Text
                            fw={500}
                            className="text-indigo-600 tracking-[0.6em] uppercase"
                            style={{ fontSize: '0.85rem' }}
                        >
                            Trường THPT Nguyễn Huệ
                        </Text>
                        <Box className="h-px w-8 bg-slate-200" />
                    </Group>
                </Stack>

                {/* Progress Indicators */}
                <Stack align="center" gap="md" className="w-80" style={{ animation: 'fade-up 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards', opacity: 0 }}>
                    <Box className="relative w-full h-[3px] bg-slate-100 rounded-full overflow-hidden">
                        <Box
                            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </Box>
                    <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                        Đang khởi động hệ thống
                    </Text>
                </Stack>
            </Stack>

            {/* Elegant Footer Overlay */}
            <Box className="absolute bottom-12 w-full text-center opacity-30">
                <Text size="xs" fw={600} className="text-slate-500 tracking-[0.4em] uppercase">
                    Hệ thống quản lý giáo dục hiện đại
                </Text>
            </Box>
        </Box>
    );
}
