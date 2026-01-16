'use client';

import { Title, Text, Paper, SimpleGrid, Group, Stack, ThemeIcon, Breadcrumbs, Anchor, Loader, Badge, ActionIcon, Menu, Button, Box, rem, Skeleton, Card, Avatar, Divider } from '@mantine/core';
import { IconUsers, IconDotsVertical, IconEdit, IconTrash, IconArrowRight, IconPlus, IconChevronLeft, IconSchool, IconUser } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { AppQuery } from '@/api/AppQuery';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ClassDrawer } from '../../../../../classes/ClassDrawer';
import { TLopNam } from '@/shared/types/academic.type';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';

export default function GradeYearClassesPage() {
    const t = useTranslations('academic.grades');
    const tClass = useTranslations('admin.academic.classes');
    const common = useTranslations('common');
    const params = useParams();
    const gradeId = Number(params.gradeId);
    const yearId = Number(params.yearId);

    const [opened, { open, close }] = useDisclosure(false);
    const [editingItem, setEditingItem] = useState<TLopNam | null>(null);

    const { data: grade } = AppQuery.academic.useKhoiDetail(gradeId);
    const { data: year } = AppQuery.academic.useYearDetail(yearId);
    const { data: classYears, isLoading } = AppQuery.academic.useClassYears({ namHocId: yearId });

    const mutations = AppMutation();
    const deleteMutation = mutations.academic.useDeleteClassYear();

    const handleOpenCreate = () => {
        setEditingItem(null);
        open();
    };

    const handleOpenEdit = (item: TLopNam) => {
        setEditingItem(item);
        open();
    };

    const handleDelete = (id: number, name: string) => {
        modals.openConfirmModal({
            title: common('delete_confirm'),
            children: (
                <Text size="sm">
                    {common('delete_message_named', { name })}
                </Text>
            ),
            labels: { confirm: common('delete'), cancel: common('cancel') },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                try {
                    await deleteMutation.mutateAsync({ urlParams: { id } } as any);
                    notifications.show({
                        title: common('success'),
                        message: common('delete_success'),
                        color: 'green',
                    });
                } catch (error) {
                    notifications.show({
                        title: common('error'),
                        message: common('delete_error'),
                        color: 'red',
                    });
                }
            },
        });
    };

    // Filter classes by grade
    const filteredClasses = classYears?.filter(cy => cy.lopHoc?.khoiId === gradeId) || [];

    const breadcrumbs = [
        { title: t('title'), href: `/admin/academic/grades` },
        { title: grade?.tenKhoi || '...', href: `/admin/academic/grades/${gradeId}/years` },
        { title: year?.tenNamHoc || '...', href: '#' },
    ].map((item, index) => (
        <Anchor component={Link} href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    return (
        <Stack gap={0} p={0} style={{ overflowX: 'hidden' }}> {/* Prevent horizontal overflow on mobile */}
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
                                {t('classes_in')} {grade?.tenKhoi}
                            </Title>
                            <Text c="dimmed" size="xs" lineClamp={1}>{year?.tenNamHoc} - {t('classes_subtitle')}</Text>
                        </Stack>
                    </Group>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={handleOpenCreate}
                        size="compact-sm"
                        variant="filled"
                        style={{ flexShrink: 0 }}
                    >
                        {tClass('create')}
                    </Button>
                </Group>
            </Box>

            <Stack p={{ base: 'md', sm: 'lg', md: 'xl' }} gap="lg"> {/* Increased padding for mobile safety */}

                <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing="lg">
                    {isLoading ? (
                        Array(8).fill(0).map((_, i) => (
                            <Skeleton key={i} height={200} radius="md" />
                        ))
                    ) : (
                        filteredClasses.map((cy) => (
                            <Card
                                key={cy.id}
                                withBorder
                                shadow="sm"
                                radius="md"
                                padding="lg"
                                className="hover-card"
                            >
                                <Group justify="space-between" mb="xs" align="flex-start">
                                    <Stack gap={2}>
                                        <Text fw={700} size="xl" c="blue.8">{cy.lopHoc?.tenLop}</Text>
                                        <Text size="xs" c="dimmed">{year?.tenNamHoc}</Text>
                                    </Stack>

                                    <Group gap={8}>
                                        <Button
                                            variant="light"
                                            color="blue"
                                            size="compact-md"
                                            radius="md"
                                            leftSection={<IconEdit size={16} />}
                                            onClick={() => handleOpenEdit(cy)}
                                        >
                                            {common('actions.edit')}
                                        </Button>
                                        <Button
                                            variant="light"
                                            color="red"
                                            size="compact-md"
                                            radius="md"
                                            leftSection={<IconTrash size={16} />}
                                            onClick={() => handleDelete(cy.id, cy.lopHoc?.tenLop || '')}
                                        >
                                            {common('actions.delete')}
                                        </Button>
                                    </Group>
                                </Group>

                                <Divider my="sm" />

                                <Group gap="sm" mb="md">
                                    <Avatar
                                        src={cy.gvChuNhiem?.hoSoGiaoVien?.nguoiDung?.avatar}
                                        radius="xl"
                                        color="blue"
                                    >
                                        {cy.gvChuNhiem?.hoTen?.charAt(0) || <IconUser size={16} />}
                                    </Avatar>
                                    <div>
                                        <Text size="sm" fw={500} lineClamp={1}>
                                            {cy.gvChuNhiem?.hoTen || common('not_assigned')}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {tClass('fields.homeroom_teacher')}
                                        </Text>
                                    </div>
                                </Group>

                                <SimpleGrid cols={2} spacing="sm" mb="md">
                                    <Paper radius="md" p="xs" bg="indigo.0" style={{ border: '1px solid var(--mantine-color-indigo-1)' }}>
                                        <Group gap="xs">
                                            <ThemeIcon variant="white" color="indigo" radius="md" size="md">
                                                <IconUser size={16} />
                                            </ThemeIcon>
                                            <div>
                                                <Text size="xs" c="indigo.9" fw={600} style={{ lineHeight: 1 }}>{t('students')}</Text>
                                                <Text size="md" fw={700} c="indigo.7" mt={2}>
                                                    {cy._count?.hocSinhs || 0}
                                                </Text>
                                            </div>
                                        </Group>
                                    </Paper>

                                    <Paper radius="md" p="xs" bg="gray.0" style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
                                        <Group gap="xs">
                                            <ThemeIcon variant="white" color="gray" radius="md" size="md">
                                                <IconUsers size={16} />
                                            </ThemeIcon>
                                            <div>
                                                <Text size="xs" c="dimmed" fw={600} style={{ lineHeight: 1 }}>{t('si_so')}</Text>
                                                <Text size="md" fw={700} c="dark.6" mt={2}>
                                                    {cy.siSo}
                                                </Text>
                                            </div>
                                        </Group>
                                    </Paper>
                                </SimpleGrid>

                                <Button
                                    component={Link}
                                    href={`/admin/academic/grades/${gradeId}/years/${yearId}/classes/${cy.id}`}
                                    variant="filled"
                                    color="indigo"
                                    fullWidth
                                    radius="md"
                                    rightSection={<IconArrowRight size={16} />}
                                >
                                    {t('view_info')}
                                </Button>
                            </Card>
                        ))
                    )}
                </SimpleGrid>

                {filteredClasses.length === 0 && (
                    <Paper withBorder radius="md" p="xl" style={{ textAlign: 'center' }}>
                        <Stack align="center" gap="sm">
                            <ThemeIcon size={50} radius="xl" variant="light" color="gray">
                                <IconUsers size={30} />
                            </ThemeIcon>
                            <Box>
                                <Text fw={600}>{t('no_classes')}</Text>
                                <Text size="sm" c="dimmed">{t('no_classes_subtitle', { defaultValue: 'No classes found.' })}</Text>
                            </Box>
                            <Button variant="light" leftSection={<IconPlus size={16} />} size="sm">
                                {tClass('create')}
                            </Button>
                        </Stack>
                    </Paper>
                )}
            </Stack>

            <ClassDrawer
                opened={opened}
                onClose={close}
                lopNamModel={editingItem}
                gradeId={gradeId}
                yearId={yearId}
            />
        </Stack>
    );
}
