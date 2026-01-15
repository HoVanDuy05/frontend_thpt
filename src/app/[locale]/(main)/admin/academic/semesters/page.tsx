"use client";

import { ActionIcon, Box, Group, Paper, Stack, Table, Text, Badge } from "@mantine/core";
import { IconCalendar, IconEdit, IconPlus, IconTrash, IconSchool } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { LayoutList } from "@/shared/components/LayoutList";
import { AppButton } from "@/shared/components/AppButton";
import { useTranslations } from "next-intl";
import { SemesterModal } from "./SemesterModal";
import { THocKy } from "@/shared/types/academic.type";
import dayjs from "dayjs";

export default function SemestersPage() {
    const t = useTranslations("academic.semesters");
    const tCommon = useTranslations("common");
    const { data: hocKys, isLoading } = AppQuery.academic.useHocKys();
    const mutation = AppMutation();
    const [opened, { open, close }] = useDisclosure(false);
    const [editingItem, setEditingItem] = useState<THocKy | null>(null);

    const createMutation = mutation.academic.useCreateSemester();
    const updateMutation = mutation.academic.useUpdateSemester(editingItem?.id || 0);
    const deleteMutation = mutation.academic.useDeleteSemester(0);

    const handleOpenCreate = () => {
        setEditingItem(null);
        open();
    };

    const handleOpenEdit = (item: THocKy) => {
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
                    await mutation.academic.useDeleteSemester(id).mutateAsync(undefined);
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
            <Paper radius="md" withBorder shadow="sm" className="overflow-hidden">
                {hocKys && hocKys.length > 0 ? (
                    <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
                        <Table.Thead
                            style={{
                                background: 'var(--mantine-color-default-hover)',
                            }}
                        >
                            <Table.Tr>
                                <Table.Th>{t("columns.name")}</Table.Th>
                                <Table.Th>{t("columns.year")}</Table.Th>
                                <Table.Th>{t("columns.start_date")}</Table.Th>
                                <Table.Th>{t("columns.end_date")}</Table.Th>
                                <Table.Th>{t("columns.status")}</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>{t("columns.actions")}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {hocKys.map((item) => (
                                <Table.Tr key={item.id}>
                                    <Table.Td fw={600} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <IconSchool size={20} className="text-indigo-600" />
                                        {item.tenHocKy}
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge variant="light" color="blue">
                                            {item.namHoc?.tenNamHoc}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>{item.ngayBatDau ? dayjs(item.ngayBatDau).format("DD/MM/YYYY") : "-"}</Table.Td>
                                    <Table.Td>{item.ngayKetThuc ? dayjs(item.ngayKetThuc).format("DD/MM/YYYY") : "-"}</Table.Td>
                                    <Table.Td>
                                        {item.dangKichHoat ? (
                                            <Text c="green" size="sm" fw={500} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Box w={6} h={6} style={{ borderRadius: '50%', background: 'var(--mantine-color-green-6)' }} />
                                                {t("status.active")}
                                            </Text>
                                        ) : (
                                            <Text c="dimmed" size="sm">
                                                {t("status.inactive")}
                                            </Text>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs" justify="flex-end">
                                            <ActionIcon variant="light" color="indigo" onClick={() => handleOpenEdit(item)}>
                                                <IconEdit size={16} />
                                            </ActionIcon>
                                            <ActionIcon variant="light" color="red" onClick={() => handleDelete(item.id)}>
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                ) : (
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
                )}
            </Paper>

            <SemesterModal
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingItem}
                loading={createMutation.isPending || updateMutation.isPending}
            />
        </LayoutList>
    );
}
