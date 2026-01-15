import { Table, Group, Text, Badge, ActionIcon, Menu, Avatar, ScrollArea, Box, rem, Stack, Paper } from '@mantine/core';
import { IconDots, IconPencil, IconTrash, IconUser, IconKey } from '@tabler/icons-react';
import { TUser } from '@/shared/types/user.type';
import { ROLE_LABELS } from '@/shared/constants/roles.constant';

interface UserTableProps {
    users: TUser[];
    onEdit: (user: TUser) => void;
    onDelete: (id: number) => void;
    onResetPassword?: (id: number) => void;
    role: string;
}

export function UserTable({ users, onEdit, onDelete, onResetPassword, role }: UserTableProps) {
    const cards = users.map((user) => (
        <Paper
            key={user.id}
            withBorder
            p="sm"
            radius="md"
            className="hover:shadow-md transition-all cursor-pointer bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
            onClick={() => onEdit(user)}
        >
            <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xs">
                <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                    <Avatar color="indigo" radius="md" size="md">
                        {user.hoTen?.charAt(0) || user.taiKhoan?.charAt(0)}
                    </Avatar>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Group gap={6} align="center" wrap="nowrap">
                            <Text size="sm" fw={700} className="text-gray-800 dark:text-zinc-200" truncate>
                                {user.hoTen || "Chưa cập nhật"}
                            </Text>
                            <Badge variant="light" color={user.isBlocked ? "red" : "green"} size="xs" radius="sm">
                                {user.isBlocked ? "Khóa" : "Mở"}
                            </Badge>
                        </Group>
                        <Text size="xs" c="dimmed" truncate>
                            {user.email || "Không có email"}
                        </Text>
                    </div>
                </Group>

                <Group gap={4} onClick={(e) => e.stopPropagation()}>
                    <Menu position="bottom-end" shadow="md" withinPortal>
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray" size="sm">
                                <IconDots size={16} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item leftSection={<IconPencil size={14} />} onClick={() => onEdit(user)}>
                                Chỉnh sửa
                            </Menu.Item>
                            <Menu.Item leftSection={<IconKey size={14} />} onClick={() => onResetPassword && onResetPassword(user.id)}>
                                Đổi mật khẩu
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={() => onDelete(user.id)}>
                                Xóa tài khoản
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Group>

            <Group mt={8} gap="lg" style={{ borderTop: '1px solid var(--mantine-color-gray-1)', paddingTop: rem(8) }}>
                <Box>
                    <Text size="10px" c="dimmed" fw={700} tt="uppercase">Tài khoản</Text>
                    <Text size="xs" fw={600} c="brand">{user.taiKhoan}</Text>
                </Box>
                <Box>
                    <Text size="10px" c="dimmed" fw={700} tt="uppercase">Mã số</Text>
                    <Text size="xs" fw={700} c="indigo">
                        {user.hoSoHocSinh?.maSoHs ||
                            user.hoSoGiaoVien?.maSoGv ||
                            user.hoSoNhanVien?.maSo || "-"}
                    </Text>
                </Box>
            </Group>
        </Paper>
    ));

    return (
        <ScrollArea h="100%" scrollbarSize={2} offsetScrollbars p="xs">
            <Stack gap={8}>
                {cards}
            </Stack>
        </ScrollArea>
    );
}
