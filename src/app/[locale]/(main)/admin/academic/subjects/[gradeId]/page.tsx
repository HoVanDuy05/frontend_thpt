"use client";

import {
    Box, Title, Text, Button, Group, Stack, Skeleton, ActionIcon, Select
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState, use, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { SubjectDrawer } from "../SubjectDrawer"; // Adjusted import path
import { SubjectsTable } from "@/feauture/admin/subjects/components/SubjectsTable";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import {
    IconPlus, IconBooks, IconChevronLeft
} from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { type SubjectType } from "@/shared/utils/subjectColumns";
import { useRouter } from "@/i18n/routing";

interface SubjectListPageProps {
    params: Promise<{
        gradeId: string;
    }>
}

export default function SubjectListPage({ params }: SubjectListPageProps) {
    const t = useTranslations('admin.academic.subjects');
    const router = useRouter();

    // Drawer control
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedSubject, setSelectedSubject] = useState<SubjectType | null>(null);

    const { gradeId } = use(params);
    const id = parseInt(gradeId);

    // Queries
    const { data: grade, isLoading: isLoadingGrade } = AppQuery.academic.useKhoiDetail(id);
    const { data: allGrades } = AppQuery.academic.useGrades();
    const { data: subjects, isLoading: isLoadingSubjects } = AppQuery.academic.useSubjects(
        { khoiId: gradeId }
    );

    const gradeOptions = useMemo(() =>
        allGrades?.map(g => ({ value: g.id.toString(), label: g.tenKhoi })) || []
        , [allGrades]);

    const isLoading = isLoadingGrade || isLoadingSubjects;

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

    if (isLoadingGrade) {
        return <SkeletonLoader type="table" count={5} />;
    }

    if (!grade) {
        return <Box p="md">Grade not found</Box>;
    }

    return (
        <Box className="w-full min-h-screen bg-[#fcfcfd] dark:bg-[#09090b]">
            {/* Header */}
            <Box className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 px-3 sm:px-6 py-3 sm:py-5 sticky top-0 z-40">
                <Group justify="space-between" align="center" wrap="nowrap" gap="xs">
                    <Group gap={4} style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                        <ActionIcon
                            variant="subtle"
                            color="indigo"
                            size="lg"
                            radius="xl"
                            onClick={() => router.push('/admin/academic/subjects')}
                            className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 shrink-0"
                        >
                            <IconChevronLeft size={22} />
                        </ActionIcon>

                        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                            <Group gap={6} wrap="nowrap" align="center">
                                <Title order={2} className="text-base sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white shrink-0">
                                    <span className="hidden xs:inline">{t('title', { defaultMessage: 'Quản lý Môn học' })}</span>
                                    <span className="xs:hidden">{t('title_mobile', { defaultMessage: 'Môn học' })}</span>
                                </Title>
                                <Select
                                    data={gradeOptions}
                                    value={gradeId}
                                    onChange={(val) => val && router.push(`/admin/academic/subjects/${val}`)}
                                    size="xs"
                                    radius="md"
                                    variant="filled"
                                    className="w-[85px] sm:w-40"
                                    styles={{
                                        input: {
                                            fontWeight: 700,
                                            backgroundColor: 'rgba(79, 70, 229, 0.08)',
                                            border: 'none',
                                            paddingLeft: '8px',
                                            paddingRight: '24px',
                                            fontSize: '11px',
                                        },
                                        section: {
                                            width: '20px'
                                        }
                                    }}
                                />
                            </Group>
                            <Text size="xs" c="dimmed" fw={500} className="hidden md:block">
                                {t('subtitle', { count: subjects?.length || 0, defaultMessage: `Danh sách ${subjects?.length || 0} môn học` })}
                            </Text>
                        </Stack>
                    </Group>

                    <Button
                        leftSection={<IconPlus size={16} stroke={3} />}
                        radius="xl"
                        size="xs"
                        color="indigo"
                        className="shadow-md shadow-indigo-500/10 shrink-0 px-3 sm:px-4"
                        onClick={handleCreate}
                        styles={{
                            section: { marginRight: '4px' }
                        }}
                    >
                        <span className="hidden sm:inline text-sm">{t('actions.create', { defaultMessage: 'Thêm mới' })}</span>
                        <span className="sm:hidden text-xs font-bold">{t('actions.create_short', { defaultMessage: 'Thêm' })}</span>
                    </Button>
                </Group>
            </Box>

            {/* Content */}
            <Box className="p-6 max-w-7xl mx-auto">
                <SubjectsTable
                    subjects={subjects}
                    isLoading={isLoadingSubjects}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Box>

            <SubjectDrawer
                opened={opened}
                onClose={close}
                subject={selectedSubject}
                khoiId={parseInt(gradeId)}
            />
        </Box>
    );
}
