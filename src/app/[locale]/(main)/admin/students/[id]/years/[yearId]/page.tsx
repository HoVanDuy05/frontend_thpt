'use client';

import { Title, Text, Paper, Group, Stack, Breadcrumbs, Anchor, Skeleton, Badge, Card, Grid, Timeline, ThemeIcon, Alert, Divider, Collapse, Button } from '@mantine/core';
import { IconSchool, IconCalendar, IconInfoCircle, IconUser, IconChevronLeft, IconClock, IconChevronDown, IconChevronUp, IconChevronsRight } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { AppQuery } from '@/api/AppQuery';
import { useParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import { useMemo, useState } from 'react';

export default function StudentYearDetailPage() {
    const t = useTranslations('students');
    const common = useTranslations('common');
    const params = useParams();
    const router = useRouter();
    const studentId = parseInt(params.id as string);
    const yearId = parseInt(params.yearId as string);
    const [expandedSemesters, setExpandedSemesters] = useState<Set<number>>(new Set());

    const { data: user, isLoading: isLoadingUser } = AppQuery.user.useDetail(studentId);
    const { data: semesters, isLoading: isLoadingSemesters } = AppQuery.academic.useHocKys({ namHocId: yearId });

    const studentProfile = user?.hoSoHocSinh;
    const yearRecord = useMemo(() =>
        studentProfile?.cacLopNam?.find(ln => ln.lopNam?.namHocId === yearId),
        [studentProfile, yearId]
    );

    const toggleSemester = (semesterId: number) => {
        setExpandedSemesters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(semesterId)) {
                newSet.delete(semesterId);
            } else {
                newSet.add(semesterId);
            }
            return newSet;
        });
    };

    if (isLoadingUser || isLoadingSemesters) return <Skeleton />;
    if (!user || !studentProfile || !yearRecord) return <Text>{t('not_found')}</Text>;

    const breadcrumbs = [
        { title: t('breadcrumb_title'), href: '/admin/students' },
        { title: studentProfile.hoTen, href: `/admin/students/${studentId}` },
        { title: yearRecord.lopNam?.namHoc?.tenNamHoc, href: '#' },
    ].map((item, index) => (
        <Anchor component={Link} href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    return (
        <Stack gap="md" p="md">
            <Breadcrumbs>{breadcrumbs}</Breadcrumbs>

            <Group justify="space-between">
                <Stack gap={0}>
                    <Title order={2}>
                        {yearRecord.lopNam?.namHoc?.tenNamHoc} {t('academic_year')}
                    </Title>
                    <Text c="dimmed">{studentProfile.hoTen} ({studentProfile.maSoHs})</Text>
                </Stack>
                {yearRecord.lopNam?.namHoc?.dangKichHoat && (
                    <Badge size="xl" color="green" variant="filled">{t('current_active_year')}</Badge>
                )}
            </Group>

            <Grid>
                {/* Year Status & Class Card */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack>
                        <Card withBorder radius="md" p="md">
                            <ThemeIcon size="lg" radius="md" mb="md" color="indigo">
                                <IconSchool size={20} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb={4}>{t('class_assignment')}</Text>
                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">{t('fields.class_name')}:</Text>
                                    <Text size="sm" fw={600}>{yearRecord.lopNam?.lopHoc?.tenLop}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">{t('fields.grade')}:</Text>
                                    <Text size="sm" fw={600}>{yearRecord.lopNam?.lopHoc?.khoi?.tenKhoi}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">{t('fields.homeroom_teacher')}:</Text>
                                    <Text size="sm" fw={600}>{yearRecord.lopNam?.gvChuNhiem?.nguoiDung?.hoTen || t('not_available')}</Text>
                                </Group>
                                <Divider my="xs" />
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">{t('fields.study_status')}:</Text>
                                    <Badge color={yearRecord.trangThai === 'DANG_HOC' ? 'green' : 'gray'}>
                                        {t(`status.${yearRecord.trangThai.toLowerCase()}`)}
                                    </Badge>
                                </Group>
                            </Stack>
                        </Card>

                        <Card withBorder radius="md" p="md">
                            <ThemeIcon size="lg" radius="md" mb="md" color="orange">
                                <IconCalendar size={20} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb={4}>{t('year_schedule')}</Text>
                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">{t('fields.start_date')}:</Text>
                                    <Text size="sm" fw={600}>
                                        {yearRecord.lopNam?.namHoc?.ngayBatDau ? new Date(yearRecord.lopNam.namHoc.ngayBatDau).toLocaleDateString('vi-VN') : t('not_available')}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">{t('fields.end_date')}:</Text>
                                    <Text size="sm" fw={600}>
                                        {yearRecord.lopNam?.namHoc?.ngayKetThuc ? new Date(yearRecord.lopNam.namHoc.ngayKetThuc).toLocaleDateString('vi-VN') : t('not_available')}
                                    </Text>
                                </Group>
                            </Stack>
                        </Card>
                    </Stack>
                </Grid.Col>

                {/* Semesters & Timeline */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack>
                        <Card withBorder radius="md" p="md">
                            <Title order={4} mb="md">{t('enrollment_timeline')}</Title>
                            <Timeline active={yearRecord.ngayRa ? 2 : 1} bulletSize={24} lineWidth={2}>
                                <Timeline.Item
                                    bullet={<IconClock size={12} />}
                                    title={t('timeline.enrolled')}
                                >
                                    <Text c="dimmed" size="sm">
                                        {t('timeline.joined_class', {
                                            className: yearRecord.lopNam?.lopHoc?.tenLop || t('not_available'),
                                            date: new Date(yearRecord.ngayVao).toLocaleDateString('vi-VN')
                                        })}
                                    </Text>
                                </Timeline.Item>

                                <Timeline.Item
                                    bullet={<IconInfoCircle size={12} />}
                                    title={t('timeline.current_status')}
                                >
                                    <Text size="sm">
                                        {t('timeline.currently_status', { status: t(`status.${yearRecord.trangThai.toLowerCase()}`) })}
                                    </Text>
                                </Timeline.Item>

                                {yearRecord.ngayRa && (
                                    <Timeline.Item
                                        bullet={<IconChevronLeft size={12} />}
                                        title={t('timeline.student_left')}
                                    >
                                        <Text c="dimmed" size="sm">
                                            {t('timeline.recorded_exit', { date: new Date(yearRecord.ngayRa).toLocaleDateString('vi-VN') })}
                                        </Text>
                                    </Timeline.Item>
                                )}
                            </Timeline>
                        </Card>

                        <Card withBorder radius="md" p="md">
                            <Title order={4} mb="md">{t('academic_semesters')}</Title>
                            {semesters && semesters.length > 0 ? (
                                <Stack gap="xs">
                                    {semesters.map((sem: any) => {
                                        const isExpanded = expandedSemesters.has(sem.id);
                                        return (
                                            <Card key={sem.id} withBorder p="sm" radius="md">
                                                <Group justify="space-between" align="center">
                                                    <Stack gap={0} style={{ flex: 1 }}>
                                                        <Text fw={600}>{sem.tenHocKy}</Text>
                                                        <Badge variant="light" color={sem.dangKichHoat ? 'green' : 'gray'}>
                                                            {sem.dangKichHoat ? t('semester_status.active') : t('semester_status.inactive')}
                                                        </Badge>
                                                    </Stack>
                                                    <Button
                                                        variant="subtle"
                                                        size="sm"
                                                        onClick={() => router.push(`/admin/students/${studentId}/years/${yearId}/semesters/${sem.id}`)}
                                                        rightSection={<IconChevronsRight size={14} />}
                                                    >
                                                        {t('view_details')}
                                                    </Button>
                                                </Group>

                                                <Collapse in={isExpanded}>
                                                    <Divider my="sm" />
                                                    <Stack gap="sm" p="sm">
                                                        <Group>
                                                            <ThemeIcon color="blue" size={24}>
                                                                <IconCalendar size={16} />
                                                            </ThemeIcon>
                                                            <Stack gap={0}>
                                                                <Text size="sm" fw={500}>{t('semester_duration')}</Text>
                                                                <Text size="xs" c="dimmed">
                                                                    {new Date(sem.ngayBatDau).toLocaleDateString('vi-VN', {
                                                                        weekday: 'long',
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </Text>
                                                                <Text size="xs" c="dimmed">
                                                                    {t('to')} {new Date(sem.ngayKetThuc).toLocaleDateString('vi-VN', {
                                                                        weekday: 'long',
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </Text>
                                                            </Stack>
                                                        </Group>

                                                        <Group>
                                                            <ThemeIcon color={sem.dangKichHoat ? 'green' : 'gray'} size={24}>
                                                                <IconClock size={16} />
                                                            </ThemeIcon>
                                                            <Stack gap={0}>
                                                                <Text size="sm" fw={500}>{t('semester_status_title')}</Text>
                                                                <Badge
                                                                    variant="light"
                                                                    color={sem.dangKichHoat ? 'green' : 'gray'}
                                                                    size="sm"
                                                                >
                                                                    {sem.dangKichHoat ? t('semester_status.active') : t('semester_status.inactive')}
                                                                </Badge>
                                                            </Stack>
                                                        </Group>

                                                        {sem.moTa && (
                                                            <Group>
                                                                <ThemeIcon color="orange" size={24}>
                                                                    <IconInfoCircle size={16} />
                                                                </ThemeIcon>
                                                                <Stack gap={0}>
                                                                    <Text size="sm" fw={500}>{t('semester_description')}</Text>
                                                                    <Text size="xs" c="dimmed">{sem.moTa}</Text>
                                                                </Stack>
                                                            </Group>
                                                        )}
                                                    </Stack>
                                                </Collapse>
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            ) : (
                                <Alert icon={<IconInfoCircle size={16} />} color="blue">
                                    {t('no_semesters_configured')}
                                </Alert>
                            )}
                        </Card>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Stack>
    );
}
