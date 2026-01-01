"use client";

import { useState } from "react";
import { Container, Stack, Title, Text, Button, Tabs, Card, Group, Badge, ThemeIcon, ActionIcon, Drawer, Box, Paper, LoadingOverlay, Select, TextInput, NumberInput, Textarea, ScrollArea } from "@mantine/core";
import { IconPlus, IconFileDescription, IconClock, IconCheck, IconX, IconChevronRight, IconSearch, IconFilter } from "@tabler/icons-react";
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
        <Container size="lg" className="py-4 pb-24">
            <Stack gap="lg">
                <Group justify="space-between" align="center">
                    <div>
                        <Title order={2} className="font-black mb-1">
                            Thủ tục hành chính
                        </Title>
                        <Text size="sm" c="dimmed">
                            Quản lý các yêu cầu và đơn từ
                        </Text>
                    </div>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        radius="xl"
                        onClick={() => setIsDrawerOpen(true)}
                        className="shadow-md"
                    >
                        Tạo yêu cầu
                    </Button>
                </Group>

                <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="xl">
                    <Tabs.List className="mb-4 overflow-x-auto flex-nowrap pb-1">
                        <Tabs.Tab value="all">Tất cả</Tabs.Tab>
                        <Tabs.Tab value="pending">Đang xử lý</Tabs.Tab>
                        <Tabs.Tab value="approved">Đã duyệt</Tabs.Tab>
                        <Tabs.Tab value="rejected">Từ chối</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value={activeTab || "all"}>
                        <Stack gap="md">
                            {isLoadingFlows ? (
                                <Text c="dimmed" ta="center">Đang tải...</Text>
                            ) : filteredFlows && filteredFlows.length > 0 ? (
                                filteredFlows.map((flow: any) => (
                                    <Card key={flow.id} withBorder radius="lg" padding="md" className="hover:border-indigo-500 transition-colors cursor-pointer">
                                        <Group justify="space-between" align="start" mb="xs">
                                            <Group gap="sm">
                                                <ThemeIcon size="lg" radius="md" variant="light" color="indigo">
                                                    <IconFileDescription size={20} />
                                                </ThemeIcon>
                                                <div>
                                                    <Text fw={700} className="line-clamp-1">{flow.tenFlow || "Yêu cầu không tên"}</Text>
                                                    <Text size="xs" c="dimmed">Mã đơn: #{flow.id}</Text>
                                                </div>
                                            </Group>
                                            <Badge color={getStatusColor(flow.trangThai)} variant="light">
                                                {getStatusLabel(flow.trangThai)}
                                            </Badge>
                                        </Group>

                                        <Group justify="space-between" align="center" mt="md">
                                            <Group gap="xs">
                                                <IconClock size={14} className="text-gray-400" />
                                                <Text size="xs" c="dimmed">
                                                    Gửi ngày: {dayjs(flow.createdAt).format("DD/MM/YYYY HH:mm")}
                                                </Text>
                                            </Group>
                                            <Button variant="subtle" size="xs" rightSection={<IconChevronRight size={14} />}>
                                                Chi tiết
                                            </Button>
                                        </Group>
                                    </Card>
                                ))
                            ) : (
                                <Stack align="center" py="xl" className="opacity-50">
                                    <IconFileDescription size={48} />
                                    <Text>Chưa có yêu cầu nào</Text>
                                </Stack>
                            )}
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Stack>

            <CreateRequestDrawer
                opened={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                templates={templates || []}
            />
        </Container>
    );
}

// --------------------------------------------------------------------------------------
// SUB-COMPONENTS
// --------------------------------------------------------------------------------------

