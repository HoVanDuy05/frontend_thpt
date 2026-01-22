"use client";

import {
    Box, Button, Group, Title, Paper, LoadingOverlay, Stack, Text,
    ActionIcon, Select, Badge, SimpleGrid, Card, Menu,
    ThemeIcon
} from "@mantine/core";
import {
    IconPlus, IconTrash, IconChalkboard,
    IconUser, IconCalendarEvent, IconDots, IconArrowLeft
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState, useMemo } from "react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { useTranslations } from "next-intl";
import { CalendarModal } from "../CalendarModal";
import { useRouter, useParams } from "next/navigation";

const PERIODS = [
    { id: 1, label: 'Tiết 1', time: '07:00 - 07:45' },
    { id: 2, label: 'Tiết 2', time: '07:50 - 08:35' },
    { id: 3, label: 'Tiết 3', time: '08:40 - 09:25' },
    { id: 4, label: 'Tiết 4', time: '09:40 - 10:25' },
    { id: 5, label: 'Tiết 5', time: '10:30 - 11:15' },
    { id: 6, label: 'Tiết 6', time: '13:00 - 13:45' },
    { id: 7, label: 'Tiết 7', time: '13:50 - 14:35' },
    { id: 8, label: 'Tiết 8', time: '14:40 - 15:25' },
    { id: 9, label: 'Tiết 9', time: '15:40 - 16:25' },
    { id: 10, label: 'Tiết 10', time: '16:30 - 17:15' },
];

const DAYS = [
    { value: 2, label: 'Thứ 2' },
    { value: 3, label: 'Thứ 3' },
    { value: 4, label: 'Thứ 4' },
    { value: 5, label: 'Thứ 5' },
    { value: 6, label: 'Thứ 6' },
    { value: 7, label: 'Thứ 7' },
    { value: 8, label: 'Chủ Nhật' },
];

