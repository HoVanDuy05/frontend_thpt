"use client";

import { Container, Group, Button, Title, ActionIcon, useMantineColorScheme, Avatar, Menu, Text } from "@mantine/core";
import { IconSun, IconMoon, IconLogout, IconUser, IconSettings, IconChevronDown } from "@tabler/icons-react";
import { useAppStore } from "@/providers/store/useAppStore";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguagePicker } from "../LanguagePicker";

export function StudentHeader() {
    const { user, logout } = useAppStore();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const t = useTranslations();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    return (
        <header className="h-16 border-b border-gray-200 dark:border-zinc-800 flex items-center bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-50">
            <Container size="xl" className="w-full">
                <Group justify="space-between">
                    <Link href="/student" className="no-underline text-inherit hover:opacity-80 transition-opacity">
                        <Title order={3} className="font-black tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                            NHers Student
                        </Title>
                    </Link>

                    <Group gap="sm">
                        <ActionIcon
                            variant="light"
                            onClick={() => toggleColorScheme()}
                            size="lg"
                            radius="xl"
                            className="hover:scale-110 transition-transform"
                        >
                            {colorScheme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
                        </ActionIcon>

                        <LanguagePicker />

                        {user && (
                            <Menu shadow="md" width={200} position="bottom-end">
                                <Menu.Target>
                                    <Button
                                        variant="light"
                                        radius="xl"
                                        leftSection={
                                            <Avatar
                                                src={user.avatar}
                                                size="sm"
                                                radius="xl"
                                            />
                                        }
                                        rightSection={<IconChevronDown size={16} />}
                                        className="hover:bg-gray-100 dark:hover:bg-zinc-900"
                                    >
                                        <Text size="sm" fw={600} className="hidden sm:block">
                                            {user.hoTen || user.taiKhoan}
                                        </Text>
                                    </Button>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Label>Tài khoản</Menu.Label>
                                    <Menu.Item
                                        leftSection={<IconUser size={16} />}
                                        onClick={() => router.push("/student")}
                                    >
                                        Trang chủ
                                    </Menu.Item>
                                    <Menu.Item
                                        leftSection={<IconSettings size={16} />}
                                        onClick={() => router.push("/student/settings")}
                                    >
                                        Cài đặt
                                    </Menu.Item>

                                    <Menu.Divider />

                                    <Menu.Item
                                        color="red"
                                        leftSection={<IconLogout size={16} />}
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        )}
                    </Group>
                </Group>
            </Container>
        </header>
    );
}
