"use client";

import { useParams, useRouter } from "next/navigation";
import {
    Box, ScrollArea, Group, ActionIcon, Title, Text, Stack,
    Paper, Grid, Badge, ThemeIcon, Avatar, Divider, Button,
    LoadingOverlay, Card, SimpleGrid, Breadcrumbs, Anchor
} from "@mantine/core";
import {
    IconChevronLeft, IconFileDescription, IconCalendar,
    IconUser, IconClock, IconCheck, IconX, IconActivity,
    IconFiles, IconInfoCircle, IconMessage2, IconDownload,
    IconHome, IconArrowRight, IconShieldCheck
} from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { dayjs } from "@/shared/utils/date.util";
import { TPhienQuyTrinh } from "@/shared/types/approval.type";

export default function StudentFlowDetailPage() {
    const params = useParams();
    const router = useRouter();
    const flowId = parseInt(params.id as string);

    // Queries
    const { data: myFlows, isLoading: isLoadingFlows } = AppQuery.approvals.useMyFlows();
    const flow = myFlows?.find((f: TPhienQuyTrinh) => f.id === flowId);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'DA_DUYET': return { color: 'teal', label: 'Đã hoàn tất', icon: IconCheck };
            case 'TU_CHOI': return { color: 'red', label: 'Bị từ chối', icon: IconX };
            case 'DANG_XU_LY': return { color: 'blue', label: 'Đang xử lý', icon: IconActivity };
            case 'CHO_DUYET': return { color: 'orange', label: 'Đợi phê duyệt', icon: IconClock };
            default: return { color: 'gray', label: status, icon: IconFileDescription };
        }
    };

    if (isLoadingFlows) return (
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
    // FIX: Using doiTuongLienQuan instead of duLieuForm
    const formData = flow.doiTuongLienQuan ? (typeof flow.doiTuongLienQuan === 'string' ? JSON.parse(flow.doiTuongLienQuan) : flow.doiTuongLienQuan) : {};

    return (
        <Box h="calc(100vh - 60px)" className="flex flex-col bg-[#fcfcfd] dark:bg-[#09090b] selection:bg-indigo-100">
            {/* Header Masterpiece */}
            <Box className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800/50 px-6 md:px-10 py-6 md:py-8 shrink-0 z-40">
                <div className="max-w-7xl mx-auto w-full">
                    <Stack gap="xl">
                        <Breadcrumbs separator={<Text size="xs" c="dimmed">/</Text>} className="opacity-70">
                            {[
                                { title: 'Dashboard', icon: IconHome },
                                { title: 'Dịch vụ của tôi', icon: null },
                                { title: `HS-${flow.id}`, icon: null },
                            ].map((item, index) => (
                                <Anchor key={index} underline="never" className="text-[11px] fw-800 uppercase lts={1} tracking-widest text-gray-500 hover:text-indigo-600 transition-colors">
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
                                    className="bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 shadow-sm hover:scale-105 active:scale-95"
                                >
                                    <IconChevronLeft size={22} stroke={3} />
                                </ActionIcon>
                                <div>
                                    <Group gap="xs" mb={8}>
                                        <Badge variant="light" color={config.color} size="sm" radius="sm" fw={850} tt="uppercase" lts={1} className="h-6">
                                            {config.label}
                                        </Badge>
                                        <Text size="xs" fw={750} className="text-gray-400 font-mono">UUID: CF-{flow.id.toString().padStart(6, '0')}</Text>
                                    </Group>
                                    <Title order={2} fw={850} className="tracking-tighter text-gray-900 dark:text-gray-50 leading-none text-2xl md:text-3xl">
                                        {flow.quyTrinh?.ten || "Yêu cầu hành chính"}
                                    </Title>
                                </div>
                            </Group>

                            <Group gap="md" visibleFrom="sm">
                                <Button leftSection={<IconDownload size={18} stroke={2.5} />} variant="subtle" color="gray" radius="100px" fw={800}>Xuất PDF</Button>
                                <Button variant="filled" color="indigo" radius="100px" h={44} px={28} fw={850} className="shadow-lg shadow-indigo-500/10 active:scale-95 transition-all">Chia sẻ hồ sơ</Button>
                            </Group>
                        </Group>
                    </Stack>
                </div>
            </Box>

            <ScrollArea className="flex-1" type="scroll">
                <Box className="max-w-7xl mx-auto p-6 md:p-10 pb-32">
                    <Grid gutter={40}>
                        {/* Content Area */}
                        <Grid.Col span={{ base: 12, lg: 7.5 }}>
                            <Stack gap={40}>
                                {/* Data Grid */}
                                <Stack gap="xs">
                                    <Group gap="sm" mb={10}>
                                        <ThemeIcon variant="light" color="indigo" radius="md" size="md">
                                            <IconShieldCheck size={18} stroke={2} />
                                        </ThemeIcon>
                                        <Text fw={900} size="sm" tt="uppercase" lts={1.5} className="text-gray-900 dark:text-gray-100">Xác thực dữ liệu nộp</Text>
                                    </Group>

                                    <Paper withBorder radius="24px" p={40} className="border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden relative">
                                        <Box className="absolute top-0 right-0 p-8 opacity-5">
                                            <IconFileDescription size={120} stroke={1} />
                                        </Box>

                                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40}>
                                            {Object.keys(formData).length > 0 ? (
                                                Object.entries(formData).map(([key, value]) => (
                                                    <Box key={key} className="group">
                                                        <Text size="xs" fw={850} c="dimmed" tt="uppercase" lts={1.2} mb={10} className="group-hover:text-indigo-600 transition-colors">{key}</Text>
                                                        <Text fw={750} size="md" className="text-gray-900 dark:text-gray-100 leading-snug">
                                                            {value as string || "N/A"}
                                                        </Text>
                                                        <Box h={2} className="bg-gray-50 dark:bg-zinc-800 mt-4 rounded-full" />
                                                    </Box>
                                                ))
                                            ) : (
                                                <Stack align="center" gap="md" py={60} className="col-span-full opacity-40">
                                                    <IconInfoCircle size={48} stroke={1} className="text-gray-300" />
                                                    <Text fw={800} size="sm" className="tracking-tight uppercase">Không có dữ liệu khai báo bổ sung</Text>
                                                </Stack>
                                            )}
                                        </SimpleGrid>
                                    </Paper>
                                </Stack>

                                {/* Activity Logs Placeholder */}
                                <Stack gap="xs">
                                    <Group gap="sm" mb={10}>
                                        <ThemeIcon variant="light" color="gray" radius="md" size="md">
                                            <IconActivity size={18} stroke={2} />
                                        </ThemeIcon>
                                        <Text fw={900} size="sm" tt="uppercase" lts={1.5} className="text-gray-400">Nhật ký xử lý hệ thống</Text>
                                    </Group>
                                    <Paper withBorder radius="24px" p={48} className="border-gray-100 bg-gray-50/30 border-dashed text-center">
                                        <IconMessage2 size={40} stroke={1} className="mx-auto mb-6 text-gray-300" />
                                        <Text fw={800} size="sm" c="dimmed" lts={0.5} className="uppercase">Chưa có thông báo phê duyệt mới</Text>
                                        <Text size="xs" c="dimmed" mt={4} className="italic">Lịch sử phê duyệt chi tiết sẽ được ghi nhận tại đây.</Text>
                                    </Paper>
                                </Stack>
                            </Stack>
                        </Grid.Col>

                        {/* Sidebar: Status & Lifecycle */}
                        <Grid.Col span={{ base: 12, lg: 4.5 }}>
                            <Stack gap={40} className="lg:sticky lg:top-10">
                                {/* Identity Card */}
                                <Paper withBorder radius="32px" p={32} className="border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-gray-100/20">
                                    <Stack gap="xl">
                                        <Group justify="space-between">
                                            <Stack gap={4}>
                                                <Text size="10px" fw={900} c="dimmed" tt="uppercase" lts={1}>Tình trạng hồ sơ</Text>
                                                <Group gap="xs">
                                                    <Box className={`w-3 h-3 rounded-full bg-${config.color}-500 animate-pulse`} />
                                                    <Text fw={850} size="lg" className="tracking-tight text-gray-900 dark:text-gray-50">{config.label}</Text>
                                                </Group>
                                            </Stack>
                                            <Avatar size={56} radius="20px" src={null} color="indigo" className="shadow-inner">
                                                <IconUser size={32} />
                                            </Avatar>
                                        </Group>

                                        <Divider className="opacity-40" />

                                        <SimpleGrid cols={1} spacing="md">
                                            <Group justify="space-between">
                                                <Text size="xs" fw={750} c="dimmed">NGƯỜI KHỞI TẠO</Text>
                                                <Text size="xs" fw={850} className="text-indigo-600">{flow.nguoiTao?.hoTen || "Sinh viên"}</Text>
                                            </Group>
                                            <Group justify="space-between">
                                                <Text size="xs" fw={750} c="dimmed">THỜI ĐIỂM NỘP</Text>
                                                <Text size="xs" fw={850} className="text-gray-700 dark:text-gray-300">{dayjs(flow.ngayTao).format("HH:mm, DD/MM/YYYY")}</Text>
                                            </Group>
                                            <Group justify="space-between">
                                                <Text size="xs" fw={750} c="dimmed">CẬP NHẬT CUỐI</Text>
                                                <Text size="xs" fw={850} className="text-gray-700 dark:text-gray-300">{dayjs(flow.ngayCapNhat || flow.ngayTao).fromNow()}</Text>
                                            </Group>
                                        </SimpleGrid>
                                    </Stack>
                                </Paper>

                                {/* Lifecyle Timeline */}
                                <Stack gap="xs">
                                    <Group gap="sm" mb={10}>
                                        <ThemeIcon variant="light" color="indigo" radius="md" size="md">
                                            <IconClock size={18} stroke={2} />
                                        </ThemeIcon>
                                        <Text fw={900} size="sm" tt="uppercase" lts={1.5} className="text-gray-900 dark:text-gray-100">Quy trình xử lý</Text>
                                    </Group>

                                    <Paper withBorder radius="32px" p={32} className="border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm relative overflow-hidden">
                                        <Stack gap={0}>
                                            {flow.quyTrinh?.cacBuoc?.map((buoc: any, index: number) => {
                                                const isActive = index === 0; // Simulated
                                                const totalSteps = flow.quyTrinh?.cacBuoc?.length || 0;
                                                return (
                                                    <Group key={buoc.id} wrap="nowrap" gap="xl" className="relative pb-12 last:pb-0">
                                                        {(index < totalSteps - 1) && (
                                                            <Box className={`absolute left-[21px] top-12 bottom-0 w-[2px] ${isActive ? 'bg-indigo-600' : 'bg-gray-100 dark:bg-zinc-800'}`} />
                                                        )}
                                                        <Box className={`w-11 h-11 rounded-16px border-2 flex items-center justify-center font-black text-sm shrink-0 z-10 transition-all duration-500 ${isActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white dark:bg-zinc-900 border-gray-100 text-gray-300'}`}>
                                                            {isActive ? <IconActivity size={18} stroke={3} /> : index + 1}
                                                        </Box>
                                                        <Box className="flex-1">
                                                            <Group justify="space-between" mb={4} align="flex-start">
                                                                <Text fw={850} size="sm" className={`${isActive ? 'text-gray-900 dark:text-gray-50' : 'text-gray-400'} uppercase tracking-tighter leading-tight`}>{buoc.ten}</Text>
                                                                {isActive && <Badge color="indigo" variant="light" size="xs" radius="sm" fw={850} px={6}>ĐANG XỬ LÝ</Badge>}
                                                            </Group>
                                                            <Text size="xs" fw={750} c={isActive ? "indigo" : "dimmed"} lts={0.2}>
                                                                {buoc.nguoiDuyets?.[0]?.user?.hoTen ||
                                                                    (buoc.nguoiDuyets?.[0]?.approverRole === 'GVCN' ? 'Giảng viên Chủ nhiệm' : 'Phòng Đào Tạo & CTSV')}
                                                            </Text>
                                                        </Box>
                                                    </Group>
                                                );
                                            })}
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Box>
            </ScrollArea>
        </Box>
    );
}
