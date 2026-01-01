"use client";

import { useState } from "react";
import { Container, Stack, Title, Text, Button, Tabs, Card, Group, Badge, ThemeIcon, ActionIcon, Drawer, Box, LoadingOverlay, Select, TextInput, NumberInput, Textarea, ScrollArea } from "@mantine/core";
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

    const handleSubmit = async () => {
        try {
            // Transform data to expected submission format
            // API likely expects: { flowId: number, values: { fieldId: value, ... } }
            // Let's assume the mutation handles the URL structure.
            // Wait, looking at AppMutation useSubmit: url: { baseUrl: "/submit-flow" }
            // So it posts a body.

            const submissionData = {
                flow_id: flowId,
                data: formData, // Send raw key-value pair { [fieldId]: value }
                target_id: null
            };

            await submitMutation.mutateAsync(submissionData);
            notifications.show({
                title: "Thành công",
                message: "Đơn yêu cầu đã được gửi đi.",
                color: "green"
            });
            onSuccess();
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể gửi đơn. Vui lòng thử lại.",
                color: "red"
            });
        }
    };

    if (isLoading) return <Box p="xl" className="flex justify-center"><Text>Đang tải biểu mẫu...</Text></Box>;
    if (!fields || fields.length === 0) return <Box p="xl"><Text c="dimmed">Không có trường nhập liệu nào.</Text></Box>;

    return (
        <Stack h="100%" gap={0}>
            <Box className="flex-1 overflow-y-auto p-4">
                <Stack gap="lg">
                    {/* Header Info */}
                    <Box className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                        <Group>
                            <IconFileDescription size={24} className="text-blue-600" />
                            <div>
                                <Text fw={700} size="lg" className="text-blue-900 dark:text-blue-100">{flowName}</Text>
                                <Text size="sm" className="text-blue-700 dark:text-blue-200">Vui lòng điền đầy đủ thông tin bên dưới</Text>
                            </div>
                        </Group>
                    </Box>

                    {/* Dynamic Inputs */}
                    {fields.map((field: any) => {
                        const commonProps = {
                            label: field.label,
                            required: field.batBuoc,
                            description: field.moTa, // if any
                            // Using field.id as key for formData
                            onChange: (val: any) => setFormData(prev => ({ ...prev, [field.id]: val })),
                        };

                        // Handle input change for events vs values
                        const handleTextChange = (e: any) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }));

                        switch (field.loaiField) {
                            case 'TEXT':
                            case 'SHORT_TEXT':
                                return (
                                    <TextInput
                                        key={field.id}
                                        {...commonProps}
                                        onChange={handleTextChange}
                                        placeholder={`Nhập ${field.label.toLowerCase()}`}
                                    />
                                );
                            case 'LONG_TEXT':
                            case 'TEXTAREA':
                                return (
                                    <Textarea
                                        key={field.id}
                                        {...commonProps}
                                        onChange={handleTextChange}
                                        placeholder={`Nhập ${field.label.toLowerCase()}`}
                                        minRows={3}
                                    />
                                );
                            case 'NUMBER':
                                return (
                                    <NumberInput
                                        key={field.id}
                                        {...commonProps}
                                        onChange={(val) => setFormData(prev => ({ ...prev, [field.id]: val }))}
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
                            // Add Select case if needed, assuming backend provides options in field definition
                            case 'SELECT':
                                return (
                                    <Select
                                        key={field.id}
                                        {...commonProps}
                                        data={field.options ? JSON.parse(field.options) : []}
                                        onChange={(val) => setFormData(prev => ({ ...prev, [field.id]: val }))}
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
            </Box>

            {/* Footer Actions */}
            <Box className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <Group justify="space-between">
                    <Button variant="default" onClick={onBack}>Quay lại</Button>
                    <Button
                        color="indigo"
                        loading={submitMutation.isPending}
                        onClick={handleSubmit}
                    >
                        Gửi yêu cầu
                    </Button>
                </Group>
            </Box>
        </Stack>
    );
}
