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
import { Stack, Text, Box, Skeleton, Paper, rem, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useEffect } from "react";

export default function StudentPage() {
    const { users, isLoading, handleCreateStudent, handleUpdate, handleDelete, isCreating } = useUserManager("HOC_SINH");
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
        const query = params.toString();
        router.push(`${pathname}?${query}` as any, { scroll: false });
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
            children: <Text size="sm">Bạn có chắc chắn muốn xóa học sinh này?</Text>,
            confirmProps: { color: "red" },
            labels: { confirm: "Xóa", cancel: "Hủy" },
            onConfirm: () => handleDelete(id),
        });
    };

    const handleSubmit = async (data: any) => {
        try {
            if (editingUser) {
                await handleUpdate(editingUser.id, data);
            } else {
                // Map generic form data to Student Account DTO
                const payload = {
                    ...data,
                    maSoHs: data.maSo,
                    lopId: Number(data.lopId),
                    namHocId: undefined // Remove helper field
                };
                await handleCreateStudent(payload);
            }
            close();
        } catch (error) {
            // Error handling is done in hook
        }
    };

    return (
        <LayoutList
            title="Quản lý Học sinh"
            description="Danh sách học sinh trong hệ thống"
            actions={
                <AppButton
                    onClick={handleOpenCreate}
                    px={{ base: 12, sm: 16 }}
                >
                    <Group gap={6} wrap="nowrap">
                        <IconPlus size={18} />
                        <span className="hidden sm:inline">Thêm Học sinh</span>
                    </Group>
                </AppButton>
            }
        >
            <Paper
                radius="lg"
                withBorder
                shadow="sm"
                className="overflow-hidden flex flex-col flex-1 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                w="100%"
                style={{
                    borderColor: 'var(--mantine-color-gray-2)',
                    background: 'var(--mantine-color-white)',
                    minHeight: rem(400),
                }}
            >
                {isLoading ? (
                    <Stack p="xl">
                        <Skeleton h={60} radius="md" />
                        <Skeleton h={60} radius="md" />
                        <Skeleton h={60} radius="md" />
                        <Skeleton h={60} radius="md" />
                    </Stack>
                ) : users && users.length > 0 ? (
                    <UserTable
                        users={users}
                        onEdit={handleOpenEdit}
                        onDelete={confirmDelete}
                        role="HOC_SINH"
                    />
                ) : (
                    <Stack align="center" py={100} gap="lg">
                        <Box
                            className="p-8 rounded-full bg-slate-50 border border-slate-100"
                        >
                            <IconAlertCircle size={56} className="text-slate-300" />
                        </Box>
                        <Stack gap={4} align="center">
                            <Text fw={700} size="lg">Chưa có dữ liệu học sinh</Text>
                            <Text size="sm" c="dimmed">Bắt đầu bằng việc thêm học sinh mới vào hệ thống</Text>
                        </Stack>
                        <AppButton
                            variant="light"
                            leftSection={<IconPlus size={18} />}
                            onClick={handleOpenCreate}
                        >
                            Thêm Học sinh ngay
                        </AppButton>
                    </Stack>
                )}
            </Paper>

            <UserDrawer
                opened={opened}
                onClose={handleClose}
                onSubmit={handleSubmit}
                initialData={editingUser}
                role="HOC_SINH"
                loading={isCreating}
            />
        </LayoutList>
    );
}
