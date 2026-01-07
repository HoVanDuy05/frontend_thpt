"use client";

import { useState } from "react";
import { Container, Stack, Title, Text, Button, Tabs, Card, Group, Badge, ThemeIcon, ActionIcon, Drawer, Box, Paper, LoadingOverlay, Select, TextInput, NumberInput, Textarea, ScrollArea, Stepper, Divider, SimpleGrid } from "@mantine/core";
import { IconPlus, IconFileDescription, IconClock, IconCheck, IconX, IconChevronRight, IconSearch, IconFilter, IconCalendar, IconUser } from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { useAppStore } from "@/providers/store/useAppStore";
import { dayjs } from "@/shared/utils/date.util";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";

export default function MyFlowPage() {
    const { user } = useAppStore();
    const [activeTab, setActiveTab] = useState<string | null>("all");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 48em)');

    // Queries
    const { data: myFlows, isLoading: isLoadingFlows } = AppQuery.approvals.useMyFlows();
    const { data: templates, isLoading: isLoadingTemplates } = AppQuery.approvals.useFlows();

    // Filter logic
    const filteredFlows = myFlows?.filter((flow: any) => {
        if (activeTab === "all") return true;
        if (activeTab === "pending") return flow.trangThai === "CHO_DUYET" || flow.trangThai === "DANG_XU_LY";
        if (activeTab === "approved") return flow.trangThai === "DA_DUYET";
        if (activeTab === "rejected") return flow.trangThai === "TU_CHOI";
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DA_DUYET': return 'green';
            case 'TU_CHOI': return 'red';
            case 'DANG_XU_LY': return 'blue';
            case 'CHO_DUYET': return 'yellow';
            default: return 'gray';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'DA_DUYET': return 'Đã duyệt';
            case 'TU_CHOI': return 'Từ chối';
            case 'DANG_XU_LY': return 'Đang xử lý';
            case 'CHO_DUYET': return 'Chờ duyệt';
            default: return status;
        }
    };

    return (
        <Box h="calc(100vh - 60px)" className="overflow-hidden flex flex-col bg-gray-50 dark:bg-zinc-950">
            {/* Minimal Header */}
            <Box className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 py-4 md:px-6 shrink-0">
                <Group justify="space-between" align="center">
                    <div>
                        <Title order={isMobile ? 4 : 3} fw={800} className="text-gray-900 dark:text-white">
                            Thủ tục hành chính
                        </Title>
                        <Text size="xs" c="dimmed" hidden={isMobile}>
                            Theo dõi và nộp các yêu cầu, đề xuất của bạn
                        </Text>
                    </div>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        radius="md"
                        color="indigo"
                        onClick={() => setIsDrawerOpen(true)}
                        size={isMobile ? "sm" : "md"}
                    >
                        Tạo yêu cầu
                    </Button>
                </Group>
            </Box>

            <Box className="flex-1 overflow-auto p-4 md:p-8 pb-24">
                <div className="max-w-6xl mx-auto flex flex-col gap-8">
                    {/* Stats Grid */}
                    {!isLoadingFlows && myFlows && (
                        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                            <Box className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase">Tổng số</Text>
                                <Text size="xl" fw={900} className="text-gray-900 dark:text-white">{myFlows.length}</Text>
                            </Box>
                            <Box className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                                <Text size="xs" c="blue" fw={700} tt="uppercase">Đang chờ</Text>
                                <Text size="xl" fw={900} c="blue">{myFlows.filter((f: any) => f.trangThai === 'CHO_DUYET' || f.trangThai === 'DANG_XU_LY').length}</Text>
                            </Box>
                            <Box className="p-4 rounded-2xl bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                                <Text size="xs" c="green" fw={700} tt="uppercase">Đã duyệt</Text>
                                <Text size="xl" fw={900} c="green">{myFlows.filter((f: any) => f.trangThai === 'DA_DUYET').length}</Text>
                            </Box>
                            <Box className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                                <Text size="xs" c="red" fw={700} tt="uppercase">Bị từ chối</Text>
                                <Text size="xl" fw={900} c="red">{myFlows.filter((f: any) => f.trangThai === 'TU_CHOI').length}</Text>
                            </Box>
                        </SimpleGrid>
                    )}

                    <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="xl" color="indigo">
                        <Group justify="space-between" mb="lg">
                            <Tabs.List className="bg-white dark:bg-zinc-900 p-1 border border-gray-100 dark:border-zinc-800 rounded-full shadow-sm">
                                <Tabs.Tab value="all" leftSection={<IconSearch size={14} />} px="xl">Tất cả</Tabs.Tab>
                                <Tabs.Tab value="pending" leftSection={<IconClock size={14} />} px="xl">Đang xử lý</Tabs.Tab>
                                <Tabs.Tab value="approved" leftSection={<IconCheck size={14} />} px="xl">Đã duyệt</Tabs.Tab>
                                <Tabs.Tab value="rejected" leftSection={<IconX size={14} />} px="xl">Từ chối</Tabs.Tab>
                            </Tabs.List>
                        </Group>

                        <Tabs.Panel value={activeTab || "all"}>
                            <Box className="relative min-h-[400px]">
                                <LoadingOverlay visible={isLoadingFlows} overlayProps={{ blur: 1, radius: 'md' }} loaderProps={{ type: 'bars', color: 'indigo' }} />
                                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                                    {filteredFlows && filteredFlows.length > 0 ? (
                                        filteredFlows.map((flow: any) => (
                                            <Card key={flow.id} withBorder radius="20px" p="xl" className="hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.1)] group border-gray-100 dark:border-zinc-800">
                                                <Stack gap="lg">
                                                    <Group justify="space-between" wrap="nowrap">
                                                        <Box className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                                                            <IconFileDescription size={28} stroke={1.5} />
                                                        </Box>
                                                        <Badge
                                                            variant="gradient"
                                                            gradient={{ from: getStatusColor(flow.trangThai), to: getStatusColor(flow.trangThai) === 'blue' ? 'cyan' : getStatusColor(flow.trangThai) === 'green' ? 'teal' : 'orange' }}
                                                            size="lg"
                                                            radius="md"
                                                            className="shadow-sm border-0"
                                                        >
                                                            {getStatusLabel(flow.trangThai)}
                                                        </Badge>
                                                    </Group>

                                                    <div>
                                                        <Text fw={800} size="lg" className="text-gray-900 dark:text-white line-clamp-1 mb-1">
                                                            {flow.tenFlow || flow.quyTrinh?.ten || "Yêu cầu hành chính"}
                                                        </Text>
                                                        <Group gap="xs">
                                                            <Badge variant="light" color="gray" size="xs" radius="xs" fw={700}>#{flow.id}</Badge>
                                                            <Text size="xs" c="dimmed" fw={500} className="flex items-center gap-1">
                                                                <IconCalendar size={12} />
                                                                {dayjs(flow.createdAt).format("DD/MM/YYYY")}
                                                            </Text>
                                                        </Group>
                                                    </div>

                                                    <Divider variant="dashed" className="opacity-50" />

                                                    <Group justify="space-between">
                                                        <Text size="xs" c="dimmed" fw={500}>Cập nhật {dayjs(flow.updatedAt).fromNow()}</Text>
                                                        <ThemeIcon variant="light" color="indigo" radius="md" size="md">
                                                            <IconChevronRight size={16} />
                                                        </ThemeIcon>
                                                    </Group>
                                                </Stack>
                                            </Card>
                                        ))
                                    ) : !isLoadingFlows && (
                                        <Box className="col-span-full">
                                            <Stack align="center" justify="center" py={120} className="border-[3px] border-dashed border-gray-100 dark:border-zinc-800 rounded-[3rem] bg-white/50 dark:bg-zinc-900/10 backdrop-blur-sm">
                                                <Box className="p-8 rounded-full bg-gradient-to-tr from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 mb-4 shadow-xl shadow-gray-200/50 dark:shadow-none">
                                                    <IconFileDescription size={64} stroke={1} className="text-indigo-200 dark:text-zinc-700" />
                                                </Box>
                                                <Title order={3} fw={900} mb={4} className="text-gray-900 dark:text-white">Bắt đầu hành trình mới</Title>
                                                <Text c="dimmed" fw={500} maw={400} ta="center" mb="xl">
                                                    Hệ thống chưa ghi nhận hồ sơ nào của bạn trong mục này. Hãy bắt đầu bằng cách tạo một yêu cầu mới.
                                                </Text>
                                                <Button
                                                    size="lg"
                                                    variant="gradient"
                                                    gradient={{ from: 'indigo', to: 'blue' }}
                                                    radius="xl"
                                                    px={40}
                                                    onClick={() => setIsDrawerOpen(true)}
                                                    leftSection={<IconPlus size={20} />}
                                                    className="shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-105 transition-transform"
                                                >
                                                    Tạo hồ sơ ngay
                                                </Button>
                                            </Stack>
                                        </Box>
                                    )}
                                </SimpleGrid>
                            </Box>
                        </Tabs.Panel>
                    </Tabs>
                </div>
            </Box>

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

function CreateRequestDrawer({ opened, onClose, templates }: { opened: boolean, onClose: () => void, templates: any[] }) {
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
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
            size={isMobile ? "100%" : "500px"}
            title={
                <Group gap="xs">
                    <ThemeIcon variant="light" color="indigo" radius="md">
                        <IconPlus size={18} />
                    </ThemeIcon>
                    <Text fw={800} size="lg">
                        {selectedTemplate ? "Chi tiết đề xuất" : "Chọn loại hồ sơ"}
                    </Text>
                </Group>
            }
            padding={0}
            styles={{
                header: { padding: '20px', borderBottom: '1px solid var(--mantine-color-gray-100)' },
                body: { height: 'calc(100% - 60px)', display: 'flex', flexDirection: 'column' }
            }}
        >
            {selectedTemplate ? (
                <DynamicRequestForm
                    template={selectedTemplate}
                    onBack={() => setSelectedTemplate(null)}
                    onSuccess={handleClose}
                />
            ) : (
                <Stack gap={0} className="flex-1 overflow-hidden">
                    <Box p="md" className="bg-gray-50 dark:bg-zinc-900/50">
                        <TextInput
                            placeholder="Tìm kiếm mẫu đơn, thủ tục..."
                            leftSection={<IconSearch size={16} />}
                            radius="md"
                            size="md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.currentTarget.value)}
                        />
                    </Box>

                    <ScrollArea className="flex-1" type="scroll">
                        <Stack p="md" gap="sm">
                            <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1} mb={4}>
                                Danh sách thủ tục hiện có ({filteredTemplates.length})
                            </Text>
                            {filteredTemplates.map(tpl => (
                                <Card
                                    key={tpl.id}
                                    withBorder
                                    radius="md"
                                    p="md"
                                    className="cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors bg-white dark:bg-zinc-900 group"
                                    onClick={() => setSelectedTemplate(tpl)}
                                >
                                    <Group justify="space-between" wrap="nowrap">
                                        <Group gap="md">
                                            <ThemeIcon
                                                variant="light"
                                                size={40}
                                                radius="md"
                                                color="indigo"
                                                className="group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40"
                                            >
                                                <IconFileDescription size={22} />
                                            </ThemeIcon>
                                            <div className="min-w-0">
                                                <Text fw={700} size="sm" className="text-gray-900 dark:text-white">{tpl.ten}</Text>
                                                <Text size="xs" c="dimmed" className="line-clamp-1">
                                                    {tpl.moTa || "Nhấn để bắt đầu điền thông tin"}
                                                </Text>
                                                <Group gap={8} mt={4}>
                                                    <Badge size="xs" variant="light" color="gray">
                                                        {tpl.cacBuoc?.length || 0} bước duyệt
                                                    </Badge>
                                                    <Badge size="xs" variant="light" color="indigo">
                                                        {tpl.danhMuc?.ten || "Liên ngành"}
                                                    </Badge>
                                                </Group>
                                            </div>
                                        </Group>
                                        <IconChevronRight size={18} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
                                    </Group>
                                </Card>
                            ))}
                        </Stack>
                    </ScrollArea>
                </Stack>
            )}
        </Drawer>
    );
}

