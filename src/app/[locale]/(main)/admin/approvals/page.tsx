"use client";

import React, { useState } from 'react';
import { Container, Stack, Title, Paper, Group, Button, Text, LoadingOverlay, Box, Badge, ActionIcon, Tooltip, Flex, Card, ThemeIcon, SimpleGrid, rem, RingProgress, Tabs } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ApprovalTable } from '@/feauture/approvals/components/ApprovalTable';
import { FlowManagementTable } from '@/feauture/approvals/components/FlowManagementTable';
import { FlowCategorySidebar } from '@/feauture/approvals/components/FlowCategorySidebar';
import { FlowBuilderDrawer } from '@/feauture/approvals/components/FlowBuilderDrawer';
import { AppQuery } from '@/api/AppQuery';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconStack, IconSchool, IconCategory2, IconClipboardList, IconClock, IconCheckbox, IconX, IconTrendingUp, IconFilter, IconFileDescription, IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { dayjs } from "@/shared/utils/date.util";
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { Drawer } from '@mantine/core';

export default function ApprovalsPage() {
    const t = useTranslations('approvals');
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get('category') || 'all';

    const setActiveCategory = (val: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (val === 'all') {
            params.delete('category');
        } else {
            params.set('category', val);
        }
        router.push(`?${params.toString()}`);
    };

    const isMobile = useMediaQuery('(max-width: 768px)');

    // Sync state with URL
    const activeTab = searchParams.get('tab') || 'flows';
    const selectedFlowId = searchParams.get('edit');
    const isCreating = searchParams.get('action') === 'create';
    const builderOpened = !!selectedFlowId || isCreating;

    const handleTabChange = (val: string | null) => {
        if (!val) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', val);
        router.push(`?${params.toString()}`);
    };

    const handleOpenCreate = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('action', 'create');
        params.delete('edit');
        router.push(`?${params.toString()}`);
    };

    const handleEditFlow = (flow: any) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('edit', flow.id.toString());
        params.delete('action');
        router.push(`?${params.toString()}`);
    };

    const handleCloseBuilder = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('edit');
        params.delete('action');
        router.push(`?${params.toString()}`);
        setTimeout(() => setSelectedFlow(null), 200);
    };

    // Category Sidebar Sync
    const sidebarOpened = searchParams.get('categories_opened') === 'true';

    const toggleSidebar = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (sidebarOpened) {
            params.delete('categories_opened');
        } else {
            params.set('categories_opened', 'true');
        }
        router.push(`?${params.toString()}`);
    };

    const closeSidebar = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('categories_opened');
        router.push(`?${params.toString()}`);
    };

    // Queries
    const { data: flows, isLoading: loadingFlows } = AppQuery.approvals.useFlows();
    const { data: categoriesData, refetch: refetchCategories } = AppQuery.approvals.useCategories();
    const { data: pendingRequests, isLoading: loadingPending } = AppQuery.approvals.usePending();

    // Selected flow logic
    const [selectedFlow, setSelectedFlow] = useState<any>(null);

    React.useEffect(() => {
        if (selectedFlowId && flows) {
            const flow = flows.find((f: any) => f.id.toString() === selectedFlowId);
            if (flow) setSelectedFlow(flow);
        }
    }, [selectedFlowId, flows]);

    // Filter flows based on activeCategory
    const filteredFlows = flows?.filter((f: any) => activeCategory === 'all' || f.danhMucId?.toString() === activeCategory) || [];

    // Compute categories for sidebar
    const categories = [
        { id: 'all', label: t('all_flows'), icon: IconStack, count: flows?.length || 0 },
        ...(categoriesData?.map((c: any) => ({
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
    const updateFlowMutation = mutation.approvals.useUpdateFlow(0); // For status/edit

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

    const handleSaveFlow = (data: any) => {
        if (data.id) {
            const payload = {
                ten: data.name,
                moTa: data.description,
                danhMucId: data.category_id,
                trangThai: data.status,
                steps: data.steps,
                fields: data.fields
            };

            (updateFlowMutation.mutate as any)({
                data: payload,
                urlParams: { id: data.id }
            }, {
                onSuccess: () => {
                    notifications.show({ title: 'Thành công', message: 'Đã cập nhật quy trình', color: 'green' });
                    handleCloseBuilder();
                    setSelectedFlow(null);
                },
                onError: () => notifications.show({ title: 'Thất bại', message: 'Không thể cập nhật', color: 'red' })
            });

        } else {
            createFlowMutation.mutate(data, {
                onSuccess: () => {
                    notifications.show({ title: 'Thành công', message: 'Đã khởi tạo quy trình mới', color: 'green' });
                    handleCloseBuilder();
                },
                onError: () => {
                    notifications.show({ title: 'Thất bại', message: 'Không thể tạo quy trình', color: 'red' });
                }
            });
        }
    };

    const handleDeleteFlow = (id: number) => {
        notifications.show({ title: 'Thông báo', message: 'Chức năng xóa đang được phát triển', color: 'blue' });
    };

    const handleToggleStatus = (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'HOAT_DONG' ? 'NHAP' : 'HOAT_DONG';
        (updateFlowMutation.mutate as any)({
            data: { trangThai: newStatus },
            urlParams: { id }
        }, {
            onSuccess: () => notifications.show({ title: 'Cập nhật', message: `Đã chuyển trạng thái sang ${newStatus === 'HOAT_DONG' ? 'Hoạt động' : 'Nháp'}`, color: 'green' }),
            onError: () => notifications.show({ title: 'Lỗi', message: 'Không thể thay đổi trạng thái', color: 'red' })
        });
    };



    // Stats
    const stats = [
        { label: t('stats.total_flows'), value: flows?.length || 0, icon: IconClipboardList, color: 'blue', progress: 100 },
        { label: t('stats.pending'), value: pendingRequests?.length || 0, icon: IconClock, color: 'orange', progress: 45 },
        { label: t('stats.approved'), value: 0, icon: IconCheckbox, color: 'green', progress: 72 },
        { label: t('stats.rejected'), value: 0, icon: IconX, color: 'red', progress: 15 },
    ];

    return (
        <Box h="calc(100vh - 60px)" className="overflow-hidden flex flex-col bg-gray-50 dark:bg-zinc-950">
            {/* Clean Header */}
            <Box className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-3 md:px-6 py-3 md:py-4 shrink-0">
                <Group justify="space-between" align="center" wrap="nowrap" gap="xs">
                    <Group gap="xs" className="overflow-hidden min-w-0">
                        {isMobile && (
                            <ActionIcon variant="subtle" onClick={toggleSidebar} color="gray" size="md" radius="md">
                                <IconCategory2 size={20} />
                            </ActionIcon>
                        )}
                        {!isMobile && (
                            <Box className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
                                <IconStack size={20} stroke={2} className="text-white" />
                            </Box>
                        )}
                        <Box className="overflow-hidden min-w-0">
                            <Title order={isMobile ? 5 : 4} fw={600} className="text-gray-900 dark:text-white truncate" style={{ fontSize: isMobile ? '14px' : '18px' }}>
                                Quản lý quy trình
                            </Title>
                        </Box>
                    </Group>
                    {isMobile ? (
                        <Button
                            leftSection={<IconPlus size={18} />}
                            onClick={handleOpenCreate}
                            size="sm"
                            radius="md"
                            color="indigo"
                        >
                            Tạo mới
                        </Button>
                    ) : (
                        <Button
                            leftSection={<IconPlus size={16} />}
                            onClick={handleOpenCreate}
                            size="sm"
                            radius="md"
                            color="indigo"
                        >
                            Tạo mới
                        </Button>
                    )}
                </Group>
            </Box>

            <Flex h="100%" className="overflow-hidden relative">
                {/* Desktop Sidebar */}
                {!isMobile && (
                    <Box className="w-[260px] relative border-r border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shrink-0">
                        <FlowCategorySidebar
                            activeCategory={activeCategory}
                            onCategoryChange={(val) => {
                                setActiveCategory(val);
                            }}
                            categories={categories}
                            onRefetch={refetchCategories}
                        />
                    </Box>
                )}

                {/* Mobile Drawer */}
                <Drawer
                    opened={isMobile && sidebarOpened}
                    onClose={closeSidebar}
                    size="100%"
                    padding={0}
                    withCloseButton={false}
                    title={null}
                    transitionProps={{ transition: 'slide-right', duration: 250 }}
                    styles={{
                        content: {
                            height: '100dvh',
                        }
                    }}
                >
                    <Box className="h-full bg-white dark:bg-zinc-900 flex flex-col">
                        <Group p="md" justify="space-between" className="border-b border-gray-100 dark:border-zinc-800 shrink-0">
                            <Text fw={700}>Danh mục quy trình</Text>
                            <ActionIcon variant="light" color="gray" onClick={closeSidebar} size="lg" radius="md">
                                <IconX size={20} />
                            </ActionIcon>
                        </Group>
                        <Box className="flex-1 overflow-auto">
                            <FlowCategorySidebar
                                activeCategory={activeCategory}
                                onCategoryChange={(val) => {
                                    setActiveCategory(val);
                                    closeSidebar();
                                }}
                                categories={categories}
                                onRefetch={refetchCategories}
                            />
                        </Box>
                    </Box>
                </Drawer>

                {/* Main content */}
                <Box className="flex-1 overflow-auto bg-gray-50 dark:bg-zinc-950 p-2 sm:p-4 md:p-6">
                    <Stack gap="lg" className="max-w-7xl mx-auto">
                        {/* Stats Grid */}
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                            {stats.map((stat) => (
                                <Paper
                                    key={stat.label}
                                    p="md"
                                    radius="md"
                                    className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                    withBorder
                                >
                                    <Group justify="apart" mb="xs">
                                        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                                            {stat.label}
                                        </Text>
                                        <ThemeIcon size={36} radius="md" variant="light" color={stat.color}>
                                            <stat.icon size={20} stroke={1.5} />
                                        </ThemeIcon>
                                    </Group>
                                    <Text size="xl" fw={700} className="text-gray-900 dark:text-white">
                                        {stat.value}
                                    </Text>
                                    <Group gap={4} mt="xs">
                                        <IconTrendingUp size={12} className="text-green-500" />
                                        <Text size="xs" c="dimmed">+12% so với tháng trước</Text>
                                    </Group>
                                </Paper>
                            ))}
                        </SimpleGrid>

                        {/* Management Section */}
                        <Stack gap="md">
                            <Group justify="space-between" align="center">
                                <Tabs
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    variant="default"
                                >
                                    <Tabs.List>
                                        <Tabs.Tab value="flows" leftSection={<IconStack size={16} />}>
                                            Quy trình ({filteredFlows.length})
                                        </Tabs.Tab>
                                        <Tabs.Tab value="requests" leftSection={<IconClipboardList size={16} />}>
                                            Yêu cầu ({pendingRequests?.length || 0})
                                        </Tabs.Tab>
                                    </Tabs.List>
                                </Tabs>
                                <Button variant="default" size="sm" leftSection={<IconFilter size={16} />}>
                                    Bộ lọc
                                </Button>
                            </Group>

                            <Box>
                                {activeTab === 'flows' ? (
                                    <Paper radius="lg" className="overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                        <LoadingOverlay visible={loadingFlows} overlayProps={{ blur: 1 }} />
                                        {filteredFlows.length > 0 ? (
                                            <FlowManagementTable
                                                flows={filteredFlows}
                                                onEdit={handleEditFlow}
                                                onDelete={handleDeleteFlow}
                                                onToggleStatus={handleToggleStatus}
                                            />
                                        ) : (
                                            <Stack align="center" justify="center" h={200} gap="sm">
                                                <Text c="dimmed">Chưa có quy trình nào.</Text>
                                            </Stack>
                                        )}
                                    </Paper>
                                ) : (
                                    <Paper
                                        radius="lg"
                                        className="overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                    >
                                        <LoadingOverlay visible={loadingPending} overlayProps={{ blur: 1 }} />
                                        <Box className="min-h-[400px]">
                                            {pendingRequests && pendingRequests.length > 0 ? (
                                                <ApprovalTable
                                                    requests={pendingRequests || []}
                                                    isAdmin
                                                    onView={(req) => router.push(`/admin/approvals/${req.id}`)}
                                                    onAction={(id, action) => action === 'APPROVE' ? handleApprove(id) : handleReject(id)}
                                                />
                                            ) : (
                                                <Stack align="center" justify="center" h={400} gap="md">
                                                    <ThemeIcon size={64} radius="full" variant="light" color="gray">
                                                        <IconClipboardList size={32} />
                                                    </ThemeIcon>
                                                    <Text size="lg" fw={500} c="dimmed">Chưa có yêu cầu nào cần duyệt</Text>
                                                </Stack>
                                            )}
                                        </Box>
                                    </Paper>
                                )}
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            </Flex>

            {/* Flow Builder Drawer */}
            <FlowBuilderDrawer
                opened={builderOpened}
                onClose={handleCloseBuilder}
                initialData={selectedFlow}
                onSave={handleSaveFlow}
                loading={createFlowMutation.isPending || updateFlowMutation.isPending}
                defaultCategoryId={activeCategory === 'all' ? null : activeCategory}
            />
        </Box>
    );
}

function Center({ children }: { children: React.ReactNode }) {
    return <div className="flex items-center justify-center h-full text-center w-full">{children}</div>;
}
