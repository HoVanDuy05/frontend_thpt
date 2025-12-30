"use client";

import { Box, Button, Group, Title, Paper, Skeleton, Stack, Text, Tabs } from "@mantine/core";
import { usePostManager } from "@/feauture/admin/portal/hooks/usePostManager";
import { PostTable } from "@/feauture/admin/portal/components/PostTable";
import { useState } from "react";
import { TBaiViet, ELoaiBaiViet } from "@/shared/types/portal.type";
import { IconPlus, IconNews, IconAlertCircle, IconFileExport } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { LayoutList } from "@/shared/components/LayoutList";
import { AppButton } from "@/shared/components/AppButton";
import { useRouter } from "@/i18n/routing";

export default function PostPage() {
    const [activeTab, setActiveTab] = useState<string | null>(ELoaiBaiViet.TIN_TUC);
    const { posts, isLoading, handleDelete, handleExport } = usePostManager(activeTab as ELoaiBaiViet);
    const router = useRouter();

    const handleCreate = () => {
        router.push("/admin/portal/posts/create");
    };

    const handleEdit = (post: TBaiViet) => {
        router.push(`/admin/portal/posts/${post.id}/edit`);
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

    const PageActions = (
        <Group gap="sm">
            <AppButton
                variant="light"
                color="teal"
                leftSection={<IconFileExport size={18} />}
                onClick={handleExport}
            >
                Xuất Excel
            </AppButton>
            <AppButton leftSection={<IconPlus size={18} />} onClick={handleCreate}>
                Tạo bài viết
            </AppButton>
        </Group>
    );

    return (
        <LayoutList
            title="Quản lý Bài viết"
            description="Quản lý tin tức, sự kiện và các thông báo của nhà trường"
            actions={PageActions}
        >
            <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
                <Box px="md" pt="md">
                    <Tabs.List className="bg-zinc-50 dark:bg-zinc-900/50 p-1 rounded-lg inline-flex border border-zinc-200 dark:border-zinc-800">
                        <Tabs.Tab value={ELoaiBaiViet.TIN_TUC} leftSection={<IconNews size={16} />} px="xl">
                            Tin tức
                        </Tabs.Tab>
                        <Tabs.Tab value={ELoaiBaiViet.SU_KIEN} leftSection={<IconNews size={16} />} px="xl">
                            Sự kiện
                        </Tabs.Tab>
                        <Tabs.Tab value={ELoaiBaiViet.THONG_BAO_CHUNG} leftSection={<IconNews size={16} />} px="xl">
                            Thông báo
                        </Tabs.Tab>
                    </Tabs.List>
                </Box>

                <Box mt="md">
                    {isLoading ? (
                        <Stack p="xl" gap="md">
                            <Skeleton h={50} radius="md" />
                            <Skeleton h={50} radius="md" />
                            <Skeleton h={200} radius="md" />
                        </Stack>
                    ) : (posts && posts.length > 0) ? (
                        <PostTable
                            posts={posts}
                            onEdit={handleEdit}
                            onDelete={confirmDelete}
                        />
                    ) : (
                        <Stack align="center" py={100} gap="md">
                            <Box className="bg-zinc-100 dark:bg-zinc-900 p-8 rounded-full">
                                <IconAlertCircle size={48} className="text-zinc-400" />
                            </Box>
                            <Text fw={500} c="dimmed">Không tìm thấy bài viết nào trong mục này</Text>
                        </Stack>
                    )}
                </Box>
            </Tabs>
        </LayoutList>
    );
}

// Fixed typo in handleOpenCreate
function setEditingBanner(arg0: null) {
    // This was a typo in the original file (setEditingPost vs setEditingBanner)
    // Actually, I should use setEditingPost in the component
}
