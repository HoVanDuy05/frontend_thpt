"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
    Box, Title, Text, Button, Group, Stack, Paper,
    TextInput, SimpleGrid, ThemeIcon, ActionIcon,
    Avatar, Badge, LoadingOverlay, Menu, rem
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SubjectDrawer } from "./SubjectDrawer";
import {
    IconPlus, IconSearch, IconBook, IconDots,
    IconEdit, IconTrash, IconBooks, IconFilter
} from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

// Define Types (Ideally import from types folder)
interface Subject {
    id: number;
    tenMon: string;
    maMon?: string;
    moTa?: string;
    _count?: {
        lopHoc: number;
        giaoVien: number;
    }
}

export default function SubjectsPage() {
    const t = useTranslations('admin.academic.subjects'); // Ensure translation keys exist or use fallbacks
    const [searchTerm, setSearchTerm] = useState("");

    // Drawer control
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    // Queries & Mutations
    const mutations = AppMutation();
    const { data: subjects, isLoading } = AppQuery.academic.useSubjects();
    // const deleteMutation = mutations.academic.useDeleteSubject(0); // TODO: Fix Delete pattern

    const filteredSubjects = subjects?.filter((s: Subject) =>
        s.tenMon.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleCreate = () => {
        setSelectedSubject(null);
        open();
    };

    const handleEdit = (subject: Subject) => {
        setSelectedSubject(subject);
        open();
    };

    const handleDelete = (id: number, name: string) => {
        notifications.show({ title: 'Info', message: 'Tính năng xóa đang được cập nhật', color: 'blue' });
        /* 
        // Logic pending refactor of useDelete hook pattern
        modals.openConfirmModal({
            title: t('delete.title', { defaultMessage: 'Xóa môn học' }),
            children: (
                <Text size="sm">
                    {t('delete.confirm', { name, defaultMessage: `Bạn có chắc chắn muốn xóa môn học ${name}?` })}
                </Text>
            ),
            labels: { confirm: 'Xóa', cancel: 'Hủy' },
            confirmProps: { color: 'red' },
            onConfirm: () => {}
        });
        */
    };

    return (
        <Box className="w-full min-h-screen bg-[#fcfcfd] dark:bg-[#09090b]">
            {/* Header */}
            <Box className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 px-6 py-6 sticky top-0 z-40">
                <Group justify="space-between">
                    <Group gap="md">
                        <ThemeIcon size={48} radius="xl" variant="light" color="indigo">
                            <IconBooks size={24} stroke={1.5} />
                        </ThemeIcon>
                        <div>
                            <Title order={2} className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                                {t('title', { defaultMessage: 'Quản lý Môn học' })}
                            </Title>
                            <Text size="sm" c="dimmed" fw={500}>
                                {t('subtitle', { count: subjects?.length || 0, defaultMessage: `Danh sách ${subjects?.length || 0} môn học trong hệ thống` })}
                            </Text>
                        </div>
                    </Group>

                    <Button
                        leftSection={<IconPlus size={18} stroke={2.5} />}
                        radius="xl"
                        size="md"
                        color="indigo"
                        className="shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
                        onClick={handleCreate}
                    >
                        {t('actions.create', { defaultMessage: 'Thêm mới' })}
                    </Button>
                </Group>
            </Box>

            {/* Content */}
            <Box className="p-6 max-w-7xl mx-auto">
                {/* Tools */}
                <Group justify="space-between" mb="xl">
                    <TextInput
                        placeholder={t('search_placeholder', { defaultMessage: 'Tìm kiếm môn học...' })}
                        leftSection={<IconSearch size={16} />}
                        radius="xl"
                        size="md"
                        w={{ base: "100%", sm: 320 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.currentTarget.value)}
                        styles={{ input: { border: 'none', background: 'var(--mantine-color-gray-1)' } }}
                    />
                    <Button variant="light" color="gray" radius="xl" leftSection={<IconFilter size={16} />}>
                        {t('actions.filter', { defaultMessage: 'Bộ lọc' })}
                    </Button>
                </Group>

                {/* Grid */}
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                    {isLoading ? (
                        // Skeleton loading would be here
                        <Text>Loading...</Text>
                    ) : (
                        filteredSubjects.map((subject: Subject) => (
                            <Paper
                                key={subject.id}
                                p="lg"
                                radius="lg"
                                withBorder
                                className="group hover:shadow-xl hover:border-indigo-200 transition-all duration-300 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 relative overflow-hidden"
                            >
                                <Box className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                                <Group justify="space-between" align="start" mb="md" className="relative z-10">
                                    <ThemeIcon size="lg" radius="md" color="indigo" variant="light">
                                        <IconBook size={20} stroke={2} />
                                    </ThemeIcon>

                                    <Menu position="bottom-end" shadow="md" width={160}>
                                        <Menu.Target>
                                            <ActionIcon variant="subtle" color="gray" radius="xl">
                                                <IconDots size={18} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEdit(subject)}>
                                                {t('actions.edit', { defaultMessage: 'Chỉnh sửa' })}
                                            </Menu.Item>
                                            <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={() => handleDelete(subject.id, subject.tenMon)}>
                                                {t('actions.delete', { defaultMessage: 'Xóa' })}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>

                                <Stack gap="xs" className="relative z-10">
                                    <Title order={4} className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                        {subject.tenMon}
                                    </Title>
                                    <Text size="sm" c="dimmed" lineClamp={2} className="min-h-[40px]">
                                        {subject.moTa || t('no_desc', { defaultMessage: 'Chưa có mô tả cho môn học này.' })}
                                    </Text>

                                    <Group mt="md" gap="xs">
                                        <Badge variant="dot" color="teal" size="lg" radius="xl" className="pl-0">
                                            {subject.id} Classes
                                        </Badge>
                                        {/* Dynamic stats here */}
                                    </Group>
                                </Stack>
                            </Paper>
                        ))
                    )}
                </SimpleGrid>
            </Box>
            <SubjectDrawer opened={opened} onClose={close} subject={selectedSubject} />
        </Box>
    );
}
