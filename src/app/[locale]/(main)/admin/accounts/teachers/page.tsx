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

export default function TeacherPage() {
    const { users, isLoading, handleCreateTeacher, handleUpdate, handleDelete, isCreating } = useUserManager("GIAO_VIEN");
    const [opened, { open, close }] = useDisclosure(false);
    const [editingUser, setEditingUser] = useState<TUser | null>(null);

    const handleOpenCreate = () => {
        setEditingUser(null);
        open();
    };

    const handleOpenEdit = (user: TUser) => {
        setEditingUser(user);
        open();
    };

    const confirmDelete = (id: number) => {
        modals.openConfirmModal({
            title: "Xác nhận xóa",
            children: <Text size="sm">Bạn có chắc chắn muốn xóa giáo viên này?</Text>,
            confirmProps: { color: "red" },
            labels: { confirm: "Xóa", cancel: "Hủy" },
            onConfirm: () => handleDelete(id),
        });
    };

    const handleSubmit = async (data: any) => {
        if (editingUser) {
            await handleUpdate(editingUser.id, data);
        } else {
            await handleCreateTeacher(data);
        }
        close();
    };

    return (
        <LayoutList
            title="Quản lý Giáo viên"
            description="Danh sách giáo viên trong hệ thống"
            actions={
                <AppButton leftSection={<IconPlus size={18} />} onClick={handleOpenCreate}>
                    Thêm Giáo viên
                </AppButton>
            }
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
                        role="GIAO_VIEN"
                    />
                ) : (
                    <Stack align="center" py={60} gap="md">
                        <Box
                            style={{ background: 'var(--mantine-color-default-hover)' }}
                            className="p-6 rounded-full"
                        >
                            <IconAlertCircle size={48} className="text-[var(--mantine-color-dimmed)]" />
                        </Box>
                        <Text fw={500} c="dimmed">Chưa có dữ liệu giáo viên</Text>
                    </Stack>
                )}
            </Paper>

            <UserDrawer
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingUser}
                role="GIAO_VIEN"
                loading={isCreating}
            />
        </LayoutList>
    );
}