function CreateRequestDrawer({ opened, onClose, templates }: { opened: boolean, onClose: () => void, templates: any[] }) {
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const isMobile = useMediaQuery('(max-width: 48em)');

    const handleClose = () => {
        setSelectedTemplate(null);
        onClose();
    };

    return (
        <Drawer
            opened={opened}
            onClose={handleClose}
            position="bottom"
            size={isMobile ? '100%' : 'lg'} // Full screen on mobile usually better for forms
            title={selectedTemplate ? "Chi tiết đơn từ" : "Chọn loại đơn từ"}
            padding="md"
            styles={{
                header: { borderBottom: '1px solid var(--mantine-color-gray-200)' },
                body: { padding: 0, height: 'calc(100% - 60px)', display: 'flex', flexDirection: 'column' }
            }}
        >
            {selectedTemplate ? (
                <DynamicRequestForm
                    flowId={selectedTemplate.id}
                    flowName={selectedTemplate.tenFlow}
                    onBack={() => setSelectedTemplate(null)}
                    onSuccess={handleClose}
                />
            ) : (
                <Stack p="md" gap="md" className="overflow-y-auto flex-1">
                    <TextInput
                        placeholder="Tìm kiếm mẫu đơn..."
                        leftSection={<IconSearch size={16} />}
                        radius="md"
                    />
                    <Text fw={700} size="sm" c="dimmed" className="uppercase">Danh sách mẫu đơn có sẵn</Text>
                    {templates.map(tpl => (
                        <Card
                            key={tpl.id}
                            withBorder
                            radius="md"
                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                            onClick={() => setSelectedTemplate(tpl)}
                        >
                            <Group justify="space-between">
                                <Group>
                                    <ThemeIcon variant="light" size="lg" radius="md" color="blue">
                                        <IconFileDescription size={20} />
                                    </ThemeIcon>
                                    <div>
                                        <Text fw={700}>{tpl.tenFlow}</Text>
                                        <Text size="xs" c="dimmed" className="line-clamp-1">
                                            {tpl.moTa || "Nhấn để tạo đơn mới"}
                                        </Text>
                                    </div>
                                </Group>
                                <IconChevronRight size={18} className="text-gray-400" />
                            </Group>
                        </Card>
                    ))}
                </Stack>
            )}
        </Drawer>
    );
}

