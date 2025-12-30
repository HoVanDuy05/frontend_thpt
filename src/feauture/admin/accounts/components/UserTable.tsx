"use client";

import { Table, Group, Text, Badge, ActionIcon, Avatar, Menu } from "@mantine/core";
import { IconPencil, IconTrash, IconDots } from "@tabler/icons-react";
import { TUser } from "@/shared/types/user.type";
import dayjs from "dayjs";

interface UserTableProps {
    users: TUser[];
    onEdit: (user: TUser) => void;
    onDelete: (id: number) => void;
    role?: "HOC_SINH" | "GIAO_VIEN" | "ADMIN";
}

export const UserTable = ({ users, onEdit, onDelete, role }: UserTableProps) => {
    const rows = users?.map((user) => {
        const profile = user.hoSoGiaoVien || user.hoSoHocSinh || ({} as any);
        const name = profile.hoTen || user.taiKhoan;
        const code = profile.maSoGv || profile.maSoHs || `ID: ${user.id}`;
        const avatar = profile.avatar;

        return (
            <Table.Tr key={user.id}>
                <Table.Td>
                    <Group gap="sm">
                        <Avatar src={avatar} radius="xl" size="sm" color="initials" name={name} />
                        <div>
                            <Text size="sm" fw={500}>
                                {name}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {user.email || "Chưa cập nhật email"}
                            </Text>
                        </div>
                    </Group>
                </Table.Td>
                <Table.Td>
                    <Badge variant="light" color="gray">
                        {code}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Badge
                        color={
                            user.vaiTro === "ADMIN"
                                ? "red"
                                : user.vaiTro === "GIAO_VIEN"
                                    ? "blue"
                                    : "green"
                        }
                        variant="dot"
                    >
                        {user.vaiTro}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Text size="sm">{dayjs(user.ngayTao).format("DD/MM/YYYY")}</Text>
                </Table.Td>
                <Table.Td>
                    <Group gap={0} justify="flex-end">
                        <Menu position="bottom-end" shadow="sm">
                            <Menu.Target>
                                <ActionIcon variant="subtle" color="gray">
                                    <IconDots size={16} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    leftSection={<IconPencil size={14} />}
                                    onClick={() => onEdit(user)}
                                >
                                    Chỉnh sửa
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconTrash size={14} />}
                                    color="red"
                                    onClick={() => onDelete(user.id)}
                                >
                                    Xóa
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Table verticalSpacing="sm" withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Người dùng</Table.Th>
                    <Table.Th>Mã số</Table.Th>
                    <Table.Th>Vai trò</Table.Th>
                    <Table.Th>Ngày tạo</Table.Th>
                    <Table.Th style={{ width: 80 }}></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}
