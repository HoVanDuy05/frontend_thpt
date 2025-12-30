"use client";

import { Box, Button, Group, Title, Paper, Skeleton, Stack, Text, Alert } from "@mantine/core";
import { useBannerManager } from "@/feauture/admin/portal/hooks/useBannerManager";
import { BannerTable } from "@/feauture/admin/portal/components/BannerTable";
import { BannerModal } from "@/feauture/admin/portal/components/BannerModal";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { TBanner } from "@/shared/types/portal.type";
import { IconPlus, IconPhotoOff, IconAlertCircle } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { LayoutList } from "@/shared/components/LayoutList";
import { AppButton } from "@/shared/components/AppButton";

export default function BannerPage() {
    const { banners, isLoading, handleCreate, handleUpdate, handleDelete, isCreating, isUpdating, isDeleting } = useBannerManager();
    const [opened, { open, close }] = useDisclosure(false);
    const [editingBanner, setEditingBanner] = useState<TBanner | null>(null);

    const handleOpenCreate = () => {
        setEditingBanner(null);
        open();
    };

    const handleOpenEdit = (banner: TBanner) => {
        setEditingBanner(banner);
        open();
    };

    const confirmDelete = (id: number) => {
        modals.openConfirmModal({
            title: "Xác nhận xóa",
            centered: true,
            children: (
                <Text size="sm">
                    Bạn có chắc chắn muốn xóa banner này? Hành động này không thể hoàn tác.
                </Text>
            ),
            labels: { confirm: "Xóa", cancel: "Hủy" },
            confirmProps: { color: "red", loading: isDeleting },
            onConfirm: () => handleDelete(id),
        });
    };

    const handleSubmit = async (data: any) => {
        if (editingBanner) {
            await handleUpdate(editingBanner.id, { ...data, id: editingBanner.id });
        } else {
            await handleCreate(data);
        }
        close();
    };

    const PageActions = (
        <AppButton leftSection={<IconPlus size={18} />} onClick={handleOpenCreate}>
            Thêm Banner
        </AppButton>
    );

    return (
        <LayoutList
            title="Quản lý Banner"
            description="Cấu hình các banner hiển thị trên trang chủ"
            actions={PageActions}
            loading={isLoading}
        >
            <Paper radius="lg" withBorder shadow="sm" className="bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
                {banners && banners.length > 0 ? (
                    <BannerTable
                        banners={banners}
                        onEdit={handleOpenEdit}
                        onDelete={confirmDelete}
                    />
                ) : (
                    <Stack align="center" py={80} gap="md">
                        <Box className="bg-zinc-100 dark:bg-zinc-900 p-8 rounded-full">
                            <IconPhotoOff size={56} className="text-zinc-400" />
                        </Box>
                        <Stack gap={4} align="center">
                            <Text fw={700} fz="lg">Chưa có banner nào</Text>
                            <Text size="sm" c="dimmed">Bắt đầu bằng cách tạo banner đầu tiên của bạn</Text>
                        </Stack>
                        <AppButton variant="light" onClick={handleOpenCreate} mt="md">
                            Tạo banner ngay
                        </AppButton>
                    </Stack>
                )}
            </Paper>

            <BannerModal
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingBanner}
                loading={isCreating || isUpdating}
            />
        </LayoutList>
    );
}
