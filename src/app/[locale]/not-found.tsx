"use client";

import React from "react";
import errorImage from "@/shared/assets/404-icon.svg";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container, Title, Text, Stack, Box } from "@mantine/core";

export default function NotFound() {
    const t = useTranslations("notFoundPage");

    return (
        <Box
            className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950"
            style={{
                backgroundImage: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.05) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(168, 85, 247, 0.05) 0%, transparent 40%)"
            }}
        >
            <Container size="md">
                <Stack align="center" justify="center" gap="xs" className="text-center">
                    <div className="relative mb-8">
                        {/* Soft glow behind image */}
                        <div className="absolute inset-0 bg-indigo-500 blur-[100px] opacity-10 rounded-full" />

                        <Image
                            src={errorImage}
                            width={500}
                            height={400}
                            alt="404 Not Found"
                            className="relative max-w-full drop-shadow-2xl"
                            priority
                        />
                    </div>

                    <Stack gap={4} align="center">
                        <Title
                            order={1}
                            className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent italic tracking-tighter"
                        >
                            {t("title")}
                        </Title>

                        <Text
                            size="xl"
                            fw={500}
                            className="max-w-[500px] opacity-80"
                        >
                            {t("description")}
                        </Text>
                    </Stack>

                    {/* Decorative line */}
                    <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-8 opacity-40" />
                </Stack>
            </Container>
        </Box>
    );
}

