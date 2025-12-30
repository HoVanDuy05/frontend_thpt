"use client";

import { Center, Box, Text, Paper, SimpleGrid, Stack, Title, Group, Container } from "@mantine/core";
import { AuthHeader } from "@/shared/components/layout/AuthHeader";
import { IconSchool } from "@tabler/icons-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box
            className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-950 dark:to-zinc-900"
        >
            <AuthHeader />

            <Center className="flex-1 p1 sm:p-8 mt-6">
                <Container size="lg" className="w-full">
                    <Paper
                        w="100%"
                        maw={1100}
                        radius="lg"
                        shadow="md"
                        withBorder
                        className="overflow-hidden bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800"
                    >
                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0}>
                            {/* LEFT COLUMN: The Form */}
                            <Box
                                p={{ base: "xl", sm: 50 }}
                                className="bg-white dark:bg-zinc-950 flex flex-col justify-center min-h-[400px]"
                            >
                                {children}
                            </Box>

                            {/* RIGHT COLUMN: Branding - Hidden on mobile */}
                            <Box
                                p={{ base: "xl", sm: 50 }}
                                className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 text-white flex-col justify-center relative hidden md:flex"
                            >
                                <Box className="relative z-10">
                                    <Stack gap="xl">
                                        <Box>
                                            <Group gap="xs" mb="md">
                                                <Box p={8} className="bg-white rounded-lg">
                                                    <IconSchool size={32} className="text-blue-700" />
                                                </Box>
                                            </Group>
                                            <Title order={2} className="text-3xl sm:text-4xl font-extrabold leading-tight">
                                                Hệ thống <br /> Đào tạo Trực tuyến
                                            </Title>
                                            <Text mt="sm" className="text-lg font-medium opacity-90">
                                                Nguyễn Huệ Academy Portal
                                            </Text>
                                        </Box>

                                        <Box className="w-full h-px bg-white opacity-20" />

                                        <Stack gap="md">
                                            <Text className="text-sm font-bold uppercase opacity-80">Hỗ trợ sinh viên</Text>

                                            <Group>
                                                <Box className="w-10 h-10 bg-white rounded-full opacity-20" />
                                                <Box>
                                                    <Text className="text-sm font-semibold">Phòng Công tác Sinh viên</Text>
                                                    <Text className="text-xs opacity-80">024.3333.xxxx</Text>
                                                </Box>
                                            </Group>

                                            <Group>
                                                <Box className="w-10 h-10 bg-white rounded-full opacity-20" />
                                                <Box>
                                                    <Text className="text-sm font-semibold">Hỗ trợ Kỹ thuật & IT</Text>
                                                    <Text className="text-xs opacity-80">support@nguyenhue.edu.vn</Text>
                                                </Box>
                                            </Group>
                                        </Stack>
                                    </Stack>
                                </Box>

                                {/* Decorative pattern */}
                                <Box className="absolute -bottom-12 -right-12 w-48 h-48 border-[20px] border-white/5 rounded-full" />
                            </Box>
                        </SimpleGrid>
                    </Paper>
                </Container>
            </Center>

            <Box className="py-4 text-center bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800">
                <Text size="xs" c="dimmed" fw={600}>
                    &copy; 2025 Học viện Nguyễn Huệ. Được phát triển bởi Advanced Agentic Coding.
                </Text>
            </Box>
        </Box>
    );
}
