'use client';

import { Title, Text, Button, Paper, SimpleGrid, Group, Stack, ThemeIcon, ActionIcon, Menu, LoadingOverlay, Breadcrumbs, Anchor, Box, rem, Skeleton } from '@mantine/core';
import { IconSchool, IconPlus, IconDotsVertical, IconEdit, IconTrash, IconArrowRight, IconChevronLeft } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { AppQuery } from '@/api/AppQuery';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { GradeModal } from './GradeModal';
import { TKhoi } from '@/shared/types/academic.type';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';

export default function GradesPage() {
    const t = useTranslations('academic.grades');
    const common = useTranslations('common');
    const locale = useParams().locale as string;

    const { data: grades, isLoading } = AppQuery.academic.useKhois();
    const [opened, { open, close }] = useDisclosure(false);
    const [editingItem, setEditingItem] = useState<TKhoi | null>(null);

    const mutations = AppMutation();
    const createMutation = mutations.academic.useCreateKhoi();
    const updateMutation = mutations.academic.useUpdateKhoi(editingItem?.id || 0);
    const deleteMutation = mutations.academic.useDeleteKhoi(0); // Dummy ID for initialization

    const handleOpenCreate = () => {
        setEditingItem(null);
        open();
    };

    const handleOpenEdit = (item: TKhoi) => {
        setEditingItem(item);
        open();
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
                    message: t('messages.update_success', { defaultValue: 'Cập nhật thành công' }),
                    color: 'green',
                });
            } else {
                await createMutation.mutateAsync(values);
                notifications.show({
                    title: common('success'),
                    message: t('messages.create_success', { defaultValue: 'Tạo thành công' }),
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

    return (
        <Stack gap={0} pos="relative">
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
                <Group justify="space-between" align="center" wrap="nowrap">
                    <Group align="center" gap="xs" style={{ flex: 1, minWidth: 0 }}>
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
                                {t('title')}
                            </Title>
                            <Text c="dimmed" size="xs" lineClamp={1}>
                                {t('subtitle')}
                            </Text>
                        </Stack>
                    </Group>
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={handleOpenCreate}
                        size="compact-sm"
                        variant="filled"
                        style={{ flexShrink: 0 }}
                    >
                        {t('create_button')}
                    </Button>
                </Group>
            </Box>

            <Stack p={{ base: 'sm', sm: 'md', md: 'xl' }} gap="lg">
                <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing="md">
                    {isLoading ? (
                        Array(8).fill(0).map((_, i) => (
                            <Paper key={i} withBorder p="md" radius="md">
                                <Group justify="space-between" mb="xs">
                                    <Skeleton h={38} w={38} radius="md" />
                                    <Group gap={5}>
                                        <Skeleton h={28} w={28} radius="sm" />
                                        <Skeleton h={28} w={28} radius="sm" />
                                    </Group>
                                </Group>
                                <Stack gap={4} mt="xs">
                                    <Skeleton h={20} w="70%" />
                                    <Skeleton h={14} w="40%" />
                                </Stack>
                                <Group justify="space-between" mt="md">
                                    <Skeleton h={15} w={60} />
                                    <Skeleton h={20} w={80} />
                                </Group>
                            </Paper>
                        ))
                    ) : (
                        grades?.map((grade) => (
                            <Paper key={grade.id} withBorder p="md" radius="md" className="hover-card">
                                <Group justify="space-between" align="flex-start" mb="xs">
                                    <ThemeIcon size={38} radius="md" variant="light" color="blue">
                                        <IconSchool size={20} />
                                    </ThemeIcon>

                                    <Group gap="xs">
                                        {/* Desktop Actions */}
                                        <Group gap={5} visibleFrom="sm">
                                            <ActionIcon
                                                variant="light"
                                                color="blue"
                                                onClick={() => handleOpenEdit(grade)}
                                                title={common('edit')}
                                            >
                                                <IconEdit size={16} />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="light"
                                                color="red"
                                                onClick={() => handleDelete(grade.id, grade.tenKhoi)}
                                                title={common('delete')}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>

                                        {/* Mobile Actions */}
                                        <Menu position="bottom-end" withinPortal>
                                            <Menu.Target>
                                                <ActionIcon variant="subtle" color="gray" hiddenFrom="sm">
                                                    <IconDotsVertical size={16} />
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleOpenEdit(grade)}>
                                                    {common('edit')}
                                                </Menu.Item>
                                                <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => handleDelete(grade.id, grade.tenKhoi)}>
                                                    {common('delete')}
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                        group     </Group>
                                </Group>

                                <Stack gap={4} mt="xs">
                                    <Title order={4} size="h5">{grade.tenKhoi}</Title>
                                    {grade.moTa ? (
                                        <Text size="xs" c="dimmed" lineClamp={1}>
                                            {grade.moTa}
                                        </Text>
                                    ) : (
                                        <Box style={{ height: 16 }} />
                                    )}
                                </Stack>

                                <Group justify="space-between" mt="md">
                                    <Text size="xs" fw={600} c="blue">
                                        {grade._count?.lopHocs || 0} {t('class_count')}
                                    </Text>
                                    <Button
                                        variant="subtle"
                                        size="compact-xs"
                                        rightSection={<IconArrowRight size={12} />}
                                        component={Link}
                                        href={`/admin/academic/grades/${grade.id}/years`}
                                    >
                                        {t('view_years')}
                                    </Button>
                                </Group>
                            </Paper>
                        ))
                    )}
                </SimpleGrid>

                {grades?.length === 0 && !isLoading && (
                    <Paper p="xl" withBorder radius="md" style={{ textAlign: 'center' }}>
                        <Text c="dimmed">{t('empty')}</Text>
                    </Paper>
                )}
            </Stack>

            <GradeModal
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingItem}
                loading={createMutation.isPending || updateMutation.isPending}
            />
        </Stack>
    );
}
