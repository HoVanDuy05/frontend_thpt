"use client";

import { AppShell, Burger, Group, Title, ActionIcon, useMantineColorScheme, Menu, Avatar, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AdminSidebar } from "@/shared/components/layout/AdminSidebar";
import { IconSun, IconMoon, IconSchool, IconBell, IconUser, IconSettings, IconLogout, IconChevronDown, IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconMenu2, IconX, IconAlignLeft } from "@tabler/icons-react";
import { withAuth } from "@/shared/hocs/withAuth";
import { useAppStore } from "@/providers/store/useAppStore";
import { ROLE_LABELS, USER_ROLES, UserRole } from "@/shared/constants/roles.constant";
import { Text, Stack } from "@mantine/core";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguagePicker } from "@/shared/components/LanguagePicker";

// function AdminLayout({ ... } -> renamed to AdminLayoutComponent or just wrap export
// Let's keep component name AdminLayout but export wrapped
const AdminLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopCollapsed, { toggle: toggleDesktop }] = useDisclosure(false);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { user } = useAppStore();

    const userRole = (user?.vaiTro as UserRole) || USER_ROLES.ADMIN;
    const dashboardTitle = ROLE_LABELS[userRole]?.dashboardTitle || "Hệ thống Quản lý";
    const router = useRouter();
    const t = useTranslations("admin.header");

    const handleLogout = () => {
        useAppStore.getState().setToken(null);
        useAppStore.getState().setUser(null);
        router.push("/auth/login");
    };

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: desktopCollapsed ? 80 : 300,
                breakpoint: "sm",
                collapsed: { mobile: !mobileOpened },
            }}
            padding={0}
            transitionDuration={300}
            transitionTimingFunction="ease"
        >
            <AppShell.Header className="flex items-center px-4 justify-between border-b bg-white dark:bg-zinc-950">
                <Group gap="xs">
                    {/* Mobile Toggle - only shown on mobile */}
                    <ActionIcon
                        variant="subtle"
                        onClick={toggleMobile}
                        hiddenFrom="sm"
                        size="lg"
                        radius="md"
                        c="dimmed"
                    >
                        {mobileOpened ? (
                            <IconX size={24} stroke={1.5} />
                        ) : (
                            <IconAlignLeft size={24} stroke={1.5} />
                        )}
                    </ActionIcon>

                    <Group gap={8} align="center">
                        <Stack gap={0}>
                            <Title order={4} className="text-zinc-800 dark:text-zinc-100 font-bold leading-tight">
                                {dashboardTitle}
                            </Title>
                            <Text size="xs" c="dimmed" fw={500}>
                                {ROLE_LABELS[userRole]?.label || "School Portal"}
                            </Text>
                        </Stack>
                    </Group>
                </Group>

                <Group gap="md">
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

                    {/* User Menu */}
                    <Menu shadow="md" width={220} position="bottom-end" withArrow>
                        <Menu.Target>
                            <UnstyledButton className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                                <Avatar size="sm" radius="xl" color="blue">
                                    {user?.taiKhoan?.charAt(0).toUpperCase() || "U"}
                                </Avatar>
                                <div className="hidden sm:block">
                                    <Text size="sm" fw={600} className="leading-none text-zinc-800 dark:text-zinc-200">
                                        {user?.taiKhoan || "User"}
                                    </Text>
                                    <Text size="xs" c="dimmed" className="leading-none mt-1">
                                        {ROLE_LABELS[userRole]?.label || "User"}
                                    </Text>
                                </div>
                                <IconChevronDown size={14} stroke={2} className="text-zinc-400" />
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown className="p-2">
                            <Menu.Label>{t("account")}</Menu.Label>
                            <Menu.Item
                                leftSection={<IconUser size={16} />}
                                onClick={() => router.push("/admin/profile")}
                                className="rounded-md"
                            >
                                {t("profile")}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconSettings size={16} />}
                                onClick={() => router.push("/admin/settings")}
                                className="rounded-md"
                            >
                                {t("settings")}
                            </Menu.Item>

                            <Menu.Divider />

                            {/* Integrated Language Picker Section */}
                            <Menu.Label>{t("language") || "Language"}</Menu.Label>
                            <div className="px-3 pb-2 pt-1">
                                <LanguagePicker />
                            </div>

                            <Menu.Divider />

                            <Menu.Item
                                leftSection={colorScheme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
                                onClick={() => toggleColorScheme()}
                                className="rounded-md"
                            >
                                {colorScheme === "dark" ? t("light_mode") : t("dark_mode")}
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Item
                                color="red"
                                leftSection={<IconLogout size={16} />}
                                onClick={handleLogout}
                                className="rounded-md"
                            >
                                {t("logout")}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p={0}>
                <AdminSidebar collapsed={desktopCollapsed} onToggle={toggleDesktop} />
            </AppShell.Navbar>

            <AppShell.Main className="bg-zinc-50 dark:bg-zinc-900 p-0 overflow-x-hidden w-full">
                {children}
            </AppShell.Main>
        </AppShell>
    );
};

export default withAuth(AdminLayout);
