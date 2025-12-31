"use client";

import { Center, Box, Text, Paper, SimpleGrid, Stack, Title, Group, Container, rem } from "@mantine/core";
import { AuthHeader } from "@/shared/components/layout/AuthHeader";
import { IconSchool, IconShieldCheck, IconClock24, IconDevices } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Box className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
            <AuthHeader />

            <Center className="flex-1 p-4 sm:p-6 md:p-8">
                <Container size="lg" className="w-full">
                    <Paper
                        w="100%"
                        maw={1100}
                        radius="xl"
                        shadow="xl"
                        withBorder
                        className="overflow-hidden bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                    >
                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0}>
                            {/* LEFT: Form */}
                            <Box
                                p={{ base: "lg", sm: "xl", md: 50 }}
                                className="bg-white dark:bg-zinc-900 flex flex-col justify-center min-h-[500px]"
                            >
                                {children}
                            </Box>

                            {/* RIGHT: Branding - Hidden on mobile */}
                            {!isMobile && (
                                <Box
                                    p={{ base: "xl", sm: 50 }}
                                    className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 dark:from-blue-700 dark:via-indigo-700 dark:to-violet-800 text-white flex flex-col justify-between relative overflow-hidden"
                                >
                                    {/* Decorative circles */}
                                    <Box className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                                    <Box className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

                                    <Box className="relative z-10">
                                        <Stack gap="xl">
                                            {/* Logo & Title */}
                                            <Box>
                                                <Group gap="sm" mb="md">
                                                    <Box p={12} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                                        <IconSchool size={36} stroke={2} />
                                                    </Box>
                                                </Group>
                                                <Title order={1} className="text-4xl md:text-5xl font-black leading-tight mb-3">
                                                    Hệ thống<br />Quản lý Trường học
                                                </Title>
                                                <Text className="text-lg font-semibold opacity-90">
                                                    Nguyễn Huệ Academy Portal
                                                </Text>
                                            </Box>

                                            {/* Features */}
                                            <Stack gap="md" mt="xl">
                                                <Group gap="md">
                                                    <Box className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                                                        <IconShieldCheck size={24} />
                                                    </Box>
                                                    <Box>
                                                        <Text className="font-bold text-base">Bảo mật cao</Text>
                                                        <Text className="text-sm opacity-80">Mã hóa dữ liệu end-to-end</Text>
                                                    </Box>
                                                </Group>

                                                <Group gap="md">
                                                    <Box className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                                                        <IconClock24 size={24} />
                                                    </Box>
                                                    <Box>
                                                        <Text className="font-bold text-base">Truy cập 24/7</Text>
                                                        <Text className="text-sm opacity-80">Học tập mọi lúc, mọi nơi</Text>
                                                    </Box>
                                                </Group>

                                                <Group gap="md">
                                                    <Box className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                                                        <IconDevices size={24} />
                                                    </Box>
                                                    <Box>
                                                        <Text className="font-bold text-base">Đa nền tảng</Text>
                                                        <Text className="text-sm opacity-80">Web, Mobile, Tablet</Text>
                                                    </Box>
                                                </Group>
                                            </Stack>
                                        </Stack>
                                    </Box>

                                    {/* Support Info */}
                                    <Box className="relative z-10 mt-auto pt-8 border-t border-white/20">
                                        <Text className="text-xs font-bold uppercase opacity-70 mb-3">Hỗ trợ</Text>
                                        <Group gap="xs">
                                            <Text className="text-sm font-semibold">📞 024.3333.xxxx</Text>
                                            <Text className="text-sm opacity-70">|</Text>
                                            <Text className="text-sm font-semibold">✉️ support@nguyenhue.edu.vn</Text>
                                        </Group>
                                    </Box>
                                </Box>
                            )}
                        </SimpleGrid>
                    </Paper>
                </Container>
            </Center>

            {/* Footer */}
            <Box className="py-4 text-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-t border-gray-200 dark:border-zinc-800">
                <Text size="xs" c="dimmed" fw={600}>
                    © 2025 Học viện Nguyễn Huệ. Phát triển bởi Advanced Agentic Coding.
                </Text>
            </Box>
        </Box>
    );
}
