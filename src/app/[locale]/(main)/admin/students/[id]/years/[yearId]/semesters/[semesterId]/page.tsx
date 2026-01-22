'use client';

import { Title, Text, Group, Stack, Breadcrumbs, Badge, Card, Grid, ThemeIcon, Button, Tabs, Table } from '@mantine/core';
import { IconSchool, IconCalendar, IconInfoCircle, IconUser, IconChevronLeft, IconClock, IconAward, IconUsers, IconReceipt, IconChartBar, IconBook, IconArrowLeft } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { formatDate, formatDateWithWeekday, formatDateRange } from '@/shared/common/date';
import { AppQuery } from '@/api/AppQuery';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { SemesterGradesTable } from '@/feauture/admin/students/components/SemesterGradesTable';
import { useBreadcrumbs } from '@/shared/hooks/useBreadcrumbs';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';

import { useMemo } from 'react';

export default function SemesterDetailPage() {
    const t = useTranslations('students');
    const common = useTranslations('common');
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const studentId = parseInt(params.id as string);
    const yearId = parseInt(params.yearId as string);
    const semesterId = parseInt(params.semesterId as string);

    const allowedTabs = useMemo(() => ['overview', 'grades', 'schedule', 'finance'], []);
    const activeTab = useMemo(() => {
        const tab = searchParams.get('tab');
        return tab && allowedTabs.includes(tab) ? tab : 'overview';
    }, [allowedTabs, searchParams]);

    const handleTabChange = (value: string | null) => {
        if (!value) return;
        const next = new URLSearchParams(searchParams.toString());
        next.set('tab', value);
        router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    };

    const { data: user, isLoading: isLoadingUser } = AppQuery.user.useDetail(studentId);
    const { data: semester, isLoading: isLoadingSemester } = AppQuery.academic.useHocKyDetail(semesterId);
    const { data: gradingData, isLoading: isLoadingGrading } = AppQuery.grading.useList({ where: { hocKyId: semesterId, hocSinhId: studentId } });
    const { data: submissions, isLoading: isLoadingSubmissions } = AppQuery.submission.useList({ where: { hocKyId: semesterId, hocSinhId: studentId } });
    const { data: subjects } = AppQuery.academic.useSubjects();

    const studentProfile = user?.hoSoHocSinh;
    const yearRecord = useMemo(() =>
        studentProfile?.cacLopNam?.find(ln => ln.lopNam?.namHocId === yearId),
        [studentProfile, yearId]
    );

    const { data: calendarData, isLoading: isLoadingCalendar } = AppQuery.calendar.useByLopNam(yearRecord?.lopNamId || 0);

    const breadcrumbItems = useMemo(
        () => [
            { title: 'Học sinh', href: '/admin/students' },
            { title: studentProfile?.hoTen || '', href: `/admin/students/${studentId}` },
            { title: yearRecord?.lopNam?.namHoc?.tenNamHoc || '', href: `/admin/students/${studentId}/years/${yearId}` },
            { title: semester?.tenHocKy || '', href: '#' },
        ],
        [studentId, yearId, studentProfile?.hoTen, yearRecord?.lopNam?.namHoc?.tenNamHoc, semester?.tenHocKy]
    );

    const breadcrumbs = useBreadcrumbs(breadcrumbItems, { LinkComponent: Link });

    if (isLoadingUser || isLoadingSemester || isLoadingGrading || isLoadingSubmissions || isLoadingCalendar) return <SkeletonLoader type="cards" count={4} />;
    if (!user || !studentProfile || !yearRecord || !semester) return <Text>{t('not_found')}</Text>;

    return (
        <Stack gap="md" p="md">
            <Breadcrumbs>{breadcrumbs}</Breadcrumbs>

            <Group justify="space-between">
                <Stack gap={0}>
                    <Title order={2}>
                        {semester.tenHocKy} - {yearRecord.lopNam?.namHoc?.tenNamHoc}
                    </Title>
                    <Text c="dimmed">{studentProfile.hoTen} ({studentProfile.maSoHs})</Text>
                </Stack>
                <Button
                    variant="subtle"
                    leftSection={<IconArrowLeft size={14} />}
                    onClick={() => router.back()}
                >
                    Quay lại
                </Button>
            </Group>

            <Grid>
                {/* Semester Info Card */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack>
                        <Card withBorder radius="md" p="md">
                            <ThemeIcon size="lg" radius="md" mb="md" color="indigo">
                                <IconCalendar size={20} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb={4}>{semester.tenHocKy}</Text>
                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Thời gian:</Text>
                                    <Text size="sm" fw={600}>
                                        {formatDateRange(semester.ngayBatDau, semester.ngayKetThuc)}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Trạng thái:</Text>
                                    <Badge color={semester.dangKichHoat ? 'green' : 'gray'}>
                                        {semester.dangKichHoat ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </Badge>
                                </Group>
                            </Stack>
                        </Card>

                        <Card withBorder radius="md" p="md">
                            <ThemeIcon size="lg" radius="md" mb="md" color="orange">
                                <IconSchool size={20} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb={4}>{t('class_info')}</Text>
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
                            </Stack>
                        </Card>
                    </Stack>
                </Grid.Col>

                {/* Main Content */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack>
                        <Tabs value={activeTab} onChange={handleTabChange} variant="pills" radius="xl" color="indigo">
                            <Tabs.List grow>
                                <Tabs.Tab value="overview" leftSection={<IconInfoCircle size={14} />}>
                                    Tổng quan
                                </Tabs.Tab>
                                <Tabs.Tab value="grades" leftSection={<IconAward size={14} />}>
                                    Điểm số
                                </Tabs.Tab>
                                <Tabs.Tab value="schedule" leftSection={<IconCalendar size={14} />}>
                                    Lịch học
                                </Tabs.Tab>
                                <Tabs.Tab value="finance" leftSection={<IconReceipt size={14} />}>
                                    Tài chính
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="overview" pt="md">
                                <Stack gap="md">
                                    <Title order={5}>Tổng quan học kỳ</Title>
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <Card withBorder p="md">
                                                <Group>
                                                    <ThemeIcon color="indigo" size={24}>
                                                        <IconCalendar size={16} />
                                                    </ThemeIcon>
                                                    <Stack gap={0}>
                                                        <Text size="sm" fw={500}>{t('start_date')}</Text>
                                                        <Text size="lg" fw={600}>
                                                            {formatDateWithWeekday(semester.ngayBatDau)}
                                                        </Text>
                                                    </Stack>
                                                </Group>
                                            </Card>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Card withBorder p="md">
                                                <Group>
                                                    <ThemeIcon color="red" size={24}>
                                                        <IconClock size={16} />
                                                    </ThemeIcon>
                                                    <Stack gap={0}>
                                                        <Text size="sm" fw={500}>{t('end_date')}</Text>
                                                        <Text size="lg" fw={600}>
                                                            {formatDateWithWeekday(semester.ngayKetThuc)}
                                                        </Text>
                                                    </Stack>
                                                </Group>
                                            </Card>
                                        </Grid.Col>
                                        <Grid.Col span={12}>
                                            {semester.moTa && (
                                                <Card withBorder p="md">
                                                    <Group>
                                                        <ThemeIcon color="orange" size={24}>
                                                            <IconInfoCircle size={16} />
                                                        </ThemeIcon>
                                                        <Stack gap={0}>
                                                            <Text size="sm" fw={500}>{t('semester_description')}</Text>
                                                            <Text size="sm">{semester.moTa}</Text>
                                                        </Stack>
                                                    </Group>
                                                </Card>
                                            )}
                                        </Grid.Col>
                                    </Grid>
                                </Stack>
                            </Tabs.Panel>

                            <Tabs.Panel value="grades" pt="md">
                                <Stack gap="md">
                                    <Title order={5}>{t('grades_overview')}</Title>
                                    <SemesterGradesTable gradingData={gradingData} />
                                </Stack>
                            </Tabs.Panel>

                            <Tabs.Panel value="schedule" pt="md">
                                <Stack gap="md">
                                    <Title order={5}>Lịch học</Title>
                                    {calendarData && calendarData.length > 0 ? (
                                        <Table striped highlightOnHover>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th>Thời gian</Table.Th>
                                                    <Table.Th>Thứ Hai</Table.Th>
                                                    <Table.Th>Thứ Ba</Table.Th>
                                                    <Table.Th>Thứ Tư</Table.Th>
                                                    <Table.Th>Thứ Năm</Table.Th>
                                                    <Table.Th>Thứ Sáu</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {calendarData.map((schedule: any, index: number) => (
                                                    <Table.Tr key={index}>
                                                        <Table.Td>{schedule.thoiGian || '-'}</Table.Td>
                                                        <Table.Td>
                                                            {schedule.thu2 && (
                                                                <Badge color={schedule.thu2.monHoc?.mauMau || 'indigo'}>
                                                                    {schedule.thu2.monHoc?.tenMon || '-'}
                                                                </Badge>
                                                            )}
                                                        </Table.Td>
                                                        <Table.Td>
                                                            {schedule.thu3 && (
                                                                <Badge color={schedule.thu3.monHoc?.mauMau || 'indigo'}>
                                                                    {schedule.thu3.monHoc?.tenMon || '-'}
                                                                </Badge>
                                                            )}
                                                        </Table.Td>
                                                        <Table.Td>
                                                            {schedule.thu4 && (
                                                                <Badge color={schedule.thu4.monHoc?.mauMau || 'indigo'}>
                                                                    {schedule.thu4.monHoc?.tenMon || '-'}
                                                                </Badge>
                                                            )}
                                                        </Table.Td>
                                                        <Table.Td>
                                                            {schedule.thu5 && (
                                                                <Badge color={schedule.thu5.monHoc?.mauMau || 'indigo'}>
                                                                    {schedule.thu5.monHoc?.tenMon || '-'}
                                                                </Badge>
                                                            )}
                                                        </Table.Td>
                                                        <Table.Td>
                                                            {schedule.thu6 && (
                                                                <Badge color={schedule.thu6.monHoc?.mauMau || 'indigo'}>
                                                                    {schedule.thu6.monHoc?.tenMon || '-'}
                                                                </Badge>
                                                            )}
                                                        </Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    ) : (
                                        <Text c="dimmed">Chưa có dữ liệu lịch học</Text>
                                    )}
                                </Stack>
                            </Tabs.Panel>

                            <Tabs.Panel value="finance" pt="md">
                                <Stack gap="md">
                                    <Title order={5}>Tổng quan tài chính</Title>
                                    <Table striped highlightOnHover>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Loại phí</Table.Th>
                                                <Table.Th>Số tiền</Table.Th>
                                                <Table.Th>Trạng thái</Table.Th>
                                                <Table.Th>Hạn thanh toán</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            <Table.Tr>
                                                <Table.Td>Học phí</Table.Td>
                                                <Table.Td>2,500,000 VNĐ</Table.Td>
                                                <Table.Td><Badge color="green">Đã thanh toán</Badge></Table.Td>
                                                <Table.Td>2024-01-15</Table.Td>
                                            </Table.Tr>
                                            <Table.Tr>
                                                <Table.Td>Phí tài liệu</Table.Td>
                                                <Table.Td>250,000 VNĐ</Table.Td>
                                                <Table.Td><Badge color="green">Đã thanh toán</Badge></Table.Td>
                                                <Table.Td>2024-01-15</Table.Td>
                                            </Table.Tr>
                                            <Table.Tr>
                                                <Table.Td>Phí hoạt động</Table.Td>
                                                <Table.Td>100,000 VNĐ</Table.Td>
                                                <Table.Td><Badge color="yellow">Chờ thanh toán</Badge></Table.Td>
                                                <Table.Td>2024-02-01</Table.Td>
                                            </Table.Tr>
                                        </Table.Tbody>
                                    </Table>
                                    <Group justify="space-between">
                                        <Text fw={500}>Tổng cộng</Text>
                                        <Badge size="lg" color="indigo">2,850,000 VNĐ</Badge>
                                    </Group>
                                </Stack>
                            </Tabs.Panel>
                        </Tabs>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Stack>
    );
}
