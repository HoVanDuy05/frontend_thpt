"use client";

import React, { useState } from 'react';
import { Container, Stack, Title, Paper, Tabs, Modal, Group, Button, Text, Select, LoadingOverlay, Card, SimpleGrid, ThemeIcon, rem, Box, Badge, ActionIcon, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ApprovalTable } from '@/feauture/approvals/components/ApprovalTable';
import { DynamicApprovalForm } from '@/feauture/approvals/components/DynamicApprovalForm';
import { AppQuery } from '@/api/AppQuery';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { IconGitPullRequest, IconFileDescription, IconHistory, IconSettings, IconEye, IconCheck, IconX, IconChartBar, IconPlus, IconActivity } from '@tabler/icons-react';

export default function ApprovalsPage() {
    const [opened, { open, close }] = useDisclosure(false);
    const [viewingInstance, setViewingInstance] = useState<any>(null);
    const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

    // Queries
    const { data: flows, isLoading: loadingFlows } = AppQuery.approvals.useFlows();
    const { data: myRequests, isLoading: loadingMy } = AppQuery.approvals.useMyFlows();
    const { data: formFields, isLoading: loadingFields } = AppQuery.approvals.useFormFields(
        Number(selectedFlowId),
        { enabled: !!selectedFlowId }
    );

    // Mutations
    const mutation = AppMutation();
    const submitMutation = mutation.approvals.useSubmit();
    const approveMutation = mutation.approvals.useApprove(0);
    const rejectMutation = mutation.approvals.useReject(0);

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

    const handleSubmit = (values: any) => {
        if (!selectedFlowId) return;
        submitMutation.mutate({
            flow_id: Number(selectedFlowId),
            target_id: values
        }, {
            onSuccess: () => {
                notifications.show({ title: 'Thành công', message: 'Đã tạo bản ghi quy trình mới' });
                close();
                setSelectedFlowId(null);
            }
        });
    };

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Stack gap={4}>
                        <Group gap="xs">
                            <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: 'blue', to: 'indigo' }}>
                                <IconSettings size={20} />
                            </ThemeIcon>
                            <Title order={1} fw={800} size="h2" className="tracking-tight">
                                Quản lý Quy trình Phê duyệt
                            </Title>
                        </Group>
                        <Text c="dimmed" size="sm" fw={500}>
                            Thiết lập, cấu hình và giám sát toàn bộ luồng phê duyệt trong hệ thống.
                        </Text>
                    </Stack>
                    <Group>
                        <Button
                            variant="light"
                            leftSection={<IconPlus size={18} />}
                            radius="md"
                        >
                            Thiết lập Flow mới
                        </Button>
                        <Button
                            leftSection={<IconGitPullRequest size={18} />}
                            onClick={open}
                            radius="md"
                            className="shadow-md"
                        >
                            Tạo yêu cầu mẫu
                        </Button>
                    </Group>
                </header>

                <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
                    <Card radius="lg" p="lg" withBorder shadow="sm" className="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent">
                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Text size="xs" c="dimmed" fw={800} tt="uppercase" lts={1}>Tổng số Flow</Text>
                                <IconChartBar size={18} className="text-blue-500" />
                            </Group>
                            <Text fw={900} size="xl" style={{ fontSize: rem(28) }}>{flows?.length || 0}</Text>
                            <Badge variant="light" color="blue" radius="sm">Mẫu hệ thống</Badge>
                        </Stack>
                    </Card>

                    <Card radius="lg" p="lg" withBorder shadow="sm">
                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Text size="xs" c="dimmed" fw={800} tt="uppercase" lts={1}>Chờ xử lý</Text>
                                <IconActivity size={18} className="text-yellow-500" />
                            </Group>
                            <Text fw={900} size="xl" style={{ fontSize: rem(28) }}>
                                {myRequests?.filter(r => r.trangThai === 'CHO_DUYET').length || 0}
                            </Text>
                            <Text size="xs" c="yellow" fw={600}>Cần Admin can thiệp</Text>
                        </Stack>
                    </Card>

                    <Card radius="lg" p="lg" withBorder shadow="sm" className="bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10 dark:to-transparent">
                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Text size="xs" c="dimmed" fw={800} tt="uppercase" lts={1}>Đã Hoàn tất</Text>
                                <IconCheck size={18} className="text-green-500" />
                            </Group>
                            <Text fw={900} size="xl" style={{ fontSize: rem(28) }}>
                                {myRequests?.filter(r => r.trangThai === 'DA_DUYET').length || 0}
                            </Text>
                            <Text size="xs" c="green" fw={600}>Vận hành mượt mà</Text>
                        </Stack>
                    </Card>

                    <Card radius="lg" p="lg" withBorder shadow="sm" className="bg-gradient-to-br from-red-50/50 to-transparent dark:from-red-900/10 dark:to-transparent">
                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Text size="xs" c="dimmed" fw={800} tt="uppercase" lts={1}>Bị Từ chối</Text>
                                <IconX size={18} className="text-red-500" />
                            </Group>
                            <Text fw={900} size="xl" style={{ fontSize: rem(28) }}>
                                {myRequests?.filter(r => r.trangThai === 'TU_CHOI').length || 0}
                            </Text>
                            <Text size="xs" c="red" fw={600}>Cần kiểm tra lại</Text>
                        </Stack>
                    </Card>
                </SimpleGrid>

                <Paper
                    radius="lg"
                    shadow="sm"
                    withBorder
                    pos="relative"
                    className="overflow-hidden"
                >
                    <LoadingOverlay visible={loadingMy || loadingFlows} overlayProps={{ radius: "lg", blur: 2 }} />
                    <Tabs defaultValue="management" variant="pills" radius="md" p="md">
                        <Tabs.List
                            style={{
                                background: 'var(--mantine-color-default-hover)',
                                border: `${rem(1)} solid var(--mantine-color-default-border)`,
                                padding: rem(4),
                                borderRadius: rem(10),
                            }}
                            className="inline-flex mb-6"
                        >
                            <Tabs.Tab value="management" leftSection={<IconSettings size={18} />} px="xl" fw={700}>
                                Quản lý Thiết lập (Templates)
                            </Tabs.Tab>
                            <Tabs.Tab value="audit" leftSection={<IconActivity size={18} />} px="xl" fw={700}>
                                Giám sát Hệ thống (Audit)
                            </Tabs.Tab>
                        </Tabs.List>

                        <Box>
                            <Tabs.Panel value="management">
                                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                                    {flows?.map(flow => (
                                        <Card key={flow.id} withBorder radius="md" p="lg" className="hover:shadow-md transition-shadow">
                                            <Group justify="space-between" mb="xs">
                                                <Group gap="xs">
                                                    <Box className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600">
                                                        <IconFileDescription size={22} />
                                                    </Box>
                                                    <div>
                                                        <Text fw={700} size="lg">{flow.ten}</Text>
                                                        <Text size="xs" c="dimmed">ID: #{flow.id}</Text>
                                                    </div>
                                                </Group>
                                                <Badge color={flow.trangThai === 'HOAT_DONG' ? 'green' : 'gray'} variant="filled" radius="sm">
                                                    {flow.trangThai}
                                                </Badge>
                                            </Group>
                                            <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                                                {flow.moTa || 'Không có mô tả cho quy trình này.'}
                                            </Text>
                                            <Divider variant="dashed" mb="md" />
                                            <Group justify="space-between">
                                                <Text size="xs" fw={600} c="dimmed">
                                                    Số bước: <Badge variant="transparent">{flow._count?.cacBuoc || 0}</Badge>
                                                </Text>
                                                <Group gap="xs">
                                                    <Tooltip label="Cấu hình Form">
                                                        <ActionIcon variant="light" color="blue"><IconSettings size={16} /></ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="Xem chi tiết">
                                                        <ActionIcon variant="light" color="gray"><IconEye size={16} /></ActionIcon>
                                                    </Tooltip>
                                                </Group>
                                            </Group>
                                        </Card>
                                    ))}
                                </SimpleGrid>
                            </Tabs.Panel>

                            <Tabs.Panel value="audit">
                                <Paper withBorder radius="md">
                                    <ApprovalTable
                                        requests={myRequests || []}
                                        isAdmin
                                        onView={(req) => setViewingInstance(req)}
                                        onAction={(id, action) => action === 'APPROVE' ? handleApprove(id) : handleReject(id)}
                                    />
                                </Paper>
                            </Tabs.Panel>
                        </Box>
                    </Tabs>
                </Paper>
            </Stack>

            <Modal
                opened={!!viewingInstance}
                onClose={() => setViewingInstance(null)}
                title={<Text fw={900} size="xl">CHI TIẾT YÊU CẦU #{viewingInstance?.id}</Text>}
                size="lg"
                radius="lg"
                centered
            >
                {viewingInstance && (
                    <Stack gap="md">
                        <Paper withBorder p="md" radius="md">
                            <Text fw={700} mb="xs" size="sm" c="dimmed">THÔNG TIN QUY TRÌNH</Text>
                            <Group justify="space-between">
                                <Text fw={800} size="lg">{viewingInstance.quyTrinh?.ten}</Text>
                                <Badge color="indigo">{viewingInstance.trangThai}</Badge>
                            </Group>
                            <Text size="sm" mt="xs">{viewingInstance.quyTrinh?.moTa}</Text>
                        </Paper>

                        <Paper withBorder p="md" radius="md" bg="var(--mantine-color-default-hover)">
                            <Text fw={700} mb="xs" size="sm" c="dimmed">DỮ LIỆU ĐÃ NỘP</Text>
                            <Stack gap="xs">
                                {Object.entries(viewingInstance.doiTuongLienQuan || {}).map(([key, value]: [string, any]) => (
                                    <Group key={key} justify="space-between" className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
                                        <Text size="sm" fw={600} tt="capitalize">{key.replace('_', ' ')}</Text>
                                        <Text size="sm">{String(value)}</Text>
                                    </Group>
                                ))}
                            </Stack>
                        </Paper>

                        <Group justify="flex-end" mt="md">
                            <Button variant="light" color="gray" onClick={() => setViewingInstance(null)}>Đóng</Button>
                            {viewingInstance.trangThai === 'CHO_DUYET' && (
                                <>
                                    <Button color="red" variant="light" onClick={() => handleReject(viewingInstance.id)}>Từ chối</Button>
                                    <Button color="green" onClick={() => handleApprove(viewingInstance.id)}>Phê duyệt ngay</Button>
                                </>
                            )}
                        </Group>
                    </Stack>
                )}
            </Modal>

            <Modal
                opened={opened}
                onClose={() => { close(); setSelectedFlowId(null); }}
                title={<Text fw={900} size="xl" className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">TẠO YEU CẦU MẪU</Text>}
                size="lg"
                padding="xl"
                radius="lg"
                centered
            >
                <Stack>
                    <Select
                        label="Chọn quy trình chạy thử"
                        placeholder="Chọn một mẫu quy trình đã thiết lập"
                        data={flows?.map(f => ({ value: f.id.toString(), label: f.ten })) || []}
                        value={selectedFlowId}
                        onChange={setSelectedFlowId}
                        disabled={loadingFlows}
                        searchable
                        clearable
                        radius="md"
                        size="md"
                    />

                    {selectedFlowId && formFields && (
                        <Paper withBorder p="xl" radius="lg" bg="var(--mantine-color-default-hover)" mt="md">
                            <DynamicApprovalForm
                                configs={formFields}
                                onSubmit={handleSubmit}
                                loading={submitMutation.isPending}
                            />
                        </Paper>
                    )}

                    {loadingFields && (
                        <Box py="xl" className="flex flex-col items-center">
                            <LoadingOverlay visible />
                            <Text size="sm" mt="md" c="dimmed">Đang tải cấu hình form...</Text>
                        </Box>
                    )}
                </Stack>
            </Modal>
        </Container>
    );
}

import { Divider } from '@mantine/core';
