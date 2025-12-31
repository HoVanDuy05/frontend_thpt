"use client";

import { Box, Container, UnstyledButton, Group, Text, Stack, useMantineTheme } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
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

            {/* Top Bar Navigation */}
            <Box className="fixed top-0 left-0 right-0 z-50 p-6 md:p-10">
                <Container size="lg" className="px-4">
                    <UnstyledButton
                        component={Link}
                        href="/"
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
                    >
                        <Box className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-transform group-hover:-translate-x-1">
                            <IconArrowLeft size={18} stroke={2.5} />
                        </Box>
                        <Text size="sm" fw={700} className="tracking-tight">
                            {t("back")}
                        </Text>
                    </UnstyledButton>
                </Container>
            </Box>

            {/* Content Section */}
            <Box className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
                <Container size={440} className="w-full">
                    {children}
                </Container>
            </Box>

            {/* Minimal Legal Footer */}
            <Box className="p-8 pb-10 flex justify-center border-t border-zinc-100/50 dark:border-zinc-900/50">
                <Text size="xs" fw={600} className="text-zinc-300 dark:text-zinc-800 uppercase tracking-widest">
                    © 2026 Admin Portal
                </Text>
            </Box>
        </Box>
    );
}
