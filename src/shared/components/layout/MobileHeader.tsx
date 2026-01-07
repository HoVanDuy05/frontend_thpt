"use client";

import { Group, Avatar, ActionIcon, Indicator, Box, Title, Text, Stack, Menu, UnstyledButton, useMantineColorScheme } from "@mantine/core";
import { IconBell, IconMenu2, IconSchool, IconChevronDown, IconUser, IconSettings, IconSun, IconMoon, IconLogout } from "@tabler/icons-react";
import { useAppStore } from "@/providers/store/useAppStore";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function MobileHeader() {

    const { user, logout } = useAppStore();
    const router = useRouter();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const t = useTranslations();

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    return (
        <header
            className="h-[60px] flex items-center px-4 justify-between bg-[var(--mantine-color-body)] sticky top-0 z-50 transition-colors duration-300"
            style={{
                borderBottom: '1px solid var(--mantine-color-default-border)'
            }}
        >
            <Group gap="xs">
                {/* Logo / Branding */}
                <Link href="/student" className="no-underline">
                    <Group gap={8} align="center">
                        <Box className="flex items-center justify-center bg-indigo-600 rounded-lg w-8 h-8">
                            <IconSchool size={18} color="white" />
                        </Box>
                        <Stack gap={0}>
                            <Title
                                order={4}
                                className="leading-tight text-base sm:text-lg"
                                c="var(--mantine-color-text)"
                            >
                                NHers Student
                            </Title>
                            <Text size="xs" c="dimmed" fw={500} visibleFrom="xs">
                                {t('common.student_portal')}
                            </Text>
                        </Stack>
                    </Group>
                </Link>
            </Group>

            <Group gap="sm">
                {/* Notification Icon */}
                <ActionIcon
                    variant="subtle"
                    size="lg"
                    radius="md"
                    className="relative"
                >
                    <IconBell size={20} stroke={1.5} />
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </ActionIcon>

                {/* User Menu - Same style as Admin */}
                <Menu shadow="md" width={220} position="bottom-end" withArrow radius="md">
                    <Menu.Target>
                        <UnstyledButton
                            style={{
                                padding: '4px 8px',
                                borderRadius: 'var(--mantine-radius-md)',
                            }}
                            className="flex items-center gap-2 hover:bg-[var(--mantine-color-gray-light-hover)] dark:hover:bg-[var(--mantine-color-dark-theme-hover)] transition-colors"
                        >
                            <Avatar size="sm" radius="xl" color="indigo" variant="light" src={user?.avatar}>
                                {user?.taiKhoan?.charAt(0).toUpperCase() || "S"}
                            </Avatar>
                            <IconChevronDown size={14} stroke={2} color="var(--mantine-color-dimmed)" />
                        </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown className="p-2">
                        <Menu.Label>{t('menu.accounts.title')}</Menu.Label>
                        <Menu.Item
                            leftSection={<IconUser size={16} />}
                            onClick={() => router.push("/student/profile")}
                            className="rounded-md"
                        >
                            {t('social.nav.profile')}
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<IconSettings size={16} />}
                            onClick={() => router.push("/student/profile")}
                            className="rounded-md"
                        >
                            {t('menu.settings')}
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Item
                            leftSection={colorScheme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
                            onClick={() => toggleColorScheme()}
                            className="rounded-md"
                        >
                            {colorScheme === "dark" ? t('common.light_mode') : t('common.dark_mode')}
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Item
                            color="red"
                            leftSection={<IconLogout size={16} />}
                            onClick={handleLogout}
                            className="rounded-md"
                        >
                            {t('menu.logout')}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
        </header>
    );

}
