"use client";

import { Menu, Avatar, Text, Group, UnstyledButton, rem } from "@mantine/core";
import { IconLogout, IconSettings, IconUser, IconChevronDown } from "@tabler/icons-react";
import { useRouter } from "@/i18n/routing";
import { useAppStore } from "@/providers/store/useAppStore";

export function UserMenu() {
    const router = useRouter();
    const { user, logout } = useAppStore();

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    if (!user) return null;

    return (
        <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
                <UnstyledButton className="hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl px-3 py-2 transition-colors">
                    <Group gap="xs">
                        <Avatar
                            src={user.avatar || undefined}
                            alt={user.hoTen}
                            radius="xl"
                            size="sm"
                            className="border-2 border-blue-500"
                        />
                        <Text size="sm" fw={600} className="hidden sm:block">
                            {user.hoTen}
                        </Text>
                        <IconChevronDown size={16} className="hidden sm:block" />
                    </Group>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Tài khoản</Menu.Label>
                <Menu.Item
                    leftSection={<IconUser size={16} />}
                    onClick={() => router.push("/social/profile")}
                >
                    Hồ sơ
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconSettings size={16} />}
                    onClick={() => router.push("/admin/dashboard")}
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
    );
}
