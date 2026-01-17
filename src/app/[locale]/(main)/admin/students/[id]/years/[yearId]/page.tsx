'use client';

import { Title, Text, Paper, Group, Stack, Breadcrumbs, Anchor, Loader, Badge, Card, Grid, Timeline, ThemeIcon, Alert, Divider } from '@mantine/core';
import { IconSchool, IconCalendar, IconInfoCircle, IconUser, IconChevronLeft, IconClock } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { AppQuery } from '@/api/AppQuery';
import { useParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import { useMemo } from 'react';

export default function StudentYearDetailPage() {
    const t = useTranslations('students');
    const common = useTranslations('common');
    const params = useParams();
    const router = useRouter();
    const studentId = parseInt(params.id as string);
    const yearId = parseInt(params.yearId as string);

    const { data: user, isLoading: isLoadingUser } = AppQuery.user.useDetail(studentId);
    const { data: semesters, isLoading: isLoadingSemesters } = AppQuery.academic.useHocKys({ namHocId: yearId });

    const studentProfile = user?.hoSoHocSinh;
    const yearRecord = useMemo(() =>
        studentProfile?.cacLopNam?.find(ln => ln.lopNam?.namHocId === yearId),
        [studentProfile, yearId]
    );

    if (isLoadingUser || isLoadingSemesters) return <Loader />;
    if (!user || !studentProfile || !yearRecord) return <Text>Record not found</Text>;

    const breadcrumbs = [
        { title: 'Students', href: '/admin/students' },
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
                        {yearRecord.lopNam?.namHoc?.tenNamHoc} Academic Year
                    </Title>
                    <Text c="dimmed">{studentProfile.hoTen} ({studentProfile.maSoHs})</Text>
                </Stack>
                {yearRecord.lopNam?.namHoc?.dangKichHoat && (
                    <Badge size="xl" color="green" variant="filled">Current Active Year</Badge>
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
                            <Text fw={700} size="lg" mb={4}>Class Assignment</Text>
                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Class Name:</Text>
                                    <Text size="sm" fw={600}>{yearRecord.lopNam?.lopHoc?.tenLop}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Grade:</Text>
                                    <Text size="sm" fw={600}>{yearRecord.lopNam?.lopHoc?.khoi?.tenKhoi}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Homeroom Teacher:</Text>
                                    <Text size="sm" fw={600}>{yearRecord.lopNam?.gvChuNhiem?.nguoiDung?.hoTen || 'Undecided'}</Text>
                                </Group>
                                <Divider my="xs" />
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Study Status:</Text>
                                    <Badge color={yearRecord.trangThai === 'DANG_HOC' ? 'green' : 'gray'}>
                                        {yearRecord.trangThai}
                                    </Badge>
                                </Group>
                            </Stack>
                        </Card>

                        <Card withBorder radius="md" p="md">
                            <ThemeIcon size="lg" radius="md" mb="md" color="orange">
                                <IconCalendar size={20} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb={4}>Year Schedule</Text>
                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Start Date:</Text>
                                    <Text size="sm" fw={600}>
                                        {yearRecord.lopNam?.namHoc?.ngayBatDau ? new Date(yearRecord.lopNam.namHoc.ngayBatDau).toLocaleDateString('vi-VN') : 'N/A'}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">End Date:</Text>
                                    <Text size="sm" fw={600}>
                                        {yearRecord.lopNam?.namHoc?.ngayKetThuc ? new Date(yearRecord.lopNam.namHoc.ngayKetThuc).toLocaleDateString('vi-VN') : 'N/A'}
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
                            <Title order={4} mb="md">Enrollment Timeline</Title>
                            <Timeline active={yearRecord.ngayRa ? 2 : 1} bulletSize={24} lineWidth={2}>
                                <Timeline.Item
                                    bullet={<IconClock size={12} />}
                                    title="Student Enrolled"
                                >
                                    <Text c="dimmed" size="sm">
                                        Joined class {yearRecord.lopNam?.lopHoc?.tenLop} on {new Date(yearRecord.ngayVao).toLocaleDateString('vi-VN')}
                                    </Text>
                                </Timeline.Item>

                                <Timeline.Item
                                    bullet={<IconInfoCircle size={12} />}
                                    title="Current Status"
                                >
                                    <Text size="sm">
                                        The student is currently <Text span fw={700} c={yearRecord.trangThai === 'DANG_HOC' ? 'green' : 'red'}>{yearRecord.trangThai.toLowerCase()}</Text> in this academic year.
                                    </Text>
                                </Timeline.Item>

                                {yearRecord.ngayRa && (
                                    <Timeline.Item
                                        bullet={<IconChevronLeft size={12} />}
                                        title="Student Left/End of Year"
                                    >
                                        <Text c="dimmed" size="sm">
                                            Recorded exit on {new Date(yearRecord.ngayRa).toLocaleDateString('vi-VN')}
                                        </Text>
                                    </Timeline.Item>
                                )}
                            </Timeline>
                        </Card>

                        <Card withBorder radius="md" p="md">
                            <Title order={4} mb="md">Academic Semesters</Title>
                            {semesters && semesters.length > 0 ? (
                                <Stack gap="xs">
                                    {semesters.map((sem: any) => (
                                        <Card key={sem.id} withBorder p="sm" radius="md">
                                            <Group justify="space-between">
                                                <Stack gap={0}>
                                                    <Text fw={600}>{sem.tenHocKy}</Text>
                                                    <Text size="xs" c="dimmed">
                                                        {new Date(sem.ngayBatDau).toLocaleDateString('vi-VN')} - {new Date(sem.ngayKetThuc).toLocaleDateString('vi-VN')}
                                                    </Text>
                                                </Stack>
                                                <Badge variant="light" color={sem.dangKichHoat ? 'green' : 'gray'}>
                                                    {sem.dangKichHoat ? 'Current' : 'Inactive'}
                                                </Badge>
                                            </Group>
                                        </Card>
                                    ))}
                                </Stack>
                            ) : (
                                <Alert icon={<IconInfoCircle size={16} />} color="blue">
                                    No semesters have been configured for this academic year.
                                </Alert>
                            )}
                        </Card>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Stack>
    );
}
