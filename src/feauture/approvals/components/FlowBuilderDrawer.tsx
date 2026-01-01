"use client";

import React, { useEffect, useState } from 'react';
import { Drawer, Stack, TextInput, Textarea, Select, Group, Button, Text, Badge, ActionIcon, Divider, Box, rem, Switch, ScrollArea, UnstyledButton, Paper, ThemeIcon, Tooltip, SimpleGrid, LoadingOverlay, Tabs, Popover, ComboboxItem, OptionsFilter } from '@mantine/core';
import { IconPlus, IconTrash, IconArrowRight, IconUser, IconSettings, IconInfoCircle, IconFileDescription, IconCheck, IconX, IconGripVertical, IconForms, IconGitPullRequest, IconCategory, IconTemplate, IconDeviceFloppy, IconChevronRight } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { AppQuery } from '@/api/AppQuery';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';

interface FlowBuilderDrawerProps {
    opened: boolean;
    onClose: () => void;
    initialData?: any;
    onSave: (data: any) => void;
    loading?: boolean;
}

export function FlowBuilderDrawer({ opened, onClose, initialData, onSave, loading }: FlowBuilderDrawerProps) {
    const t = useTranslations('approvals.builder');
    const tRoles = useTranslations('approvals.roles');
    const tFields = useTranslations('approvals.fields');
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Queries & Mutations
    const { data: categoriesData, isLoading: loadingCategories, refetch: refetchCategories } = AppQuery.approvals.useCategories();
    const createCategoryMutation = AppMutation().approvals.useCreateCategory();

    // State
    const [name, setName] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [categoryId, setCategoryId] = React.useState<string | null>(null);
    const [activeTab, setActiveTab] = React.useState<string | null>('design');

    // Category Creation State
    const [searchValue, setSearchValue] = useState('');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    const [steps, setSteps] = React.useState<{ id: number, name: string, rule: 'all' | 'any', approverType: string, specificUser?: any }[]>([
        { id: 1, name: "Duyệt lần 1", rule: 'any', approverType: 'ROLE_GVCN' }
    ]);
    const [formFields, setFormFields] = React.useState<{ id: number, label: string, required: boolean, type: string, options?: string[] }[]>([
        { id: 1, label: "Lý do", required: true, type: 'TEXTAREA' }
    ]);

    // Reset form when opened
    useEffect(() => {
        if (opened && !initialData) {
            setName('');
            setDesc('');
            setCategoryId(null);
            setSteps([{ id: 1, name: "Duyệt lần 1", rule: 'any', approverType: 'ROLE_GVCN' }]);
            setFormFields([{ id: 1, label: "Lý do", required: true, type: 'LONG_TEXT' }]);
            setActiveTab('info');
        } else if (opened && initialData) {
            // Populate initial data logic here
        }
    }, [opened, initialData]);

    // Options
    const categoryOptions = categoriesData?.map((c: any) => ({ value: c.id.toString(), label: c.ten })) || [];

    const INPUT_TYPES = [
        { value: 'TEXT', label: tFields('text') },
        { value: 'LONG_TEXT', label: tFields('long_text') },
        { value: 'NUMBER', label: tFields('number') },
        { value: 'DATE', label: tFields('date') },
        { value: 'TIME', label: tFields('time') },
        { value: 'SELECT', label: tFields('select') },
        { value: 'CHECKBOX', label: tFields('checkbox') },
        { value: 'RADIO', label: tFields('radio') },
        { value: 'FILE', label: tFields('file') },
    ];

    // Handlers
    const addStep = () => {
        setSteps(prev => [...prev, { id: Date.now(), name: `Duyệt lần ${prev.length + 1}`, rule: 'any', approverType: 'ROLE_GVCN' }]);
    };

    const removeStep = (index: number) => {
        setSteps(prev => prev.filter((_, i) => i !== index));
    };

    const addField = () => {
        setFormFields(prev => [...prev, { id: Date.now(), label: `Trường mới ${prev.length + 1}`, required: false, type: 'TEXT' }]);
    };

    const removeField = (id: number) => {
        setFormFields(prev => prev.filter(f => f.id !== id));
    };

    const updateField = (id: number, key: keyof typeof formFields[0], value: any) => {
        setFormFields(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    // Fetch potential approvers (Teachers & Admins)
    const { data: usersData } = AppQuery.user.useList({ take: 1000 });

    // Filter and map users for Select options
    const approverOptions = React.useMemo(() => {
        if (!usersData) return [];
        return usersData
            .filter((u: any) => u.vaiTro === 'GIAO_VIEN' || u.vaiTro === 'ADMIN')
            .map((u: any) => ({
                value: u.id.toString(),
                label: `${u.hoTen || u.taiKhoan} (${u.vaiTro === 'ADMIN' ? 'Admin' : 'Giáo viên'})`
            }));
    }, [usersData]);

    const handleCreateCategory = async (query: string) => {
        setIsCreatingCategory(true);
        try {
            const res = await createCategoryMutation.mutateAsync({ ten: query, moTa: '' });
            notifications.show({ title: 'Thành công', message: 'Đã tạo danh mục mới', color: 'green' });
            await refetchCategories();
            setCategoryId(res.id.toString());
            setSearchValue(''); // Clear search to show selected value
        } catch (error) {
            notifications.show({ title: 'Lỗi', message: 'Không thể tạo danh mục', color: 'red' });
        } finally {
            setIsCreatingCategory(false);
        }
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            description: desc,
            category_id: categoryId ? Number(categoryId) : null,
            steps,
            fields: formFields
        });
    };

    // Custom filter for category select to include "Create" option
    const optionsFilter: OptionsFilter = ({ options, search }) => {
        const query = search.toLowerCase().trim();
        const parsedOptions = options as ComboboxItem[];
        const filtered = parsedOptions.filter((item) => item.label.toLowerCase().includes(query));

        const exactMatch = filtered.some((item) => item.label.toLowerCase() === query);
        if (query.length > 0 && !exactMatch) {
            return [...filtered, { value: '$create', label: query }];
        }
        return filtered;
    };

    // Render Helpers (Moved inside render to avoid recreation if they were components, or just use direct JSX)
    // To avoid focus loss, we simply render them directly in the main return or useMemo if strictly needed. 
    // But since they depend on state, direct JSX is best for this complexity.

    const renderInfoPanel = () => (
        <ScrollArea.Autosize mah="100%" type="scroll" offsetScrollbars scrollbarSize={6} className="h-full">
            <Stack p="xl" gap="xl" className="min-h-full pb-24">
                <Box>
                    <Group gap="xs" mb="lg">
                        <ThemeIcon color="indigo" variant="light" radius="md">
                            <IconInfoCircle size={18} />
                        </ThemeIcon>
                        <Text fw={700} size="sm" tt="uppercase" c="dimmed">{t('info_tab') || "Thông tin cơ bản"}</Text>
                    </Group>
                    <Stack gap="md">
                        <TextInput
                            label={t('name_label')}
                            placeholder="Ví dụ: Đơn xin nghỉ phép"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            size="md"
                            radius="md"
                            variant="filled"
                            className="transition-all focus-within:shadow-sm"
                            styles={{
                                input: { backgroundColor: 'var(--mantine-color-gray-0)' },
                                label: { fontWeight: 600, marginBottom: 8 }
                            }}
                        />
                        <Textarea
                            label={t('desc_label')}
                            placeholder="Mô tả mục đích của quy trình này..."
                            minRows={3}
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            size="md"
                            radius="md"
                            variant="filled"
                            styles={{
                                input: { backgroundColor: 'var(--mantine-color-gray-0)' },
                                label: { fontWeight: 600, marginBottom: 8 }
                            }}
                        />

                        <Select
                            label="Danh mục quy trình"
                            placeholder="Tìm kiếm hoặc tạo mới..."
                            size="md"
                            radius="md"
                            variant="filled"
                            data={categoryOptions}
                            value={categoryId}
                            onChange={(val) => {
                                if (val === '$create') {
                                    handleCreateCategory(searchValue);
                                } else {
                                    setCategoryId(val);
                                }
                            }}
                            searchable
                            nothingFoundMessage="Không tìm thấy danh mục"
                            onSearchChange={setSearchValue}
                            searchValue={searchValue}
                            rightSection={loadingCategories ? <LoadingOverlay visible /> : null}
                            clearable
                            filter={optionsFilter}
                            renderOption={({ option, checked }) => {
                                if (option.value === '$create') {
                                    return (
                                        <Group gap="xs">
                                            <ThemeIcon color="indigo" variant="light" size="sm">
                                                <IconPlus size={14} />
                                            </ThemeIcon>
                                            <Text size="sm">Tạo mới danh mục "<b>{option.label}</b>"</Text>
                                        </Group>
                                    );
                                }
                                return (
                                    <Group gap="xs">
                                        <IconCategory size={16} className="text-gray-400" />
                                        <Text size="sm">{option.label}</Text>
                                        {checked && <IconCheck size={16} className="ml-auto text-indigo-600" />}
                                    </Group>
                                );
                            }}
                            styles={{
                                input: { backgroundColor: 'var(--mantine-color-gray-0)' },
                                label: { fontWeight: 600, marginBottom: 8 }
                            }}
                        />
                        <Text size="xs" c="dimmed" mt={-8}>
                            * Nhập tên danh mục mới và chọn "Tạo mới..." để tạo nhanh.
                        </Text>
                    </Stack>
                </Box>

                <Divider />

                <Box>
                    <Group gap="xs" mb="lg" justify="space-between">
                        <Group gap="xs">
                            <ThemeIcon color="orange" variant="light" radius="md">
                                <IconForms size={18} />
                            </ThemeIcon>
                            <Text fw={700} size="sm" tt="uppercase" c="dimmed">Biểu mẫu (Form)</Text>
                        </Group>
                        <Button
                            variant="subtle"
                            color="indigo"
                            size="xs"
                            leftSection={<IconPlus size={16} />}
                            onClick={addField}
                        >
                            Thêm trường thông tin
                        </Button>
                    </Group>
                    <Stack gap="md">
                        {formFields.map((field, index) => (
                            <Paper
                                key={field.id}
                                withBorder
                                p="md"
                                radius="lg"
                                className="bg-white dark:bg-zinc-800 shadow-sm border-gray-200 dark:border-zinc-700 relative group"
                            >
                                <Box className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 group-hover:bg-indigo-400 transition-colors rounded-l-lg" />
                                <Stack gap="sm" pl="xs">
                                    <Group justify="space-between" wrap="nowrap">
                                        <Group gap="sm" className="flex-1">
                                            <ThemeIcon color="gray" variant="transparent" size="sm" className="cursor-grab text-gray-400 hover:text-gray-600">
                                                <IconGripVertical size={16} />
                                            </ThemeIcon>
                                            <TextInput
                                                value={field.label}
                                                onChange={(e) => updateField(field.id, 'label', e.target.value)}
                                                placeholder="Tên trường (Ví dụ: Lý do nghỉ)..."
                                                variant="unstyled"
                                                size="sm"
                                                className="flex-1 font-semibold"
                                                styles={{
                                                    input: { fontSize: 15 }
                                                }}
                                            />
                                        </Group>
                                        <ActionIcon
                                            color="red"
                                            variant="subtle"
                                            size="sm"
                                            onClick={() => removeField(field.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>

                                    <Divider variant="dashed" />

                                    <Group gap="md">
                                        <Select
                                            data={INPUT_TYPES}
                                            value={field.type}
                                            onChange={(val) => updateField(field.id, 'type', val)}
                                            size="xs"
                                            variant="filled"
                                            placeholder="Loại dữ liệu"
                                            className="w-32"
                                            allowDeselect={false}
                                        />
                                        <Switch
                                            label="Bắt buộc nhập"
                                            checked={field.required}
                                            onChange={(e) => updateField(field.id, 'required', e.currentTarget.checked)}
                                            size="xs"
                                        />
                                    </Group>
                                </Stack>
                            </Paper>
                        ))}

                        {formFields.length === 0 && (
                            <Paper p="xl" radius="lg" className="border-2 border-dashed border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                                <Stack align="center" gap="sm">
                                    <ThemeIcon size={48} radius="xl" variant="light" color="gray">
                                        <IconFileDescription size={24} />
                                    </ThemeIcon>
                                    <Text size="sm" c="dimmed" ta="center">
                                        Chưa có trường nào được cấu hình.<br />
                                        Nhấn <b>"Thêm trường thông tin"</b> để bắt đầu thiết kế form.
                                    </Text>
                                    <Button variant="light" size="xs" onClick={addField}>Thêm trường ngay</Button>
                                </Stack>
                            </Paper>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </ScrollArea.Autosize>
    );

    const renderDesignPanel = () => (
        <Box className="h-full flex flex-col relative overflow-hidden bg-gray-50/50 dark:bg-zinc-900/50">
            <Box className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <Box p="md" className="border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm z-10 flex justify-between items-center shrink-0">
                <Group>
                    <ThemeIcon variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} radius="lg">
                        <IconGitPullRequest size={18} />
                    </ThemeIcon>
                    <Stack gap={0}>
                        <Text fw={700} size="sm">Thiết kế luồng duyệt</Text>
                        <Text size="xs" c="dimmed">Kéo thả hoặc thêm bước để cấu hình</Text>
                    </Stack>
                </Group>
                <Button size="xs" variant="filled" color="indigo" leftSection={<IconPlus size={14} />} onClick={addStep}>Thêm bước duyệt</Button>
            </Box>

            <Box className="flex-1 overflow-auto">
                <Box className="min-w-[800px] min-h-full relative bg-gray-50/30 dark:bg-zinc-900/30">
                    {/* Infinite Grid Background */}
                    <Box className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px', width: '200%', height: '200%' }} />

                    <Box p="xl" className="min-w-fit min-h-full flex items-center md:items-start z-10 relative pb-32">
                        <Box className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-0 pl-10 pr-20 py-20 min-w-[600px]">

                            {/* START NODE */}
                            <Box className="flex flex-col md:flex-row items-center relative z-10 group">
                                <Box className="w-[180px] p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm flex flex-col items-center gap-3 relative hover:shadow-md hover:border-indigo-300 transition-all cursor-default relative">
                                    <Box className="absolute -top-3 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-100 dark:border-indigo-800 tracking-wider">BẮT ĐẦU</Box>
                                    <ThemeIcon size={42} radius="full" color="indigo" variant="light">
                                        <IconUser size={20} />
                                    </ThemeIcon>
                                    <Box className="text-center">
                                        <Text size="sm" fw={700}>Người tạo đơn</Text>
                                        <Text size="10px" c="dimmed">Nhân viên / Giáo viên</Text>
                                    </Box>
                                </Box>

                                {/* Connector */}
                                <Box className="h-8 w-px md:h-px md:w-12 bg-gray-300 my-2 md:my-0 relative">
                                    <IconChevronRight size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 bg-gray-50 dark:bg-zinc-900 rounded-full" />
                                </Box>
                            </Box>

                            {/* STEPS LOOP */}
                            <Box className="flex flex-col md:flex-row gap-4 md:ml-0 items-center">
                                {steps.map((step, index) => (
                                    <React.Fragment key={step.id}>
                                        <Box className="w-[280px] bg-white dark:bg-zinc-800 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-zinc-700 overflow-hidden group hover:border-indigo-400 hover:ring-2 hover:ring-indigo-100 dark:hover:ring-indigo-900 transition-all flex flex-col shrink-0">
                                            <Box className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 w-full" />
                                            <Box p="md">
                                                <Group justify="space-between" mb="sm">
                                                    <Badge variant="light" color="indigo" radius="md">BƯỚC {index + 1}</Badge>
                                                    <ActionIcon color="red" variant="subtle" size="sm" onClick={() => removeStep(index)} radius="xl">
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Group>

                                                <Stack gap="xs">
                                                    <TextInput
                                                        placeholder="Tên bước"
                                                        value={step.name}
                                                        onChange={(e) => {
                                                            const newSteps = [...steps];
                                                            newSteps[index].name = e.target.value;
                                                            setSteps(newSteps);
                                                        }}
                                                        variant="unstyled"
                                                        fw={700}
                                                        className="border-b border-gray-100 focus-within:border-indigo-300 transition-colors"
                                                        styles={{ input: { fontSize: 15 } }}
                                                    />
                                                    <Select
                                                        label="Người duyệt"
                                                        data={approverOptions}
                                                        placeholder="Chọn người duyệt..."
                                                        searchable
                                                        nothingFoundMessage="Không tìm thấy"
                                                        value={step.approverType}
                                                        onChange={(val) => {
                                                            if (val) {
                                                                const newSteps = [...steps];
                                                                newSteps[index].approverType = val;
                                                                setSteps(newSteps);
                                                            }
                                                        }}
                                                        size="sm"
                                                        radius="md"
                                                        leftSection={<IconUser size={14} />}
                                                        className="mt-1"
                                                    />
                                                </Stack>
                                            </Box>
                                            <Box p="xs" bg="var(--mantine-color-gray-0)" className="border-t border-gray-100 dark:border-zinc-700 flex justify-center">
                                                <Text size="10px" c="dimmed" fw={600} tt="uppercase" className="flex items-center gap-1">
                                                    <IconGitPullRequest size={12} />
                                                    Quy tắc: Duyệt bất kỳ
                                                </Text>
                                            </Box>
                                        </Box>

                                        {/* Connector Loop */}
                                        <Box className="flex flex-col md:flex-row items-center">
                                            <Box className="h-8 w-px md:h-px md:w-12 bg-gray-300 my-2 md:my-0 relative">
                                                <IconChevronRight size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 bg-gray-50 dark:bg-zinc-900 rounded-full" />
                                            </Box>
                                        </Box>

                                    </React.Fragment>
                                ))}

                                {/* ADD BUTTON END */}
                                <Tooltip label="Thêm bước tiếp theo">
                                    <UnstyledButton onClick={addStep} className="self-center shrink-0 group">
                                        <Box className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 dark:border-zinc-600 flex items-center justify-center text-gray-400 group-hover:border-indigo-500 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all bg-white dark:bg-zinc-800 shadow-sm">
                                            <IconPlus size={24} />
                                        </Box>
                                    </UnstyledButton>
                                </Tooltip>

                                {/* Connector to end */}
                                <Box className="flex flex-col md:flex-row items-center">
                                    <Box className="h-8 w-px md:h-px md:w-12 bg-gray-300 my-2 md:my-0 relative">
                                        <IconChevronRight size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 bg-gray-50 dark:bg-zinc-900 rounded-full" />
                                    </Box>
                                </Box>

                            </Box>

                            {/* END NODE */}
                            <Box className="flex flex-col md:flex-row gap-4 items-center self-center h-auto md:h-[200px] shrink-0">
                                <Box className="flex flex-col items-center">
                                    <ThemeIcon size={56} radius="full" color="green" variant="gradient" gradient={{ from: 'teal', to: 'green' }} className="shadow-lg shadow-green-200 dark:shadow-none">
                                        <IconCheck size={28} />
                                    </ThemeIcon>
                                    <Text size="xs" fw={700} mt="sm" c="green" tt="uppercase" lts={1}>Hoàn tất</Text>
                                </Box>
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            position="right"
            size={isMobile ? "100%" : "90%"}
            title={null} // Custom header
            withCloseButton={false}
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            styles={{
                content: { display: 'flex', flexDirection: 'column', backgroundColor: 'var(--mantine-color-body)' },
                body: { padding: 0, flex: 1, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }
            }}
        >
            {/* Custom Header */}
            <Box px="xl" py="md" className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
                <Group justify="space-between">
                    <Group>
                        <ThemeIcon size="xl" radius="md" color="indigo" variant="gradient" gradient={{ from: 'indigo', to: 'violet', deg: 45 }}>
                            <IconTemplate size={24} stroke={2} color="white" />
                        </ThemeIcon>
                        <Stack gap={0}>
                            <Text fw={800} size="lg" className="text-gray-900 dark:text-gray-100">{t('title') || "Trình tạo quy trình"}</Text>
                            <Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={1}>{t('subtitle') || "Thiết kế luồng & biểu mẫu"}</Text>
                        </Stack>
                    </Group>
                    <ActionIcon variant="subtle" color="gray" onClick={onClose} size="lg" radius="xl">
                        <IconX size={24} />
                    </ActionIcon>
                </Group>
            </Box>

            <form className="flex flex-col flex-1 overflow-hidden" onSubmit={handleSubmit}>

                {isMobile ? (
                    <Tabs value={activeTab} onChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden" styles={{ panel: { flex: 1, overflow: 'hidden' } }}>
                        <Tabs.List grow>
                            <Tabs.Tab value="info" leftSection={<IconInfoCircle size={16} />}>Thông tin</Tabs.Tab>
                            <Tabs.Tab value="design" leftSection={<IconGitPullRequest size={16} />}>Quy trình</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="info" className="flex-1 overflow-hidden relative">
                            {renderInfoPanel()}
                        </Tabs.Panel>

                        <Tabs.Panel value="design" className="flex-1 overflow-hidden relative">
                            {renderDesignPanel()}
                        </Tabs.Panel>
                    </Tabs>
                ) : (
                    <Box className="flex-1 flex flex-row overflow-hidden h-full">
                        <Box className="w-[420px] border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0 flex flex-col overflow-hidden h-full">
                            {renderInfoPanel()}
                        </Box>
                        <Box className="flex-1 flex flex-col overflow-hidden bg-gray-50/50 h-full">
                            {renderDesignPanel()}
                        </Box>
                    </Box>
                )}

                <Box p="md" className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-50 shrink-0">
                    <Group justify="flex-end">
                        <Button variant="default" onClick={onClose} disabled={loading} radius="md">{t('cancel') || "Hủy"}</Button>
                        <Button
                            color="indigo"
                            loading={loading}
                            type="submit"
                            size="md"
                            radius="md"
                            leftSection={<IconDeviceFloppy size={18} />}
                            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all"
                        >
                            {t('submit') || "Lưu quy trình"}
                        </Button>
                    </Group>
                </Box>
            </form >
        </Drawer >
    );
}
