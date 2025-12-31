"use client";

import { Box, Button, Group, Title, Paper, Skeleton, Stack, Text, ActionIcon, rem, Table, ScrollArea } from "@mantine/core";
import { IconPlus, IconCalendar, IconTrash, IconEdit } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { LayoutList } from "@/shared/components/LayoutList";
import { AppButton } from "@/shared/components/AppButton";

import { CalendarModal } from "./CalendarModal";

import { useTranslations } from "next-intl";

export default function CalendarPage() {
    const t = useTranslations("academic.schedule");
    const tCommon = useTranslations("common");
    const { data: calendars, isLoading } = AppQuery.calendar.useList();
    const mutation = AppMutation();
    const [opened, { open, close }] = useDisclosure(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const createMutation = mutation.academic.useCreateCalendar();

    const handleOpenCreate = () => {
        setEditingItem(null);
        open();
    };

    const handleOpenEdit = (item: any) => {
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
                    await mutation.academic.useDeleteCalendar(id).mutateAsync(undefined);
                    notifications.show({ title: tCommon("status.success"), message: "Đã xóa lịch học", color: "green" });
                } catch (error) {
                    notifications.show({ title: tCommon("status.error"), message: "Không thể xóa", color: "red" });
                }
            }
        });
    };

    const handleSubmit = async (data: any) => {
        try {
            if (editingItem) {
                await mutation.academic.useUpdateCalendar(editingItem.id).mutateAsync(data);
                notifications.show({ title: tCommon("status.success"), message: "Đã cập nhật lịch học", color: "green" });
            } else {
                await createMutation.mutateAsync(data);
                notifications.show({ title: tCommon("status.success"), message: "Đã tạo lịch học mới", color: "green" });
            }
            close();
        } catch (error) {
            notifications.show({ title: tCommon("status.error"), message: "Thao tác thất bại", color: "red" });
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
                {calendars && calendars.length > 0 ? (
                    <ScrollArea>
                        <Table verticalSpacing="sm" horizontalSpacing="md">
                            <Table.Thead
                                style={{
                                    background: 'var(--mantine-color-default-hover)',
                                }}
                            >
                                <Table.Tr>
                                    <Table.Th>{t("columns.day")}</Table.Th>
                                    <Table.Th>{t("columns.class")}</Table.Th>
                                    <Table.Th>{t("columns.subject")}</Table.Th>
                                    <Table.Th>{t("columns.period")}</Table.Th>
                                    <Table.Th>{t("columns.room")}</Table.Th>
                                    <Table.Th>{t("columns.teacher")}</Table.Th>
                                    <Table.Th style={{ textAlign: 'right' }}>{t("columns.actions")}</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {calendars.map((item: any) => (
                                    <Table.Tr key={item.id}>
                                        <Table.Td fw={600}>Thứ {item.thu === 8 ? "CN" : item.thu}</Table.Td>
                                        <Table.Td>{item.lopHoc?.tenLop}</Table.Td>
                                        <Table.Td>{item.monHoc?.tenMon}</Table.Td>
                                        <Table.Td className="whitespace-nowrap">Tiết {item.tietBatDau} ({item.soTiet} tiết)</Table.Td>
                                        <Table.Td>{item.phongHoc || "-"}</Table.Td>
                                        <Table.Td>{item.gvDay?.hoTen || "-"}</Table.Td>
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
                    </ScrollArea>
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

            <CalendarModal
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingItem}
                loading={createMutation.isPending}
            />
        </LayoutList>
    );
}
