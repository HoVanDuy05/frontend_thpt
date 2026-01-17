"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
    Box, Title, Text, Button, Group
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SubjectDrawer } from "./SubjectDrawer";
import { SubjectsTable } from "@/feauture/admin/subjects/components/SubjectsTable";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import {
    IconPlus, IconBooks
} from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { notifications } from "@mantine/notifications";

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
    const t = useTranslations('admin.academic.subjects');

    // Drawer control
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    // Queries
    const { data: subjects, isLoading } = AppQuery.academic.useSubjects();

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
    };

    if (isLoading) {
        return <SkeletonLoader type="table" count={5} />;
    }

    return (
        <Box className="w-full min-h-screen bg-[#fcfcfd] dark:bg-[#09090b]">
            {/* Header */}
            <Box className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 px-6 py-6 sticky top-0 z-40">
                <Group justify="space-between">
                    <Group gap="md">
                        <Box className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                            <IconBooks size={24} className="text-indigo-600 dark:text-indigo-400" />
                        </Box>
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
                <SubjectsTable subjects={subjects} isLoading={isLoading} />
            </Box>

            <SubjectDrawer opened={opened} onClose={close} subject={selectedSubject} />
        </Box>
    );

    if (isLoading) {
        return <SkeletonLoader type="table" count={5} />;
    }
}
