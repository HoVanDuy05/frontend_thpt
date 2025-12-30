"use client";

import React from "react";
import errorImage from "@/shared/assets/web-maintenance.svg";
import Image from "next/image";
import { Container, Title, Text, Stack, Box, Paper } from "@mantine/core";
import { useTranslations } from "next-intl";

export default function Error({
    error,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations("error_page");

    return (
        <Box
            className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950"
            style={{
                backgroundImage: "radial-gradient(circle at bottom right, rgba(239, 68, 68, 0.05) 0%, transparent 40%), radial-gradient(circle at top left, rgba(220, 38, 38, 0.05) 0%, transparent 40%)"
            }}
        >
            <Container size="sm">
                <Stack align="center" justify="center" gap="xl" className="text-center">
                    <div className="relative">
                        {/* Soft red glow behind image */}
                        <div className="absolute inset-0 bg-red-500 blur-[100px] opacity-10 rounded-full" />

                        <Image
                            src={errorImage}
                            width={400}
                            height={400}
                            alt="Maintenance"
                            className="relative max-w-full drop-shadow-2xl"
                            priority
                        />
                    </div>

                    <Stack gap="xs" align="center">
                        <Title
                            order={1}
                            className="text-4xl md:text-5xl font-black bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 bg-clip-text text-transparent tracking-tight"
                        >
                            {t("title")}
                        </Title>

                        <Text
                            size="lg"
                            fw={500}
                            className="max-w-[500px] opacity-80"
                        >
                            {t("description")}
                        </Text>
                    </Stack>

                    <Paper
                        withBorder
                        p="md"
                        radius="md"
                        className="w-full max-w-md bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-red-100 dark:border-red-900/30 shadow-sm"
                    >
                        <Stack gap={4} align="flex-start" className="text-left">
                            <Text size="xs" fw={700} c="red" tt="uppercase" className="tracking-wider">
                                Error Details
                            </Text>
                            <Text size="sm" fw={600} className="break-all">
                                {error.name}: {error.message}
                            </Text>
                            {error.digest && (
                                <Text size="xs" c="dimmed" className="font-mono mt-1">
                                    ID: {error.digest}
                                </Text>
                            )}
                        </Stack>
                    </Paper>

                    {/* Decorative line */}
                    <div className="w-16 h-1.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-full mt-4 opacity-40" />
                </Stack>
            </Container>
        </Box>
    );
}


