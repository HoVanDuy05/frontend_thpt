'use client';

import { Title, Text, Paper, Group, Stack, Breadcrumbs, Anchor, Loader, Table, Avatar, Badge, Button, TextInput, Box, rem, ActionIcon, Grid, Card, ThemeIcon, Divider, SimpleGrid } from '@mantine/core';
import { IconSearch, IconUserPlus, IconChevronLeft, IconSchool, IconUsers, IconCalendar, IconInfoCircle, IconUser } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { AppQuery } from '@/api/AppQuery';
import { useParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import { useState } from 'react';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';
import { AddStudentModal } from './AddStudentModal';
import { useDisclosure } from '@mantine/hooks';

export default function ClassDetailPage() {
    const t = useTranslations('academic.grades');
    const common = useTranslations('common');
    const params = useParams();
    const gradeId = Number(params.gradeId);
    const yearId = Number(params.yearId);
    const classId = Number(params.classId);

    const router = useRouter();
    const [opened, { open, close }] = useDisclosure(false);
    const [search, setSearch] = useState('');

    const { data: grade } = AppQuery.academic.useKhoiDetail(gradeId);
    const { data: year } = AppQuery.academic.useYearDetail(yearId);
    // Note: Ideally we'd have a specific useClassYearDetail hook, but relying on caching/list for now
    const { data: classNam, isLoading } = AppQuery.academic.useClassYears({ namHocId: yearId });

    const currentClass = classNam?.find(c => c.id === classId);

    if (isLoading) return <Loader />;
    if (!currentClass) return <Text>{t('no_classes')}</Text>; // Handle not found better in production

    const filteredStudents = currentClass?.hocSinhs?.filter(hsln =>
        hsln.hocSinh?.hoTen?.toLowerCase().includes(search.toLowerCase()) ||
        hsln.hocSinh?.maSoHs?.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => (a.hocSinh?.hoTen || '').localeCompare(b.hocSinh?.hoTen || '', 'vi')) || [];

    const breadcrumbs = [
        { title: t('title'), href: `/admin/academic/grades` },
        { title: grade?.tenKhoi || '...', href: `/admin/academic/grades/${gradeId}/years` },
        { title: year?.tenNamHoc || '...', href: `/admin/academic/grades/${gradeId}/years/${yearId}/classes` },
        { title: currentClass?.lopHoc?.tenLop || '...', href: '#' },
    ].map((item, index) => (
        <Anchor component={Link} href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    return (
        <Stack gap={0} p={0}>
            {/* Header / Breadcrumbs */}
            <Box
                pos="sticky"
                top={0}
                pt={{ base: 'md', sm: 'xl' }}
                pb="md"
                px={{ base: 'md', sm: 'xl' }}
                bg="var(--mantine-color-body)"
                style={{
                    zIndex: 100,
                    borderBottom: '1px solid var(--mantine-color-default-border)',
                }}
            >
                <Breadcrumbs mb="xs" visibleFrom="sm">{breadcrumbs}</Breadcrumbs>

                <Group justify="space-between" align="center" wrap="nowrap">
                    <Group align="center" gap="sm">
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => window.history.back()}
                            size="md"
                        >
                            <IconChevronLeft size={20} />
                        </ActionIcon>
                        <Stack gap={0}>
                            <Title order={2} size="h3">
                                {t('class_info', { defaultValue: 'Class Info' })}: {currentClass.lopHoc?.tenLop}
                            </Title>
                            <Text c="dimmed" size="xs">{year?.tenNamHoc}</Text>
                        </Stack>
                    </Group>
                </Group>
            </Box>

            <Stack p={{ base: 'sm', sm: 'md', md: 'xl' }} gap="lg">

                {/* Class Information Cards */}
                <Grid>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Card withBorder radius="md" padding="lg">
                            <Group align="flex-start" justify="space-between" mb="md">
                                <Group>
                                    <ThemeIcon size={40} radius="md" variant="light" color="indigo">
                                        <IconSchool size={24} />
                                    </ThemeIcon>
                                    <div>
                                        <Text size="lg" fw={600} style={{ lineHeight: 1 }}>{currentClass.lopHoc?.tenLop}</Text>
                                        <Text size="sm" c="dimmed" mt={4}>{grade?.tenKhoi}</Text>
                                    </div>
                                </Group>
                                <Badge size="lg" variant="light" color="indigo">{year?.tenNamHoc}</Badge>
                            </Group>

                            <Divider my="md" />

                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                <Box>
                                    <Group gap="xs" mb={5}>
                                        <IconUsers size={16} style={{ opacity: 0.7 }} />
                                        <Text size="sm" c="dimmed">{t('fields.homeroom_teacher', { defaultValue: 'Homeroom Teacher' })}</Text>
                                    </Group>
                                    <Group gap="sm">
                                        <Avatar src={currentClass.gvChuNhiem?.hoSoGiaoVien?.nguoiDung?.avatar} radius="xl" color="indigo" />
                                        <div>
                                            <Text size="sm" fw={500}>{currentClass.gvChuNhiem?.hoTen || common('not_assigned')}</Text>
                                            <Text size="xs" c="dimmed">{currentClass.gvChuNhiem?.maSo}</Text>
                                        </div>
                                    </Group>
                                </Box>
                                <Box>
                                    <Group gap="xs" mb={5}>
                                        <IconInfoCircle size={16} style={{ opacity: 0.7 }} />
                                        <Text size="sm" c="dimmed">{t('fields.description', { defaultValue: 'Description' })}</Text>
                                    </Group>
                                    <Text size="sm">{currentClass.lopHoc?.moTa || t('no_description', { defaultValue: 'No description' })}</Text>
                                </Box>
                            </SimpleGrid>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card withBorder radius="md" padding="lg" h="100%">
                            <Title order={4} mb="md">{t('statistics', { defaultValue: 'Statistics' })}</Title>
                            <Stack gap="md">
                                <Group justify="space-between">
                                    <Text size="sm">{t('si_so')}</Text>
                                    <Badge variant="filled" color="dark">{currentClass.siSo}</Badge>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm">{t('students')}</Text>
                                    <Badge variant="light" color="blue">{currentClass.hocSinhs?.length || 0}</Badge>
                                </Group>
                                {/* Example stats - replace with real breakdowns if available */}
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">{t('gender_male', { defaultValue: 'Male' })}</Text>
                                    <Text size="sm" fw={500}>{currentClass.hocSinhs?.filter(h => h.hocSinh?.gioiTinh === 'NAM').length || 0}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">{t('gender_female', { defaultValue: 'Female' })}</Text>
                                    <Text size="sm" fw={500}>{currentClass.hocSinhs?.filter(h => h.hocSinh?.gioiTinh === 'NU').length || 0}</Text>
                                </Group>
                            </Stack>
                        </Card>
                    </Grid.Col>
                </Grid>

                {/* Student List Section */}
                <Stack gap="sm">
                    <Group justify="space-between" align="center">
                        <Card withBorder radius="md" p="xs" w="100%">
                            <Group justify="space-between" align="center">
                                <Title order={4}>{t('student_list')}</Title>
                                <Button
                                    leftSection={<IconUserPlus size={18} />}
                                    size="xs"
                                    variant="filled"
                                    color="indigo"
                                    onClick={open}
                                >
                                    {t('add_student')}
                                </Button>
                            </Group>
                        </Card>
                        <TextInput
                            placeholder={common('actions.search')}
                            leftSection={<IconSearch size={16} />}
                            value={search}
                            onChange={(e) => setSearch(e.currentTarget.value)}
                            size="sm"
                            w={250}
                        />
                    </Group>

                    <Paper withBorder radius="md">
                        <Table.ScrollContainer minWidth={800}>
                            <Table verticalSpacing="sm" highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th w={60} style={{ paddingLeft: 'var(--mantine-spacing-md)' }}>#</Table.Th>
                                        <Table.Th>{t('student_name')}</Table.Th>
                                        <Table.Th>{t('student_id')}</Table.Th>
                                        <Table.Th>{t('gender')}</Table.Th>
                                        <Table.Th>{t('status')}</Table.Th>
                                        <Table.Th align="right" style={{ paddingRight: 'var(--mantine-spacing-md)' }}>{common('actions_header')}</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {filteredStudents.map((hsln, index) => (
                                        <Table.Tr
                                            key={hsln.id}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => router.push(`/admin/students/${hsln.hocSinh.userId}`)}
                                        >
                                            <Table.Td style={{ paddingLeft: 'var(--mantine-spacing-md)' }}>
                                                <Text size="sm" c="dimmed">{index + 1}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Group gap="xs">
                                                    <Avatar size={24} radius="xl" src={hsln.hocSinh?.nguoiDung?.avatar} />
                                                    <Text size="sm" fw={500}>{hsln.hocSinh?.hoTen}</Text>
                                                </Group>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm">{hsln.hocSinh?.maSoHs}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm">{hsln.hocSinh?.gioiTinh}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge variant="dot" size="sm" color={hsln.trangThai === 'DANG_HOC' ? 'green' : 'gray'}>
                                                    {hsln.trangThai}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td align="right" style={{ paddingRight: 'var(--mantine-spacing-md)' }}>
                                                <Button
                                                    variant="subtle"
                                                    size="compact-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/admin/students/${hsln.hocSinh.userId}`);
                                                    }}
                                                >
                                                    {common('details')}
                                                </Button>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>

                        {filteredStudents.length === 0 && (
                            <Text p="xl" c="dimmed" ta="center" size="sm">
                                {t('no_students')}
                            </Text>
                        )}
                    </Paper>
                </Stack>
            </Stack>
            <AddStudentModal
                opened={opened}
                onClose={close}
                yearId={yearId}
                classId={classId}
            />
        </Stack>
    );
}
