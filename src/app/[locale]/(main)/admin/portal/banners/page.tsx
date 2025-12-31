"use client";

import { Box, Button, Group, Title, Paper, Skeleton, Stack, Text, Alert } from "@mantine/core";
import { useBannerManager } from "@/feauture/admin/portal/hooks/useBannerManager";
import { BannerTable } from "@/feauture/admin/portal/components/BannerTable";
import { BannerDrawer } from "@/feauture/admin/portal/components/BannerDrawer";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { TBanner } from "@/shared/types/portal.type";
import { IconPlus, IconPhotoOff, IconAlertCircle } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { LayoutList } from "@/shared/components/LayoutList";
import { AppButton } from "@/shared/components/AppButton";

import { useTranslations } from "next-intl";

export default function BannerPage() {
    const t = useTranslations("portal.banners");
    const tCommon = useTranslations("common");
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
            title: tCommon("delete_title"),
            centered: true,
            children: (
                <Text size="sm">
                    {tCommon("confirm_delete")}
                </Text>
            ),
            labels: { confirm: tCommon("actions.delete"), cancel: tCommon("actions.cancel") },
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
        <AppButton leftSection={<IconPlus size={18} />} onClick={handleOpenCreate} size="sm">
            <span className="hidden sm:inline">{t("create")}</span>
            <span className="sm:hidden">{tCommon("actions.create")}</span>
        </AppButton>
    );

    return (
        <LayoutList
            title={t("title")}
            description={t("subtitle")}
            actions={PageActions}
            loading={isLoading}
        >
            <Paper
                radius="lg"
                withBorder
                shadow="sm"
                style={{
                    background: 'rgba(var(--mantine-color-body-rgb), 0.5)',
                    backdropFilter: 'blur(8px)',
                }}
                className="overflow-hidden"
            >
                {banners && banners.length > 0 ? (
                    <BannerTable
                        banners={banners}
                        onEdit={handleOpenEdit}
                        onDelete={confirmDelete}
                    />
                ) : (
                    <Stack align="center" py={{ base: 60, sm: 80 }} gap="md" px="md">
                        <Box
                            style={{ background: 'var(--mantine-color-default-hover)' }}
                            className="p-8 rounded-full"
                        >
                            <IconPhotoOff size={56} className="text-[var(--mantine-color-dimmed)]" />
                        </Box>
                        <Stack gap={4} align="center">
                            <Text fw={700} fz={{ base: "md", sm: "lg" }}>{t("no_data")}</Text>
                            <Text size="sm" c="dimmed" ta="center">{t("no_data_subtitle")}</Text>
                        </Stack>
                        <AppButton variant="light" onClick={handleOpenCreate} mt="md" size="sm">
                            {t("create_now")}
                        </AppButton>
                    </Stack>
                )}
            </Paper>

            <BannerDrawer
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingBanner}
                loading={isCreating || isUpdating}
            />
        </LayoutList>
    );
}
