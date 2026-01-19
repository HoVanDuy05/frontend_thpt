"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
    Box, Title, Text, Button, Group, Stack
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SubjectDrawer } from "./SubjectDrawer";
import { SubjectsTable } from "@/feauture/admin/subjects/components/SubjectsTable";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import {
    IconPlus, IconBooks
} from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { type SubjectType } from "@/shared/utils/subjectColumns";

export default function SubjectsPage() {
    const t = useTranslations('admin.academic.subjects');

    // Drawer control
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedSubject, setSelectedSubject] = useState<SubjectType | null>(null);

    // Queries
    const { data: subjects, isLoading } = AppQuery.academic.useSubjects();

    const mutations = AppMutation();
    const deleteMutation = mutations.academic.useDeleteSubject();

    const handleCreate = () => {
        setSelectedSubject(null);
        open();
    };

    const handleEdit = (subject: SubjectType) => {
        setSelectedSubject(subject);
        open();
    };

    const handleDelete = (subject: SubjectType) => {
        const modalId = notifications.show({
            title: t('delete_confirm_title', { defaultMessage: 'Xác nhận xóa' }),
            message: (
                <Stack>
                    <Text size="sm">
                        {t('delete_confirm_message', { name: subject.tenMon, defaultMessage: `Bạn có chắc chắn muốn xóa môn học "${subject.tenMon}"?` })}
                    </Text>
                    <Group justify="end" mt="xs">
                        <Button variant="default" size="xs" onClick={() => notifications.hide(modalId)}>
                            {t('actions.cancel', { defaultMessage: 'Hủy' })}
                        </Button>
                        <Button
                            color="red"
                            size="xs"
                            onClick={() => {
                                deleteMutation.mutate({ urlParams: { id: subject.id } } as any, {
                                    onSuccess: () => {
                                        notifications.show({ title: 'Thành công', message: 'Xóa môn học thành công', color: 'green' });
                                        notifications.hide(modalId);
                                    },
                                    onError: (error: any) => {
                                        notifications.show({ title: 'Thất bại', message: error?.message || 'Có lỗi xảy ra', color: 'red' });
                                        notifications.hide(modalId);
                                    }
                                });
                            }}
                        >
                            {t('actions.delete_confirm', { defaultMessage: 'Xóa' })}
                        </Button>
                    </Group>
                </Stack>
            ),
            color: 'red',
            autoClose: false,
        });
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
                <SubjectsTable
                    subjects={subjects}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Box>

            <SubjectDrawer opened={opened} onClose={close} subject={selectedSubject} />
        </Box>
    );

    if (isLoading) {
        return <SkeletonLoader type="table" count={5} />;
    }
}
