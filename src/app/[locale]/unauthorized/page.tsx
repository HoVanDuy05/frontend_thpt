"use client";

import { Container, Title, Text, Button, Stack, Center, Paper } from "@mantine/core";
import { IconLock, IconArrowLeft, IconLogout } from "@tabler/icons-react";
import { useRouter } from "@/i18n/routing";
import { useAppStore } from "@/providers/store/useAppStore";

export default function UnauthorizedPage() {
    const router = useRouter();
    const { setToken, setUser } = useAppStore();

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        router.push("/auth/login");
    };

    return (
        <Center className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4">
            <Container size="sm">
                <Paper shadow="xl" p={40} radius="lg" className="text-center relative overflow-hidden bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />

                    <Stack align="center" gap="xl">
                        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full">
                            <IconLock size={60} className="text-red-600" stroke={1.5} />
                        </div>

                        <Stack gap="xs">
                            <Title order={1} className="text-3xl font-black text-zinc-900 dark:text-white">
                                Truy cập bị từ chối
                            </Title>
                            <Text size="lg" c="dimmed" className="max-w-md mx-auto">
                                Rất tiếc, bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại tài khoản hoặc liên hệ quản trị viên.
                            </Text>
                        </Stack>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
                            <Button
                                variant="default"
                                size="lg"
                                leftSection={<IconArrowLeft size={20} />}
                                onClick={() => router.back()}
                                className="px-8"
                            >
                                Quay lại
                            </Button>
                            <Button
                                color="red"
                                size="lg"
                                leftSection={<IconLogout size={20} />}
                                onClick={handleLogout}
                                className="px-8 shadow-md"
                            >
                                Đăng xuất & Đăng nhập lại
                            </Button>
                        </div>
                    </Stack>
                </Paper>
            </Container>
        </Center>
    );
}
