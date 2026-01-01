"use client";

import React, { useState } from 'react';
import { Container, Stack, Title, Paper, Group, Button, Text, LoadingOverlay, Box, Badge, ActionIcon, Tooltip, Flex, Card, ThemeIcon, SimpleGrid, rem, RingProgress } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ApprovalTable } from '@/feauture/approvals/components/ApprovalTable';
import { FlowCategorySidebar } from '@/feauture/approvals/components/FlowCategorySidebar';
import { FlowBuilderDrawer } from '@/feauture/approvals/components/FlowBuilderDrawer';
import { AppQuery } from '@/api/AppQuery';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconStack, IconSchool, IconSettings, IconClipboardList, IconClock, IconCheckbox, IconX, IconTrendingUp, IconFilter } from '@tabler/icons-react';
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
        { label: t('stats.total_flows'), value: flows?.length || 0, icon: IconClipboardList, color: 'blue', progress: 100 },
        { label: t('stats.pending'), value: myRequests?.filter((r: any) => r.trangThai === 'CHO_DUYET').length || 0, icon: IconClock, color: 'orange', progress: 45 },
        { label: t('stats.approved'), value: myRequests?.filter((r: any) => r.trangThai === 'DA_DUYET').length || 0, icon: IconCheckbox, color: 'green', progress: 72 },
        { label: t('stats.rejected'), value: myRequests?.filter((r: any) => r.trangThai === 'TU_CHOI').length || 0, icon: IconX, color: 'red', progress: 15 },
    ];

    return (
        <Box h="calc(100vh - 60px)" className="overflow-hidden flex flex-col bg-[#F8FAFC] dark:bg-zinc-950">
            {/* Premium Header */}
            <Box className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-6 py-5 shrink-0 shadow-sm relative z-20">
                <Group justify="space-between" align="center">
                    <Group gap="md">
                        {isMobile && (
                            <ActionIcon variant="light" onClick={toggleSidebar} color="indigo" size="lg" radius="md">
                                <IconSettings size={20} />
                            </ActionIcon>
                        )}
                        <ThemeIcon size={42} radius="12" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 135 }}>
                            <IconStack size={24} stroke={1.5} />
                        </ThemeIcon>
                        <div>
                            <Title order={2} fw={800} className="text-gray-900 dark:text-white tracking-tight leading-none">
                                {t('page_title')}
                            </Title>
                            <Text size="sm" c="dimmed" mt={2} fw={500}>
                                {t('page_subtitle')}
                            </Text>
                        </div>
                    </Group>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={openBuilder}
                        size="md"
                        radius="md"
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                    >
                        {isMobile ? t('create_new_short') : t('create_new')}
                    </Button>
                </Group>
            </Box>

            <Flex h="100%" className="overflow-hidden relative">
                {/* Sidebar Background Blur for Mobile */}
                {isMobile && sidebarOpened && (
                    <Box className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30" onClick={toggleSidebar} />
                )}

                {/* Category Sidebar */}
                <Box
                    className={`
                        ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-[280px] shadow-2xl transition-transform duration-300 transform' : 'w-[260px] relative border-r border-gray-100 dark:border-zinc-800'}
                        bg-white dark:bg-zinc-900 flex flex-col
                        ${isMobile && !sidebarOpened ? '-translate-x-full' : 'translate-x-0'}
                    `}
                >
                    {isMobile && (
                        <Group p="md" justify="space-between" className="border-b border-gray-100 dark:border-zinc-800">
                            <Text fw={700}>Danh mục</Text>
                            <ActionIcon variant="subtle" color="gray" onClick={toggleSidebar}><IconX size={20} /></ActionIcon>
                        </Group>
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

                {/* Main content */}
                <Box className="flex-1 overflow-auto bg-[#F8FAFC] dark:bg-zinc-950 p-6 relative">
                    {/* Decorative background blobs */}
                    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20 pointer-events-none" />

                    <Stack gap="xl" className="relative z-10 max-w-7xl mx-auto">
                        {/* Stats Grid */}
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                            {stats.map((stat) => (
                                <Paper
                                    key={stat.label}
                                    p="md"
                                    radius="lg"
                                    className="border border-white/60 dark:border-white/5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all group"
                                >
                                    <Group justify="space-between" align="flex-start" mb="xs">
                                        <div>
                                            <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.5}>{stat.label}</Text>
                                            <Text size="2xl" fw={800} className="text-gray-900 dark:text-white mt-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</Text>
                                        </div>
                                        <RingProgress
                                            size={48}
                                            thickness={4}
                                            roundCaps
                                            sections={[{ value: stat.progress, color: stat.color }]}
                                            label={
                                                <Center>
                                                    <stat.icon size={16} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                                </Center>
                                            }
                                        />
                                    </Group>
                                    <Text size="xs" c="dimmed" className="flex items-center gap-1">
                                        <IconTrendingUp size={12} className="text-green-500" />
                                        <span className="text-green-600 font-medium">+12%</span> so với tháng trước
                                    </Text>
                                </Paper>
                            ))}
                        </SimpleGrid>

                        {/* Recent Requests Table */}
                        <Stack gap="md">
                            <Group justify="space-between" align="center">
                                <Title order={3} className="text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                    <IconClipboardList size={24} className="text-indigo-600" />
                                    {t('table.title')}
                                </Title>
                                <Button variant="subtle" size="sm" rightSection={<IconFilter size={16} />}>Bộ lọc</Button>
                            </Group>

                            <Paper
                                radius="lg"
                                className="overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                            >
                                <LoadingOverlay visible={loadingMy || loadingFlows} overlayProps={{ blur: 1 }} />
                                <Box className="min-h-[400px]">
                                    {myRequests && myRequests.length > 0 ? (
                                        <ApprovalTable
                                            requests={myRequests || []}
                                            isAdmin
                                            onView={(req) => console.log('View:', req)}
                                            onAction={(id, action) => action === 'APPROVE' ? handleApprove(id) : handleReject(id)}
                                        />
                                    ) : (
                                        <Stack align="center" justify="center" h={400} gap="md">
                                            <ThemeIcon size={64} radius="full" variant="light" color="gray">
                                                <IconClipboardList size={32} />
                                            </ThemeIcon>
                                            <Text size="lg" fw={500} c="dimmed">Chưa có yêu cầu nào</Text>
                                        </Stack>
                                    )}
                                </Box>
                            </Paper>
                        </Stack>
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

function Center({ children }: { children: React.ReactNode }) {
    return <div className="flex items-center justify-center h-full text-center w-full">{children}</div>;
}
