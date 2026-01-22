"use client";

import { Container, Stack, Title, Card, Text, Badge, Group, Box, ScrollArea, ActionIcon, Timeline, ThemeIcon, LoadingOverlay } from "@mantine/core";
import { IconBook, IconClock, IconMapPin, IconCalendarEvent, IconChevronLeft, IconChevronRight, IconUser } from "@tabler/icons-react";
import { dayjs } from "@/shared/utils/date.util";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { AppQuery } from "@/api/AppQuery";

export default function SchedulePage() {
    const t = useTranslations("student.nav");

    // Simulate current date state
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const startOfWeek = selectedDate.startOf('week');

    // Fetch student schedule
    const { data: scheduleData, isLoading } = AppQuery.calendar.useMySchedule();

    // Generate week days for the horizontal strip
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const date = startOfWeek.add(i + 1, 'day'); // Start from Monday
        return {
            date: date,
            dayName: date.format('dd'), // Mo, Tu, We... (need locale config for these to be VN)
            dayNumber: date.format('DD'),
            isToday: date.isSame(dayjs(), 'day'),
            isSelected: date.isSame(selectedDate, 'day')
        };
    });

    // Map day of week (2-7, 8) to selected date's day
    const selectedDayOfWeek = selectedDate.day() === 0 ? 8 : selectedDate.day() + 1; // Convert Sunday (0) to 8, others +1

    // Filter schedule by selected day
    const filteredSchedule = useMemo(() => {
        if (!scheduleData) return [];
        return scheduleData
            .filter((item: any) => item.thu === selectedDayOfWeek)
            .sort((a: any, b: any) => a.tietBatDau - b.tietBatDau);
    }, [scheduleData, selectedDayOfWeek]);

    // Helper to get time range for a period
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
        const endPeriod = periods[tietBatDau + soTiet - 2];
        if (!startPeriod || !endPeriod) return 'N/A';
        return `${startPeriod.start} - ${endPeriod.end}`;
    };

    return (
        <Container size="lg" className="py-0 px-0 sm:px-4 flex flex-col h-[calc(100vh-64px-56px)] sm:h-auto">
            {/* Header Section */}
            <Box className="bg-white dark:bg-zinc-950 p-4 sticky top-0 z-10 border-b border-gray-100 dark:border-zinc-800">
                <Group justify="space-between" align="center" mb="md">
                    <div>
                        <Title order={2} className="font-black">
                            {t("schedule")}
                        </Title>
                        <Group gap={4}>
                            <IconCalendarEvent size={14} className="text-gray-500" />
                            <Text size="sm" c="dimmed" className="capitalize">
                                {selectedDate.format("dddd, DD MMMM YYYY")}
                            </Text>
                        </Group>
                    </div>
                </Group>

                {/* Date Strip */}
                <ScrollArea type="never" offsetScrollbars={false} className="-mx-4 px-4">
                    <Group gap="sm" wrap="nowrap" className="pb-2">
                        {weekDays.map((day, index) => (
                            <Box
                                key={index}
                                onClick={() => setSelectedDate(day.date)}
                                className={`
                                    flex flex-col items-center justify-center p-2 rounded-2xl min-w-[56px] cursor-pointer transition-all duration-200 border
                                    ${day.isSelected
                                        ? "bg-indigo-600 border-indigo-600 shadow-md transform scale-105"
                                        : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-indigo-300"
                                    }
                                `}
                            >
                                <Text
                                    size="xs"
                                    fw={600}
                                    className={`uppercase mb-1 ${day.isSelected ? "text-indigo-100" : "text-gray-500"}`}
                                >
                                    {day.dayName}
                                </Text>
                                <Text
                                    size="lg"
                                    fw={800}
                                    className={day.isSelected ? "text-white" : "text-gray-900 dark:text-gray-100"}
                                >
                                    {day.dayNumber}
                                </Text>
                                {day.isToday && (
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${day.isSelected ? "bg-white" : "bg-indigo-600"}`} />
                                )}
                            </Box>
                        ))}
                    </Group>
                </ScrollArea>
            </Box>

            {/* Schedule Timeline Content */}
            <ScrollArea className="flex-1 bg-gray-50 dark:bg-black p-4">
                <LoadingOverlay visible={isLoading} />
                <Timeline active={1} bulletSize={24} lineWidth={2}>
                    {filteredSchedule.map((cls: any, index: number) => (
                        <Timeline.Item
                            key={index}
                            bullet={
                                <Box className="bg-indigo-600 w-full h-full rounded-full flex items-center justify-center">
                                    <Text size="xs" fw={700} c="white">{cls.tietBatDau}</Text>
                                </Box>
                            }
                            lineVariant={index === filteredSchedule.length - 1 ? "dashed" : "solid"}
                        >
                            <Box className="ml-2 mb-6">
                                <Group gap="xs" mb={4}>
                                    <Text size="sm" fw={700} c="dimmed" className="font-mono">
                                        {getTimeRange(cls.tietBatDau, cls.soTiet)}
                                    </Text>
                                    {cls.soTiet > 1 && (
                                        <Badge size="xs" variant="dot" color="blue">{cls.soTiet} tiết</Badge>
                                    )}
                                </Group>

                                <Card
                                    padding="md"
                                    radius="lg"
                                    className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-zinc-900 relative overflow-hidden group"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-lg" />

                                    <Group justify="space-between" align="start" wrap="nowrap">
                                        <Stack gap={4} className="flex-1">
                                            <Text fw={800} size="lg" className="group-hover:text-indigo-600 transition-colors">
                                                {cls.monHoc?.tenMon || 'N/A'}
                                            </Text>

                                            <Group gap="lg" mt={2}>
                                                <Group gap={4}>
                                                    <IconUser size={14} className="text-gray-400" />
                                                    <Text size="sm" c="dimmed">
                                                        {cls.gvDay?.hoTen || 'Chưa phân công'}
                                                    </Text>
                                                </Group>
                                                <Group gap={4}>
                                                    <IconMapPin size={14} className="text-gray-400" />
                                                    <Text size="sm" c="dimmed">
                                                        {cls.phongHoc || 'N/A'}
                                                    </Text>
                                                </Group>
                                            </Group>
                                        </Stack>
                                    </Group>
                                </Card>
                            </Box>
                        </Timeline.Item>
                    ))}
                </Timeline>

                {/* Empty State visual if no classes */}
                {filteredSchedule.length === 0 && !isLoading && (
                    <Stack align="center" className="py-12 opacity-50">
                        <IconBook size={48} />
                        <Text>Không có lịch học cho ngày này</Text>
                    </Stack>
                )}

                {/* Bottom spacer for safe area */}
                <div className="h-20" />
            </ScrollArea>
        </Container>
    );
}
