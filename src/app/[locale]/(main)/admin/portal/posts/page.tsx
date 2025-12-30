"use client";

import { Box, Button, Group, Title, Paper, Skeleton, Stack, Text, Tabs } from "@mantine/core";
import { usePostManager } from "@/feauture/admin/portal/hooks/usePostManager";
import { PostTable } from "@/feauture/admin/portal/components/PostTable";
import { PostModal } from "@/feauture/admin/portal/components/PostModal";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { TBaiViet, ELoaiBaiViet } from "@/shared/types/portal.type";
import { IconPlus, IconNews, IconAlertCircle } from "@tabler/icons-react";
import { modals } from "@mantine/modals";

export default function PostPage() {
    const [activeTab, setActiveTab] = useState<string | null>(ELoaiBaiViet.TIN_TUC);
    const { posts, isLoading, handleCreate, handleUpdate, handleDelete, handleExport, isPending } = usePostManager(activeTab as ELoaiBaiViet);

    const [opened, { open, close }] = useDisclosure(false);
    const [editingPost, setEditingPost] = useState<TBaiViet | null>(null);

    const handleOpenCreate = () => {
        setEditingPost(null);
        open();
    };

    const handleOpenEdit = (post: TBaiViet) => {
        setEditingPost(post);
        open();
    };

    const confirmDelete = (id: number) => {
        modals.openConfirmModal({
            title: "Xác nhận xóa",
            centered: true,
            children: (
                <Text size="sm">
                    Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
                </Text>
            ),
            labels: { confirm: "Xóa", cancel: "Hủy" },
            confirmProps: { color: "red" },
            onConfirm: () => handleDelete(id),
        });
    };

    const handleSubmit = async (data: any) => {
        if (editingPost) {
            await handleUpdate(editingPost.id, data);
        } else {
            await handleCreate(data);
        }
        close();
    };

    return (
        <Box p="md">
            <Stack gap="lg">
                <Group justify="space-between">
                    <Stack gap={2}>
                        <Title order={2}>Quản lý Bài viết</Title>
                        <Text size="sm" c="dimmed">Quản lý tin tức, sự kiện và các thông báo của nhà trường</Text>
                    </Stack>
                    <Group gap="sm">
                        <Button
                            variant="light"
                            color="teal"
                            leftSection={<IconNews size={18} />}
                            onClick={handleExport}
                        >
                            Xuất Excel
                        </Button>
                        <Button leftSection={<IconPlus size={18} />} onClick={handleOpenCreate} radius="md">
                            Tạo bài viết
                        </Button>
                    </Group>
                </Group>

                <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
                    <Tabs.List className="bg-white dark:bg-zinc-950 px-2 pt-2 border-b-0">
                        <Tabs.Tab value={ELoaiBaiViet.TIN_TUC} leftSection={<IconNews size={16} />}>
                            Tin tức
                        </Tabs.Tab>
                        <Tabs.Tab value={ELoaiBaiViet.SU_KIEN} leftSection={<IconNews size={16} />}>
                            Sự kiện
                        </Tabs.Tab>
                        <Tabs.Tab value={ELoaiBaiViet.THONG_BAO} leftSection={<IconNews size={16} />}>
                            Thông báo
                        </Tabs.Tab>
                    </Tabs.List>

                    <Paper mt="md" radius="md" withBorder shadow="sm" className="bg-white dark:bg-zinc-950 overflow-hidden">
                        {isLoading ? (
                            <Stack p="md" gap="sm">
                                <Skeleton h={50} radius="sm" />
                                <Skeleton h={50} radius="sm" />
                                <Skeleton h={150} radius="sm" />
                            </Stack>
                        ) : posts && posts.length > 0 ? (
                            <PostTable
                                posts={posts}
                                onEdit={handleOpenEdit}
                                onDelete={confirmDelete}
                            />
                        ) : (
                            <Stack align="center" py={60} gap="sm">
                                <IconAlertCircle size={40} className="text-zinc-300" />
                                <Text fw={500} c="dimmed">Không tìm thấy bài viết nào trong mục này</Text>
                            </Stack>
                        )}
                    </Paper>
                </Tabs>
            </Stack>

            <PostModal
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                initialData={editingPost}
                loading={isPending}
            />
        </Box>
    );
}
