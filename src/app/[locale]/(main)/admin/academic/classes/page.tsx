"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
    Box, Title, Text, Button, Group, Stack, Paper,
    TextInput, SimpleGrid, ThemeIcon, ActionIcon,
    Avatar, Badge, LoadingOverlay, Menu, Select, Tabs
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CloneClassModal } from "./CloneClassModal";
import { ClassDrawer } from "./ClassDrawer";
import { TLopNam } from "@/shared/types/academic.type";
import {
    IconPlus, IconSearch, IconSchool, IconDots,
    IconEdit, IconTrash, IconFilter, IconChalkboard, IconCopy
} from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

export default function ClassesPage() {
    const t = useTranslations('admin.academic.classes');
    const [searchTerm, setSearchTerm] = useState("");

    // Drawer
    const [opened, { open, close }] = useDisclosure(false);
    const [openedClone, { open: openClone, close: closeClone }] = useDisclosure(false);
    const [selectedLopNam, setSelectedLopNam] = useState<TLopNam | null>(null);

    // Queries & Mutations
    const { data: lopNams, isLoading } = AppQuery.academic.useClassYears();
    const deleteMutation = AppMutation().academic.useDeleteClassYear();

    const filteredLopNams = lopNams?.filter((ln: TLopNam) =>
        (ln.lopHoc?.tenLop?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    ) || [];

    const handleCreate = () => {
        setSelectedLopNam(null);
        open();
    };

    const handleEdit = (lopNam: TLopNam) => {
        setSelectedLopNam(lopNam);
        open();
    };

    const handleDelete = (id: number, name: string) => {
        modals.openConfirmModal({
            title: t('actions.delete_confirm_title', { defaultMessage: 'Xác nhận xóa' }),
            children: (
                <Text size="sm">
                    Bạn có chắc chắn muốn xóa lớp <b>{name}</b> khỏi năm học này?
                </Text>
            ),
            labels: { confirm: t('actions.delete', { defaultMessage: 'Xóa' }), cancel: t('actions.cancel', { defaultMessage: 'Hủy' }) },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                deleteMutation.mutate({ urlParams: { id } }, {
                    onSuccess: () => {
                        notifications.show({ title: 'Thành công', message: 'Đã xóa lớp khỏi năm học', color: 'green' });
                    },
                    onError: () => {
                        notifications.show({ title: 'Thất bại', message: 'Có lỗi xảy ra', color: 'red' });
                    }
                });
            },
        });
    };

    return (
        <Box className="w-full min-h-screen bg-[#fcfcfd] dark:bg-[#09090b]">
            {/* Header */}
            <Box className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 px-6 py-6 sticky top-0 z-40">
                <Group justify="space-between">
                    <Group gap="md">
                        <ThemeIcon size={48} radius="xl" variant="light" color="indigo">
                            <IconSchool size={24} stroke={1.5} />
                        </ThemeIcon>
                        <div>
                            <Title order={2} className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                                {t('title', { defaultMessage: 'Quản lý Lớp học' })}
                            </Title>
                            <Text size="sm" c="dimmed" fw={500}>
                                {t('subtitle', { count: lopNams?.length || 0, defaultMessage: `Danh sách ${lopNams?.length || 0} lớp học trong hệ thống` })}
                            </Text>
                        </div>
                    </Group>

                    <Group>
                        <Button
                            leftSection={<IconCopy size={18} stroke={2.5} />}
                            radius="xl"
                            size="md"
                            variant="light"
                            color="indigo"
                            onClick={openClone}
                        >
                            Sao chép từ năm cũ
                        </Button>
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
                </Group>
            </Box>

            {/* Content */}
            <Box className="p-6 max-w-7xl mx-auto">
                {/* Tools */}
                <Group justify="space-between" mb="xl">
                    <TextInput
                        placeholder={t('search_placeholder', { defaultMessage: 'Tìm kiếm lớp học...' })}
                        leftSection={<IconSearch size={16} />}
                        radius="xl"
                        size="md"
                        w={{ base: "100%", sm: 320 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.currentTarget.value)}
                        styles={{ input: { border: 'none', background: 'var(--mantine-color-gray-1)' } }}
                    />
                    <Group>
                        <Button variant="light" color="gray" radius="xl" leftSection={<IconFilter size={16} />}>
                            {t('actions.filter', { defaultMessage: 'Bộ lọc' })}
                        </Button>
                    </Group>
                </Group>

                {/* Hierarchical View by Grade Level */}
                {isLoading ? (
                    <Box pos="relative" h={400}>
                        <LoadingOverlay visible={true} overlayProps={{ blur: 2 }} />
                    </Box>
                ) : (
                    <Tabs defaultValue="10" variant="pills" radius="xl" color="indigo">
                        <Tabs.List mb="xl">
                            {[10, 11, 12].map((khoi) => (
                                <Tabs.Tab key={khoi} value={khoi.toString()} leftSection={<IconSchool size={16} />}>
                                    Khối {khoi}
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>

                        {[10, 11, 12].map((khoi) => {
                            const lopNamsInGrade = filteredLopNams.filter(ln => ln.lopHoc?.khoiLop === khoi);

                            return (
                                <Tabs.Panel key={khoi} value={khoi.toString()}>
                                    {lopNamsInGrade.length > 0 ? (
                                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                                            {lopNamsInGrade.map((lopNam: TLopNam) => (
                                                <Paper
                                                    key={lopNam.id}
                                                    p="lg"
                                                    radius="lg"
                                                    withBorder
                                                    className="group hover:shadow-xl hover:border-indigo-200 transition-all duration-300 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 relative overflow-hidden"
                                                >
                                                    <Group justify="space-between" align="start" mb="md">
                                                        <ThemeIcon size="lg" radius="md" color="indigo" variant="light">
                                                            <IconChalkboard size={20} stroke={2} />
                                                        </ThemeIcon>

                                                        <Menu position="bottom-end" shadow="md" width={160}>
                                                            <Menu.Target>
                                                                <ActionIcon variant="subtle" color="gray" radius="xl">
                                                                    <IconDots size={18} />
                                                                </ActionIcon>
                                                            </Menu.Target>
                                                            <Menu.Dropdown>
                                                                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEdit(lopNam)}>
                                                                    {t('actions.edit', { defaultMessage: 'Chỉnh sửa' })}
                                                                </Menu.Item>
                                                                <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={() => handleDelete(lopNam.id, lopNam.lopHoc?.tenLop || '')}>
                                                                    {t('actions.delete', { defaultMessage: 'Xóa' })}
                                                                </Menu.Item>
                                                            </Menu.Dropdown>
                                                        </Menu>
                                                    </Group>

                                                    <Stack gap={4}>
                                                        <Title order={3} className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                            {lopNam.lopHoc?.tenLop || 'N/A'}
                                                        </Title>

                                                        <Group gap={6} mt="xs">
                                                            <Text size="sm" fw={500} c="dimmed">GVCN:</Text>
                                                            {lopNam.gvChuNhiem ? (
                                                                <Badge variant="light" color="blue" radius="sm">
                                                                    {lopNam.gvChuNhiem.hoTen}
                                                                </Badge>
                                                            ) : (
                                                                <Text size="sm" c="dimmed" fs="italic">Chưa gán</Text>
                                                            )}
                                                        </Group>

                                                        <Group gap={6}>
                                                            <Text size="sm" fw={500} c="dimmed">Năm học:</Text>
                                                            <Text size="sm">{lopNam.namHoc?.tenNamHoc || 'N/A'}</Text>
                                                        </Group>

                                                        <Group mt="md" gap="xs">
                                                            <Badge variant="dot" color="teal" size="lg" radius="xl" className="pl-0">
                                                                {lopNam._count?.hocSinhs || lopNam.siSo || 0} Học sinh
                                                            </Badge>
                                                        </Group>
                                                    </Stack>
                                                </Paper>
                                            ))}
                                        </SimpleGrid>
                                    ) : (
                                        <Paper p={80} radius="lg" withBorder className="border-dashed bg-gray-50/50">
                                            <Stack align="center" gap="xs">
                                                <IconChalkboard size={48} stroke={1} className="text-gray-400" />
                                                <Text c="dimmed" ta="center" fw={500}>Chưa có lớp nào trong khối này</Text>
                                            </Stack>
                                        </Paper>
                                    )}
                                </Tabs.Panel>
                            );
                        })}
                    </Tabs>
                )}
            </Box>

            <ClassDrawer opened={opened} onClose={close} lopNamModel={selectedLopNam} />
            <CloneClassModal opened={openedClone} onClose={closeClone} />
        </Box>
    );
}