export default function ClassSchedulePage() {
    const t = useTranslations("academic.schedule");
    const router = useRouter();
    const params = useParams();
    const lopNamId = params.id as string;

    // State
    const [opened, { open, close }] = useDisclosure(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Queries
    const { data: scheduleData, isLoading: isLoadingSchedule } = AppQuery.calendar.useByLopNam(
        lopNamId ? parseInt(lopNamId) : 0,
        { enabled: !!lopNamId }
    );

    // Mutations
    const mutations = AppMutation();
    const createMutation = mutations.academic.useCreateCalendar();
    const updateMutation = mutations.academic.useUpdateCalendar(editingItem?.id || 0);

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
            title: 'Xóa lịch học',
            children: <Text size="sm">Bạn có chắc chắn muốn xóa lịch học này?</Text>,
            labels: { confirm: 'Xóa', cancel: 'Hủy' },
            confirmProps: { color: "red" },
            onConfirm: async () => {
                try {
                    await mutations.academic.useDeleteCalendar(id).mutateAsync({});
                    notifications.show({ title: 'Thành công', message: 'Đã xóa lịch học', color: 'green' });
                } catch (error) {
                    notifications.show({ title: 'Thất bại', message: 'Không thể xóa lịch học', color: 'red' });
                }
            }
        });
    };

    const handleSubmit = async (data: any) => {
        try {
            const payload = { ...data, lopNamId: parseInt(lopNamId) };

            if (editingItem?.id) {
                await updateMutation.mutateAsync(payload as any);
                notifications.show({ title: 'Thành công', message: "Đã cập nhật lịch học", color: "green" });
            } else {
                await createMutation.mutateAsync(payload as any);
                notifications.show({ title: 'Thành công', message: "Đã tạo lịch học mới", color: "green" });
            }
            close();
        } catch (error) {
            notifications.show({ title: 'Thất bại', message: "Thao tác thất bại", color: "red" });
        }
    };

    // Helper functions
    const getEvent = (day: number, period: number) => {
        return scheduleData?.find((item: any) =>
            item.thu === day &&
            period >= item.tietBatDau &&
            period < (item.tietBatDau + item.soTiet)
        );
    };

    const isEventStart = (day: number, period: number) => {
        const event = getEvent(day, period);
        return event && event.tietBatDau === period;
    };

    return (
        <Box className="w-full min-h-screen bg-[#fcfcfd] dark:bg-[#09090b]">
            {/* Header */}
            <Box className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 px-6 py-4 sticky top-0 z-40">
                <Group justify="space-between">
                    <Group>
                        <ActionIcon variant="subtle" onClick={() => router.back()}>
                            <IconArrowLeft size={20} />
                        </ActionIcon>
                        <ThemeIcon size={40} radius="xl" variant="light" color="indigo">
                            <IconCalendarEvent size={22} />
                        </ThemeIcon>
                        <div>
                            <Title order={3} className="text-gray-900 dark:text-white">Thời khóa biểu</Title>
                            <Text size="sm" c="dimmed">Quản lý lịch học</Text>
                        </div>
                    </Group>

                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={handleOpenCreate}
                        color="indigo"
                    >
                        Thêm lịch
                    </Button>
                </Group>
            </Box>

            {/* Content */}
            <Box className="p-6 max-w-[1600px] mx-auto overflow-x-auto">
                <Paper withBorder radius="md" className="min-w-[1000px] overflow-hidden">
                    <LoadingOverlay visible={isLoadingSchedule} />

                    {/* Header Row */}
                    <SimpleGrid cols={8} spacing={0} className="border-b dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
                        <Box className="p-4 border-r dark:border-zinc-800 flex items-center justify-center">
                            <Text fw={700} c="dimmed" size="sm">Tiết / Thứ</Text>
                        </Box>
                        {DAYS.map(day => (
                            <Box key={day.value} className="p-4 border-r last:border-r-0 dark:border-zinc-800 text-center">
                                <Text fw={700} size="sm">{day.label}</Text>
                            </Box>
                        ))}
                    </SimpleGrid>

                    {/* Body Rows */}
                    {PERIODS.map(period => (
                        <SimpleGrid key={period.id} cols={8} spacing={0} className="border-b last:border-b-0 dark:border-zinc-800 min-h-[80px]">
                            {/* Period Label */}
                            <Box className="p-3 border-r dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30 flex flex-col justify-center items-center text-center">
                                <Text fw={600} size="sm">{period.label}</Text>
                                <Text size="xs" c="dimmed">{period.time}</Text>
                            </Box>

                            {/* Days */}
                            {DAYS.map(day => {
                                const event = getEvent(day.value, period.id);
                                const isStart = isEventStart(day.value, period.id);

                                return (
                                    <Box
                                        key={day.value}
                                        className={`p-1 border-r last:border-r-0 dark:border-zinc-800 relative group transition-colors hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 flex flex-col cursor-pointer`}
                                        onClick={() => {
                                            if (!event) {
                                                setEditingItem({
                                                    thu: day.value,
                                                    tietBatDau: period.id,
                                                    lopNamId: Number(lopNamId)
                                                });
                                                open();
                                            }
                                        }}
                                    >
                                        {event ? (
                                            isStart ? (
                                                <Card
                                                    p="xs"
                                                    radius="md"
                                                    className="h-full bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500 cursor-pointer hover:brightness-95 transition-all z-10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenEdit(event);
                                                    }}
                                                >
                                                    <Group justify="space-between" align="start" gap={4}>
                                                        <Text fw={700} size="sm" lineClamp={1} title={event.monHoc?.tenMon}>
                                                            {event.monHoc?.tenMon}
                                                        </Text>
                                                        <Menu shadow="md" width={100}>
                                                            <Menu.Target>
                                                                <ActionIcon size="xs" variant="transparent" onClick={(e) => e.stopPropagation()}>
                                                                    <IconDots size={12} />
                                                                </ActionIcon>
                                                            </Menu.Target>
                                                            <Menu.Dropdown>
                                                                <Menu.Item leftSection={<IconTrash size={12} />} color="red" onClick={() => handleDelete(event.id)}>Xóa</Menu.Item>
                                                            </Menu.Dropdown>
                                                        </Menu>
                                                    </Group>

                                                    <Group gap={4} mt={4}>
                                                        <IconUser size={12} className="opacity-50" />
                                                        <Text size="xs" c="dimmed" lineClamp={1}>{event.gvDay?.hoTen || 'N/A'}</Text>
                                                    </Group>
                                                    <Group gap={4}>
                                                        <IconChalkboard size={12} className="opacity-50" />
                                                        <Text size="xs" c="dimmed">{event.phongHoc || 'N/A'}</Text>
                                                    </Group>
                                                </Card>
                                            ) : (
                                                <Box className="h-full w-full bg-indigo-50/50 dark:bg-indigo-900/10 border-l-4 border-l-indigo-500/50 rounded-md" />
                                            )
                                        ) : (
                                            <Box className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <ThemeIcon variant="light" size="sm" color="indigo" radius="xl">
                                                    <IconPlus size={14} />
                                                </ThemeIcon>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </SimpleGrid>
                    ))}
                </Paper>
            </Box>

            <CalendarModal
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingItem}
                loading={createMutation.isPending || updateMutation.isPending}
                lopNamId={lopNamId ? parseInt(lopNamId) : undefined}
            />
        </Box>
    );
}
