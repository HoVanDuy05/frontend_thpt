"use client";

import { Box, Button, Group, Title, Paper, Skeleton, Stack, Text, Tabs, ScrollArea } from "@mantine/core";
import { usePostManager } from "@/feauture/admin/portal/hooks/usePostManager";
import { PostTable } from "@/feauture/admin/portal/components/PostTable";
import { useState } from "react";
import { TBaiViet, ELoaiBaiViet } from "@/shared/types/portal.type";
import { IconPlus, IconNews, IconAlertCircle, IconFileExport, IconCalendarEvent, IconBell } from "@tabler/icons-react";
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
        <Group gap="sm" wrap="wrap">
            <AppButton
                variant="light"
                color="teal"
                leftSection={<IconFileExport size={18} />}
                onClick={handleExport}
                size="sm"
                visibleFrom="sm"
            >
                Xuất Excel
            </AppButton>
            <AppButton
                leftSection={<IconPlus size={18} />}
                onClick={handleCreate}
                size="sm"
            >
                <span className="hidden sm:inline">Tạo bài viết</span>
                <span className="sm:hidden">Tạo</span>
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
                <ScrollArea>
                    <Tabs.List className="bg-zinc-50 dark:bg-zinc-900/50 p-1 rounded-lg inline-flex border border-zinc-200 dark:border-zinc-800 mb-4">
                        <Tabs.Tab
                            value={ELoaiBaiViet.TIN_TUC}
                            leftSection={<IconNews size={16} />}
                            px={{ base: "md", sm: "xl" }}
                        >
                            <span className="hidden sm:inline">Tin tức</span>
                            <span className="sm:hidden">Tin</span>
                        </Tabs.Tab>
                        <Tabs.Tab
                            value={ELoaiBaiViet.SU_KIEN}
                            leftSection={<IconCalendarEvent size={16} />}
                            px={{ base: "md", sm: "xl" }}
                        >
                            <span className="hidden sm:inline">Sự kiện</span>
                            <span className="sm:hidden">SK</span>
                        </Tabs.Tab>
                        <Tabs.Tab
                            value={ELoaiBaiViet.THONG_BAO_CHUNG}
                            leftSection={<IconBell size={16} />}
                            px={{ base: "md", sm: "xl" }}
                        >
                            <span className="hidden sm:inline">Thông báo</span>
                            <span className="sm:hidden">TB</span>
                        </Tabs.Tab>
                    </Tabs.List>
                </ScrollArea>

                <Box>
                    {isLoading ? (
                        <Stack gap="md">
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
