"use client";

import { Box, Button, Group, Title, Paper, Skeleton, Stack, Text, Avatar, ScrollArea, Badge } from "@mantine/core";
import { useCommentManager } from "@/feauture/admin/portal/hooks/useCommentManager";
import { usePostManager } from "@/feauture/admin/portal/hooks/usePostManager";
import { TBaiViet, TBinhLuan } from "@/shared/types/portal.type";
import { IconMessage, IconTrash, IconArrowBackUp } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useState } from "react";
import { modals } from "@mantine/modals";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export default function CommentManagementPage() {
    const { posts, isLoading: isPostsLoading } = usePostManager();
    const [selectedPost, setSelectedPost] = useState<TBaiViet | null>(null);

    const { comments, isLoading: isCommentsLoading, handleDelete } = useCommentManager(selectedPost?.id || 0);

    const confirmDelete = (id: number) => {
        modals.openConfirmModal({
            title: "Xóa bình luận",
            children: <Text size="sm">Bạn có chắc chắn muốn xóa bình luận này?</Text>,
            labels: { confirm: "Xóa", cancel: "Hủy" },
            confirmProps: { color: "red" },
            onConfirm: () => handleDelete(id),
        });
    };

    return (
        <Box p="md">
            <Stack gap="lg" h="calc(100vh - 120px)">
                <Group justify="space-between">
                    <Stack gap={2}>
                        <Title order={2}>Quản lý Bình luận</Title>
                        <Text size="sm" c="dimmed">Kiểm duyệt và phản hồi ý kiến của người dùng</Text>
                    </Stack>
                </Group>

                <Group gap="md" align="flex-start" className="flex-1 overflow-hidden">
                    {/* Left side: Post List */}
                    <Paper withBorder p="md" radius="md" className="w-1/3 h-full flex flex-col bg-white dark:bg-zinc-950">
                        <Text fw={700} border-b pb="xs" mb="sm">Danh sách bài viết</Text>
                        <ScrollArea className="flex-1 px-1">
                            {isPostsLoading ? (
                                <Stack gap="xs">
                                    <Skeleton h={60} radius="sm" />
                                    <Skeleton h={60} radius="sm" />
                                    <Skeleton h={60} radius="sm" />
                                </Stack>
                            ) : posts?.map(post => (
                                <Box
                                    key={post.id}
                                    p="sm"
                                    className={`rounded-md cursor-pointer transition-colors mb-2 border ${selectedPost?.id === post.id ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 border-transparent'}`}
                                    onClick={() => setSelectedPost(post)}
                                >
                                    <Stack gap={4}>
                                        <Text size="sm" fw={selectedPost?.id === post.id ? 700 : 500} className="line-clamp-2">
                                            {post.tieuDe}
                                        </Text>
                                        <Group gap="apart" justify="space-between">
                                            <Text size="xs" c="dimmed">{dayjs(post.ngayTao).format("DD/MM/YYYY")}</Text>
                                            <Badge size="xs" color="blue" variant="light">{post._count?.binhLuans || 0} bình luận</Badge>
                                        </Group>
                                    </Stack>
                                </Box>
                            ))}
                        </ScrollArea>
                    </Paper>

                    {/* Right side: Comments for selected post */}
                    <Paper withBorder radius="md" className="flex-1 h-full flex flex-col bg-white dark:bg-zinc-950">
                        {selectedPost ? (
                            <>
                                <Box p="md" className="border-b bg-zinc-50/50 dark:bg-zinc-900/30">
                                    <Group justify="space-between">
                                        <Stack gap={2}>
                                            <Text fw={700}>{selectedPost.tieuDe}</Text>
                                            <Text size="xs" c="dimmed">Bài viết ID: {selectedPost.id}</Text>
                                        </Stack>
                                    </Group>
                                </Box>

                                <ScrollArea p="md" className="flex-1">
                                    {isCommentsLoading ? (
                                        <Stack>
                                            <Skeleton h={80} radius="md" />
                                            <Skeleton h={80} radius="md" />
                                        </Stack>
                                    ) : (comments as any) && (comments as any).length > 0 ? (
                                        <Stack gap="lg">
                                            {(comments as any).map((comment: any) => (
                                                <CommentItem
                                                    key={comment.id}
                                                    comment={comment}
                                                    onDelete={confirmDelete}
                                                />
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Stack align="center" py={100} gap="sm">
                                            <IconMessage size={48} className="text-zinc-300" />
                                            <Text c="dimmed">Chưa có bình luận nào cho bài viết này</Text>
                                        </Stack>
                                    )}
                                </ScrollArea>
                            </>
                        ) : (
                            <Stack align="center" justify="center" h="100%" gap="md">
                                <Box className="bg-zinc-100 dark:bg-zinc-900 p-8 rounded-full">
                                    <IconMessage size={64} className="text-zinc-400" />
                                </Box>
                                <Text fw={500} c="dimmed">Chọn một bài viết để xem bình luận</Text>
                            </Stack>
                        )}
                    </Paper>
                </Group>
            </Stack>
        </Box>
    );
}

function CommentItem({ comment, onDelete }: { comment: any; onDelete: (id: number) => void }) {
    const displayName = comment.nguoiDung?.hoSoGiaoVien?.hoTen || comment.nguoiDung?.hoSoHocSinh?.hoTen || comment.nguoiDung?.taiKhoan || "Người dùng";
    const avatar = (comment.nguoiDung?.hoSoGiaoVien as any)?.avatar || (comment.nguoiDung?.hoSoHocSinh as any)?.avatar;

    return (
        <Group align="flex-start" wrap="nowrap" gap="md">
            <Avatar src={avatar} radius="xl" size="md">
                {displayName[0]}
            </Avatar>
            <Box className="flex-1 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg relative group">
                <Group justify="space-between" mb={4}>
                    <Text size="sm" fw={700}>{displayName}</Text>
                    <Text size="xs" c="dimmed">{dayjs(comment.ngayTao).fromNow()}</Text>
                </Group>
                <Text size="sm">{comment.noiDung}</Text>

                <Group gap={8} className="mt-2">
                    <Button variant="subtle" size="compact-xs" color="blue" leftSection={<IconArrowBackUp size={14} />}>
                        Phản hồi
                    </Button>
                    <Button
                        variant="subtle"
                        size="compact-xs"
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => onDelete(comment.id)}
                    >
                        Xóa
                    </Button>
                </Group>
            </Box>
        </Group>
    );
}
