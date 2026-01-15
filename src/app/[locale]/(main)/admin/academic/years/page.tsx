"use client";

import { ActionIcon, Box, Group, Paper, Stack, Table, Text, SimpleGrid, Card, Badge, Tooltip } from "@mantine/core";
import { IconCalendar, IconEdit, IconPlus, IconTrash, IconCalendarTime, IconSchool } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { LayoutList } from "@/shared/components/LayoutList";
import { AppButton } from "@/shared/components/AppButton";
import { useTranslations } from "next-intl";
import { YearModal } from "./YearModal";
import { TNamHoc } from "@/shared/types/academic.type";
import dayjs from "dayjs";

export default function YearsPage() {
    const t = useTranslations("academic.years");
    const tCommon = useTranslations("common");
    const { data: namHocs, isLoading } = AppQuery.academic.useYears();
    const mutation = AppMutation();
    const [opened, { open, close }] = useDisclosure(false);
    const [editingItem, setEditingItem] = useState<TNamHoc | null>(null);

    const createMutation = mutation.academic.useCreateYear();
    const updateMutation = mutation.academic.useUpdateYear(editingItem?.id || 0);
    const deleteMutation = mutation.academic.useDeleteYear(0); // ID will be passed directly

    const handleOpenCreate = () => {
        setEditingItem(null);
        open();
    };

    const handleOpenEdit = (item: TNamHoc) => {
        setEditingItem(item);
        open();
    };

    const handleDelete = (id: number) => {
        modals.openConfirmModal({
            title: tCommon("delete_title"),
            centered: true,
            children: <Text size="sm">{tCommon("confirm_delete")}</Text>,
            labels: { confirm: tCommon("actions.delete"), cancel: tCommon("actions.cancel") },
            confirmProps: { color: "red" },
            onConfirm: async () => {
                try {
                    await mutation.academic.useDeleteYear(id).mutateAsync(undefined);
                    notifications.show({ title: tCommon("status.success"), message: t("messages.delete_success"), color: "green" });
                } catch (error) {
                    notifications.show({ title: tCommon("status.error"), message: tCommon("status.error_msg"), color: "red" });
                }
            }
        });
    };

    const handleSubmit = async (data: any) => {
        try {
            if (editingItem) {
                await updateMutation.mutateAsync(data);
                notifications.show({ title: tCommon("status.success"), message: t("messages.update_success"), color: "green" });
            } else {
                await createMutation.mutateAsync(data);
                notifications.show({ title: tCommon("status.success"), message: t("messages.create_success"), color: "green" });
            }
            close();
        } catch (error) {
            notifications.show({ title: tCommon("status.error"), message: tCommon("status.error_msg"), color: "red" });
        }
    };

    return (
        <LayoutList
            title={t("title")}
            description={t("subtitle")}
            actions={
                <AppButton leftSection={<IconPlus size={18} />} onClick={handleOpenCreate} radius="md">
                    {t("create")}
                </AppButton>
            }
            loading={isLoading}
        >
            {namHocs && namHocs.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                    {namHocs.map((item) => (
                        <Card key={item.id} shadow="sm" padding="md" radius="md" withBorder className="relative hover:shadow-md transition-shadow">
                            <Group justify="space-between" align="flex-start" mb="xs">
                                <Badge
                                    size="sm"
                                    color={item.dangKichHoat ? "green" : "gray"}
                                    variant="light"
                                >
                                    {item.dangKichHoat ? t("status.active") : t("status.inactive")}
                                </Badge>

                                <Group gap={0}>
                                    <Tooltip label={t("actions.edit")}>
                                        <ActionIcon variant="subtle" color="indigo" size="sm" onClick={() => handleOpenEdit(item)}>
                                            <IconEdit size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label={t("actions.delete")}>
                                        <ActionIcon variant="subtle" color="red" size="sm" onClick={() => handleDelete(item.id)}>
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Group>

                            <Stack align="center" gap={4} mb="xs">
                                <Box
                                    className="p-2 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                >
                                    <IconSchool size={24} />
                                </Box>
                                <Text fw={600} size="md" ta="center">
                                    {item.tenNamHoc}
                                </Text>
                            </Stack>

                            <Group grow gap="xs" mt="auto">
                                <Box className="p-1.5 rounded bg-gray-50 dark:bg-dark-600 text-center">
                                    <Text size="10px" c="dimmed" tt="uppercase">{t("columns.start_date")}</Text>
                                    <Text size="xs" fw={500}>
                                        {item.ngayBatDau ? dayjs(item.ngayBatDau).format("DD/MM/YYYY") : "-"}
                                    </Text>
                                </Box>
                                <Box className="p-1.5 rounded bg-gray-50 dark:bg-dark-600 text-center">
                                    <Text size="10px" c="dimmed" tt="uppercase">{t("columns.end_date")}</Text>
                                    <Text size="xs" fw={500}>
                                        {item.ngayKetThuc ? dayjs(item.ngayKetThuc).format("DD/MM/YYYY") : "-"}
                                    </Text>
                                </Box>
                            </Group>
                        </Card>
                    ))}
                </SimpleGrid>
            ) : (
                <Paper radius="md" withBorder shadow="sm" className="overflow-hidden">
                    <Stack align="center" py={80} gap="md">
                        <Box
                            style={{ background: 'var(--mantine-color-default-hover)' }}
                            className="p-8 rounded-full"
                        >
                            <IconCalendar size={56} className="text-[var(--mantine-color-dimmed)]" />
                        </Box>
                        <Stack gap={4} align="center">
                            <Text fw={700} size="lg">{t("no_data")}</Text>
                            <Text size="sm" c="dimmed">{t("no_data_subtitle")}</Text>
                        </Stack>
                    </Stack>
                </Paper>
            )}

            <YearModal
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingItem}
                loading={createMutation.isPending || updateMutation.isPending}
            />
        </LayoutList>
    );
}
