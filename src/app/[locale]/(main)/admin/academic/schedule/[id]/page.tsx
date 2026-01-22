"use client";

import {
    Box, Button, Group, Title, Paper, LoadingOverlay, Stack, Text,
    ActionIcon, Select, Badge, SimpleGrid, Card, Menu,
    ThemeIcon, Center, SegmentedControl
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
    IconPlus, IconTrash, IconChalkboard,
    IconUser, IconCalendarEvent, IconDots, IconArrowLeft,
    IconChevronLeft, IconChevronRight
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useState, useMemo } from "react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { useTranslations } from "next-intl";
import { CalendarModal } from "../CalendarModal";
import { useRouter, useParams } from "next/navigation";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import "dayjs/locale/vi";

dayjs.extend(weekday);
dayjs.locale("vi");

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

export default function ClassSchedulePage() {
    const t = useTranslations("academic.schedule");
    const router = useRouter();
    const params = useParams();
    const lopNamId = params.id as string;

    // State
    const [opened, { open, close }] = useDisclosure(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [view, setView] = useState<'week' | 'month'>('week');

    const isMobile = useMediaQuery("(max-width: 48em)");

    // Calculate start and end of week
    const startOfWeek = currentDate.startOf('week').add(1, 'day'); // Monday
    const endOfWeek = startOfWeek.add(6, 'days'); // Sunday

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => ({
            value: i + 2, // 2-8
            date: startOfWeek.add(i, 'day'),
            label: i === 6 ? 'Chủ Nhật' : `Thứ ${i + 2}`
        }));
    }, [startOfWeek]);

    // Queries
    const { data: scheduleData, isLoading: isLoadingSchedule } = AppQuery.calendar.useList({
        lopNamId: parseInt(lopNamId),
        from: (view === 'week' ? startOfWeek : currentDate.startOf('month')).format('YYYY-MM-DD'),
        to: (view === 'week' ? endOfWeek : currentDate.endOf('month')).format('YYYY-MM-DD')
    } as any);

    // Mutations
    const mutations = AppMutation();
    const createMutation = mutations.academic.useCreateCalendar();
    const updateMutation = mutations.academic.useUpdateCalendar(editingItem?.id || 0);

    const handleOpenEdit = (item: any) => {
        setEditingItem(item);
        open();
    };

    const prevDate = () => setCurrentDate(prev => prev.subtract(1, view === 'week' ? 'week' : 'month'));
    const nextDate = () => setCurrentDate(prev => prev.add(1, view === 'week' ? 'week' : 'month'));
    const goToToday = () => setCurrentDate(dayjs());

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
    const COLORS = ['indigo', 'teal', 'blue', 'violet', 'grape', 'pink', 'orange', 'cyan', 'lime'];
    const getEventColor = (monHocId: number) => COLORS[(monHocId || 0) % COLORS.length];

    const getEvent = (day: number, period: number, date: dayjs.Dayjs) => {
        return scheduleData?.find((item: any) => {
            const isSameDay = item.ngay ? dayjs(item.ngay).isSame(date, 'day') : item.thu === day;
            return isSameDay &&
                period >= item.tietBatDau &&
                period < (item.tietBatDau + item.soTiet);
        });
    };

    const isEventStart = (day: number, period: number, date: dayjs.Dayjs) => {
        const event = getEvent(day, period, date);
        return event && event.tietBatDau === period;
    };

    const renderWeekView = () => (
        <Paper withBorder radius="md" className="overflow-x-auto relative min-h-[500px]">
            <LoadingOverlay visible={isLoadingSchedule} />
            <Box style={{ minWidth: 1000 }}>
                <SimpleGrid cols={8} spacing={0} className="border-b dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
                    <Box
                        className="p-4 border-r dark:border-zinc-800 flex items-center justify-center sticky left-0 z-20 bg-gray-50 dark:bg-zinc-900"
                        style={{ left: 0 }}
                    >
                        <Text fw={700} c="dimmed" size="sm">Tiết / Thứ</Text>
                    </Box>
                    {weekDays.map(day => (
                        <Box key={day.value} className="p-2 border-r last:border-r-0 dark:border-zinc-800 text-center">
                            <Text fw={700} size="sm">{day.label}</Text>
                            <Text size="xs" c="dimmed">{day.date.format('DD/MM/YYYY')}</Text>
                        </Box>
                    ))}
                </SimpleGrid>

                {PERIODS.map(period => (
                    <SimpleGrid key={period.id} cols={8} spacing={0} className="border-b last:border-b-0 dark:border-zinc-800 min-h-[100px]">
                        <Box
                            className="p-3 border-r dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/80 flex flex-col justify-center items-center text-center sticky left-0 z-20 backdrop-blur-sm"
                            style={{ left: 0 }}
                        >
                            <Text fw={600} size="sm">{period.label}</Text>
                            <Text size="xs" c="dimmed">{period.time}</Text>
                        </Box>

                        {weekDays.map(day => {
                            const event = getEvent(day.value, period.id, day.date);
                            const isStart = isEventStart(day.value, period.id, day.date);
                            const eventColor = event ? getEventColor(event.monHocId) : 'indigo';

                            return (
                                <Box
                                    key={day.value}
                                    className={`p-1 border-r last:border-r-0 dark:border-zinc-800 relative group transition-colors hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 flex flex-col cursor-pointer`}
                                    onClick={() => {
                                        if (!event) {
                                            setEditingItem({
                                                thu: day.value,
                                                tietBatDau: period.id,
                                                lopNamId: Number(lopNamId),
                                                ngay: day.date.toDate()
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
                                                style={{
                                                    backgroundColor: `var(--mantine-color-${eventColor}-light)`,
                                                    borderLeft: `4px solid var(--mantine-color-${eventColor}-filled)`
                                                }}
                                                className="h-full cursor-pointer hover:brightness-95 transition-all z-10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenEdit(event);
                                                }}
                                            >
                                                <Group justify="space-between" align="start" gap={2} wrap="nowrap">
                                                    <Text fw={700} size="xs" lineClamp={2} title={event.monHoc?.tenMon}>
                                                        {event.monHoc?.tenMon}
                                                    </Text>
                                                    <Menu shadow="md" width={100}>
                                                        <Menu.Target>
                                                            <ActionIcon size="xs" variant="transparent" onClick={(e) => e.stopPropagation()}>
                                                                <IconDots size={12} />
                                                            </ActionIcon>
                                                        </Menu.Target>
                                                        <Menu.Dropdown>
                                                            <Menu.Item leftSection={<IconTrash size={12} />} color="red" onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(event.id);
                                                            }}>Xóa</Menu.Item>
                                                        </Menu.Dropdown>
                                                    </Menu>
                                                </Group>
                                                <Text size="10px" c="dimmed" lineClamp={1}>{event.gvDay?.hoTen}</Text>
                                                {event.phongHoc && <Text size="10px" c="dimmed">{event.phongHoc}</Text>}
                                            </Card>
                                        ) : (
                                            <Box
                                                className="h-full w-full opacity-50 rounded-md"
                                                style={{ borderLeft: `4px solid var(--mantine-color-${eventColor}-filled)`, backgroundColor: `var(--mantine-color-${eventColor}-light-hover)` }}
                                            />
                                        )
                                    ) : (
                                        <Box className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <ThemeIcon variant="light" size="xs" color="indigo" radius="xl">
                                                <IconPlus size={12} />
                                            </ThemeIcon>
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}
                    </SimpleGrid>
                ))}
            </Box>
        </Paper>
    );

    const renderMonthView = () => {
        const startOfMonth = currentDate.startOf('month');
        const daysInMonth = currentDate.daysInMonth();
        const startDay = startOfMonth.day(); // 0 is Sunday, 1 is Monday...
        const emptyCells = startDay === 0 ? 6 : startDay - 1;

        const days = Array.from({ length: emptyCells + daysInMonth }).map((_, i) => {
            if (i < emptyCells) return null;
            return startOfMonth.add(i - emptyCells, 'day');
        });

        return (
            <Paper withBorder radius="md" className="overflow-hidden">
                <LoadingOverlay visible={isLoadingSchedule} />
                <SimpleGrid cols={7} spacing={0} className="border-b dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 text-center">
                    {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map(h => (
                        <Box key={h} p="xs" className="border-r last:border-r-0 dark:border-zinc-800">
                            <Text fw={700} size="sm">{h}</Text>
                        </Box>
                    ))}
                </SimpleGrid>
                <SimpleGrid cols={7} spacing={0} className="dark:border-zinc-800">
                    {days.map((date, i) => (
                        <Box
                            key={i}
                            className={`min-h-[120px] p-2 border-r border-b dark:border-zinc-800 group cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors ${i % 7 === 6 ? 'border-r-0' : ''}`}
                            onClick={() => {
                                if (date) {
                                    setEditingItem({
                                        ngay: date.toDate(),
                                        thu: date.day() === 0 ? 8 : date.day() + 1,
                                        lopNamId: Number(lopNamId)
                                    });
                                    open();
                                }
                            }}
                        >
                            {date && (
                                <Stack gap={4}>
                                    <Text size="sm" fw={date.isSame(dayjs(), 'day') ? 800 : 500} c={date.isSame(dayjs(), 'day') ? 'indigo' : 'inherit'}>
                                        {date.date()}
                                    </Text>
                                    <Stack gap={2}>
                                        {scheduleData
                                            ?.filter((item: any) => item.ngay && dayjs(item.ngay).isSame(date, 'day'))
                                            .map((event: any) => (
                                                <Badge
                                                    key={event.id}
                                                    variant="dot"
                                                    color={getEventColor(event.monHocId)}
                                                    size="xs"
                                                    fullWidth
                                                    styles={{ label: { textTransform: 'none' } }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenEdit(event);
                                                    }}
                                                >
                                                    T{event.tietBatDau}: {event.monHoc?.tenMon}
                                                </Badge>
                                            ))}
                                    </Stack>
                                </Stack>
                            )}
                        </Box>
                    ))}
                </SimpleGrid>
            </Paper>
        );
    };

    return (
        <Box className="w-full min-h-screen bg-[#fcfcfd] dark:bg-[#09090b]">
            {/* Header */}
            <Box className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 px-4 md:px-6 py-3 md:py-4">
                <Group justify="space-between" align="center">
                    <Group gap="xs" wrap="nowrap">
                        <ActionIcon variant="subtle" onClick={() => router.back()} size="lg">
                            <IconArrowLeft size={20} />
                        </ActionIcon>
                        <ThemeIcon size={36} radius="xl" variant="light" color="indigo" visibleFrom="xs">
                            <IconCalendarEvent size={20} />
                        </ThemeIcon>
                        <Box style={{ flex: 1, minWidth: 0 }}>
                            <Title order={3} className="text-gray-900 dark:text-white" size="h4" lineClamp={1}>Thời khóa biểu</Title>
                            <Text size="xs" c="dimmed" truncate>
                                {view === 'week'
                                    ? `${startOfWeek.format('DD/MM')} - ${endOfWeek.format('DD/MM/YYYY')}`
                                    : `Tháng ${currentDate.format('MM/YYYY')}`
                                }
                            </Text>
                        </Box>
                    </Group>

                    <Group gap="xs">
                        <SegmentedControl
                            value={view}
                            onChange={(val: any) => setView(val)}
                            data={[
                                { label: 'Tuần', value: 'week' },
                                { label: 'Tháng', value: 'month' },
                            ]}
                            size="xs"
                            color="indigo"
                            visibleFrom="sm"
                        />

                        <Group gap={5} wrap="nowrap">
                            <ActionIcon variant="light" color="gray" onClick={prevDate} size="md">
                                <IconChevronLeft size={16} />
                            </ActionIcon>
                            <DatePickerInput
                                value={currentDate.toDate()}
                                onChange={(val) => val && setCurrentDate(dayjs(val))}
                                size="xs"
                                placeholder="Chọn"
                                style={{ width: 85 }}
                                valueFormat="DD/MM"
                                dropdownType="popover"
                            />
                            <ActionIcon variant="light" color="gray" onClick={nextDate} size="md">
                                <IconChevronRight size={16} />
                            </ActionIcon>
                            <Button variant="light" color="gray" size="xs" onClick={goToToday} visibleFrom="md">Hôm nay</Button>
                        </Group>
                    </Group>
                </Group>
            </Box>

            <Box className="p-4 md:p-6 max-w-[1600px] mx-auto">
                {view === 'week' ? renderWeekView() : renderMonthView()}
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
