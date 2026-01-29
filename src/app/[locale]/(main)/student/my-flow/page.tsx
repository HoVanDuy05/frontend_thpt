"use client";

import { useState, useEffect } from "react";
import {
    Stack, Title, Text, Button, Tabs, Group,
    Badge, ThemeIcon, ActionIcon, Drawer, Box, Paper, LoadingOverlay,
    Select, TextInput, NumberInput, Textarea, ScrollArea, Stepper,
    Checkbox, Radio, FileInput,
    SimpleGrid, Table, UnstyledButton,
    Divider
} from "@mantine/core";
import { CheckTypeInput } from "@/feauture/approvals/components/CheckTypeInput";
import {
    useMediaQuery,
    useDebouncedValue
} from "@mantine/hooks";
import {
    IconPlus, IconFileDescription, IconClock, IconCheck, IconX,
    IconChevronRight, IconCalendar, IconChevronLeft, IconFiles,
    IconActivity, IconExternalLink, IconSearch, IconArrowRight,
    IconTrendingUp, IconBriefcase, IconHistory, IconAlertCircle,
    IconForms
} from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { DatePickerInput, DateTimePicker, TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TPhienQuyTrinh, TQuyTrinh, TTruongFormQuyTrinh, LoaiTruongForm } from "@/shared/types/approval.type";
import { dayjs } from "@/shared/utils/date.util";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function MyFlowPage() {
    const t = useTranslations('student_flow');
    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams();

    // URL State management
    const activeTab = searchParams.get("status") || "all";
    const searchQuery = searchParams.get("q") || "";
    const [inputValue, setInputValue] = useState(searchQuery);
    const [debouncedSearch] = useDebouncedValue(inputValue, 300);

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        let changed = false;
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                if (params.has(key)) {
                    params.delete(key);
                    changed = true;
                }
            } else {
                if (params.get(key) !== value) {
                    params.set(key, value);
                    changed = true;
                }
            }
        });

        if (changed) {
            const query = params.toString();
            router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
        }
    };

    const setActiveTab = (status: string) => updateParams({ status });

    useEffect(() => {
        updateParams({ q: debouncedSearch || null });
    }, [debouncedSearch]);

    // Update local input if URL changes externally
    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    const isDrawerOpen = searchParams.get("create") === "true";

    const setIsDrawerOpen = (open: boolean) => {
        if (open) {
            updateParams({ create: 'true' });
        } else {
            updateParams({
                create: null,
                flowId: null,
                categoryId: null,
                step: null
            });
        }
    };

    // Queries
    const { data: myFlows, isLoading: isLoadingFlows } = AppQuery.approvals.useMyFlows();
    const { data: templates } = AppQuery.approvals.useFlows();

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'DA_DUYET': return { color: 'teal', label: t('tabs.completed'), icon: IconCheck };
            case 'TU_CHOI': return { color: 'red', label: t('tabs.rejected'), icon: IconX };
            case 'DANG_XU_LY': return { color: 'blue', label: t('common.status.pending'), icon: IconActivity };
            case 'CHO_DUYET': return { color: 'orange', label: t('tabs.pending'), icon: IconClock };
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


    return (
        <Box className="flex flex-col flex-1 min-h-0 bg-[#fcfcfd] dark:bg-[#09090b]">
            {/* Optimized Navigation Bar */}
            <Box className="h-[70px] sm:h-[90px] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border-b border-gray-100 dark:border-zinc-800 px-4 md:px-8 flex items-center shrink-0 z-40 relative">
                <Box className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                <Group justify="space-between" className="w-full max-w-7xl mx-auto">
                    <Group className="gap-2 sm:gap-4">
                        <Box className="relative group">
                            <Group className="gap-2 sm:gap-4 relative">
                                <Box className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                                    <IconFiles size={20} stroke={2.5} />
                                </Box>
                                <div>
                                    <Title order={4} fw={900} className="tracking-tight text-gray-900 dark:text-gray-50 leading-none text-sm sm:text-base">Smart Portal</Title>
                                    <Text size="10px" fw={700} tt="uppercase" lts={1} className="text-indigo-600 mt-0.5 hidden sm:block">{t('drawer.header.categories')}</Text>
                                </div>
                            </Group>
                        </Box>
                    </Group>

                    <Group gap="xs">
                        <Button
                            leftSection={<IconPlus size={18} stroke={3} />}
                            variant="filled"
                            color="indigo"
                            radius="xl"
                            h={40}
                            onClick={() => setIsDrawerOpen(true)}
                            className="shadow-lg hover:shadow-xl transition-all active:scale-95 fw-800 text-xs sm:text-sm sm:h-12 px-4 sm:px-6"
                        >
                            <span className="hidden sm:inline">{t('empty.action')}</span>
                            <span className="sm:hidden">{t('common.actions.create')}</span>
                        </Button>
                    </Group>
                </Group>
            </Box>

            <ScrollArea className="flex-1" type="scroll">
                <Box className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
                    <Stack className="gap-8 sm:gap-12">
                        {/* Summary Section - Mobile Optimized */}
                        {!isLoadingFlows && myFlows && (
                            <SimpleGrid cols={{ base: 2, sm: 2, lg: 4 }} className="gap-2 sm:gap-4">
                                {[
                                    { key: 'all', label: t('stats.total_flows'), value: myFlows.length, color: 'indigo', icon: IconBriefcase, trend: t('stats.today_trend') },
                                    { key: 'pending', label: t('tabs.pending'), value: myFlows.filter((f: TPhienQuyTrinh) => f.trangThai === 'CHO_DUYET').length, color: 'blue', icon: IconClock, trend: t('stats.priority') },
                                    { key: 'approved', label: t('tabs.completed'), value: myFlows.filter((f: TPhienQuyTrinh) => f.trangThai === 'DA_DUYET').length, color: 'teal', icon: IconCheck, trend: t('stats.completed') },
                                    { key: 'rejected', label: t('tabs.rejected'), value: myFlows.filter((f: TPhienQuyTrinh) => f.trangThai === 'TU_CHOI').length, color: 'red', icon: IconHistory, trend: t('stats.note') },
                                ].map((s, i) => {
                                    const isActive = activeTab === s.key;
                                    return (
                                        <Paper
                                            key={i}
                                            withBorder
                                            radius="xl"
                                            onClick={() => setActiveTab(s.key)}
                                            className={`
                                                cursor-pointer transition-all duration-300 min-h-[140px]
                                                ${isActive
                                                    ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/10 shadow-md ring-2 ring-indigo-500/20'
                                                    : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 group hover:border-indigo-200 shadow-sm hover:shadow-lg'
                                                }
                                                p-4 sm:p-6
                                            `}
                                        >
                                            <Group justify="space-between" mb={{ base: 12, sm: 16 }}>
                                                <ThemeIcon variant={isActive ? 'filled' : 'light'} color={s.color} size={40} radius="lg" className="group-hover:scale-110 transition-transform">
                                                    <s.icon size={20} stroke={2} />
                                                </ThemeIcon>
                                                <Badge variant="light" color={s.color} size="xs" radius="sm" fw={800} className="hidden sm:block">{s.trend}</Badge>
                                            </Group>
                                            <Text size="10px" fw={800} c={isActive ? 'indigo' : 'dimmed'} tt="uppercase" lts={1} mb={4} className="line-clamp-1">{s.label}</Text>
                                            <Text fw={900} className="text-[24px] sm:text-[32px] text-gray-900 dark:text-white leading-none tracking-tight">{s.value}</Text>
                                        </Paper>
                                    );
                                })}
                            </SimpleGrid>
                        )}

                        <Box>
                            <Stack gap="md">
                                <Group justify="space-between" align="center" className="flex-col sm:flex-row gap-4">
                                    <Box className="w-full sm:flex-1">
                                        <TextInput
                                            placeholder={t('common.actions.search')}
                                            leftSection={<IconSearch size={18} stroke={2.5} className="text-gray-400" />}
                                            radius="xl"
                                            size="sm"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.currentTarget.value)}
                                            styles={{ input: { background: 'white', border: '1px solid var(--mantine-color-gray-100)', height: '44px', fontWeight: 600 } }}
                                        />
                                    </Box>
                                </Group>

                                <Box pb={120}>
                                    {isLoadingFlows ? (
                                        <Box h={400} className="relative">
                                            <LoadingOverlay visible={true} overlayProps={{ blur: 0 }} loaderProps={{ color: 'indigo', type: 'bars' }} />
                                        </Box>
                                    ) : filteredFlows && filteredFlows.length > 0 ? (
                                        <Stack gap="md">
                                            {filteredFlows.map((flow: TPhienQuyTrinh, index: number) => {
                                                const status = getStatusConfig(flow.trangThai);
                                                return (
                                                    <Paper
                                                        key={flow.id}
                                                        component={Link}
                                                        href={`${pathname}/${flow.id}`}
                                                        radius="24px"
                                                        className="group hover:shadow-xl hover:scale-[1.01] transition-all duration-300 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-indigo-100 dark:hover:border-indigo-900 cursor-pointer overflow-hidden p-0"
                                                    >
                                                        <Group gap={0} wrap="nowrap" align="stretch">
                                                            {/* Left indicator bar */}
                                                            <Box style={{ width: 6 }} className={`bg-${status.color}-500 group-hover:w-3 transition-all duration-300`} />

                                                            <Box p={{ base: 16, sm: 20 }} className="flex-1">
                                                                <Stack gap="md">
                                                                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                                                                        <Stack gap={2}>
                                                                            <Text fw={900} size="sm" tt="uppercase" className="tracking-tighter text-gray-900 dark:text-white leading-tight">
                                                                                {flow.quyTrinh?.ten}
                                                                            </Text>
                                                                            <Group gap={6}>
                                                                                <Badge size="xs" variant="outline" color="gray" radius="sm" fw={800} className="opacity-60 text-[9px]">
                                                                                    • {flow.quyTrinh?.danhMuc?.ten || 'GENERAL'}
                                                                                </Badge>
                                                                                <Text size="10px" fw={700} c="dimmed" className="hidden sm:block">ID: #{flow.id}</Text>
                                                                            </Group>
                                                                        </Stack>
                                                                        <Badge
                                                                            color={status.color}
                                                                            variant="light"
                                                                            size="sm"
                                                                            radius="md"
                                                                            h={28}
                                                                            px={12}
                                                                            fw={900}
                                                                            className="shadow-sm text-[10px] uppercase lts={1}"
                                                                        >
                                                                            {status.label}
                                                                        </Badge>
                                                                    </Group>

                                                                    <Group justify="space-between" align="center">
                                                                        <Group gap={20}>
                                                                            <Group gap={6}>
                                                                                <ThemeIcon size={20} radius="sm" variant="light" color="gray">
                                                                                    <IconCalendar size={12} stroke={2.5} />
                                                                                </ThemeIcon>
                                                                                <Text size="10px" fw={700} c="dimmed">
                                                                                    {dayjs(flow.ngayTao).format('DD MMM, YYYY')}
                                                                                </Text>
                                                                            </Group>

                                                                            <Group gap={6}>
                                                                                <ThemeIcon size={20} radius="sm" variant="light" color="indigo">
                                                                                    <IconHistory size={12} stroke={2.5} />
                                                                                </ThemeIcon>
                                                                                <Text size="10px" fw={800} c="indigo">
                                                                                    {flow.quyTrinh?._count?.cacBuoc || 0} {t('form.info.preparation')}
                                                                                </Text>
                                                                            </Group>
                                                                        </Group>

                                                                        <ActionIcon
                                                                            variant="light"
                                                                            color="gray"
                                                                            radius="xl"
                                                                            size="md"
                                                                            className="group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all sm:opacity-0 group-hover:opacity-100"
                                                                        >
                                                                            <IconChevronRight size={16} stroke={3} />
                                                                        </ActionIcon>
                                                                    </Group>
                                                                </Stack>
                                                            </Box>
                                                        </Group>
                                                    </Paper>
                                                );
                                            })}
                                        </Stack>
                                    ) : (
                                        <Paper withBorder radius="24px" p={80} className="border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                            <Stack align="center" justify="center" className="opacity-60">
                                                <Box className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                                                    <IconFiles size={36} stroke={1} />
                                                </Box>
                                                <Title order={4} fw={800} className="text-lg text-gray-400 tracking-tight mt-4 uppercase">{t('empty.title')}</Title>
                                                <Text size="xs" c="dimmed" maw={280} ta="center">{t('empty.subtitle')}</Text>
                                                <Button variant="light" color="indigo" radius="xl" size="sm" mt={16} onClick={() => setIsDrawerOpen(true)}>{t('empty.action')}</Button>
                                            </Stack>
                                        </Paper>
                                    )}
                                </Box>
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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations('student_flow');

    const categoryId = searchParams.get("categoryId");
    const flowId = searchParams.get("flowId");

    const selectedTemplate = templates.find(temp => temp.id.toString() === flowId) || null;

    // Derived Categories
    const categories = templates.reduce((acc: any[], template) => {
        const cat = template.danhMuc;
        if (!cat) return acc;
        const existing = acc.find(c => c.id === cat.id);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ ...cat, count: 1 });
        }
        return acc;
    }, []);

    const selectedCategory = categories.find(c => c.id.toString() === categoryId) || null;

    const navigate = (paramsToUpdate: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(paramsToUpdate).forEach(([key, value]) => {
            if (value === null) params.delete(key);
            else params.set(key, value);
        });
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleBack = () => {
        if (flowId) {
            navigate({ flowId: null, step: null });
        } else if (categoryId) {
            navigate({ categoryId: null });
        } else {
            onClose();
        }
    };

    const [searchTerm, setSearchTerm] = useState("");
    const isMobile = useMediaQuery('(max-width: 48em)');

    const filteredTemplates = templates.filter(temp =>
        temp.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        temp.moTa?.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(temp => temp.trangThai === "HOAT_DONG");

    const handleClose = () => {
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
                <Box className="px-5 py-6 sm:px-10 sm:py-8 border-b border-gray-100 dark:border-zinc-800 shrink-0 relative">
                    <Group justify="space-between">
                        <Group className="gap-3 sm:gap-6">
                            <ActionIcon
                                variant="light"
                                color="indigo"
                                radius="12px"
                                size={40}
                                onClick={handleBack}
                                className="shadow-sm hover:scale-110 active:scale-95 transition-all sm:size-12 sm:rounded-2xl"
                            >
                                <IconChevronLeft size={20} className="sm:size-6" stroke={3} />
                            </ActionIcon>
                            <div>
                                <Title order={3} fw={950} className="text-lg sm:text-xl tracking-tighter text-gray-900 dark:text-gray-50 leading-none mb-1">
                                    {selectedTemplate ? selectedTemplate.ten : selectedCategory ? selectedCategory.ten : "Smart Portal"}
                                </Title>
                                <Text size="9px" className="sm:text-[10px]" fw={900} c="indigo" tt="uppercase" lts={1.5}>
                                    {selectedTemplate ? t('drawer.header.register') : selectedCategory ? t('drawer.header.flows') : t('drawer.header.categories')}
                                </Text>
                            </div>
                        </Group>
                    </Group>
                </Box>

                <Box className="flex-1 overflow-hidden">
                    {selectedTemplate ? (
                        <DynamicRequestForm
                            template={selectedTemplate}
                            onBack={handleBack}
                            onSuccess={handleClose}
                        />
                    ) : (
                        <Stack gap={0} h="100%">
                            <Box className="p-5 sm:p-8 pb-2 sm:pb-4">
                                <TextInput
                                    placeholder={categoryId ? t('drawer.placeholders.search_flows') : t('drawer.placeholders.search_categories')}
                                    leftSection={<IconSearch size={18} className="text-gray-400" />}
                                    radius="12px"
                                    size="md"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                                    styles={{ input: { background: '#f8fafc', border: 'none', height: '48px' } }}
                                    className="sm:h-14 sm:text-lg"
                                />
                            </Box>

                            <ScrollArea className="flex-1" type="scroll">
                                <Box className="px-5 sm:px-8 pb-8">
                                    <Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={1.2} mb={16} mt={10}>
                                        {categoryId ? t('sections.flows_in_category', { name: selectedCategory?.ten }) : t('sections.explore_categories')}
                                    </Text>

                                    <SimpleGrid cols={isMobile ? 1 : 2} spacing="xl">
                                        {!categoryId ? (
                                            // Level 1: Categories
                                            categories.filter(c => c.ten.toLowerCase().includes(searchTerm.toLowerCase())).map((cat: any) => (
                                                <UnstyledButton
                                                    key={cat.id}
                                                    className="group p-4 sm:p-6 rounded-20px bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-indigo-200 hover:bg-indigo-50/10 transition-all"
                                                    onClick={() => navigate({ categoryId: cat.id.toString() })}
                                                >
                                                    <Group justify="space-between" wrap="nowrap">
                                                        <Group className="gap-4 sm:gap-6" wrap="nowrap">
                                                            <ThemeIcon variant="light" size={44} radius="12px" color="indigo" className="group-hover:rotate-12 transition-transform">
                                                                <IconBriefcase size={22} stroke={1.5} />
                                                            </ThemeIcon>
                                                            <div className="min-w-0">
                                                                <Text fw={850} className="text-sm sm:text-md text-gray-900 dark:text-gray-50 tracking-tight uppercase leading-snug">{cat.ten}</Text>
                                                                <Text className="text-[10px] sm:text-xs" fw={700} c="indigo" mt={2}>{t('drawer.category_card.available_count', { count: cat.count })}</Text>
                                                            </div>
                                                        </Group>
                                                        <IconChevronRight size={20} stroke={3} className="text-gray-200 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                                    </Group>
                                                </UnstyledButton>
                                            ))
                                        ) : (
                                            // Level 2: Flows in Category
                                            filteredTemplates.filter(temp => temp.danhMuc?.id.toString() === categoryId).map((template: TQuyTrinh) => (
                                                <UnstyledButton
                                                    key={template.id}
                                                    className="group p-4 sm:p-6 rounded-20px bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-indigo-200 hover:bg-indigo-50/10 transition-all"
                                                    onClick={() => navigate({ flowId: template.id.toString(), step: "flow" })}
                                                >
                                                    <Group justify="space-between" wrap="nowrap">
                                                        <Group className="gap-4 sm:gap-6" wrap="nowrap">
                                                            <ThemeIcon
                                                                variant="light"
                                                                size={44}
                                                                radius="12px"
                                                                color="indigo"
                                                                className="group-hover:scale-110 transition-transform"
                                                            >
                                                                <IconFileDescription size={22} stroke={1.5} className="sm:size-[26px]" />
                                                            </ThemeIcon>
                                                            <div className="min-w-0">
                                                                <Text fw={850} className="text-sm sm:text-md text-gray-900 dark:text-gray-50 tracking-tight uppercase leading-snug">{template.ten}</Text>
                                                                <Text size="xs" c="dimmed" fw={600} className="line-clamp-1 mt-1 opacity-80">
                                                                    {template.moTa || t('form.info.default_desc')}
                                                                </Text>
                                                            </div>
                                                        </Group>
                                                        <IconChevronRight size={20} stroke={3} className="text-gray-200 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                                    </Group>
                                                </UnstyledButton>
                                            ))
                                        )}
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
    const t = useTranslations('student_flow');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const flowId = template.id;
    const stepParam = searchParams.get("step") || "flow";
    const activeStep = stepParam === "data" ? 1 : 0;

    const { data: fields, isLoading } = AppQuery.approvals.useFormFields(flowId);
    const submitMutation = AppMutation().approvals.useSubmit();

    const [formData, setFormData] = useState<Record<string, string | number | boolean | string[] | null>>({});

    const hasSteps = Array.isArray(template.cacBuoc) && template.cacBuoc.length > 0;

    const navigateToStep = (step: "flow" | "data") => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("step", step);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleSubmit = async () => {
        try {
            if (fields) {
                for (const field of fields) {
                    if (field.batBuoc && !formData[field.id]) {
                        notifications.show({ title: t('notifications.error_title'), message: `${t('form.input.placeholder', { name: field.nhan })}`, color: "red" });
                        return;
                    }
                }
            }

            if (!hasSteps) {
                notifications.show({ title: t('common.status.pending'), message: t('form.steps.empty'), color: "orange" });
                return;
            }

            await submitMutation.mutateAsync({
                flow_id: flowId,
                data: formData,
                target_id: null
            });

            notifications.show({ title: t('notifications.success_title'), message: t('notifications.success_msg'), color: "indigo" });
            onSuccess();
        } catch (error: unknown) {
            const errorMsg = (error as any)?.response?.data?.message || t('notifications.error_msg');
            notifications.show({ title: t('notifications.error_title'), message: errorMsg, color: "red" });
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
            <Box className="px-5 py-4 sm:px-10 sm:py-6 bg-gray-50/50 dark:bg-zinc-900/30 border-b border-gray-100 dark:border-zinc-800">
                <Stepper active={activeStep} onStepClick={(s) => navigateToStep(s === 0 ? "flow" : "data")} size="xs" color="indigo" radius="xl" allowNextStepsSelect={false}>
                    <Stepper.Step label={<Text fw={900} className="text-[9px] sm:text-[11px]" tt="uppercase" lts={1.2}>{t('form.stepper.flow')}</Text>} />
                    <Stepper.Step label={<Text fw={900} className="text-[9px] sm:text-[11px]" tt="uppercase" lts={1.2}>{t('form.stepper.data')}</Text>} />
                </Stepper>
            </Box>

            <ScrollArea className="flex-1" type="scroll">
                <Box className="p-5 sm:p-10">
                    <div className="max-w-xl mx-auto">
                        {activeStep === 0 ? (
                            <Stack className="gap-8 sm:gap-10">
                                {/* Enhanced Procedure Card */}
                                <Paper p={0} radius="24px" className="overflow-hidden border-none shadow-2xl">
                                    <Box className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 sm:p-10 text-white relative">
                                        <Box className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                        <Group wrap="nowrap" align="flex-start" className="gap-4 sm:gap-6 relative">
                                            <ThemeIcon size={54} radius="16px" className="bg-white/20 backdrop-blur-md text-white border border-white/30 shrink-0">
                                                <IconFileDescription size={28} stroke={2} />
                                            </ThemeIcon>
                                            <Stack gap={4}>
                                                <Title order={3} fw={900} className="text-lg sm:text-2xl tracking-tight leading-tight uppercase">
                                                    {template.ten}
                                                </Title>
                                                <Text fw={500} className="text-[11px] sm:text-sm leading-relaxed opacity-80 max-w-lg">
                                                    {template.moTa || t('form.info.default_desc')}
                                                </Text>
                                            </Stack>
                                        </Group>
                                    </Box>
                                </Paper>

                                {/* Preparation & Context Info */}
                                <Stack gap="md">
                                    <Group gap="xs">
                                        <Box className="w-1 h-5 bg-indigo-600 rounded-full" />
                                        <Text fw={900} tt="uppercase" lts={1.5} className="text-xs text-gray-900 dark:text-gray-100">{t('form.info.preparation')}</Text>
                                    </Group>
                                    <Paper withBorder radius="20px" p="xl" className="border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40">
                                        <Stack gap="lg">
                                            <Text size="sm" fw={600} c="dimmed" lh={1.6}>
                                                {t('form.info.ready_msg')}
                                            </Text>

                                            <SimpleGrid cols={2} spacing="md">
                                                <Group gap="sm">
                                                    <ThemeIcon variant="light" color="indigo" size="lg" radius="md">
                                                        <IconActivity size={18} stroke={2} />
                                                    </ThemeIcon>
                                                    <div>
                                                        <Text size="xs" fw={800} c="indigo" tt="uppercase" lts={0.5}>{template.cacBuoc?.length || 0} {t('form.stepper.flow')}</Text>
                                                        <Text size="10px" fw={600} c="dimmed">{t('form.steps.title')}</Text>
                                                    </div>
                                                </Group>
                                                <Group gap="sm">
                                                    <ThemeIcon variant="light" color="teal" size="lg" radius="md">
                                                        <IconFiles size={18} stroke={2} />
                                                    </ThemeIcon>
                                                    <div>
                                                        <Text size="xs" fw={800} c="teal" tt="uppercase" lts={0.5}>{fields?.length || 0} {t('form.stepper.data')}</Text>
                                                        <Text size="10px" fw={600} c="dimmed">{t('form.input.title')}</Text>
                                                    </div>
                                                </Group>
                                            </SimpleGrid>
                                        </Stack>
                                    </Paper>
                                </Stack>

                                {/* Flow Timeline Visualization */}
                                <Stack className="gap-8">
                                    <Group gap="xs">
                                        <Box className="w-1 h-5 bg-indigo-600 rounded-full" />
                                        <Text fw={900} tt="uppercase" lts={1.5} className="text-xs text-gray-900 dark:text-gray-100">{t('form.steps.title')}</Text>
                                    </Group>

                                    <Box className="px-2 sm:px-4">
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
                                                    <Group key={b.id} wrap="nowrap" className="gap-6 sm:gap-10 relative pb-8 last:pb-0">
                                                        {(template.cacBuoc && index < template.cacBuoc.length - 1) && (
                                                            <Box className="absolute left-[17px] sm:left-[21px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/30 to-transparent" />
                                                        )}
                                                        <Box className="relative shrink-0">
                                                            <Box className="size-9 sm:size-11 rounded-2xl bg-white dark:bg-zinc-900 border-[2.5px] border-indigo-600 flex items-center justify-center text-indigo-600 font-black text-xs sm:text-sm shrink-0 z-10 shadow-lg shadow-indigo-500/10">
                                                                {index + 1}
                                                            </Box>
                                                            {index === 0 && (
                                                                <Box className="absolute -inset-1 bg-indigo-500/20 blur-md rounded-2xl -z-10 animate-pulse" />
                                                            )}
                                                        </Box>
                                                        <Box className="flex-1">
                                                            <Paper withBorder p="md" radius="16px" className="border-gray-100 dark:border-zinc-800 hover:border-indigo-200 transition-colors shadow-sm">
                                                                <Group justify="space-between" mb={4}>
                                                                    <Text fw={850} className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 uppercase tracking-tight leading-none">{b.ten}</Text>
                                                                    <Badge size="xs" variant="light" color="indigo" radius="md" fw={900} className="h-5 px-1.5 opacity-80">P{index + 1}</Badge>
                                                                </Group>
                                                                <Text className="text-[11px] sm:text-xs" fw={750} c="indigo" tt="uppercase" lts={0.5}>{approverName}</Text>
                                                                <Text c="dimmed" fw={600} mt={8} className="text-[10px] sm:text-[11px] opacity-70 flex items-center gap-1.5">
                                                                    <IconClock size={12} />
                                                                    {b.loaiQuyTac === 'TAT_CA' ? t('form.steps.rule_all') : t('form.steps.rule_any')}
                                                                </Text>
                                                            </Paper>
                                                        </Box>
                                                    </Group>
                                                );
                                            }) : (
                                                <Paper p="xl" radius="16px" className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-center">
                                                    <Text size="xs" fw={850} c="red">{t('form.steps.empty')}</Text>
                                                </Paper>
                                            )}
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Stack>
                        ) : (
                            <Stack className="gap-10 sm:gap-12">
                                <Box>
                                    <Title order={3} fw={900} className="text-xl sm:text-3xl tracking-tight mb-2 text-gray-900 dark:text-white">
                                        {t('form.input.title')}
                                    </Title>
                                    <Text className="text-xs sm:text-sm" fw={500} c="dimmed" lh={1.6}>
                                        {t('form.input.subtitle')}
                                    </Text>
                                </Box>

                                <Stack gap={24}>
                                    {fields && fields.length > 0 ? fields.map((field: TTruongFormQuyTrinh) => (
                                        <CheckTypeInput
                                            key={field.id}
                                            field={field}
                                            value={formData[field.id.toString()]}
                                            onChange={(val) => setFormData(prev => ({ ...prev, [field.id.toString()]: val }))}
                                        />
                                    )) : (
                                        <Box py={60} className="text-center bg-gray-50/50 rounded-24px border border-dashed border-gray-200">
                                            <Text fw={850} size="sm" c="gray">{t('form.input.empty_fields')}</Text>
                                        </Box>
                                    )}
                                </Stack>
                            </Stack>
                        )}
                    </div>
                </Box>
            </ScrollArea>

            <Box className="px-5 py-4 sm:px-8 sm:py-6 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
                <Group justify="space-between">
                    <Button
                        variant="subtle"
                        color="gray"
                        radius="100px"
                        fw={800}
                        size="sm"
                        onClick={activeStep === 0 ? onBack : () => navigateToStep("flow")}
                    >
                        {activeStep === 0 ? t('form.actions.cancel') : t('form.actions.back')}
                    </Button>

                    <Button
                        variant="filled"
                        color="indigo"
                        radius="100px"
                        size="md"
                        h={44}
                        px={32}
                        fw={850}
                        disabled={!hasSteps}
                        onClick={activeStep === 0 ? () => navigateToStep("data") : handleSubmit}
                        loading={submitMutation.isPending}
                        rightSection={activeStep === 0 ? <IconChevronRight size={18} stroke={3} /> : <IconCheck size={18} stroke={3} />}
                        className="shadow-lg shadow-indigo-500/10 sm:h-12 sm:px-10"
                    >
                        {activeStep === 0 ? t('form.actions.continue') : t('form.actions.submit')}
                    </Button>
                </Group>
            </Box>
        </Stack>
    );
}