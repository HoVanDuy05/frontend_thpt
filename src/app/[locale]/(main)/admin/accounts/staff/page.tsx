"use client";

import { useUserManager } from "@/feauture/admin/accounts/hooks/useUserManager";
import { UserTable } from "@/feauture/admin/accounts/components/UserTable";
import { UserDrawer } from "@/feauture/admin/accounts/components/UserDrawer";
import { LayoutList } from "@/shared/components/LayoutList";
import { AppButton } from "@/shared/components/AppButton";
import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { TUser } from "@/shared/types/user.type";
import { Stack, Text, Box, Skeleton, Paper } from "@mantine/core";
import { modals } from "@mantine/modals";

export default function StaffPage() {
    const { users, isLoading, handleUpdate, handleDelete } = useUserManager("ADMIN");
    // ADMIN can only edit other admins or view them mostly. Creation might be manual or same as teacher?
    // For now, I'll reuse the drawer but be careful about specific fields.
    const [opened, { open, close }] = useDisclosure(false);
    const [editingUser, setEditingUser] = useState<TUser | null>(null);

    const handleOpenEdit = (user: TUser) => {
        setEditingUser(user);
        open();
    };

    const confirmDelete = (id: number) => {
        modals.openConfirmModal({
            title: "Xác nhận xóa",
            children: <Text size="sm">Bạn có chắc chắn muốn xóa quản trị viên này?</Text>,
            confirmProps: { color: "red" },
            labels: { confirm: "Xóa", cancel: "Hủy" },
            onConfirm: () => handleDelete(id),
        });
    };

    const handleSubmit = async (data: any) => {
        if (editingUser) {
            await handleUpdate(editingUser.id, data);
        }
        // Creating Admin might not be exposed here directly or needs a separate mutation.
        close();
    };

    return (
        <LayoutList
            title="Quản lý Nhân viên"
            description="Danh sách nhân viên/quản trị viên"
        // No Create button for now as it's sensitive
        >
            <Paper radius="md" withBorder shadow="sm" className="overflow-hidden">
                {isLoading ? (
                    <Stack p="md">
                        <Skeleton h={50} />
                        <Skeleton h={50} />
                        <Skeleton h={50} />
                    </Stack>
                ) : users && users.length > 0 ? (
                    <UserTable
                        users={users}
                        onEdit={handleOpenEdit}
                        onDelete={confirmDelete}
                        role="ADMIN"
                    />
                ) : (
                    <Stack align="center" py={60} gap="md">
                        <Box
                            style={{ background: 'var(--mantine-color-default-hover)' }}
                            className="p-6 rounded-full"
                        >
                            <IconAlertCircle size={48} className="text-[var(--mantine-color-dimmed)]" />
                        </Box>
                        <Text fw={500} c="dimmed">Chưa có dữ liệu nhân viên</Text>
                    </Stack>
                )}
            </Paper>

            <UserDrawer
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingUser}
                role="GIAO_VIEN" // Fallback to a layout that accepts HoTen/Email (Teacher layout is closest)
                loading={false}
            />
        </LayoutList>
    );
}
