"use client";

import React, { useEffect, useState } from 'react';
import { Drawer, Stack, TextInput, Textarea, Select, Group, Button, Text, Badge, ActionIcon, Divider, Box, rem, Switch, ScrollArea, UnstyledButton, Paper, ThemeIcon, Tooltip, SimpleGrid, LoadingOverlay, Tabs, Popover } from '@mantine/core';
import { IconPlus, IconTrash, IconArrowRight, IconUser, IconSettings, IconInfoCircle, IconFileDescription, IconCheck, IconX, IconGripVertical, IconForms, IconGitPullRequest, IconCategory, IconTemplate, IconDeviceFloppy } from '@tabler/icons-react';
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
            // Populate initial data logic here (omitted for brevity as placeholder)
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
    const { data: usersData } = AppQuery.user.useList({ take: 1000 }); // Fetch enough users to filter

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

    const InfoPanel = () => (
        <ScrollArea.Autosize mah="calc(100vh - 200px)" type="scroll" offsetScrollbars scrollbarSize={6}>
            <Stack p="md" gap="lg" className="min-h-full">
                <Box>
                    <Group gap="xs" mb="md">
                        <IconInfoCircle size={18} className="text-indigo-600" />
                        <Text fw={700} size="sm" tt="uppercase" c="dimmed">Thông tin chung</Text>
                    </Group>
                    <Stack gap="md">
                        <TextInput
                            label={t('name_label')}
                            placeholder="Ví dụ: Nghỉ phép"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            size="md"
                            styles={{
                                label: { fontWeight: 600, marginBottom: 8 }
                            }}
                        />
                        <Textarea
                            label={t('desc_label')}
                            placeholder="Mô tả quy trình..."
                            minRows={3}
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            size="md"
                            styles={{
                                label: { fontWeight: 600, marginBottom: 8 }
                            }}
                        />
                        <Select
                            label="Danh mục quy trình"
                            placeholder="Chọn hoặc tạo mới..."
                            size="md"
                            data={(() => {
                                const exactMatch = categoryOptions.some(o => o.label.toLowerCase() === searchValue.toLowerCase());
                                if (searchValue.trim().length > 0 && !exactMatch) {
                                    return [...categoryOptions, { value: '$create', label: `+ Tạo mới "${searchValue}"` }];
                                }
                                return categoryOptions;
                            })()}
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
                            filter={({ options, search }) => {
                                const query = search.toLowerCase().trim();
                                return options.filter((item: any) => item.label.toLowerCase().includes(query) || item.value === '$create');
                            }}
                            styles={{
                                label: { fontWeight: 600, marginBottom: 8 }
                            }}
                        />
                    </Stack>
                </Box>

                <Divider />

                <Box>
                    <Group gap="xs" mb="md" justify="space-between">
                        <Group gap="xs">
                            <IconForms size={18} className="text-indigo-600" />
                            <Text fw={700} size="sm" tt="uppercase" c="dimmed">Biểu mẫu (Form)</Text>
                        </Group>
                        <Button
                            variant="light"
                            color="indigo"
                            size="xs"
                            leftSection={<IconPlus size={16} />}
                            onClick={addField}
                        >
                            Thêm trường
                        </Button>
                    </Group>
                    <Stack gap="sm">
                        {formFields.map((field, index) => (
                            <Paper
                                key={field.id}
                                withBorder
                                p="md"
                                radius="md"
                                className="bg-white dark:bg-zinc-800 hover:shadow-md transition-all border-gray-200 dark:border-zinc-700"
                            >
                                <Stack gap="sm">
                                    <Group justify="space-between" wrap="nowrap">
                                        <Group gap="xs" className="flex-1">
                                            <ThemeIcon color="gray" variant="light" size="md" className="cursor-grab">
                                                <IconGripVertical size={16} />
                                            </ThemeIcon>
                                            <TextInput
                                                value={field.label}
                                                onChange={(e) => updateField(field.id, 'label', e.target.value)}
                                                placeholder="Tên trường..."
                                                variant="unstyled"
                                                size="sm"
                                                className="flex-1"
                                                styles={{
                                                    input: { fontWeight: 600, fontSize: 14 }
                                                }}
                                            />
                                        </Group>
                                        <ActionIcon
                                            color="red"
                                            variant="subtle"
                                            size="sm"
                                            onClick={() => removeField(field.id)}
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>

                                    <Group gap="md" grow>
                                        <Select
                                            label="Loại trường"
                                            data={INPUT_TYPES}
                                            value={field.type}
                                            onChange={(val) => updateField(field.id, 'type', val)}
                                            size="sm"
                                            styles={{
                                                label: { fontSize: 12, fontWeight: 500, marginBottom: 4 }
                                            }}
                                        />
                                        <Box>
                                            <Text size="xs" fw={500} mb={4} c="dimmed">Tùy chọn</Text>
                                            <Switch
                                                label="Bắt buộc"
                                                checked={field.required}
                                                onChange={(e) => updateField(field.id, 'required', e.currentTarget.checked)}
                                                size="sm"
                                            />
                                        </Box>
                                    </Group>
                                </Stack>
                            </Paper>
                        ))}

                        {formFields.length === 0 && (
                            <Paper p="xl" radius="md" className="border-2 border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900">
                                <Stack align="center" gap="xs">
                                    <ThemeIcon size="xl" radius="xl" variant="light" color="gray">
                                        <IconFileDescription size={24} />
                                    </ThemeIcon>
                                    <Text size="sm" c="dimmed" ta="center">
                                        Chưa có trường nào. Nhấn "Thêm trường" để bắt đầu.
                                    </Text>
                                </Stack>
                            </Paper>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </ScrollArea.Autosize>
    );

    const DesignPanel = () => (
        <Box className="h-full flex flex-col relative overflow-hidden bg-gray-50/50 dark:bg-zinc-900/50">
            <Box className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <Box p="md" className="border-b border-gray-200 bg-white/50 backdrop-blur-sm z-10 flex justify-between items-center shrink-0">
                <Group>
                    <ThemeIcon variant="light" color="indigo" radius="md">
                        <IconGitPullRequest size={20} />
                    </ThemeIcon>
                    <Text fw={700} className="hidden sm:block">Thiết kế luồng duyệt</Text>
                </Group>
                <Button size="xs" variant="light" leftSection={<IconPlus size={14} />} onClick={addStep}>Thêm bước</Button>
            </Box>

            <Box className="flex-1 overflow-auto">
                <Box className="min-w-[800px] min-h-full relative bg-gray-50/50 dark:bg-zinc-900/50">
                    {/* Grid Pattern Background */}
                    <Box className="absolute inset-0 opacity-5 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px', width: '200%', height: '200%' }} />

                    <Box p="xl" className="min-w-fit min-h-full flex items-center md:items-start z-10 relative">
                        <Box className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-0 pl-10 pr-20 py-20 min-w-[600px]">

                            {/* START NODE */}
                            <Box className="flex flex-col md:flex-row items-center relative z-10">
                                <Box className="w-[200px] md:w-[240px] p-4 bg-white dark:bg-zinc-800 rounded-xl border-2 border-indigo-100 shadow-sm flex flex-col items-center gap-3 relative before:content-[''] before:absolute before:inset-0 before:border-2 before:border-indigo-500/10 before:rounded-xl hover:shadow-md transition-shadow cursor-default">
                                    <Badge size="lg" variant="dot" color="indigo">BẮT ĐẦU</Badge>
                                    <Group gap="sm">
                                        <ThemeIcon size="lg" radius="xl" color="indigo" variant="light">
                                            <IconUser size={20} />
                                        </ThemeIcon>
                                        <Box>
                                            <Text size="sm" fw={700}>Người tạo đơn</Text>
                                            <Text size="10px" c="dimmed">Nhân viên / Giáo viên</Text>
                                        </Box>
                                    </Group>
                                </Box>

                                {/* Connector */}
                                <Box className="h-8 w-2 md:h-2 md:w-8 bg-gray-200 my-2 md:my-0" />
                                <IconArrowRight className="text-gray-300 rotate-90 md:rotate-0 shrink-0" />
                                <Box className="h-8 w-2 md:h-2 md:w-8 bg-gray-200 my-2 md:my-0" />
                            </Box>

                            {/* STEPS LOOP */}
                            <Box className="flex flex-col md:flex-row gap-4 md:ml-0 items-center">
                                {steps.map((step, index) => (
                                    <React.Fragment key={step.id}>
                                        <Box className="w-[260px] md:w-[280px] bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 overflow-hidden group hover:border-indigo-300 transition-all flex flex-col shrink-0">
                                            <Box className="h-2 bg-indigo-500 w-full" />
                                            <Box p="md">
                                                <Group justify="space-between" mb="sm">
                                                    <Badge variant="light" color="indigo" radius="sm">BƯỚC {index + 1}</Badge>
                                                    <ActionIcon color="red" variant="subtle" size="sm" onClick={() => removeStep(index)}>
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Group>

                                                <Stack gap="sm">
                                                    <TextInput
                                                        label="Tên bước"
                                                        value={step.name}
                                                        onChange={(e) => {
                                                            const newSteps = [...steps];
                                                            newSteps[index].name = e.target.value;
                                                            setSteps(newSteps);
                                                        }}
                                                        fw={600}
                                                    />
                                                    <Select
                                                        label="Người duyệt"
                                                        data={approverOptions}
                                                        placeholder="Chọn người duyệt..."
                                                        searchable
                                                        nothingFoundMessage="Khong tìm thấy"
                                                        value={step.approverType}
                                                        onChange={(val) => {
                                                            if (val) {
                                                                const newSteps = [...steps];
                                                                newSteps[index].approverType = val;
                                                                setSteps(newSteps);
                                                            }
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>
                                            <Box p="xs" bg="var(--mantine-color-gray-0)" className="border-t border-gray-100 flex justify-center">
                                                <Text size="10px" c="dimmed" fw={600} tt="uppercase">Quy tắc: Duyệt bất kỳ</Text>
                                            </Box>
                                        </Box>

                                        {/* Connector Loop */}
                                        <Box className="flex flex-col md:flex-row items-center">
                                            <Box className="h-8 w-2 md:h-2 md:w-8 bg-gray-200 my-2 md:my-0" />
                                            <IconArrowRight className="text-gray-300 rotate-90 md:rotate-0 shrink-0" />
                                            <Box className="h-8 w-2 md:h-2 md:w-8 bg-gray-200 my-2 md:my-0" />
                                        </Box>

                                    </React.Fragment>
                                ))}

                                {/* ADD BUTTON END */}
                                <UnstyledButton onClick={addStep} className="self-center shrink-0">
                                    <Box className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all bg-white">
                                        <IconPlus size={24} />
                                    </Box>
                                </UnstyledButton>

                                {/* Connector to end */}
                                <Box className="flex flex-col md:flex-row items-center">
                                    <Box className="h-8 w-2 md:h-2 md:w-8 bg-gray-200 my-2 md:my-0" />
                                    <IconArrowRight className="text-gray-300 rotate-90 md:rotate-0 shrink-0" />
                                    <Box className="h-8 w-2 md:h-2 md:w-8 bg-gray-200 my-2 md:my-0" />
                                </Box>

                            </Box>

                            {/* END NODE */}
                            <Box className="flex flex-col md:flex-row gap-4 items-center self-center h-auto md:h-[200px] shrink-0">
                                <Box className="flex flex-col items-center">
                                    <ThemeIcon size={48} radius="xl" color="green" variant="light">
                                        <IconCheck size={24} />
                                    </ThemeIcon>
                                    <Text size="xs" fw={700} mt="xs" c="green">HOÀN TẤT</Text>
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
            title={
                <Group>
                    <ThemeIcon size="xl" radius="md" color="indigo" variant="gradient" gradient={{ from: 'indigo', to: 'violet', deg: 45 }}>
                        <IconForms size={24} stroke={2} color="white" />
                    </ThemeIcon>
                    <Stack gap={0}>
                        <Text fw={800} size="lg" className="text-indigo-950 dark:text-indigo-50">{t('title')}</Text>
                        <Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={1}>{t('subtitle')}</Text>
                    </Stack>
                </Group>
            }
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            styles={{
                header: { borderBottom: `${rem(1)} solid var(--mantine-color-default-border)`, paddingBottom: rem(16), paddingTop: rem(16) },
                content: { display: 'flex', flexDirection: 'column', backgroundColor: 'var(--mantine-color-gray-0)' },
                body: { padding: 0, flex: 1, overflow: 'hidden' }
            }}
        >
            <form className="h-full flex flex-col overflow-hidden" onSubmit={handleSubmit}>

                {isMobile ? (
                    <Tabs value={activeTab} onChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden" styles={{ panel: { flex: 1, overflow: 'hidden' } }}>
                        <Tabs.List grow>
                            <Tabs.Tab value="info" leftSection={<IconInfoCircle size={16} />}>Thông tin</Tabs.Tab>
                            <Tabs.Tab value="design" leftSection={<IconGitPullRequest size={16} />}>Quy trình</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="info">
                            <InfoPanel />
                        </Tabs.Panel>

                        <Tabs.Panel value="design">
                            <DesignPanel />
                        </Tabs.Panel>
                    </Tabs>
                ) : (
                    <Box className="flex-1 flex flex-row overflow-hidden">
                        <Box className="w-[400px] border-r border-gray-200 bg-white dark:bg-zinc-900 shrink-0 flex flex-col overflow-hidden">
                            <InfoPanel />
                        </Box>
                        <Box className="flex-1 flex flex-col overflow-hidden">
                            <DesignPanel />
                        </Box>
                    </Box>
                )}

                <Box p="md" className="border-t border-[var(--mantine-color-default-border)] bg-white dark:bg-zinc-800 z-20 shrink-0">
                    <Group justify="flex-end">
                        <Button variant="default" onClick={onClose} disabled={loading}>{t('cancel')}</Button>
                        <Button
                            color="indigo"
                            loading={loading}
                            type="submit"
                            size="md"
                            leftSection={<IconDeviceFloppy size={18} />}
                            className="shadow-md hover:shadow-lg transition-all"
                        >
                            {t('submit')}
                        </Button>
                    </Group>
                </Box>
            </form >
        </Drawer >
    );
}