function DynamicRequestForm({ template, onBack, onSuccess }: { template: any, onBack: () => void, onSuccess: () => void }) {
    const flowId = template.id;
    const { data: fields, isLoading } = AppQuery.approvals.useFormFields(flowId);
    const submitMutation = AppMutation().approvals.useSubmit();

    const [formData, setFormData] = useState<Record<string, any>>({});
    const [activeStep, setActiveStep] = useState(0);

    const hasSteps = Array.isArray(template.cacBuoc) && template.cacBuoc.length > 0;
    const hasFields = Array.isArray(fields) && fields.length > 0;

    const nextStep = () => setActiveStep((current) => (current < 1 ? current + 1 : current));
    const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

    const handleSubmit = async () => {
        try {
            if (fields) {
                for (const field of fields) {
                    if (field.batBuoc && !formData[field.id]) {
                        notifications.show({
                            title: "Thiếu thông tin",
                            message: `Vui lòng nhập ${field.nhan}`,
                            color: "red"
                        });
                        return;
                    }
                }
            }

            if (!hasSteps) {
                notifications.show({ title: "Lỗi quy trình", message: "Quy trình chưa có bước duyệt.", color: "red" });
                return;
            }

            await submitMutation.mutateAsync({
                flow_id: flowId,
                data: formData,
                target_id: null
            });

            notifications.show({ title: "Thành công", message: "Hồ sơ của bạn đã được gửi.", color: "green" });
            onSuccess();
        } catch (error: any) {
            notifications.show({
                title: "Lỗi hệ thống",
                message: error?.response?.data?.message || "Không thể gửi hồ sơ.",
                color: "red"
            });
        }
    };

    if (isLoading) return (
        <Stack align="center" justify="center" h="100%" p="xl">
            <LoadingOverlay visible={true} overlayProps={{ blur: 0 }} loaderProps={{ color: 'indigo', type: 'bars' }} />
            <Text size="sm" c="dimmed">Đang tải cấu hình...</Text>
        </Stack>
    );

    return (
        <Stack gap={0} h="100%" className="bg-gray-50/30 dark:bg-zinc-950/30">
            <Box p="md" className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
                <Stepper active={activeStep} onStepClick={setActiveStep} size="sm" color="indigo" radius="md">
                    <Stepper.Step label="Thông tin" description="Xem quy trình" />
                    <Stepper.Step label="Khai báo" description="Điền biểu mẫu" />
                </Stepper>
            </Box>

            <ScrollArea className="flex-1" p="md">
                <div className="max-w-2xl mx-auto">
                    {activeStep === 0 ? (
                        <Stack gap="xl" py="md">
                            <Box className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-100 dark:border-indigo-900/30">
                                <Text fw={800} size="xl" className="text-gray-900 dark:text-white mb-2">{template.ten}</Text>
                                <Text size="sm" c="dimmed" className="leading-relaxed">
                                    {template.moTa || "Quy trình hành chính chính thức dành cho sinh viên."}
                                </Text>
                            </Box>

                            <Paper withBorder radius="xl" p="xl" className="bg-white dark:bg-zinc-900 shadow-sm">
                                <Stack gap="lg">
                                    <Group gap="xs">
                                        <ThemeIcon variant="light" color="indigo" radius="md">
                                            <IconClock size={18} />
                                        </ThemeIcon>
                                        <Text fw={700} size="sm" tt="uppercase" lts={1} c="dimmed">Tiến trình phê duyệt</Text>
                                    </Group>

                                    <Stack gap="xs">
                                        {hasSteps ? template.cacBuoc.map((b: any, index: number) => {
                                            const approver = b.nguoiDuyets?.[0];
                                            let approverName = "Chưa xác định";
                                            if (approver) {
                                                if (approver.loaiNguoiPheDuyet === 'VAI_TRO') {
                                                    approverName = approver.approverRole === 'GVCN' ? 'Giáo viên Chủ nhiệm' :
                                                        approver.approverRole === 'TRUONG_KHOA' ? 'Trưởng Khoa' :
                                                            approver.approverRole === 'ADMIN' ? 'Quản trị viên' : approver.approverRole;
                                                } else if (approver.user) {
                                                    approverName = approver.user.hoTen || approver.user.email;
                                                }
                                            }

                                            return (
                                                <Group key={b.id} wrap="nowrap" gap="md" className="relative pb-8 last:pb-0">
                                                    {index < template.cacBuoc.length - 1 && (
                                                        <Box className="absolute left-[15px] top-8 bottom-0 w-[2.5px] bg-indigo-50 dark:bg-zinc-800" />
                                                    )}
                                                    <Box className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-lg shadow-indigo-200 dark:shadow-none z-10">
                                                        {index + 1}
                                                    </Box>
                                                    <Box className="flex-1 bg-gray-50/50 dark:bg-zinc-800/30 p-3 rounded-xl border border-gray-100 dark:border-zinc-800/50">
                                                        <Group justify="space-between" mb={2}>
                                                            <Text fw={800} size="sm" className="text-gray-900 dark:text-white uppercase tracking-tight">{b.ten}</Text>
                                                            <Badge size="xs" variant="dot" color="indigo">Bước {index + 1}</Badge>
                                                        </Group>
                                                        <Group gap="xs" mb={4}>
                                                            <IconUser size={12} className="text-indigo-500" />
                                                            <Text size="xs" fw={700} c="indigo">{approverName}</Text>
                                                        </Group>
                                                        <Text size="xs" c="dimmed" fw={500}>
                                                            {b.loaiQuyTac === 'TAT_CA' ? "Yêu cầu tất cả phê duyệt" : "Một người bất kỳ có thể phê duyệt"}
                                                        </Text>
                                                    </Box>
                                                </Group>
                                            );
                                        }) : (
                                            <Badge variant="light" color="red" size="lg" radius="md" p="md" fullWidth>
                                                Chưa cấu hình các bước duyệt
                                            </Badge>
                                        )}
                                    </Stack>
                                </Stack>
                            </Paper>

                            <Paper withBorder radius="xl" p="xl" className="bg-white dark:bg-zinc-900 shadow-sm">
                                <Stack gap="lg">
                                    <Group gap="xs">
                                        <ThemeIcon variant="light" color="orange" radius="md">
                                            <IconFileDescription size={18} />
                                        </ThemeIcon>
                                        <Text fw={700} size="sm" tt="uppercase" lts={1} c="dimmed">Thông tin bạn cần nộp</Text>
                                    </Group>

                                    <Group gap="sm">
                                        {hasFields ? fields.map((f: any) => (
                                            <Badge key={f.id} variant="outline" color="gray" py="md" px="lg" radius="md" fw={600}>
                                                {f.nhan}
                                            </Badge>
                                        )) : (
                                            <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>Quy trình này không yêu cầu điền thêm thông tin.</Text>
                                        )}
                                    </Group>
                                </Stack>
                            </Paper>
                        </Stack>
                    ) : (
                        <Stack gap="xl" py="md">
                            <Box>
                                <Title order={3} fw={800} className="text-gray-900 dark:text-white mb-1">Khai báo thông tin</Title>
                                <Text size="sm" c="dimmed">Vui lòng hoàn thành chính xác các nội dung dưới đây</Text>
                            </Box>

                            <Paper withBorder radius="xl" p="xl" className="bg-white dark:bg-zinc-900 shadow-sm">
                                <Stack gap="lg">
                                    {fields && fields.length > 0 ? fields.map((field: any) => {
                                        const commonProps = {
                                            label: <Text fw={700} size="sm" mb={4}>{field.nhan} {field.batBuoc && <span className="text-red-500">*</span>}</Text>,
                                            required: field.batBuoc,
                                            placeholder: field.moTa || `Nhập ${field.nhan.toLowerCase()}...`,
                                            size: "md",
                                            radius: "md",
                                        };

                                        const handleChange = (val: any) => setFormData(prev => ({ ...prev, [field.id]: val }));

                                        switch (field.loai) {
                                            case 'LONG_TEXT': return <Textarea key={field.id} {...commonProps} minRows={4} onChange={(e) => handleChange(e.currentTarget.value)} />;
                                            case 'NUMBER': return <NumberInput key={field.id} {...commonProps} onChange={handleChange} />;
                                            case 'DATE': return <TextInput key={field.id} type="date" {...commonProps} onChange={(e) => handleChange(e.currentTarget.value)} />;
                                            case 'SELECT': return <Select key={field.id} {...commonProps} data={field.tuyChon ? (typeof field.tuyChon === 'string' ? JSON.parse(field.tuyChon) : field.tuyChon) : []} onChange={handleChange} searchable clearable />;
                                            default: return <TextInput key={field.id} {...commonProps} onChange={(e) => handleChange(e.currentTarget.value)} />;
                                        }
                                    }) : (
                                        <Box py="xl" className="text-center">
                                            <IconCheck size={48} className="text-green-500 mx-auto mb-4 opacity-20" />
                                            <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>Không có thông tin bổ sung cần điền. Bạn có thể gửi hồ sơ ngay.</Text>
                                        </Box>
                                    )}
                                </Stack>
                            </Paper>
                        </Stack>
                    )}
                </div>
            </ScrollArea>

            <Box p="md" className="bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                <Group justify="space-between">
                    <Button variant="subtle" color="gray" onClick={activeStep === 0 ? onBack : prevStep} leftSection={<IconChevronRight size={16} className="rotate-180" />}>
                        {activeStep === 0 ? "Thoát" : "Quay lại"}
                    </Button>

                    {activeStep === 0 ? (
                        <Button
                            color="indigo"
                            radius="md"
                            disabled={!hasSteps}
                            onClick={nextStep}
                            rightSection={<IconChevronRight size={16} />}
                            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none"
                        >
                            Tiếp tục điền đơn
                        </Button>
                    ) : (
                        <Button
                            color="indigo"
                            radius="md"
                            onClick={handleSubmit}
                            loading={submitMutation.isPending}
                            leftSection={<IconCheck size={18} />}
                            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none"
                        >
                            Gửi hồ sơ ngay
                        </Button>
                    )}
                </Group>
            </Box>
        </Stack>
    );
}
