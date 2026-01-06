"use client";

import { Box, Container, UnstyledButton, Group, Text, Stack, useMantineTheme } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations("common.actions");
    const theme = useMantineTheme();

    return (
        <Box className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 relative overflow-hidden">
            {/* Background elements to reduce "sparseness" */}
            <Box className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
            <Box className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Top Bar Navigation - Fixed for consistent access */}
            <Box className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
                <Container size="lg" className="w-full">
                    <UnstyledButton
                        component={Link}
                        href="/"
                        className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-110 active:scale-95 pointer-events-auto"
                        aria-label="Home"
                    >
                        <IconHome size={20} stroke={2.5} />
                    </UnstyledButton>
                </Container>
            </Box>

            {/* Content Section */}
            <Box className="flex-1 flex flex-col items-center justify-center p-6 pt-20 sm:pt-24 sm:p-12 relative z-10">
                <Container size={440} className="w-full">
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
