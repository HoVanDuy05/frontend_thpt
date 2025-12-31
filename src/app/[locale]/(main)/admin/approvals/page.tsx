"use client";

import React, { useState } from 'react';
import { Container, Stack, Title, Paper, Group, Button, Text, LoadingOverlay, Box, Badge, ActionIcon, Tooltip, Flex, Card, ThemeIcon, SimpleGrid, rem } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ApprovalTable } from '@/feauture/approvals/components/ApprovalTable';
import { FlowCategorySidebar } from '@/feauture/approvals/components/FlowCategorySidebar';
import { FlowBuilderDrawer } from '@/feauture/approvals/components/FlowBuilderDrawer';
import { AppQuery } from '@/api/AppQuery';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconStack, IconSchool, IconSettings, IconClipboardList, IconClock, IconCheckbox, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function ApprovalsPage() {
    const t = useTranslations('approvals');
    const [builderOpened, { open: openBuilder, close: closeBuilder }] = useDisclosure(false);
    const [activeCategory, setActiveCategory] = useState('all');

    const isMobile = useMediaQuery('(max-width: 768px)');
    const [sidebarOpened, { toggle: toggleSidebar }] = useDisclosure(false);

    // Queries
    const { data: flows, isLoading: loadingFlows } = AppQuery.approvals.useFlows();
    const { data: categoriesData } = AppQuery.approvals.useCategories();
    const { data: myRequests, isLoading: loadingMy } = AppQuery.approvals.useMyFlows();

    // Compute categories for sidebar
    const categories = [
        { id: 'all', label: t('all_flows'), icon: IconStack, count: flows?.length || 0 },
        ...(categoriesData?.map(c => ({
            id: c.id.toString(),
            label: c.ten,
            icon: IconSchool,
            count: c._count?.quyTrinhs || 0
        })) || [])
    ];

    // Mutations
    const mutation = AppMutation();
    const approveMutation = mutation.approvals.useApprove(0);
    const rejectMutation = mutation.approvals.useReject(0);
    const createFlowMutation = mutation.approvals.useCreateFlow();

    const handleApprove = (id: number) => {
        (approveMutation.mutate as any)({
            note: 'Phê duyệt hệ thống (Admin)',
            urlParams: { id }
        }, {
            onSuccess: () => notifications.show({ title: 'Thành công', message: 'Yêu cầu quy trình đã được phê duyệt', color: 'green' })
        });
    };

    const handleReject = (id: number) => {
        (rejectMutation.mutate as any)({
            note: 'Từ chối hệ thống (Admin)',
            urlParams: { id }
        }, {
            onSuccess: () => notifications.show({ title: 'Thành công', message: 'Yêu cầu quy trình đã bị từ chối', color: 'red' })
        });
    };

    const handleCreateFlow = (data: any) => {
        createFlowMutation.mutate(data, {
            onSuccess: () => {
                notifications.show({ title: 'Thành công', message: 'Đã khởi tạo quy trình mới', color: 'green' });
                closeBuilder();
            },
            onError: () => {
                notifications.show({ title: 'Thất bại', message: 'Không thể tạo quy trình', color: 'red' });
            }
        });
    };

    // Stats
    const stats = [
        { label: t('stats.total_flows'), value: flows?.length || 0, icon: IconClipboardList, color: 'blue' },
        { label: t('stats.pending'), value: myRequests?.filter((r: any) => r.trangThai === 'CHO_DUYET').length || 0, icon: IconClock, color: 'orange' },
        { label: t('stats.approved'), value: myRequests?.filter((r: any) => r.trangThai === 'DA_DUYET').length || 0, icon: IconCheckbox, color: 'green' },
        { label: t('stats.rejected'), value: myRequests?.filter((r: any) => r.trangThai === 'TU_CHOI').length || 0, icon: IconX, color: 'red' },
    ];

    return (
        <Box h="calc(100vh - 60px)" className="overflow-hidden flex flex-col bg-gray-50 dark:bg-zinc-900">
            {/* Page Header */}
            <Box px="xl" py="md" className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
                <Group justify="space-between">
                    <Stack gap={4}>
                        <Group gap="sm">
                            {isMobile && (
                                <ActionIcon variant="subtle" onClick={toggleSidebar} color="gray" size="lg">
                                    <IconSettings size={20} />
                                </ActionIcon>
                            )}
                            <Title order={2} fw={800} className="text-gray-900 dark:text-white">
                                {t('page_title')}
                            </Title>
                        </Group>
                        <Text size="sm" c="dimmed">
                            {t('page_subtitle')}
                        </Text>
                    </Stack>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={openBuilder}
                        size="md"
                        className="shadow-sm"
                        color="indigo"
                    >
                        {isMobile ? t('create_new_short') : t('create_new')}
                    </Button>
                </Group>
            </Box>

            <Flex h="100%" className="overflow-hidden">
                {/* Category Sidebar */}
                {(!isMobile || sidebarOpened) && (
                    <Box
                        className={`${isMobile ? 'fixed inset-0 z-[100] bg-white dark:bg-zinc-900' : ''}`}
                    >
                        {isMobile && (
                            <Box p="md" className="border-b border-gray-200 dark:border-zinc-800">
                                <Button variant="subtle" fullWidth onClick={toggleSidebar}>{t('close_categories')}</Button>
                            </Box>
                        )}
                        <FlowCategorySidebar
                            activeCategory={activeCategory}
                            onCategoryChange={(val) => {
                                setActiveCategory(val);
                                if (isMobile) toggleSidebar();
                            }}
                            categories={categories}
                        />
                    </Box>
                )}

                {/* Main content */}
                <Box className="flex-1 overflow-auto" p="xl">
                    <Stack gap="xl">
                        {/* Stats Cards */}
                        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                            {stats.map((stat) => (
                                <Card key={stat.label} withBorder radius="md" className="bg-white dark:bg-zinc-800">
                                    <Group justify="space-between">
                                        <Stack gap={4}>
                                            <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                                                {stat.label}
                                            </Text>
                                            <Text size="xl" fw={900}>
                                                {stat.value}
                                            </Text>
                                        </Stack>
                                        <ThemeIcon size="xl" radius="md" variant="light" color={stat.color}>
                                            <stat.icon size={24} />
                                        </ThemeIcon>
                                    </Group>
                                </Card>
                            ))}
                        </SimpleGrid>

                        {/* Approvals Table */}
                        <Paper withBorder radius="lg" className="overflow-hidden shadow-sm bg-white dark:bg-zinc-800">
                            <Box p="md" className="border-b border-gray-200 dark:border-zinc-800">
                                <Group justify="space-between">
                                    <Stack gap={4}>
                                        <Text fw={700} size="lg">{t('table.title')}</Text>
                                        <Text size="sm" c="dimmed">
                                            {myRequests?.length || 0} {t('table.count')}
                                        </Text>
                                    </Stack>
                                </Group>
                            </Box>
                            <LoadingOverlay visible={loadingMy || loadingFlows} overlayProps={{ blur: 1 }} />
                            <ApprovalTable
                                requests={myRequests || []}
                                isAdmin
                                onView={(req) => console.log('View:', req)}
                                onAction={(id, action) => action === 'APPROVE' ? handleApprove(id) : handleReject(id)}
                            />
                        </Paper>
                    </Stack>
                </Box>
            </Flex>

            {/* Flow Builder Drawer */}
            <FlowBuilderDrawer
                opened={builderOpened}
                onClose={closeBuilder}
                onSave={handleCreateFlow}
                loading={createFlowMutation.isPending}
            />
        </Box>
    );
}
