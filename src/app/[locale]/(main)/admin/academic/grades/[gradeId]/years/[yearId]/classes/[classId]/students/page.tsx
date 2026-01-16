'use client';

import { Title, Text, Paper, Group, Stack, Breadcrumbs, Anchor, Loader, Table, Avatar, Badge, Button, TextInput, Box, rem, ActionIcon } from '@mantine/core';
import { IconSearch, IconUserPlus, IconChevronLeft } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { AppQuery } from '@/api/AppQuery';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useState } from 'react';

export default function ClassStudentsPage() {
    const t = useTranslations('academic.grades');
    const common = useTranslations('common');
    const params = useParams();
    const gradeId = Number(params.gradeId);
    const yearId = Number(params.yearId);
    const classId = Number(params.classId);

    const [search, setSearch] = useState('');

    const { data: grade } = AppQuery.academic.useKhoiDetail(gradeId);
    const { data: year } = AppQuery.academic.useYearDetail(yearId);
    const { data: classNam, isLoading } = AppQuery.academic.useClassYears({ namHocId: yearId });

    // Find specific class instance
    const currentClass = classNam?.find(c => c.id === classId);

    if (isLoading) return <Loader />;

    const filteredStudents = currentClass?.hocSinhs?.filter(hsln =>
        hsln.hocSinh?.hoTen?.toLowerCase().includes(search.toLowerCase()) ||
        hsln.hocSinh?.maSoHs?.toLowerCase().includes(search.toLowerCase())
    ) || [];

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
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }}
            >
                <Breadcrumbs mb="xs" visibleFrom="sm">{breadcrumbs}</Breadcrumbs>

                <Group justify="space-between" align="center" wrap="nowrap">
                    <Group align="center" gap="sm" style={{ flex: 1, minWidth: 0 }}>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => window.history.back()}
                            size="md"
                        >
                            <IconChevronLeft size={20} />
                        </ActionIcon>
                        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                            <Title order={2} size="h3" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {t('student_list')} - {currentClass?.lopHoc?.tenLop}
                            </Title>
                            <Text c="dimmed" size="xs" lineClamp={1}>{t('student_list_subtitle', { year: year?.tenNamHoc || '' })}</Text>
                        </Stack>
                    </Group>
                </Group>
            </Box>

            <Stack p={{ base: 'sm', sm: 'md', md: 'xl' }} gap="lg">
                <Group justify="space-between" align="center" gap="xs">
                    <TextInput
                        placeholder={common('actions.search')}
                        leftSection={<IconSearch size={16} />}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        size="sm"
                        style={{ flex: 1 }}
                    />
                    <Button
                        leftSection={<IconUserPlus size={18} />}
                        size="compact-sm"
                        variant="filled"
                    >
                        {t('add_student')}
                    </Button>
                </Group>

                <Paper withBorder radius="md">
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th style={{ fontSize: rem(12) }}>{t('student_name')}</Table.Th>
                                <Table.Th style={{ fontSize: rem(12) }}>{t('student_id')}</Table.Th>
                                <Table.Th style={{ fontSize: rem(12) }}>{t('gender')}</Table.Th>
                                <Table.Th style={{ fontSize: rem(12) }}>{t('status')}</Table.Th>
                                <Table.Th align="right" style={{ fontSize: rem(12) }}>{common('actions_header')}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filteredStudents.map((hsln) => (
                                <Table.Tr key={hsln.id}>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <Avatar size={24} radius="xl" src={hsln.hocSinh?.nguoiDung?.avatar} />
                                            <Text size="xs" fw={500}>{hsln.hocSinh?.hoTen}</Text>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="xs">{hsln.hocSinh?.maSoHs}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="xs">{hsln.hocSinh?.gioiTinh}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge variant="dot" size="xs">{hsln.trangThai}</Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Button variant="subtle" size="compact-xs">{common('details', { defaultValue: 'Chi tiết' })}</Button>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    {filteredStudents.length === 0 && (
                        <Text p="xl" c="dimmed" ta="center" size="sm">
                            {t('no_students')}
                        </Text>
                    )}
                </Paper>
            </Stack>
        </Stack>
    );
}
