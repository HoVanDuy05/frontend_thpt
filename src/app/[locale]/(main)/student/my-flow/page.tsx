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
    IconActivity, IconExternalLink, IconSearch
} from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { TPhienQuyTrinh, TQuyTrinh, TTruongFormQuyTrinh, LoaiTruongForm } from "@/shared/types/approval.type";
import { useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";

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

    const rows = filteredFlows?.map((flow: TPhienQuyTrinh) => {
        const config = getStatusConfig(flow.trangThai);
        return (
            <Table.Tr
                key={flow.id}
                className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors group"
                onClick={() => router.push(`./my-flow/${flow.id}`)}
            >
                <Table.Td>
                    <Text fw={750} size="sm" className="text-gray-400 font-mono">#{flow.id}</Text>
                </Table.Td>
                <Table.Td>
                    <Stack gap={2}>
                        <Text fw={850} size="sm" className="text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                            {flow.quyTrinh?.ten || "Yêu cầu hành chính"}
                        </Text>
                        <Text size="xs" c="dimmed" fw={600} className="line-clamp-1">
                            {flow.quyTrinh?.danhMuc?.ten || "Dịch vụ công"}
                        </Text>
                    </Stack>
                </Table.Td>
                <Table.Td>
                    <Badge variant="dot" color={config.color} size="md" radius="sm" fw={850} tt="uppercase" lts={0.5} className="h-7 px-3">
                        {config.label}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Group gap="xs">
                        <IconCalendar size={14} className="text-gray-400" />
                        <Text size="sm" fw={650} className="text-gray-600 dark:text-gray-400">
                            {dayjs(flow.ngayTao).format("DD/MM/YYYY")}
                        </Text>
                    </Group>
                </Table.Td>
                <Table.Td>
                    <Text size="xs" fw={700} c="dimmed" ta="right">
                        {dayjs(flow.ngayCapNhat || flow.ngayTao).fromNow()}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Group justify="flex-end">
                        <ActionIcon variant="subtle" color="gray" radius="xl" className="group-hover:text-indigo-600 group-hover:bg-indigo-50/50">
                            <IconExternalLink size={18} stroke={2.5} />
                        </ActionIcon>
                    </Group>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Box h="calc(100vh - 60px)" className="flex flex-col bg-[#fcfcfd] dark:bg-[#09090b] translate-z-0">
            {/* Ultra-Slim Navigation Bar */}
            <Box h={72} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800/50 px-6 md:px-10 flex items-center shrink-0 z-40">
                <Group justify="space-between" className="w-full max-w-7xl mx-auto">
                    <Group gap="xl">
                        <Group gap="sm">
                            <Box className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                                <IconFiles size={20} stroke={2} />
                            </Box>
                            <div>
                                <Title order={4} fw={850} className="tracking-tight text-gray-900 dark:text-gray-50 leading-none">Smart Portal</Title>
                                <Text size="10px" fw={750} tt="uppercase" lts={1.2} className="text-indigo-600 dark:text-indigo-400 mt-0.5">Hệ thống hồ sơ</Text>
                            </div>
                        </Group>
                    </Group>

                    <Group gap="md">
                        <Button
                            leftSection={<IconPlus size={18} stroke={2.5} />}
                            variant="filled"
                            color="indigo"
                            radius="100px"
                            h={42}
                            px={24}
                            onClick={() => setIsDrawerOpen(true)}
                            className="shadow-[0_8px_16px_-4px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_20px_-4px_rgba(79,70,229,0.4)] transition-all active:scale-95 fw-800"
                        >
                            Tạo yêu cầu
                        </Button>
                    </Group>
                </Group>
            </Box>

            <ScrollArea className="flex-1" type="scroll">
                <Box className="max-w-7xl mx-auto p-6 md:p-10 pb-32">
                    <Stack gap={40}>
                        {/* Summary Section */}
                        {!isLoadingFlows && myFlows && (
                            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                                {[
                                    { label: 'Tất cả hồ sơ', value: myFlows.length, color: 'gray', trend: 'Lưu trữ' },
                                    { label: 'Đang xử lý', value: myFlows.filter((f: TPhienQuyTrinh) => f.trangThai === 'CHO_DUYET').length, color: 'blue', trend: 'Hành động' },
                                    { label: 'Đã hoàn tất', value: myFlows.filter((f: TPhienQuyTrinh) => f.trangThai === 'DA_DUYET').length, color: 'teal', trend: 'Kết thúc' },
                                    { label: 'Bị từ chối', value: myFlows.filter((f: TPhienQuyTrinh) => f.trangThai === 'TU_CHOI').length, color: 'red', trend: 'Kiểm tra' },
                                ].map((s, i) => (
                                    <Paper key={i} withBorder radius="16px" p="xl" className="border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 group">
                                        <Text size="xs" fw={750} c="dimmed" tt="uppercase" lts={1} mb={4}>{s.label}</Text>
                                        <Group align="flex-end" gap="xs">
                                            <Text size="32px" fw={900} className="text-gray-900 dark:text-white tabular-nums leading-none">{s.value}</Text>
                                            <Badge variant="light" color={s.color} size="xs" radius="sm" fw={800} px={6} className="h-5 leading-none">{s.trend}</Badge>
                                        </Group>
                                    </Paper>
                                ))}
                            </SimpleGrid>
                        )}

                        <Box>
                            <Stack gap="xl">
                                <Group justify="space-between" align="center">
                                    <Tabs value={activeTab} onChange={setActiveTab} variant="unstyled">
                                        <Tabs.List className="bg-gray-100/60 dark:bg-zinc-800/50 p-1.2 rounded-14px flex gap-1">
                                            {[
                                                { value: 'all', label: 'Tất cả' },
                                                { value: 'pending', label: 'Đang xử lý' },
                                                { value: 'approved', label: 'Đã duyệt' },
                                                { value: 'rejected', label: 'Từ chối' },
                                            ].map((t) => (
                                                <Tabs.Tab
                                                    key={t.value}
                                                    value={t.value}
                                                    className={`px-6 py-2 rounded-10px text-sm fw-750 transition-all ${activeTab === t.value ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                                >
                                                    {t.label}
                                                </Tabs.Tab>
                                            ))}
                                        </Tabs.List>
                                    </Tabs>

                                    <Box w={{ base: '100%', sm: 300 }}>
                                        <TextInput
                                            placeholder="Tìm kiếm theo tên, mã..."
                                            leftSection={<IconSearch size={18} className="text-gray-400" />}
                                            radius="100px"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.currentTarget.value)}
                                            styles={{ input: { background: 'white', border: '1px solid var(--mantine-color-gray-100)' } }}
                                        />
                                    </Box>
                                </Group>

                                <Paper withBorder radius="24px" className="border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <Table verticalSpacing="lg" horizontalSpacing="xl" highlightOnHover={false}>
                                            <Table.Thead className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                                                <Table.Tr>
                                                    <Table.Th className="text-xs fw-850 uppercase lts={1} text-gray-400">Mã số</Table.Th>
                                                    <Table.Th className="text-xs fw-850 uppercase lts={1} text-gray-400">Tên yêu cầu</Table.Th>
                                                    <Table.Th className="text-xs fw-850 uppercase lts={1} text-gray-400">Trạng thái</Table.Th>
                                                    <Table.Th className="text-xs fw-850 uppercase lts={1} text-gray-400">Ngày tạo</Table.Th>
                                                    <Table.Th className="text-xs fw-850 uppercase lts={1} text-gray-400 text-right">Cập nhật</Table.Th>
                                                    <Table.Th />
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {isLoadingFlows ? (
                                                    <Table.Tr>
                                                        <Table.Td colSpan={6} p={0}>
                                                            <Box h={200} className="relative">
                                                                <LoadingOverlay visible={true} overlayProps={{ blur: 0 }} loaderProps={{ color: 'indigo', type: 'bars' }} />
                                                            </Box>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                ) : rows && rows.length > 0 ? rows : (
                                                    <Table.Tr>
                                                        <Table.Td colSpan={6}>
                                                            <Stack align="center" justify="center" py={100} className="opacity-60">
                                                                <IconFiles size={80} stroke={0.5} className="text-gray-300" />
                                                                <Text fw={750} size="xl" className="text-gray-400">Không tìm thấy hồ sơ nào</Text>
                                                                <Button variant="subtle" color="indigo" radius="xl" onClick={() => setIsDrawerOpen(true)}>Khởi tạo yêu cầu đầu tiên</Button>
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
            size={isMobile ? "100%" : "680px"}
            withCloseButton={false}
            padding={0}
            transitionProps={{ transition: 'slide-left', duration: 400, timingFunction: 'ease' }}
        >
            <Box h="100%" className="flex flex-col bg-white dark:bg-zinc-950">
                {/* Custom Drawer Header */}
                <Box px={32} py={24} className="border-b border-gray-100 dark:border-zinc-800 shrink-0">
                    <Group justify="space-between">
                        <Group gap="md">
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                radius="xl"
                                size="lg"
                                onClick={selectedTemplate ? () => setSelectedTemplate(null) : handleClose}
                            >
                                <IconChevronLeft size={22} stroke={2.5} />
                            </ActionIcon>
                            <div>
                                <Title order={4} fw={850} className="tracking-tight">
                                    {selectedTemplate ? "Chi tiết đề xuất" : "Dịch vụ hành chính"}
                                </Title>
                                <Text size="xs" fw={700} c="dimmed" lts={0.5}>HỆ THỐNG PHÊ DUYỆT TỰ ĐỘNG</Text>
                            </div>
                        </Group>
                        {!selectedTemplate && (
                            <ActionIcon variant="light" color="red" radius="xl" size="xl" onClick={handleClose}>
                                <IconX size={20} stroke={2.5} />
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
            <Box px={32} py={20} className="bg-gray-50/50 dark:bg-zinc-900/30">
                <Stepper active={activeStep} onStepClick={setActiveStep} size="xs" color="indigo" radius="xl" allowNextStepsSelect={false}>
                    <Stepper.Step label={<Text fw={900} size="10px" tt="uppercase" lts={1}>Tiến trình</Text>} />
                    <Stepper.Step label={<Text fw={900} size="10px" tt="uppercase" lts={1}>Dữ liệu</Text>} />
                </Stepper>
            </Box>

            <ScrollArea className="flex-1" p={32}>
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