function DynamicRequestForm({ flowId, flowName, onBack, onSuccess }: { flowId: number, flowName: string, onBack: () => void, onSuccess: () => void }) {
    const { data: fields, isLoading } = AppQuery.approvals.useFormFields(flowId);
    const submitMutation = AppMutation().approvals.useSubmit();

    // We can't use useForm properly with dynamic fields initially unless we know them.
    // Instead we'll manage local state or initialized useForm after loading.
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Safety check for empty or error state
    const hasFields = Array.isArray(fields) && fields.length > 0;

    const handleSubmit = async () => {
        try {
            // Basic validation
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

            const submissionData = {
                flow_id: flowId,
                data: JSON.stringify(formData), // Stringify data object as backend might expect JSON string or check DTO
                target_id: null
            };

            // Double check DTO type - older analysis said expected 'data'
            // If backend throws "Flow is not active", it means the flow status is wrong on server.
            // We can try to catch that specific error.

            await submitMutation.mutateAsync({
                flow_id: flowId,
                data: formData, // Send object, let axios handle it, or check if backend expects string
                target_id: null
            });

            notifications.show({
                title: "Thành công",
                message: "Đơn yêu cầu đã được gửi đi.",
                color: "green"
            });
            onSuccess();
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error.message;
            if (errorMsg === "Flow is not active") {
                notifications.show({
                    title: "Rất tiếc",
                    message: "Quy trình này hiện đang tạm ngưng hoặc chưa được kích hoạt.",
                    color: "orange"
                });
            } else {
                notifications.show({
                    title: "Lỗi",
                    message: "Không thể gửi đơn. Vui lòng thử lại.",
                    color: "red"
                });
            }
        }
    };

    if (isLoading) return (
        <Stack align="center" justify="center" h={300}>
            <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ color: 'indigo', type: 'bars' }} />
            <Text size="sm" c="dimmed" mt="xl">Đang tải biểu mẫu...</Text>
        </Stack>
    );

    if (!hasFields) return (
        <Stack align="center" justify="center" h={300}>
            <ThemeIcon size={60} radius="xl" color="gray" variant="light">
                <IconFileDescription size={32} />
            </ThemeIcon>
            <Text c="dimmed">Quy trình này chưa có biểu mẫu nhập liệu.</Text>
            <Button variant="light" onClick={onBack}>Quay lại</Button>
        </Stack>
    );

    return (
        <Stack h="100%" gap={0}>
            <Box className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                <Stack gap="xl">
                    {/* Header Info */}
                    <Paper shadow="xs" p="lg" radius="lg" className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800">
                        <Group>
                            <ThemeIcon size="xl" radius="md" color="indigo" variant="filled">
                                <IconFileDescription size={24} />
                            </ThemeIcon>
                            <div>
                                <Text fw={800} size="lg" className="text-indigo-900 dark:text-indigo-100">{flowName}</Text>
                                <Text size="sm" className="text-indigo-700 dark:text-indigo-200">Vui lòng điền đầy đủ thông tin bên dưới</Text>
                            </div>
                        </Group>
                    </Paper>

                    {/* Dynamic Inputs */}
                    <Stack gap="md">
                        {fields.map((field: any) => {
                            const commonProps = {
                                label: <Text fw={600} size="sm">{field.nhan} {field.batBuoc && <span className="text-red-500">*</span>}</Text>,
                                required: field.batBuoc,
                                description: field.moTa, // if any
                                withAsterisk: false, // Custom asterisk above
                                size: "md",
                                radius: "md",
                                className: "transition-all focus-within:translate-x-1"
                            };

                            const handleChange = (val: any) => setFormData(prev => ({ ...prev, [field.id]: val }));
                            const handleTextChange = (e: any) => handleChange(e.target.value);

                            // field.loai match from API: LONG_TEXT, TEXT, NUMBER, etc.
                            switch (field.loai) {
                                case 'TEXT':
                                case 'SHORT_TEXT':
                                    return (
                                        <TextInput
                                            key={field.id}
                                            {...commonProps}
                                            placeholder={`Nhập ${field.nhan.toLowerCase()}`}
                                            onChange={handleTextChange}
                                        />
                                    );
                                case 'LONG_TEXT':
                                case 'TEXTAREA':
                                    return (
                                        <Textarea
                                            key={field.id}
                                            {...commonProps}
                                            placeholder={`Nhập ${field.nhan.toLowerCase()} chi tiết`}
                                            minRows={4}
                                            onChange={handleTextChange}
                                        />
                                    );
                                case 'NUMBER':
                                    return (
                                        <NumberInput
                                            key={field.id}
                                            {...commonProps}
                                            placeholder="0"
                                            onChange={handleChange}
                                        />
                                    );
                                case 'DATE':
                                    return (
                                        <TextInput
                                            key={field.id}
                                            type="date"
                                            {...commonProps}
                                            onChange={handleTextChange}
                                        />
                                    );
                                case 'SELECT':
                                    return (
                                        <Select
                                            key={field.id}
                                            {...commonProps}
                                            data={field.tuyChon ? JSON.parse(field.tuyChon) : []}
                                            placeholder="Chọn giá trị"
                                            onChange={handleChange}
                                        />
                                    );
                                default:
                                    return (
                                        <TextInput
                                            key={field.id}
                                            {...commonProps}
                                            onChange={handleTextChange}
                                        />
                                    );
                            }
                        })}
                    </Stack>
                </Stack>
            </Box>

            {/* Footer Actions */}
            <Paper radius={0} className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Group justify="space-between">
                    <Button variant="subtle" color="gray" onClick={onBack} radius="xl">Quay lại</Button>
                    <Button
                        color="indigo"
                        size="md"
                        radius="xl"
                        loading={submitMutation.isPending}
                        onClick={handleSubmit}
                        leftSection={<IconCheck size={18} />}
                        className="shadow-md shadow-indigo-500/20"
                    >
                        Gửi hồ sơ
                    </Button>
                </Group>
            </Paper>
        </Stack>
    );
}
