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

export default function BannerPage() {
    const { banners, isLoading, handleCreate, handleUpdate, handleDelete, isCreating } = useBannerManager();
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
            confirmProps: { color: "red" },
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

    return (
        <Box p="md">
            <Stack gap="lg">
                <Group justify="space-between">
                    <Stack gap={0}>
                        <Title order={2}>Quản lý Banner</Title>
                        <Text size="sm" c="dimmed">Cấu hình các banner hiển thị trên trang chủ</Text>
                    </Stack>
                    <Button leftSection={<IconPlus size={18} />} onClick={handleOpenCreate} radius="md">
                        Thêm Banner
                    </Button>
                </Group>

                <Paper radius="md" withBorder shadow="sm" className="bg-white dark:bg-zinc-950 overflow-hidden">
                    {isLoading ? (
                        <Stack p="md" gap="sm">
                            <Skeleton h={50} radius="md" />
                            <Skeleton h={50} radius="md" />
                            <Skeleton h={50} radius="md" />
                        </Stack>
                    ) : banners && banners.length > 0 ? (
                        <BannerTable
                            banners={banners}
                            onEdit={handleOpenEdit}
                            onDelete={confirmDelete}
                        />
                    ) : (
                        <Stack align="center" py={60} gap="md">
                            <Box className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-full">
                                <IconPhotoOff size={48} className="text-zinc-400" />
                            </Box>
                            <Text fw={500} c="dimmed">Chưa có banner nào được tạo</Text>
                            <Button variant="light" onClick={handleOpenCreate}>Tạo banner đầu tiên</Button>
                        </Stack>
                    )}
                </Paper>
            </Stack>

            <BannerModal
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingBanner}
                loading={isCreating}
            />
        </Box>
    );
}
