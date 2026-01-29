"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import {
    Box, ScrollArea, Group, ActionIcon, Title, Text, Stack,
    Paper, Grid, Badge, ThemeIcon, Avatar, Divider, Button,
    LoadingOverlay, SimpleGrid, Breadcrumbs, Anchor
} from "@mantine/core";
import {
    IconChevronLeft, IconFileDescription, IconCalendar,
    IconUser, IconClock, IconCheck, IconX, IconActivity,
    IconFiles, IconInfoCircle, IconMessage2, IconDownload,
    IconHome, IconShieldCheck
} from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { dayjs } from "@/shared/utils/date.util";
import { TBuocQuyTrinh, TTruongFormQuyTrinh, TrangThaiPhien } from "@/shared/types/approval.type";
import { CheckTypeDisplay } from "@/feauture/approvals/components/CheckTypeDisplay";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";

export default function AdminFlowDetailPage() {
    const params = useParams();
    const router = useRouter();
    const flowId = parseInt(params.id as string);

    // Queries
    const { data: flow, isLoading: isLoadingFlow } = AppQuery.approvals.useInstance(flowId);

    // Mutations
    const mutation = AppMutation();
    const approveMutation = mutation.approvals.useApprove(flowId);
    const rejectMutation = mutation.approvals.useReject(flowId);

    const handleApprove = () => {
        (approveMutation.mutate as any)({
            note: 'Phê duyệt hệ thống (Admin Review)',
            urlParams: { id: flowId }
        }, {
            onSuccess: () => {
                notifications.show({ title: 'Thành công', message: 'Yêu cầu quy trình đã được phê duyệt', color: 'green' });
                router.back();
            }
        });
    };

    const handleReject = () => {
        (rejectMutation.mutate as any)({
            note: 'Từ chối hệ thống (Admin Review)',
            urlParams: { id: flowId }
        }, {
            onSuccess: () => {
                notifications.show({ title: 'Thành công', message: 'Yêu cầu quy trình đã bị từ chối', color: 'red' });
                router.back();
            }
        });
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'DA_DUYET': return { color: 'teal', label: 'Đã hoàn tất', icon: IconCheck };
            case 'TU_CHOI': return { color: 'red', label: 'Bị từ chối', icon: IconX };
            case 'DANG_XU_LY': return { color: 'blue', label: 'Đang xử lý', icon: IconActivity };
            case 'CHO_DUYET': return { color: 'orange', label: 'Đợi phê duyệt', icon: IconClock };
            default: return { color: 'gray', label: status, icon: IconFileDescription };
        }
    };

    const formData = React.useMemo(() => {
        let data: any = {};
        if (!flow) return data;
        if (flow.doiTuongLienQuan) {
            try {
                const parsed = typeof flow.doiTuongLienQuan === 'string' ? JSON.parse(flow.doiTuongLienQuan) : flow.doiTuongLienQuan;
                data = { ...data, ...parsed };
            } catch (e) {
                console.error("Failed to parse doiTuongLienQuan", e);
            }
        }
        if (flow.duLieuForm) {
            try {
                const parsed = JSON.parse(flow.duLieuForm);
                data = { ...data, ...parsed };
            } catch (e) {
                console.error("Failed to parse duLieuForm", e);
            }
        }
        return data;
    }, [flow]);

    const getFieldValue = (field: TTruongFormQuyTrinh) => {
        return formData[field.tenTruong] ?? formData[field.id.toString()] ?? formData[field.id];
    };

    if (isLoadingFlow) return (
        <Box h="calc(100vh - 60px)" className="relative bg-white dark:bg-black">
            <LoadingOverlay visible={true} overlayProps={{ blur: 1 }} loaderProps={{ color: 'indigo', type: 'bars' }} />
        </Box>
    );

    if (!flow) return (
        <Stack align="center" justify="center" h="100vh" gap="lg" className="bg-[#fcfcfd] dark:bg-[#09090b]">
            <Box className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400">
                <IconFiles size={40} stroke={1.5} />
            </Box>
            <div className="text-center">
                <Text fw={850} size="xl" className="text-gray-900 dark:text-gray-50">Hồ sơ không tồn tại</Text>
                <Text size="sm" c="dimmed" mt={4}>Vui lòng kiểm tra lại mã số hoặc quyền truy cập của bạn.</Text>
            </div>
            <Button variant="filled" color="indigo" radius="100px" h={48} px={32} onClick={() => router.push("./")}>Quay lại danh sách</Button>
        </Stack>
    );

    const config = getStatusConfig(flow.trangThai);
    const canAction = flow.trangThai === 'DANG_XU_LY' || flow.trangThai === 'CHO_DUYET';

    return (
        <Box className="flex flex-col flex-1 min-h-0 bg-[#fcfcfd] dark:bg-[#09090b] selection:bg-indigo-100">
            {/* Header */}
            <Box className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800/50 px-6 md:px-10 py-6 md:py-8 shrink-0 z-40">
                <div className="max-w-7xl mx-auto w-full">
                    <Stack gap="xl">
                        <Breadcrumbs separator={<Text size="xs" c="dimmed">/</Text>} className="opacity-70">
                            {[
                                { title: 'Dashboard', path: '/admin/dashboard' },
                                { title: 'Duyệt quy trình', path: '/admin/approvals' },
                                { title: `Yêu cầu #${flow.id}`, path: null },
                            ].map((item, index) => (
                                <Anchor key={index} underline="never" onClick={() => item.path && router.push(item.path)} className="text-[11px] fw-800 uppercase lts={1} tracking-widest text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer">
                                    {item.title}
                                </Anchor>
                            ))}
                        </Breadcrumbs>

                        <Group justify="space-between" align="flex-end">
                            <Group gap="xl">
                                <ActionIcon
                                    variant="light"
                                    color="gray"
                                    radius="12px"
                                    size={48}
                                    onClick={() => router.back()}
                                    className="bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 shadow-sm"
                                >
                                    <IconChevronLeft size={22} stroke={3} />
                                </ActionIcon>
                                <div>
                                    <Group gap="xs" mb={8}>
                                        <Badge variant="light" color={config.color} size="sm" radius="sm" fw={850} tt="uppercase" lts={1}>
                                            {config.label}
                                        </Badge>
                                        <Text size="xs" fw={750} className="text-gray-400 font-mono">CF-{flow.id.toString().padStart(6, '0')}</Text>
                                    </Group>
                                    <Title order={2} fw={850} className="tracking-tighter text-gray-900 dark:text-gray-50 text-2xl md:text-3xl">
                                        {flow.quyTrinh?.ten || "Yêu cầu quy trình"}
                                    </Title>
                                </div>
                            </Group>

                            {canAction && (
                                <Group gap="md">
                                    <Button
                                        leftSection={<IconX size={18} stroke={2.5} />}
                                        variant="light"
                                        color="red"
                                        radius="100px"
                                        h={44}
                                        px={28}
                                        fw={850}
                                        loading={rejectMutation.isPending}
                                        onClick={handleReject}
                                    >
                                        Từ chối
                                    </Button>
                                    <Button
                                        leftSection={<IconCheck size={18} stroke={2.5} />}
                                        variant="filled"
                                        color="green"
                                        radius="100px"
                                        h={44}
                                        px={28}
                                        fw={850}
                                        loading={approveMutation.isPending}
                                        onClick={handleApprove}
                                        className="shadow-lg shadow-green-500/10"
                                    >
                                        Phê duyệt Admin
                                    </Button>
                                </Group>
                            )}
                        </Group>
                    </Stack>
                </div>
            </Box>

            <ScrollArea className="flex-1" type="scroll">
                <Box className="max-w-7xl mx-auto p-6 md:p-10 pb-32">
                    <Grid gutter={40}>
                        <Grid.Col span={{ base: 12, lg: 8 }}>
                            <Stack gap={40}>
                                <Stack gap="xs">
                                    <Group gap="sm" mb={10}>
                                        <ThemeIcon variant="light" color="indigo" radius="md" size="md">
                                            <IconShieldCheck size={18} stroke={2} />
                                        </ThemeIcon>
                                        <Text fw={900} size="sm" tt="uppercase" lts={1.5}>Dữ liệu người dùng nộp</Text>
                                    </Group>

                                    <Paper withBorder radius="24px" p={40} className="bg-white dark:bg-zinc-900 shadow-sm">
                                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40}>
                                            {flow.fields && flow.fields.length > 0 ? (
                                                flow.fields.map((f: any) => (
                                                    <CheckTypeDisplay
                                                        key={f.submitFlowFieldID}
                                                        field={{
                                                            id: f.detailFlow.detailFlowId,
                                                            nhan: f.detailFlow.fieldName,
                                                            loai: f.detailFlow.fieldValue as any,
                                                            batBuoc: f.detailFlow.optional === 'false',
                                                            tuyChon: f.detailFlow.optionValue,
                                                            tenTruong: f.detailFlow.key,
                                                            quyTrinhId: flow.quyTrinhId,
                                                            thuTu: f.detailFlow.order
                                                        }}
                                                        value={f.submitContent}
                                                    />
                                                ))
                                            ) : flow.quyTrinh?.cacTruong?.map((field: TTruongFormQuyTrinh) => (
                                                <CheckTypeDisplay
                                                    key={field.id}
                                                    field={field}
                                                    value={getFieldValue(field)}
                                                />
                                            ))}
                                        </SimpleGrid>
                                    </Paper>
                                </Stack>

                                <Stack gap="xs">
                                    <Group gap="sm" mb={10}>
                                        <ThemeIcon variant="light" color="gray" radius="md" size="md">
                                            <IconActivity size={18} stroke={2} />
                                        </ThemeIcon>
                                        <Text fw={900} size="sm" tt="uppercase" lts={1.5}>Nhật ký phê duyệt</Text>
                                    </Group>
                                    <Paper withBorder radius="24px" p={32} className="bg-white dark:bg-zinc-900 shadow-sm">
                                        {flow.nhatKy && flow.nhatKy.length > 0 ? (
                                            <Stack gap="md">
                                                {flow.nhatKy.map((log: any) => (
                                                    <Group key={log.id} wrap="nowrap" align="flex-start">
                                                        <Avatar size="sm" radius="xl" color="indigo" variant="light">
                                                            {log.nguoiDung?.hoTen?.charAt(0).toUpperCase() || "A"}
                                                        </Avatar>
                                                        <Box className="flex-1">
                                                            <Group justify="space-between">
                                                                <Text size="sm" fw={700}>{log.nguoiDung?.hoTen}</Text>
                                                                <Text size="xs" c="dimmed">{dayjs(log.ngayTao).format('DD/MM/YYYY HH:mm')}</Text>
                                                            </Group>
                                                            <Badge size="xs" color={log.hanhDong === 'PHE_DUYET' ? 'green' : 'red'} mb={4}>
                                                                {log.hanhDong}
                                                            </Badge>
                                                            <Text size="sm">{log.noiDung || 'Không có ghi chú'}</Text>
                                                        </Box>
                                                    </Group>
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Text size="sm" c="dimmed" ta="center" py="xl">Chưa có hoạt động nào được ghi lại</Text>
                                        )}
                                    </Paper>
                                </Stack>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, lg: 4 }}>
                            <Stack gap="lg" className="sticky top-10">
                                <Paper withBorder radius="24px" p={24} className="bg-white dark:bg-zinc-900 shadow-sm">
                                    <Stack gap="md">
                                        <Text size="xs" fw={900} c="dimmed" tt="uppercase" lts={1}>Thông tin người yêu cầu</Text>
                                        <Group>
                                            <Avatar size="xl" radius="md" color="indigo">
                                                {flow.nguoiTao?.hoTen?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Text fw={800} size="lg">{flow.nguoiTao?.hoTen || "Ẩn danh"}</Text>
                                                <Text size="xs" c="dimmed">{flow.nguoiTao?.email}</Text>
                                                <Text size="xs" c="dimmed" mt={4}>Tài khoản: {flow.nguoiTao?.taiKhoan}</Text>
                                            </Box>
                                        </Group>
                                        <Divider />
                                        <SimpleGrid cols={1} spacing="xs">
                                            <Group justify="space-between">
                                                <Text size="xs" fw={700} c="dimmed">NGÀY GỬI</Text>
                                                <Text size="xs" fw={800}>{dayjs(flow.ngayTao).format('DD/MM/YYYY HH:mm')}</Text>
                                            </Group>
                                            <Group justify="space-between">
                                                <Text size="xs" fw={700} c="dimmed">TRẠNG THÁI HIỆN TẠI</Text>
                                                <Text size="xs" fw={800} color={config.color}>{config.label}</Text>
                                            </Group>
                                        </SimpleGrid>
                                    </Stack>
                                </Paper>

                                <Paper withBorder radius="24px" p={24} className="bg-white dark:bg-zinc-900 shadow-sm">
                                    <Stack gap="md">
                                        <Text size="xs" fw={900} c="dimmed" tt="uppercase" lts={1}>Quy trình xử lý</Text>
                                        <Box className="relative">
                                            {flow.quyTrinh?.cacBuoc?.map((buoc: TBuocQuyTrinh, index: number) => {
                                                const currentStepIndex = flow.buocPhiens?.findIndex((bp: any) => bp.trangThai === 'CHO_DUYET') ?? -1;
                                                const isDone = index < flow.buocHienTai - 1 || flow.trangThai === 'DA_DUYET';
                                                const isCurrent = index === flow.buocHienTai - 1 && flow.trangThai === 'DANG_XU_LY';

                                                return (
                                                    <Group key={buoc.id} wrap="nowrap" gap="md" className="relative pb-6 last:pb-0">
                                                        {index < (flow.quyTrinh?.cacBuoc?.length || 0) - 1 && (
                                                            <Box className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-gray-100" />
                                                        )}
                                                        <Box className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${isDone ? 'bg-green-500 text-white' : isCurrent ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                            {isDone ? <IconCheck size={14} /> : index + 1}
                                                        </Box>
                                                        <Box>
                                                            <Text size="sm" fw={isCurrent ? 800 : 600} c={isCurrent ? 'indigo' : 'default'}>{buoc.ten}</Text>
                                                            <Text size="xs" c="dimmed">
                                                                {buoc.nguoiDuyets?.[0]?.approverRole === 'ADMIN' ? 'Ban Giám Hiệu' : buoc.nguoiDuyets?.[0]?.approverRole || 'Người phê duyệt'}
                                                            </Text>
                                                        </Box>
                                                    </Group>
                                                );
                                            })}
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Box>
            </ScrollArea>
        </Box>
    );
}
