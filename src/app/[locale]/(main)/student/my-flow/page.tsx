"use client";

import { useState } from "react";
import {
    Stack, Title, Text, Button, Tabs, Group,
    Badge, ThemeIcon, ActionIcon, Drawer, Box, Paper, LoadingOverlay,
    Select, TextInput, NumberInput, Textarea, ScrollArea, Stepper,
    SimpleGrid, Table, UnstyledButton
} from "@mantine/core";
import {
    IconPlus, IconFileDescription, IconClock, IconCheck, IconX,
    IconChevronRight, IconCalendar, IconChevronLeft, IconFiles,
    IconActivity, IconExternalLink, IconSearch, IconArrowRight,
    IconTrendingUp, IconBriefcase, IconHistory
} from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { TPhienQuyTrinh, TQuyTrinh, TTruongFormQuyTrinh, LoaiTruongForm } from "@/shared/types/approval.type";
import { useMediaQuery } from "@mantine/hooks";
import { dayjs } from "@/shared/utils/date.util";

export default function MyFlowPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string | null>("all");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Queries
    const { data: myFlows, isLoading: isLoadingFlows } = AppQuery.approvals.useMyFlows();
    const { data: templates } = AppQuery.approvals.useFlows();

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'DA_DUYET': return { color: 'teal', label: 'Đã hoàn tất', icon: IconCheck };
            case 'TU_CHOI': return { color: 'red', label: 'Từ chối', icon: IconX };
            case 'DANG_XU_LY': return { color: 'blue', label: 'Đang xử lý', icon: IconActivity };
            case 'CHO_DUYET': return { color: 'orange', label: 'Chờ duyệt', icon: IconClock };
            default: return { color: 'gray', label: status, icon: IconFileDescription };
        }
    };

    const filteredFlows = (myFlows || [])?.filter((flow: TPhienQuyTrinh) => {
        const matchesTab = activeTab === "all" ||
            (activeTab === "pending" && (flow.trangThai === "CHO_DUYET")) ||
            (activeTab === "approved" && flow.trangThai === "DA_DUYET") ||
            (activeTab === "rejected" && flow.trangThai === "TU_CHOI");

        const matchesSearch = (flow.quyTrinh?.ten || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            flow.id.toString().includes(searchQuery);

        return matchesTab && matchesSearch;
    });

    const rows = filteredFlows?.map((flow: TPhienQuyTrinh, index: number) => {
        const config = getStatusConfig(flow.trangThai);
        return (
            <Table.Tr
                key={flow.id}
                className="hover:bg-indigo-50/10 dark:hover:bg-indigo-500/5 cursor-pointer transition-all duration-300 group border-b border-gray-50 dark:border-zinc-800/50"
                onClick={() => router.push(`./my-flow/${flow.id}`)}
            >
                <Table.Td>
                    <Box className="flex items-center gap-4">
                        <Box className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-[10px] fw-900 text-gray-400 font-mono group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {index + 1}
                        </Box>
                        <Text fw={850} size="xs" className="text-gray-400 font-mono tracking-tighter">CF-{flow.id.toString().padStart(6, '0')}</Text>
                    </Box>
                </Table.Td>
                <Table.Td>
                    <Stack gap={2}>
                        <Text fw={900} size="sm" className="text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-none">
                            {flow.quyTrinh?.ten || "Yêu cầu hành chính"}
                        </Text>
                        <Group gap={6} mt={4}>
                            <Badge variant="dot" color="gray" size="xs" radius="sm" fw={800} className="border-none bg-transparent px-0">{flow.quyTrinh?.danhMuc?.ten || "Hành chính"}</Badge>
                            <Text size="10px" c="dimmed" fw={700}>•</Text>
                            <Text size="10px" c="dimmed" fw={750} tt="uppercase" lts={0.5}>Mã: HS-{flow.id}</Text>
                        </Group>
                    </Stack>
                </Table.Td>
                <Table.Td>
                    <Badge variant="light" color={config.color} size="md" radius="sm" fw={900} tt="uppercase" lts={1} className="h-8 px-4 border border-current/10">
                        {config.label}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Stack gap={2}>
                        <Text size="sm" fw={850} className="text-gray-800 dark:text-gray-200 tabular-nums">
                            {dayjs(flow.ngayTao).format("HH:mm")}
                        </Text>
                        <Text size="11px" fw={700} c="dimmed">
                            {dayjs(flow.ngayTao).format("DD MMM, YYYY")}
                        </Text>
                    </Stack>
                </Table.Td>
                <Table.Td>
                    <Text size="xs" fw={850} className="text-indigo-600 uppercase tracking-widest text-right">
                        {dayjs(flow.ngayTao).fromNow()}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Group justify="flex-end">
                        <Box className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-45 transition-all">
                            <IconArrowRight size={18} stroke={3} />
                        </Box>
                    </Group>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Box h="calc(100vh - 60px)" className="flex flex-col bg-[#fcfcfd] dark:bg-[#09090b] translate-z-0">
            {/* Ultra-Premium Navigation Bar */}
            <Box h={100} className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border-b border-gray-100 dark:border-zinc-800 px-6 md:px-12 flex items-center shrink-0 z-40 relative">
                <Box className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                <Group justify="space-between" className="w-full max-w-7xl mx-auto">
                    <Group gap="xl">
                        <Box className="relative group">
                            <Box className="absolute -inset-2 bg-indigo-500/20 rounded-2xl blur-xl group-hover:bg-indigo-500/30 transition-all opacity-0 group-hover:opacity-100" />
                            <Group gap="md" className="relative">
                                <Box className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                                    <IconFiles size={24} stroke={2.5} />
                                </Box>
                                <div>
                                    <Title order={3} fw={900} className="tracking-tighter text-gray-900 dark:text-gray-50 leading-none">Smart Portal</Title>
                                    <Text size="xs" fw={800} tt="uppercase" lts={1.5} className="text-indigo-600 mt-1">Dịch vụ một cửa số</Text>
                                </div>
                            </Group>
                        </Box>
                    </Group>

                    <Group gap="md">
                        <Button
                            leftSection={<IconPlus size={20} stroke={3} />}
                            variant="filled"
                            color="indigo"
                            radius="100px"
                            h={52}
                            px={32}
                            onClick={() => setIsDrawerOpen(true)}
                            className="shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95 fw-900 text-sm uppercase tracking-wider"
                        >
                            Tạo đề xuất mới
                        </Button>
                    </Group>
                </Group>
            </Box>

            <ScrollArea className="flex-1" type="scroll">
                <Box className="max-w-7xl mx-auto p-6 md:p-12 pb-32">
                    <Stack gap={56}>
                        {/* Summary Section - Masterpiece Edition */}
                        {!isLoadingFlows && myFlows && (
                            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
                                {[
                                    { label: 'Tổng số hồ sơ', value: myFlows.length, color: 'indigo', icon: IconBriefcase, trend: '+2 hôm nay' },
                                    { label: 'Đang chờ xử lý', value: myFlows.filter((f: TPhienQuyTrinh) => f.trangThai === 'CHO_DUYET').length, color: 'blue', icon: IconClock, trend: 'Ưu tiên' },
                                    { label: 'Đã được duyệt', value: myFlows.filter((f: TPhienQuyTrinh) => f.trangThai === 'DA_DUYET').length, color: 'teal', icon: IconCheck, trend: 'Hoàn tất' },
                                    { label: 'Cần xem lại', value: myFlows.filter((f: TPhienQuyTrinh) => f.trangThai === 'TU_CHOI').length, color: 'red', icon: IconHistory, trend: 'Lưu ý' },
                                ].map((s, i) => (
                                    <Paper key={i} withBorder radius="32px" p={32} className="border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 group hover:border-indigo-200 transition-all duration-500 shadow-sm hover:shadow-xl">
                                        <Group justify="space-between" mb={24}>
                                            <ThemeIcon variant="light" color={s.color} size={48} radius="xl" className="group-hover:scale-110 transition-transform">
                                                <s.icon size={24} stroke={2} />
                                            </ThemeIcon>
                                            <Badge variant="light" color={s.color} size="xs" radius="sm" fw={900}>{s.trend}</Badge>
                                        </Group>
                                        <Text size="xs" fw={850} c="dimmed" tt="uppercase" lts={1.5} mb={4}>{s.label}</Text>
                                        <Text size="36px" fw={950} className="text-gray-900 dark:text-white leading-none tracking-tight">{s.value}</Text>
                                    </Paper>
                                ))}
                            </SimpleGrid>
                        )}

                        <Box>
                            <Stack gap="xl">
                                <Group justify="space-between" align="center">
                                    <Tabs value={activeTab} onChange={setActiveTab} variant="unstyled">
                                        <Tabs.List className="bg-gray-100/40 dark:bg-zinc-800/40 p-1.5 rounded-20px flex gap-1.5 backdrop-blur-sm">
                                            {[
                                                { value: 'all', label: 'Tất cả hồ sơ' },
                                                { value: 'pending', label: 'Đang chờ xử lý' },
                                                { value: 'approved', label: 'Đã phê duyệt' },
                                                { value: 'rejected', label: 'Bị từ chối' },
                                            ].map((t) => (
                                                <Tabs.Tab
                                                    key={t.value}
                                                    value={t.value}
                                                    className={`px-8 py-2.5 rounded-16px text-xs fw-900 transition-all uppercase tracking-widest ${activeTab === t.value ? 'bg-white dark:bg-zinc-700 shadow-xl shadow-gray-200/50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                    {t.label}
                                                </Tabs.Tab>
                                            ))}
                                        </Tabs.List>
                                    </Tabs>

                                    <Box w={{ base: '100%', sm: 360 }}>
                                        <TextInput
                                            placeholder="Tìm kiếm thông tin hồ sơ..."
                                            leftSection={<IconSearch size={22} stroke={2.5} className="text-gray-400" />}
                                            radius="100px"
                                            size="md"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.currentTarget.value)}
                                            styles={{ input: { background: 'white', border: '1px solid var(--mantine-color-gray-100)', height: '52px', fontWeight: 700 } }}
                                        />
                                    </Box>
                                </Group>

                                <Paper withBorder radius="32px" className="border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xl shadow-gray-200/20 mb-20">
                                    <div className="overflow-x-auto">
                                        <Table verticalSpacing={24} horizontalSpacing={40} highlightOnHover={false}>
                                            <Table.Thead className="bg-gray-50/30 dark:bg-zinc-800/30 border-b border-gray-100 dark:border-zinc-800">
                                                <Table.Tr>
                                                    <Table.Th className="text-[10px] fw-900 uppercase lts={2} text-gray-400 py-6">Định danh hồ sơ</Table.Th>
                                                    <Table.Th className="text-[10px] fw-900 uppercase lts={2} text-gray-400 py-6">Thông tin dịch vụ</Table.Th>
                                                    <Table.Th className="text-[10px] fw-900 uppercase lts={2} text-gray-400 py-6">Tiến độ</Table.Th>
                                                    <Table.Th className="text-[10px] fw-900 uppercase lts={2} text-gray-400 py-6">Ngày khởi tạo</Table.Th>
                                                    <Table.Th className="text-[10px] fw-900 uppercase lts={2} text-gray-400 py-6 text-right">Hoạt động</Table.Th>
                                                    <Table.Th />
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {isLoadingFlows ? (
                                                    <Table.Tr>
                                                        <Table.Td colSpan={6} p={0}>
                                                            <Box h={300} className="relative">
                                                                <LoadingOverlay visible={true} overlayProps={{ blur: 0 }} loaderProps={{ color: 'indigo', type: 'bars' }} />
                                                            </Box>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                ) : rows && rows.length > 0 ? rows : (
                                                    <Table.Tr>
                                                        <Table.Td colSpan={6}>
                                                            <Stack align="center" justify="center" py={120} className="opacity-60">
                                                                <Box className="w-24 h-24 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300">
                                                                    <IconFiles size={48} stroke={1} />
                                                                </Box>
                                                                <Text fw={900} size="xl" className="text-gray-400 tracking-tight mt-6">Hộp thư hồ sơ trống</Text>
                                                                <Text size="sm" c="dimmed" maw={300} ta="center">Bạn chưa có bất kỳ yêu cầu phê duyệt nào được khởi tạo trong hệ thống.</Text>
                                                                <Button variant="light" color="indigo" radius="xl" size="md" mt={24} onClick={() => setIsDrawerOpen(true)}>Khởi tạo ngay</Button>
                                                            </Stack>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                )}
                                            </Table.Tbody>
                                        </Table>
                                    </div>
                                </Paper>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            </ScrollArea>

            <CreateRequestDrawer
                opened={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                templates={templates || []}
            />
        </Box>
    );
}

// --------------------------------------------------------------------------------------
// SUB-COMPONENTS
// --------------------------------------------------------------------------------------

function CreateRequestDrawer({ opened, onClose, templates }: { opened: boolean, onClose: () => void, templates: TQuyTrinh[] }) {
    const [selectedTemplate, setSelectedTemplate] = useState<TQuyTrinh | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const isMobile = useMediaQuery('(max-width: 48em)');

    const filteredTemplates = templates.filter(t =>
        t.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.moTa?.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(t => t.trangThai === "HOAT_DONG");

    const handleClose = () => {
        setSelectedTemplate(null);
        setSearchTerm("");
        onClose();
    };

    return (
        <Drawer
            opened={opened}
            onClose={handleClose}
            position="right"
            size={isMobile ? "100%" : "720px"}
            withCloseButton={false}
            padding={0}
            transitionProps={{ transition: 'slide-left', duration: 600, timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            className="selection:bg-indigo-100"
        >
            <Box h="100%" className="flex flex-col bg-white dark:bg-zinc-950 relative overflow-hidden">
                {/* Decorative background element */}
                <Box className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                {/* Custom Drawer Header - Masterpiece Edition */}
                <Box px={40} py={32} className="border-b border-gray-100 dark:border-zinc-800 shrink-0 relative">
                    <Group justify="space-between">
                        <Group gap="xl">
                            <ActionIcon
                                variant="light"
                                color="indigo"
                                radius="16px"
                                size={48}
                                onClick={selectedTemplate ? () => setSelectedTemplate(null) : handleClose}
                                className="shadow-sm hover:scale-110 active:scale-95 transition-all"
                            >
                                <IconChevronLeft size={24} stroke={3} />
                            </ActionIcon>
                            <div>
                                <Title order={3} fw={950} className="tracking-tighter text-gray-900 dark:text-gray-50 leading-none mb-1">
                                    {selectedTemplate ? selectedTemplate.ten : "Dịch vụ Smart Portal"}
                                </Title>
                                <Text size="10px" fw={900} c="indigo" tt="uppercase" lts={2}>Trung tâm hành chính công số</Text>
                            </div>
                        </Group>
                        {!selectedTemplate && (
                            <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" onClick={handleClose}>
                                <IconX size={24} stroke={2.5} />
                            </ActionIcon>
                        )}
                    </Group>
                </Box>

                <Box className="flex-1 overflow-hidden">
                    {selectedTemplate ? (
                        <DynamicRequestForm
                            template={selectedTemplate}
                            onBack={() => setSelectedTemplate(null)}
                            onSuccess={handleClose}
                        />
                    ) : (
                        <Stack gap={0} h="100%">
                            <Box p={32} pb={16}>
                                <TextInput
                                    placeholder="Tìm kiếm thủ tục (ví dụ: cấp lại thẻ, xin nghỉ...)"
                                    leftSection={<IconSearch size={20} className="text-gray-400" />}
                                    radius="12px"
                                    size="lg"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                                    styles={{ input: { background: '#f8fafc', border: 'none', height: '56px' } }}
                                />
                            </Box>

                            <ScrollArea className="flex-1" type="scroll">
                                <Box px={32} pb={32}>
                                    <Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={1.5} mb={20} mt={10}>Danh mục dịch vụ ({filteredTemplates.length})</Text>
                                    <SimpleGrid cols={isMobile ? 1 : 2} spacing="xl">
                                        {filteredTemplates.map((template: TQuyTrinh) => (
                                            <UnstyledButton
                                                key={template.id}
                                                className="group p-6 rounded-20px bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-indigo-200 hover:bg-indigo-50/10 transition-all"
                                                onClick={() => setSelectedTemplate(template)}
                                            >
                                                <Group justify="space-between" wrap="nowrap">
                                                    <Group gap="xl" wrap="nowrap">
                                                        <ThemeIcon
                                                            variant="light"
                                                            size={52}
                                                            radius="16px"
                                                            color="indigo"
                                                            className="group-hover:scale-110 transition-transform"
                                                        >
                                                            <IconFileDescription size={26} stroke={1.5} />
                                                        </ThemeIcon>
                                                        <div className="min-w-0">
                                                            <Text fw={850} size="md" className="text-gray-900 dark:text-gray-50 tracking-tight uppercase leading-snug">{template.ten}</Text>
                                                            <Text size="xs" c="dimmed" fw={600} className="line-clamp-1 mt-1 opacity-80">
                                                                {template.moTa || "Khởi tạo yêu cầu phê duyệt kỹ thuật số."}
                                                            </Text>
                                                            <Group gap={8} mt={12}>
                                                                <Badge size="xs" variant="outline" color="indigo" radius="sm" fw={850} h={22}>{template.cacBuoc?.length || 0} CHIỀU DUYỆT</Badge>
                                                                <Badge size="xs" variant="dot" color="gray" radius="sm" fw={850} h={22}>{template.danhMuc?.ten || "CHUNG"}</Badge>
                                                            </Group>
                                                        </div>
                                                    </Group>
                                                    <IconChevronRight size={24} stroke={3} className="text-gray-200 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                                </Group>
                                            </UnstyledButton>
                                        ))}
                                    </SimpleGrid>
                                </Box>
                            </ScrollArea>
                        </Stack>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
}

function DynamicRequestForm({ template, onBack, onSuccess }: { template: TQuyTrinh, onBack: () => void, onSuccess: () => void }) {
    const flowId = template.id;
    const { data: fields, isLoading } = AppQuery.approvals.useFormFields(flowId);
    const submitMutation = AppMutation().approvals.useSubmit();

    const [formData, setFormData] = useState<Record<string, string | number | boolean | null>>({});
    const [activeStep, setActiveStep] = useState(0);

    const hasSteps = Array.isArray(template.cacBuoc) && template.cacBuoc.length > 0;

    const handleSubmit = async () => {
        try {
            if (fields) {
                for (const field of fields) {
                    if (field.batBuoc && !formData[field.id]) {
                        notifications.show({ title: "Dữ liệu không hợp lệ", message: `Vui lòng hoàn thành: ${field.nhan}`, color: "red" });
                        return;
                    }
                }
            }

            if (!hasSteps) {
                notifications.show({ title: "Cảnh báo hệ thống", message: "Quy trình này chưa được thiết lập luồng phê duyệt.", color: "orange" });
                return;
            }

            await submitMutation.mutateAsync({
                flow_id: flowId,
                data: formData,
                target_id: null
            });

            notifications.show({ title: "Gửi yêu cầu thành công 🛰️", message: "Hồ sơ của bạn đang được truyền tải.", color: "indigo" });
            onSuccess();
        } catch (error: unknown) {
            const errorMsg = (error as any)?.response?.data?.message || "Không thể khởi tạo hồ sơ.";
            notifications.show({ title: "Lỗi kết nối", message: errorMsg, color: "red" });
        }
    };

    if (isLoading) return (
        <Stack align="center" justify="center" h="100%" p="xl">
            <LoadingOverlay visible={true} overlayProps={{ blur: 0 }} loaderProps={{ color: 'indigo', type: 'bars' }} />
        </Stack>
    );

    return (
        <Stack gap={0} h="100%" className="bg-white dark:bg-zinc-950">
            {/* Minimal Form Stepper */}
            <Box px={40} py={24} className="bg-gray-50/50 dark:bg-zinc-900/30 border-b border-gray-100 dark:border-zinc-800">
                <Stepper active={activeStep} onStepClick={setActiveStep} size="sm" color="indigo" radius="xl" allowNextStepsSelect={false}>
                    <Stepper.Step label={<Text fw={900} size="11px" tt="uppercase" lts={1.5}>Luồng truyền tải</Text>} />
                    <Stepper.Step label={<Text fw={900} size="11px" tt="uppercase" lts={1.5}>Khai báo dữ liệu</Text>} />
                </Stepper>
            </Box>

            <ScrollArea className="flex-1" p={40}>
                <div className="max-w-xl mx-auto">
                    {activeStep === 0 ? (
                        <Stack gap={32}>
                            <Box className="p-8 rounded-24px bg-gray-900 text-white shadow-xl">
                                <Title order={4} fw={850} className="tracking-tight uppercase mb-2">{template.ten}</Title>
                                <Text size="xs" fw={500} className="leading-relaxed opacity-70">
                                    {template.moTa || "Thủ tục hành chính được hỗ trợ tự động hóa."}
                                </Text>
                            </Box>

                            <Stack gap="xl">
                                <Group gap="xs">
                                    <Box className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                                    <Text fw={900} size="xs" tt="uppercase" lts={1.5} className="text-gray-900 dark:text-gray-100">Luồng xử lý hồ sơ</Text>
                                </Group>

                                <Box className="relative">
                                    <Stack gap={0}>
                                        {hasSteps ? template.cacBuoc?.map((b, index) => {
                                            const approver = b.nguoiDuyets?.[0];
                                            let approverName = "N/A";
                                            if (approver) {
                                                if (approver.loaiNguoiPheDuyet === 'VAI_TRO') {
                                                    approverName = approver.approverRole === 'GVCN' ? 'Giảng viên Chủ nhiệm' :
                                                        approver.approverRole === 'TRUONG_KHOA' ? 'Lãnh đạo Khoa' :
                                                            approver.approverRole === 'ADMIN' ? 'Ban Giám Hiệu' : (approver.approverRole || "N/A");
                                                } else if (approver.user) {
                                                    approverName = approver.user.hoTen || approver.user.email || "N/A";
                                                }
                                            }

                                            return (
                                                <Group key={b.id} wrap="nowrap" gap="xl" className="relative pb-10 last:pb-0">
                                                    {(template.cacBuoc && index < template.cacBuoc.length - 1) && (
                                                        <Box className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-indigo-100 dark:bg-zinc-800" />
                                                    )}
                                                    <Box className="w-10 h-10 rounded-14px bg-white dark:bg-zinc-900 border-2 border-indigo-600 flex items-center justify-center text-indigo-600 font-black text-xs shrink-0 z-10 shadow-sm">
                                                        {index + 1}
                                                    </Box>
                                                    <Box className="flex-1">
                                                        <Group justify="space-between" mb={4}>
                                                            <Text fw={850} size="sm" className="text-gray-900 dark:text-gray-100 uppercase tracking-tight leading-none">{b.ten}</Text>
                                                            <Badge size="xs" variant="light" color="indigo" radius="sm" fw={850}>P{index + 1}</Badge>
                                                        </Group>
                                                        <Text size="xs" fw={750} c="indigo" tt="uppercase" lts={0.5}>{approverName}</Text>
                                                        <Text size="11px" c="dimmed" fw={600} mt={6} className="opacity-80 italic">
                                                            {b.loaiQuyTac === 'TAT_CA' ? "■ Phê duyệt tập thể" : "■ Phê duyệt đơn phương"}
                                                        </Text>
                                                    </Box>
                                                </Group>
                                            );
                                        }) : (
                                            <Paper p="xl" radius="16px" className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-center">
                                                <Text size="xs" fw={850} c="red">KHÔNG CÓ DỮ LIỆU LUỒNG</Text>
                                            </Paper>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack gap={32}>
                            <Box>
                                <Title order={2} fw={850} className="tracking-tight mb-2">Thông tin đầu vào</Title>
                                <Text size="xs" fw={600} c="dimmed">Tính chính xác của thông tin ảnh hưởng trực tiếp đến kết quả phê duyệt.</Text>
                            </Box>

                            <Stack gap="xl">
                                {fields && fields.length > 0 ? fields.map((field: TTruongFormQuyTrinh) => {
                                    const commonProps = {
                                        label: <Text fw={850} size="xs" mb={8} className="uppercase tracking-widest text-gray-500">{field.nhan} {field.batBuoc && <span className="text-red-500">*</span>}</Text>,
                                        required: field.batBuoc,
                                        placeholder: `Nhập ${field.nhan.toLowerCase()}...`,
                                        size: "md",
                                        radius: "8px",
                                        styles: {
                                            input: {
                                                border: '1px solid var(--mantine-color-gray-200)',
                                                height: '48px',
                                                '&:focus': { border: '1px solid var(--mantine-color-indigo-600)' }
                                            }
                                        }
                                    };

                                    const handleChange = (val: string | number | boolean | null) => setFormData(prev => ({ ...prev, [field.id]: val }));

                                    switch (field.loai) {
                                        case LoaiTruongForm.TEXTAREA:
                                        case LoaiTruongForm.LONG_TEXT:
                                            return <Textarea key={field.id} {...commonProps} minRows={4} onChange={(e) => handleChange(e.currentTarget.value)} radius="12px" />;
                                        case LoaiTruongForm.NUMBER: return <NumberInput key={field.id} {...commonProps} onChange={handleChange} />;
                                        case LoaiTruongForm.DATE: return <TextInput key={field.id} type="date" {...commonProps} onChange={(e) => handleChange(e.currentTarget.value)} />;
                                        case LoaiTruongForm.SELECT: return <Select key={field.id} {...commonProps} data={field.tuyChon ? (typeof field.tuyChon === 'string' ? JSON.parse(field.tuyChon) : field.tuyChon) : []} onChange={handleChange} searchable clearable />;
                                        default: return <TextInput key={field.id} {...commonProps} onChange={(e) => handleChange(e.currentTarget.value)} />;
                                    }
                                }) : (
                                    <Box py={60} className="text-center bg-gray-50/50 rounded-24px border border-dashed border-gray-200">
                                        <Text fw={850} size="sm" c="gray">KHÔNG YÊU CẦU DỮ LIỆU BỔ SUNG</Text>
                                    </Box>
                                )}
                            </Stack>
                        </Stack>
                    )}
                </div>
            </ScrollArea>

            <Box px={32} py={24} className="border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
                <Group justify="space-between">
                    <Button
                        variant="subtle"
                        color="gray"
                        radius="100px"
                        fw={800}
                        onClick={activeStep === 0 ? onBack : () => setActiveStep(0)}
                    >
                        {activeStep === 0 ? "Huỷ bỏ" : "Quay lại"}
                    </Button>

                    <Button
                        variant="filled"
                        color="indigo"
                        radius="100px"
                        size="md"
                        h={48}
                        px={40}
                        fw={850}
                        disabled={!hasSteps}
                        onClick={activeStep === 0 ? () => setActiveStep(1) : handleSubmit}
                        loading={submitMutation.isPending}
                        rightSection={activeStep === 0 ? <IconChevronRight size={18} stroke={3} /> : <IconCheck size={18} stroke={3} />}
                        className="shadow-lg shadow-indigo-500/10"
                    >
                        {activeStep === 0 ? "Tiếp tục" : "Nộp hồ sơ"}
                    </Button>
                </Group>
            </Box>
        </Stack>
    );
}