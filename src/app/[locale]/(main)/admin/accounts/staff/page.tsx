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
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect } from "react";

export default function StaffPage() {
    // NHAN_VIEN usually refers to staff/officials in school context
    const { users, isLoading, handleCreateStudent: handleCreate, handleUpdate, handleDelete, isCreating } = useUserManager("NHAN_VIEN");
    const [opened, { open, close }] = useDisclosure(false);
    const [editingUser, setEditingUser] = useState<TUser | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const updateUrl = (id?: string | number | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (id) {
            params.set('userId', id.toString());
        } else {
            params.delete('userId');
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleOpenCreate = () => {
        setEditingUser(null);
        updateUrl('new');
        open();
    };

    const handleOpenEdit = (user: TUser) => {
        setEditingUser(user);
        updateUrl(user.id);
        open();
    };

    useEffect(() => {
        const userId = searchParams.get('userId');
        if (userId) {
            if (userId === 'new') {
                setEditingUser(null);
                open();
            } else {
                const user = users?.find(u => u.id === Number(userId));
                if (user) {
                    setEditingUser(user);
                    open();
                }
            }
        }
    }, [searchParams, users]);

    const handleClose = () => {
        updateUrl(null);
        close();
    };

    const confirmDelete = (id: number) => {
        modals.openConfirmModal({
            title: "Xác nhận xóa",
            children: <Text size="sm">Bạn có chắc chắn muốn xóa nhân viên này?</Text>,
            confirmProps: { color: "red" },
            labels: { confirm: "Xóa", cancel: "Hủy" },
            onConfirm: () => handleDelete(id),
        });
    };

    // ... (keep middle same)

    const handleSubmit = async (data: any) => {
        try {
            if (editingUser) {
                await handleUpdate(editingUser.id, data);
            } else {
                // For Staff, we currently just create a basic user. 
                // Note: 'maSo' from form will be ignored by backend unless we add HoSoNhanVien
                await handleCreate(data);
            }
            close();
        } catch (error) {
            // Handled in hook
        }
    };

    return (
        <LayoutList
            title="Quản lý Nhân viên"
            description="Danh sách nhân viên / cán bộ trong hệ thống"
            actions={
                <AppButton leftSection={<IconPlus size={18} />} onClick={handleOpenCreate}>
                    Thêm Nhân viên
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
                        role="NHAN_VIEN"
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
                onClose={handleClose}
                onSubmit={handleSubmit}
                initialData={editingUser}
                role="NHAN_VIEN"
                loading={isCreating}
            />
        </LayoutList>
    );
}
