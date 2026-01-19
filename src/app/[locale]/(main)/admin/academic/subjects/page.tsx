'use client';

import { Title, Text, Button, Paper, SimpleGrid, Group, Stack, ThemeIcon, Box, Skeleton } from '@mantine/core';
import { IconSchool, IconBooks, IconArrowRight } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { AppQuery } from '@/api/AppQuery';
import { useRouter } from '@/i18n/routing';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';

export default function SubjectsPage() {
    const t = useTranslations('admin.academic.subjects');
    const router = useRouter();

    const { data: grades, isLoading } = AppQuery.academic.useGrades();

    return (
        <Stack gap={0} pos="relative" className="w-full min-h-screen bg-[#fcfcfd] dark:bg-[#09090b]">
            <Box
                pos="sticky"
                top={0}
                pt={{ base: 'md', sm: 'xl' }}
                pb="md"
                px={{ base: 'md', sm: 'xl' }}
                bg="white"
                style={{
                    zIndex: 100,
                    borderBottom: '1px solid var(--mantine-color-default-border)',
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }}
                className="dark:bg-zinc-900/80 dark:border-zinc-800"
            >
                <Group justify="space-between" align="center" wrap="nowrap">
                    <Group align="center" gap="md" style={{ flex: 1, minWidth: 0 }}>
                        <Box className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                            <IconBooks size={28} className="text-indigo-600 dark:text-indigo-400" />
                        </Box>
                        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                            <Title order={2} size="h3" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {t('title', { defaultMessage: 'Quản lý Môn học' })}
                            </Title>
                            <Text c="dimmed" size="xs" lineClamp={1}>
                                {t('grade_selection_subtitle', { defaultMessage: 'Chọn khối lớp để quản lý danh sách môn học' })}
                            </Text>
                        </Stack>
                    </Group>
                </Group>
            </Box>

            <Stack p={{ base: 'sm', sm: 'md', md: 'xl' }} gap="lg" className="max-w-7xl mx-auto w-full">
                <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing="md">
                    {isLoading ? (
                        Array(8).fill(0).map((_, i) => (
                            <Paper key={i} withBorder p="md" radius="md">
                                <Skeleton h={38} w={38} radius="md" mb="xs" />
                                <Stack gap={4} mt="xs">
                                    <Skeleton h={20} w="70%" />
                                    <Skeleton h={14} w="40%" />
                                </Stack>
                                <Group justify="end" mt="md">
                                    <Skeleton h={30} w={100} radius="md" />
                                </Group>
                            </Paper>
                        ))
                    ) : (
                        grades?.map((grade) => (
                            <Paper
                                key={grade.id}
                                withBorder
                                p="md"
                                radius="md"
                                className="hover:shadow-md transition-all duration-300 bg-white dark:bg-zinc-900 dark:border-zinc-800"
                            >
                                <Group justify="space-between" align="center" mb="xs">
                                    <ThemeIcon size={38} radius="md" variant="light" color="blue">
                                        <IconSchool size={20} />
                                    </ThemeIcon>
                                </Group>

                                <Stack gap={4} mt="xs">
                                    <Title order={4} size="h5">{grade.tenKhoi}</Title>
                                    {grade.moTa ? (
                                        <Text size="xs" c="dimmed" lineClamp={2}>
                                            {grade.moTa}
                                        </Text>
                                    ) : (
                                        <Text size="xs" c="dimmed"><i>{t('no_description', { defaultMessage: 'Chưa có mô tả' })}</i></Text>
                                    )}
                                </Stack>

                                <Group justify="end" mt="md">
                                    <Button
                                        variant="light"
                                        color="indigo"
                                        size="xs"
                                        radius="md"
                                        rightSection={<IconArrowRight size={14} />}
                                        onClick={() => router.push(`/admin/academic/subjects/${grade.id}`)}
                                    >
                                        {t('view_subjects', { defaultMessage: 'Xem môn học' })}
                                    </Button>
                                </Group>
                            </Paper>
                        ))
                    )}
                </SimpleGrid>

                {grades?.length === 0 && !isLoading && (
                    <Paper p="xl" withBorder radius="md" style={{ textAlign: 'center' }}>
                        <Text c="dimmed">Không tìm thấy khối lớp nào</Text>
                    </Paper>
                )}
            </Stack>
        </Stack>
    );
}
