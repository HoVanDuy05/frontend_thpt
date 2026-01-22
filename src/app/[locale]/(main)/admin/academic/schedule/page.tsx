"use client";

import {
    Box, Button, Group, Title, Paper, Stack, Text,
    Select, SimpleGrid, Card, ThemeIcon, Badge, Avatar
} from "@mantine/core";
import {
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
    const [selectedYearId, setSelectedYearId] = useState<string | null>(null);

    // Queries
    const { data: years } = AppQuery.academic.useYears();
    const { data: lopNams, isLoading } = AppQuery.academic.useClassYears(
        { namHocId: selectedYearId ? parseInt(selectedYearId) : undefined },
        { enabled: !!selectedYearId }
    );

    // Derived Selection Options
    const yearOptions = useMemo(() =>
        years?.map((y: any) => ({ value: String(y.id), label: y.tenNamHoc })) || [],
        [years]);

    const handleClassClick = (lopNamId: number) => {
        router.push(`/${locale}/admin/academic/schedule/${lopNamId}`);
    };

    return (
        <Box className="w-full min-h-screen bg-[#fcfcfd] dark:bg-[#09090b]">
            {/* Header */}
            <Box className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 px-6 py-4 sticky top-0 z-40">
                <Group justify="space-between">
                    <Group>
                        <ThemeIcon size={40} radius="xl" variant="light" color="indigo">
                            <IconCalendarEvent size={22} />
                        </ThemeIcon>
                        <div>
                            <Title order={3} className="text-gray-900 dark:text-white">Thời khóa biểu</Title>
                            <Text size="sm" c="dimmed">Quản lý lịch học theo lớp</Text>
                        </div>
                    </Group>

                    <Select
                        placeholder="Chọn năm học"
                        data={yearOptions}
                        value={selectedYearId}
                        onChange={(val) => setSelectedYearId(val)}
                        searchable
                        w={250}
                    />
                </Group>
            </Box>

            {/* Content */}
            <Box className="p-6 max-w-[1400px] mx-auto">
                {!selectedYearId ? (
                    <Stack align="center" mt={100} gap="md">
                        <IconChalkboard size={64} stroke={1} className="opacity-50" />
                        <Text size="lg" fw={500} c="dimmed">Vui lòng chọn năm học để xem danh sách lớp</Text>
                    </Stack>
                ) : (
                    <>
                        <Text size="lg" fw={600} mb="md">
                            Danh sách lớp học
                        </Text>

                        {isLoading ? (
                            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                                {[1, 2, 3, 4].map((i) => (
                                    <Card key={i} withBorder padding="lg" radius="md" className="animate-pulse">
                                        <Box h={120} />
                                    </Card>
                                ))}
                            </SimpleGrid>
                        ) : lopNams && lopNams.length > 0 ? (
                            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                                {lopNams.map((lopNam: any) => (
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
                                                <ThemeIcon size={50} radius="md" variant="light" color="indigo">
                                                    <IconChalkboard size={28} />
                                                </ThemeIcon>
                                                <Badge size="sm" variant="light" color="blue">
                                                    Khối {lopNam.lopHoc?.khoi?.maKhoi || 'N/A'}
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
                                <Text size="lg" fw={500} c="dimmed">Chưa có lớp học nào trong năm học này</Text>
                            </Stack>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}
