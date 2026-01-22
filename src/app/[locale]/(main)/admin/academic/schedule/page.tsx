"use client";

import {
    Box, Button, Group, Title, Paper, Stack, Text,
    Select, SimpleGrid, Card, ThemeIcon, Badge, Avatar,
    ActionIcon
} from "@mantine/core";
import {
    IconArrowLeft,
    IconCalendarEvent, IconChalkboard, IconUser, IconUsers
} from "@tabler/icons-react";
import { useState, useMemo } from "react";
import { AppQuery } from "@/api/AppQuery";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";

export default function ScheduleOverviewPage() {
    const t = useTranslations("academic.schedule");
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    // State
    const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
    const [selectedYearId, setSelectedYearId] = useState<string | null>(null);

    // Queries
    const { data: years } = AppQuery.academic.useYears();
    const { data: khois } = AppQuery.academic.useKhois();

    // Auto-select latest year if not set
    useMemo(() => {
        if (years && years.length > 0 && !selectedYearId) {
            setSelectedYearId(String(years[0].id));
        }
    }, [years, selectedYearId]);

    const { data: lopNams, isLoading } = AppQuery.academic.useClassYears(
        {
            namHocId: selectedYearId ? parseInt(selectedYearId) : undefined,
        } as any,
        { enabled: !!selectedYearId }
    );

    // Filtered classes by selected Grade
    const filteredLopNams = useMemo(() => {
        if (!selectedGradeId || !lopNams) return [];
        return lopNams.filter((ln: any) => ln.lopHoc?.khoiId === selectedGradeId);
    }, [lopNams, selectedGradeId]);

    // Derived Selection Options
    const yearOptions = useMemo(() =>
        years?.map((y: any) => ({ value: String(y.id), label: y.tenNamHoc })) || [],
        [years]);

    const handleClassClick = (lopNamId: number) => {
        router.push(`/${locale}/admin/academic/schedule/${lopNamId}`);
    };

    const selectedGrade = useMemo(() =>
        khois?.find((k: any) => k.id === selectedGradeId),
        [khois, selectedGradeId]
    );

    return (
        <Box className="w-full min-h-screen bg-[#fcfcfd] dark:bg-[#09090b]">
            {/* Header */}
            <Box className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 px-6 py-4 sticky top-0 z-40">
                <Group justify="space-between">
                    <Group>
                        {selectedGradeId && (
                            <ActionIcon variant="subtle" onClick={() => setSelectedGradeId(null)} size="lg">
                                <IconArrowLeft size={20} />
                            </ActionIcon>
                        )}
                        <ThemeIcon size={40} radius="xl" variant="light" color="indigo">
                            <IconCalendarEvent size={22} />
                        </ThemeIcon>
                        <div>
                            <Title order={3} className="text-gray-900 dark:text-white">
                                {selectedGrade ? `Lớp học khối ${selectedGrade.maKhoi}` : "Thời khóa biểu"}
                            </Title>
                            <Text size="sm" c="dimmed">
                                {selectedGrade ? "Chọn lớp học để xem lịch" : "Chọn khối học để bắt đầu"}
                            </Text>
                        </div>
                    </Group>

                    {selectedGradeId && (
                        <Select
                            placeholder="Chọn năm học"
                            data={yearOptions}
                            value={selectedYearId}
                            onChange={(val) => setSelectedYearId(val)}
                            searchable
                            w={200}
                        />
                    )}
                </Group>
            </Box>

            {/* Content */}
            <Box className="p-6 max-w-[1400px] mx-auto">
                {!selectedGradeId ? (
                    // 1. GRADE SELECTION
                    <>
                        <Text size="lg" fw={600} mb="xl">Danh sách khối học</Text>
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing="lg">
                            {khois?.map((khoi: any) => (
                                <Card
                                    key={khoi.id}
                                    withBorder
                                    padding="xl"
                                    radius="md"
                                    className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.05] hover:border-indigo-500 text-center"
                                    onClick={() => setSelectedGradeId(khoi.id)}
                                >
                                    <Stack align="center" gap="xs">
                                        <ThemeIcon size={60} radius="xl" variant="light" color="indigo">
                                            <Text fw={800} size="xl">{khoi.maKhoi}</Text>
                                        </ThemeIcon>
                                        <Text fw={700} size="lg">Khối {khoi.maKhoi}</Text>
                                        <Text size="xs" c="dimmed">{khoi.tenKhoi}</Text>
                                    </Stack>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </>
                ) : (
                    // 2. CLASS SELECTION (within Grade)
                    <>
                        {isLoading ? (
                            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                                {[1, 2, 3, 4].map((i) => (
                                    <Card key={i} withBorder padding="lg" radius="md" className="animate-pulse">
                                        <Box h={120} />
                                    </Card>
                                ))}
                            </SimpleGrid>
                        ) : filteredLopNams.length > 0 ? (
                            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                                {filteredLopNams.map((lopNam: any) => (
                                    <Card
                                        key={lopNam.id}
                                        withBorder
                                        padding="lg"
                                        radius="md"
                                        className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                        onClick={() => handleClassClick(lopNam.id)}
                                    >
                                        <Stack gap="md">
                                            <Group justify="space-between">
                                                <ThemeIcon size={50} radius="md" variant="light" color="indigo" className="bg-gradient-to-br from-indigo-50 to-blue-50">
                                                    <IconChalkboard size={28} className="text-indigo-600" />
                                                </ThemeIcon>
                                                <Badge size="sm" variant="dot" color="blue">
                                                    Lớp {lopNam.lopHoc?.tenLop}
                                                </Badge>
                                            </Group>

                                            <div>
                                                <Text fw={700} size="lg" className="text-gray-900 dark:text-white">
                                                    {lopNam.lopHoc?.tenLop}
                                                </Text>
                                                <Text size="sm" c="dimmed">
                                                    {lopNam.namHoc?.tenNamHoc}
                                                </Text>
                                            </div>

                                            <Group gap="xs">
                                                <IconUser size={16} className="text-gray-400" />
                                                <Text size="sm" c="dimmed" lineClamp={1}>
                                                    {lopNam.gvChuNhiem?.hoTen || 'Chưa có GVCN'}
                                                </Text>
                                            </Group>

                                            <Group gap="xs">
                                                <IconUsers size={16} className="text-gray-400" />
                                                <Text size="sm" c="dimmed">
                                                    Sĩ số: {lopNam.siSo || 0} học sinh
                                                </Text>
                                            </Group>
                                        </Stack>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        ) : (
                            <Stack align="center" mt={60} gap="md">
                                <IconChalkboard size={64} stroke={1} className="opacity-50" />
                                <Text size="lg" fw={500} c="dimmed">Chưa có lớp học nào thuộc khối này trong năm học đã chọn</Text>
                                <Button variant="light" color="indigo" onClick={() => setSelectedGradeId(null)}>Quay lại chọn khối</Button>
                            </Stack>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}
