'use client';

import { Title, Text, Paper, SimpleGrid, Group, Stack, ThemeIcon, Breadcrumbs, Anchor, Loader, Badge, ActionIcon, Menu, Button, Box, rem } from '@mantine/core';
import { IconUsers, IconDotsVertical, IconEdit, IconTrash, IconArrowRight, IconPlus, IconChevronLeft, IconCalendar } from '@tabler/icons-react';
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

    if (isLoading) return <Loader />;

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

            <Stack p={{ base: 'sm', sm: 'md', md: 'xl' }} gap="lg">

                <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing="md">
                    {filteredClasses.map((cy) => (
                        <Paper key={cy.id} withBorder p="md" radius="md" className="hover-card">
                            <Group justify="space-between" mb="xs">
                                <ThemeIcon size={38} radius="md" color="indigo" variant="light">
                                    <IconUsers size={20} />
                                </ThemeIcon>

                                <Group gap="xs">
                                    {/* Desktop Actions */}
                                    <Group gap={5} visibleFrom="sm">
                                        <ActionIcon
                                            variant="light"
                                            color="blue"
                                            title={common('edit')}
                                            onClick={() => handleOpenEdit(cy)}
                                        >
                                            <IconEdit size={16} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="light"
                                            color="red"
                                            title={common('delete')}
                                            onClick={() => handleDelete(cy.id, cy.lopHoc?.tenLop || '')}
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>

                                    {/* Mobile Actions */}
                                    <Menu position="bottom-end">
                                        <Menu.Target>
                                            <ActionIcon variant="subtle" color="gray" hiddenFrom="sm">
                                                <IconDotsVertical size={16} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleOpenEdit(cy)}>
                                                {common('edit')}
                                            </Menu.Item>
                                            <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(cy.id, cy.lopHoc?.tenLop || '')}>
                                                {common('delete')}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            </Group>

                            <Stack gap={4}>
                                <Title order={4} size="h5">{cy.lopHoc?.tenLop}</Title>
                                <Text size="xs" c="dimmed" lineClamp={1}>
                                    {tClass('fields.homeroom_teacher')}: {cy.gvChuNhiem?.hoTen || common('not_assigned')}
                                </Text>
                                <Group gap={5} mt={5}>
                                    <Badge variant="light" color="blue" size="xs">
                                        {cy._count?.hocSinhs || 0} {t('students')}
                                    </Badge>
                                    <Badge variant="light" color="gray" size="xs">
                                        {cy.siSo} {t('si_so', { defaultValue: 'Si số' })}
                                    </Badge>
                                </Group>
                            </Stack>

                            <Button
                                fullWidth
                                mt="md"
                                variant="subtle"
                                size="compact-xs"
                                rightSection={<IconArrowRight size={12} />}
                                component={Link}
                                href={`/admin/academic/grades/${gradeId}/years/${yearId}/classes/${cy.id}/students`}
                            >
                                {t('view_students')}
                            </Button>
                        </Paper>
                    ))}
                </SimpleGrid>

                {filteredClasses.length === 0 && (
                    <Paper withBorder radius="md" p="xl" style={{ textAlign: 'center' }}>
                        <Stack align="center" gap="sm">
                            <ThemeIcon size={50} radius="xl" variant="light" color="gray">
                                <IconUsers size={30} />
                            </ThemeIcon>
                            <Box>
                                <Text fw={600}>{t('no_classes')}</Text>
                                <Text size="sm" c="dimmed">{t('no_classes_subtitle', { defaultValue: 'Chưa có lớp học nào được tạo cho khối này trong năm học đã chọn.' })}</Text>
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
            />
        </Stack>
    );
}
