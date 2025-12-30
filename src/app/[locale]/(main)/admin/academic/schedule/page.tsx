"use client";

import { Box, Button, Group, Title, Paper, Skeleton, Stack, Text, ActionIcon } from "@mantine/core";
import { IconPlus, IconCalendar, IconTrash, IconEdit } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

import { CalendarModal } from "./CalendarModal";

export default function CalendarPage() {
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
            title: "Xác nhận xóa",
            children: <Text size="sm">Bạn có chắc chắn muốn xóa lịch học này?</Text>,
            labels: { confirm: "Xóa", cancel: "Hủy" },
            confirmProps: { color: "red" },
            onConfirm: async () => {
                try {
                    await mutation.academic.useDeleteCalendar(id).mutateAsync(undefined);
                    notifications.show({ title: "Thành công", message: "Đã xóa lịch học", color: "green" });
                } catch (error) {
                    notifications.show({ title: "Lỗi", message: "Không thể xóa", color: "red" });
                }
            }
        });
    };

    const handleSubmit = async (data: any) => {
        try {
            if (editingItem) {
                await mutation.academic.useUpdateCalendar(editingItem.id).mutateAsync(data);
                notifications.show({ title: "Thành công", message: "Đã cập nhật lịch học", color: "green" });
            } else {
                await createMutation.mutateAsync(data);
                notifications.show({ title: "Thành công", message: "Đã tạo lịch học mới", color: "green" });
            }
            close();
        } catch (error) {
            notifications.show({ title: "Lỗi", message: "Thao tác thất bại", color: "red" });
        }
    };

    return (
        <Box p="md">
            <Stack gap="lg">
                <Group justify="space-between">
                    <Stack gap={2}>
                        <Title order={2}>Quản lý Lịch học</Title>
                        <Text size="sm" c="dimmed">Quản lý thời khóa biểu của toàn trường</Text>
                    </Stack>
                    <Button leftSection={<IconPlus size={18} />} onClick={handleOpenCreate} radius="md">
                        Thêm lịch học
                    </Button>
                </Group>

                <Paper p="md" radius="md" withBorder shadow="sm" className="bg-white dark:bg-zinc-950">
                    {isLoading ? (
                        <Skeleton h={300} radius="md" />
                    ) : calendars && calendars.length > 0 ? (
                        <Box className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="border-b bg-zinc-50 dark:bg-zinc-900">
                                        <th className="p-4 font-semibold">Thứ</th>
                                        <th className="p-4 font-semibold">Lớp</th>
                                        <th className="p-4 font-semibold">Môn học</th>
                                        <th className="p-4 font-semibold">Tiết</th>
                                        <th className="p-4 font-semibold">Phòng</th>
                                        <th className="p-4 font-semibold">Giáo viên</th>
                                        <th className="p-4 font-semibold text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {calendars.map((item: any) => (
                                        <tr key={item.id} className="border-b hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                            <td className="p-4 font-medium">Thứ {item.thu === 8 ? "CN" : item.thu}</td>
                                            <td className="p-4">{item.lopHoc?.tenLop}</td>
                                            <td className="p-4">{item.monHoc?.tenMon}</td>
                                            <td className="p-4 whitespace-nowrap">Tiết {item.tietBatDau} ({item.soTiet} tiết)</td>
                                            <td className="p-4">{item.phongHoc || "-"}</td>
                                            <td className="p-4">{item.gvDay?.hoTen || "-"}</td>
                                            <td className="p-4 text-right">
                                                <Group gap="xs" justify="flex-end">
                                                    <ActionIcon variant="light" color="blue" onClick={() => handleOpenEdit(item)}>
                                                        <IconEdit size={16} />
                                                    </ActionIcon>
                                                    <ActionIcon variant="light" color="red" onClick={() => handleDelete(item.id)}>
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Group>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    ) : (
                        <Stack align="center" py={60} gap="sm">
                            <IconCalendar size={40} className="text-zinc-300" />
                            <Text fw={500} c="dimmed">Chưa có lịch học nào được thiết lập</Text>
                        </Stack>
                    )}
                </Paper>
            </Stack>

            <CalendarModal
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingItem}
                loading={createMutation.isPending}
            />
        </Box>
    );
}
