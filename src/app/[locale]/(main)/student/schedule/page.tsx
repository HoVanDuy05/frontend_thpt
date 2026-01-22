"use client";

import { Container, Stack, Title, Card, Text, Badge, Group, Box, ScrollArea, ActionIcon, Timeline, ThemeIcon, LoadingOverlay, SegmentedControl, Button, Tooltip, SimpleGrid, Paper, Center } from "@mantine/core";
import { IconBook, IconClock, IconMapPin, IconCalendarEvent, IconChevronLeft, IconChevronRight, IconUser, IconRefresh, IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { dayjs } from "@/shared/utils/date.util";
import { useTranslations } from "next-intl";
import { useState, useMemo, useEffect } from "react";
import { AppQuery } from "@/api/AppQuery";

export default function SchedulePage() {
    const t = useTranslations("student.nav");

    // State
    const [view, setView] = useState<'day' | 'week' | 'month'>('day');
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [now, setNow] = useState(dayjs());

    // Update 'now' every minute to refresh "current class" highlight
    useEffect(() => {
        const timer = setInterval(() => setNow(dayjs()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Fetch student schedule
    const { data: scheduleData, isLoading } = AppQuery.calendar.useMySchedule();

    // Helper functions
    const COLORS = ['indigo', 'teal', 'blue', 'violet', 'grape', 'pink', 'orange', 'cyan', 'lime'];
    const getEventColor = (monHocId: number) => COLORS[(monHocId || 0) % COLORS.length];

    const getTimeRange = (tietBatDau: number, soTiet: number) => {
        const periods = [
            { start: '07:00', end: '07:45' },
            { start: '07:50', end: '08:35' },
            { start: '08:40', end: '09:25' },
            { start: '09:40', end: '10:25' },
            { start: '10:30', end: '11:15' },
            { start: '13:00', end: '13:45' },
            { start: '13:50', end: '14:35' },
            { start: '14:40', end: '15:25' },
            { start: '15:40', end: '16:25' },
            { start: '16:30', end: '17:15' },
        ];
        const startPeriod = periods[tietBatDau - 1];
        const endPeriod = periods[tietBatDau + (soTiet || 1) - 2];
        if (!startPeriod || !endPeriod) return { startText: '--:--', endText: '--:--', startRaw: '00:00', endRaw: '00:00' };
        return { startText: startPeriod.start, endText: endPeriod.end, startRaw: startPeriod.start, endRaw: endPeriod.end };
    };

    const isCurrentlyHappening = (startT: string, endT: string) => {
        const [sh, sm] = startT.split(':').map(Number);
        const [eh, em] = endT.split(':').map(Number);
        const startTime = now.hour(sh).minute(sm);
        const endTime = now.hour(eh).minute(em).second(59);
        return now.isAfter(startTime) && now.isBefore(endTime);
    };

    // Date calculations
    const startOfWeek = useMemo(() => {
        const day = selectedDate.day();
        const diff = day === 0 ? -6 : 1 - day;
        return selectedDate.add(diff, 'day').startOf('day');
    }, [selectedDate]);

    const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => ({
        date: startOfWeek.add(i, 'day'),
        dayName: startOfWeek.add(i, 'day').format('dd'),
        dayNumber: startOfWeek.add(i, 'day').format('DD'),
        isToday: startOfWeek.add(i, 'day').isSame(dayjs(), 'day'),
        isSelected: startOfWeek.add(i, 'day').isSame(selectedDate, 'day')
    })), [startOfWeek, selectedDate]);

    // Data Filtering
    const dailySchedule = useMemo(() => {
        if (!scheduleData) return [];
        const dow = selectedDate.day() === 0 ? 8 : selectedDate.day() + 1;
        return scheduleData
            .filter((item: any) => {
                const sameDay = item.thu === dow;
                const matchesDate = item.ngay ? dayjs(item.ngay).isSame(selectedDate, 'day') : true;
                // If it has a date, prioritize it. If not, it's a recurring weekly entry.
                if (item.ngay) return dayjs(item.ngay).isSame(selectedDate, 'day');
                return sameDay;
            })
            .sort((a: any, b: any) => a.tietBatDau - b.tietBatDau);
    }, [scheduleData, selectedDate]);

    // Navigation
    const prevDate = () => setSelectedDate(prev => prev.subtract(1, view === 'day' ? 'day' : view === 'week' ? 'week' : 'month'));
    const nextDate = () => setSelectedDate(prev => prev.add(1, view === 'day' ? 'day' : view === 'week' ? 'week' : 'month'));
    const goToToday = () => setSelectedDate(dayjs());

    // --- Render Components ---

    const renderDayView = () => (
        <Timeline active={-1} bulletSize={30} lineWidth={2}>
            {dailySchedule.map((cls: any, index: number) => {
                const time = getTimeRange(cls.tietBatDau, cls.soTiet);
                const isNow = isCurrentlyHappening(time.startRaw, time.endRaw) && selectedDate.isSame(dayjs(), 'day');
                const color = getEventColor(cls.monHocId);

                return (
                    <Timeline.Item
                        key={cls.id}
                        bullet={
                            <Box className={`w-full h-full rounded-full flex items-center justify-center transition-all ${isNow ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)] scale-110' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                                <Text size="xs" fw={700} c={isNow ? "white" : "dimmed"}>{cls.tietBatDau}</Text>
                            </Box>
                        }
                    >
                        <Box className="ml-2 mb-8">
                            <Group gap="xs" mb={8}>
                                <Badge size="sm" variant="filled" color={isNow ? 'indigo' : 'gray'} className="font-mono">
                                    {time.startText} - {time.endText}
                                </Badge>
                                {isNow && (
                                    <Badge size="xs" color="red" variant="dot" className="animate-pulse">ĐANG DIỄN RA</Badge>
                                )}
                            </Group>

                            <Card
                                p="md"
                                radius="xl"
                                shadow={isNow ? "md" : "sm"}
                                style={{
                                    border: isNow ? '2px solid var(--mantine-color-indigo-6)' : '1px solid var(--mantine-color-gray-2)',
                                    borderLeftWidth: 6,
                                    borderLeftColor: `var(--mantine-color-${color}-filled)`,
                                    backgroundColor: `var(--mantine-color-${color}-light)`
                                }}
                                className="hover:scale-[1.01] transition-transform cursor-pointer"
                            >
                                <Group justify="space-between" align="start">
                                    <Stack gap={2}>
                                        <Text fw={900} size="xl" color={`${color}.9`}>
                                            {cls.monHoc?.tenMon}
                                        </Text>
                                        <Group gap="md">
                                            <Group gap={4}>
                                                <IconUser size={16} className="text-gray-500" />
                                                <Text size="sm" fw={600}>{cls.gvDay?.hoTen || 'Giao viên tự do'}</Text>
                                            </Group>
                                            <Group gap={4}>
                                                <IconMapPin size={16} className="text-gray-500" />
                                                <Text size="sm" c="dimmed">{cls.phongHoc || 'Sân trường'}</Text>
                                            </Group>
                                        </Group>
                                    </Stack>
                                    <ThemeIcon size={40} radius="md" variant="white" color={color}>
                                        <IconBook size={20} />
                                    </ThemeIcon>
                                </Group>
                            </Card>
                        </Box>
                    </Timeline.Item>
                );
            })}
            {dailySchedule.length === 0 && (
                <Center h={300}>
                    <Stack align="center" gap="xs" className="opacity-40">
                        <IconCalendarEvent size={64} stroke={1} />
                        <Text fw={500}>Hôm nay bạn không có lịch học</Text>
                    </Stack>
                </Center>
            )}
        </Timeline>
    );

    const renderWeekView = () => (
        <Paper withBorder radius="md" p={0} className="overflow-x-auto relative min-h-[500px]">
            <Box style={{ minWidth: 1000 }}>
                {/* Header DOW */}
                <SimpleGrid cols={8} spacing={0} className="border-b sticky top-0 z-30 bg-gray-50/95 dark:bg-zinc-900/95 backdrop-blur-sm">
                    <Box className="p-4 border-r flex items-center justify-center sticky left-0 z-40 bg-gray-100">
                        <Text fw={700} size="sm" c="dimmed">Tiết / Thứ</Text>
                    </Box>
                    {weekDays.map((day, i) => (
                        <Box key={i} className={`p-4 border-r dark:border-zinc-800 text-center ${day.isToday ? 'bg-indigo-50/50' : ''}`}>
                            <Text size="xs" fw={700} c="indigo" tt="uppercase">{day.dayName}</Text>
                            <Text size="lg" fw={800}>{day.dayNumber}</Text>
                        </Box>
                    ))}
                </SimpleGrid>

                {/* Grid Content */}
                {Array.from({ length: 10 }).map((_, periodIndex) => (
                    <SimpleGrid key={periodIndex} cols={8} spacing={0} className="border-b dark:border-zinc-800 group h-24">
                        <Box className="border-r dark:border-zinc-800 flex flex-col items-center justify-center sticky left-0 z-20 bg-gray-50">
                            <Text fw={700} size="sm" c="dimmed">Tiết {periodIndex + 1}</Text>
                        </Box>

                        {weekDays.map((day, dayIndex) => {
                            const dow = dayIndex + 2; // 2-8
                            const events = scheduleData?.filter((item: any) => {
                                const matchedDow = item.thu === dow;
                                const matchedDate = item.ngay ? dayjs(item.ngay).isSame(day.date, 'day') : true;
                                const matchedPeriod = item.tietBatDau === periodIndex + 1;
                                if (item.ngay) return dayjs(item.ngay).isSame(day.date, 'day') && matchedPeriod;
                                return matchedDow && matchedPeriod;
                            });

                            return (
                                <Box key={dayIndex} className="p-1 border-r dark:border-zinc-800 min-h-[80px]">
                                    {events?.map((event: any) => (
                                        <Card
                                            key={event.id}
                                            p="xs"
                                            radius="sm"
                                            style={{
                                                backgroundColor: `var(--mantine-color-${getEventColor(event.monHocId)}-light)`,
                                                borderLeftWidth: 3,
                                                borderLeftColor: `var(--mantine-color-${getEventColor(event.monHocId)}-filled)`
                                            }}
                                            className="h-full"
                                        >
                                            <Text fw={700} size="xs" lineClamp={2} c={`${getEventColor(event.monHocId)}.9`}>
                                                {event.monHoc?.tenMon}
                                            </Text>
                                            <Text size="10px" truncate>{event.phongHoc}</Text>
                                        </Card>
                                    ))}
                                </Box>
                            );
                        })}
                    </SimpleGrid>
                ))}
            </Box>
        </Paper>
    );

    const renderMonthView = () => {
        // Very basic custom calendar for month
        const firstDayOfMonth = selectedDate.startOf('month');
        const startOfCalendar = firstDayOfMonth.startOf('week').add(1, 'day'); // Start from Monday
        const days = Array.from({ length: 35 }).map((_, i) => startOfCalendar.add(i, 'day'));

        return (
            <SimpleGrid cols={7} spacing="xs">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                    <Text key={d} ta="center" fw={800} size="sm" c="dimmed" p="xs">{d}</Text>
                ))}
                {days.map((day, i) => {
                    const isToday = day.isSame(dayjs(), 'day');
                    const isOutside = !day.isSame(selectedDate, 'month');
                    const dow = day.day() === 0 ? 8 : day.day() + 1;
                    const events = scheduleData?.filter((item: any) => {
                        if (item.ngay) return dayjs(item.ngay).isSame(day, 'day');
                        return item.thu === dow;
                    });

                    return (
                        <Paper
                            key={i}
                            withBorder
                            p={4}
                            radius="md"
                            h={120}
                            style={{ opacity: isOutside ? 0.4 : 1 }}
                            bg={isToday ? 'indigo.0' : 'white'}
                        >
                            <Text size="xs" fw={700} ta="right" c={isToday ? 'indigo' : 'gray'}>
                                {day.format('D')}
                            </Text>
                            <Stack gap={2} mt={2}>
                                {events?.slice(0, 3).map((e: any) => (
                                    <Badge key={e.id} size="xs" color={getEventColor(e.monHocId)} variant="filled" fullWidth styles={{ label: { textTransform: 'none' } }}>
                                        {e.monHoc?.tenMon}
                                    </Badge>
                                ))}
                                {events && events.length > 3 && (
                                    <Text size="10px" ta="center">+{events.length - 3} thêm</Text>
                                )}
                            </Stack>
                        </Paper>
                    );
                })}
            </SimpleGrid>
        );
    };

    return (
        <Container size="xl" className="py-6 px-4">
            <Stack gap="xl">
                {/* Title & View Switcher */}
                <Group justify="space-between" align="center">
                    <div>
                        <Title className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent" fw={900}>
                            Lịch Học Của Bạn
                        </Title>
                        <Text size="sm" c="dimmed" fw={500}>Theo dõi thời gian biểu và phòng học thông minh</Text>
                    </div>

                    <Group gap="xs">
                        <SegmentedControl
                            value={view}
                            onChange={(val: any) => setView(val)}
                            data={[
                                { label: 'Ngày', value: 'day' },
                                { label: 'Tuần', value: 'week' },
                                { label: 'Tháng', value: 'month' },
                            ]}
                            color="indigo"
                            radius="xl"
                            size="sm"
                        />
                        <Tooltip label="Hôm nay">
                            <ActionIcon variant="light" color="indigo" size="lg" radius="xl" onClick={goToToday}>
                                <IconRefresh size={20} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>

                {/* Sub Header (Navigation) */}
                <Group justify="space-between">
                    <Group>
                        <ActionIcon variant="subtle" color="gray" onClick={prevDate}>
                            <IconArrowLeft size={24} />
                        </ActionIcon>
                        <Text fw={800} size="xl" className="min-w-[200px] text-center">
                            {view === 'day' ? selectedDate.format("dddd, DD/MM") :
                                view === 'week' ? `Tuần ${selectedDate.format("DD/MM")} - ${selectedDate.add(6, 'day').format("DD/MM")}` :
                                    selectedDate.format("MMMM YYYY")}
                        </Text>
                        <ActionIcon variant="subtle" color="gray" onClick={nextDate}>
                            <IconArrowRight size={24} />
                        </ActionIcon>
                    </Group>

                    <Button variant="light" color="indigo" radius="xl" leftSection={<IconClock size={16} />}>
                        Cập nhật cuối: {now.format("HH:mm")}
                    </Button>
                </Group>

                {/* Content Area */}
                <Box className="relative min-h-[600px]">
                    <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'md', blur: 2 }} />
                    {view === 'day' && renderDayView()}
                    {view === 'week' && renderWeekView()}
                    {view === 'month' && renderMonthView()}
                </Box>
            </Stack>
        </Container>
    );
}
