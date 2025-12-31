"use client";

import { Table, Group, Text, Badge, ActionIcon, Menu, Avatar } from '@mantine/core';
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
    const rows = users.map((user) => (
        <Table.Tr key={user.id}>
            <Table.Td>
                <Group gap="sm">
                    <Avatar color="indigo" radius="xl">
                        {user.hoTen?.charAt(0) || user.taiKhoan?.charAt(0)}
                    </Avatar>
                    <div>
                        <Text size="sm" fw={500}>
                            {user.hoTen || "Chưa cập nhật"}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {user.email || "Không có email"}
                        </Text>
                    </div>
                </Group>
            </Table.Td>
            <Table.Td>
                <Text size="sm">{user.taiKhoan}</Text>
            </Table.Td>
            <Table.Td>
                <Badge variant="light" color={user.isBlocked ? "red" : "green"}>
                    {user.isBlocked ? "Đã khóa" : "Hoạt động"}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Text size="sm">{user.maSo || "-"}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap={0} justify="flex-end">
                    <Menu position="bottom-end" shadow="md" withinPortal>
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
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
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table verticalSpacing="sm">
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Người dùng</Table.Th>
                    <Table.Th>Tài khoản</Table.Th>
                    <Table.Th>Trạng thái</Table.Th>
                    <Table.Th>Mã số</Table.Th>
                    <Table.Th />
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}
