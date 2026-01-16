'use client';

import { Title, Text, Paper, SimpleGrid, Group, Stack, ThemeIcon, Breadcrumbs, Anchor, Loader, Badge, ActionIcon, Box, rem, Button, Menu, Skeleton } from '@mantine/core';
import { IconCalendar, IconArrowRight, IconChevronLeft, IconPlus, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { AppQuery } from '@/api/AppQuery';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { YearModal } from '../../../years/YearModal';
import { TNamHoc } from '@/shared/types/academic.type';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';

export default function GradeYearsPage() {
    const t = useTranslations('academic.grades');
    const tYear = useTranslations('academic.years');
    const params = useParams();
    const common = useTranslations('common');
    const gradeId = Number(params.gradeId);

    const [opened, { open, close }] = useDisclosure(false);
    const [editingItem, setEditingItem] = useState<TNamHoc | null>(null);

    const { data: grade, isLoading: isLoadingGrade } = AppQuery.academic.useKhoiDetail(gradeId);
    const { data: years, isLoading: isLoadingYears } = AppQuery.academic.useYears();

    const mutations = AppMutation();
    const createMutation = mutations.academic.useCreateYear();
    const updateMutation = mutations.academic.useUpdateYear(0);
    const deleteMutation = mutations.academic.useDeleteYear(0);

    const handleOpenCreate = () => {
        setEditingItem(null);
        open();
    };

    const handleOpenEdit = (item: TNamHoc) => {
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

    const handleSubmit = async (values: any) => {
        try {
            if (editingItem) {
                await updateMutation.mutateAsync({
                    ...values,
                    urlParams: { id: editingItem.id }
                } as any);
                notifications.show({
                    title: common('success'),
                    message: common('update_success'),
                    color: 'green',
                });
            } else {
                await createMutation.mutateAsync(values);
                notifications.show({
                    title: common('success'),
                    message: common('create_success'),
                    color: 'green',
                });
            }
            close();
        } catch (error: any) {
            notifications.show({
                title: common('error'),
                message: error?.response?.data?.message || common('error_occurred'),
                color: 'red',
            });
        }
    };


    // if (isLoadingGrade || isLoadingYears) return <Loader />; // Removed early return

    const breadcrumbs = [
        { title: t('title'), href: `/admin/academic/grades` },
        { title: grade?.tenKhoi || '...', href: '#' },
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
                                {grade?.tenKhoi} - {t('select_year_title')}
                            </Title>
                            <Text c="dimmed" size="xs" lineClamp={1}>{t('select_year_subtitle')}</Text>
                        </Stack>
                    </Group>
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={handleOpenCreate}
                        size="compact-sm"
                        variant="filled"
                        style={{ flexShrink: 0 }}
                    >
                        {tYear('create')}
                    </Button>
                </Group>
            </Box>

            <Stack p={{ base: 'sm', sm: 'md', md: 'xl' }} gap="lg">

                <SimpleGrid cols={{ base: 2, xs: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
                    {isLoadingYears ? (
                        Array(5).fill(0).map((_, i) => (
                            <Paper key={i} withBorder p="sm" radius="md">
                                <Stack gap="xs" align="center">
                                    <Skeleton h={30} w={30} radius="md" />
                                    <Stack gap={2} w="100%" align="center">
                                        <Skeleton h={16} w="60%" />
                                        <Skeleton h={14} w="30%" />
                                    </Stack>
                                </Stack>
                            </Paper>
                        ))
                    ) : (
                        years?.map((year) => (
                            <Paper
                                key={year.id}
                                withBorder
                                p="sm"
                                radius="md"
                                className="hover-card"
                                style={{ position: 'relative' }}
                            >
                                <Menu position="bottom-end" withinPortal>
                                    <Menu.Target>
                                        <ActionIcon
                                            variant="subtle"
                                            color="gray"
                                            size="xs"
                                            style={{ position: 'absolute', top: 5, right: 5, zIndex: 10 }}
                                        >
                                            <IconDotsVertical size={14} />
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleOpenEdit(year)}>
                                            {common('edit')}
                                        </Menu.Item>
                                        <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(year.id, year.tenNamHoc)}>
                                            {common('delete')}
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>

                                <Link
                                    href={`/admin/academic/grades/${gradeId}/years/${year.id}/classes`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <Stack gap="xs" align="center" style={{ textAlign: 'center' }}>
                                        <ThemeIcon size="md" radius="md" color={year.dangKichHoat ? "teal" : "gray"} variant="light">
                                            <IconCalendar size={18} />
                                        </ThemeIcon>

                                        <Stack gap={2}>
                                            <Title order={5} size="sm" lineClamp={1}>{year.tenNamHoc}</Title>
                                            {year.dangKichHoat && (
                                                <Badge color="teal" variant="light" size="xs" radius="xs">
                                                    {tYear('status.active')}
                                                </Badge>
                                            )}
                                        </Stack>
                                    </Stack>
                                </Link>
                            </Paper>
                        ))
                    )}
                </SimpleGrid>
            </Stack>

            <YearModal
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingItem}
                loading={createMutation.isPending || updateMutation.isPending}
            />
        </Stack>
    );
}
