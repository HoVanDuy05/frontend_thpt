"use client";

import { Box, Button, Group, Title, Paper, Skeleton, Stack, Text, Avatar, ScrollArea, Badge, Divider } from "@mantine/core";
import { useCommentManager } from "@/feauture/admin/portal/hooks/useCommentManager";
import { usePostManager } from "@/feauture/admin/portal/hooks/usePostManager";
import { TBaiViet, TBinhLuan } from "@/shared/types/portal.type";
import { IconMessage, IconTrash, IconArrowBackUp, IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useState } from "react";
import { modals } from "@mantine/modals";
import { LayoutList } from "@/shared/components/LayoutList";
import { AppButton } from "@/shared/components/AppButton";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export default function CommentManagementPage() {
    const { posts, isLoading: isPostsLoading } = usePostManager();
    const [selectedPost, setSelectedPost] = useState<TBaiViet | null>(null);

    const { comments, isLoading: isCommentsLoading, handleDelete } = useCommentManager(selectedPost?.id || 0);

    const confirmDelete = (id: number) => {
        modals.openConfirmModal({
            title: "Xóa bình luận",
            centered: true,
            children: <Text size="sm">Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.</Text>,
            labels: { confirm: "Xóa", cancel: "Hủy" },
            confirmProps: { color: "red" },
            onConfirm: () => handleDelete(id),
        });
    };

    return (
        <LayoutList
            title="Quản lý Bình luận"
            description="Kiểm duyệt và phản hồi ý kiến của người dùng trên trang portal"
        >
            <Box h="calc(100vh - 250px)" style={{ display: 'flex' }}>
                <Group gap="0" align="flex-start" wrap="nowrap" w="100%" h="100%">
                    {/* Left side: Post List */}
                    <Box
                        w={340}
                        h="100%"
                        className="border-r border-zinc-200 dark:border-zinc-800 flex flex-col"
                    >
                        <Box p="md" className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50">
                            <Group justify="space-between" mb="xs">
                                <Text fw={700} size="sm">Danh sách bài viết</Text>
                                <Badge variant="light" color="blue">{posts?.length || 0}</Badge>
                            </Group>
                        </Box>

                        <ScrollArea className="flex-1 px-3 py-4">
                            {isPostsLoading ? (
                                <Stack gap="sm">
                                    <Skeleton h={80} radius="md" />
                                    <Skeleton h={80} radius="md" />
                                    <Skeleton h={80} radius="md" />
                                </Stack>
                            ) : posts?.map(post => (
                                <Box
                                    key={post.id}
                                    p="md"
                                    className={`rounded-xl cursor-pointer transition-all mb-3 border ${selectedPost?.id === post.id
                                        ? 'bg-blue-50/80 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 ring-1 ring-blue-100 dark:ring-blue-900/30'
                                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border-transparent'}`}
                                    onClick={() => setSelectedPost(post)}
                                >
                                    <Stack gap={6}>
                                        <Text size="sm" fw={selectedPost?.id === post.id ? 700 : 600} className="line-clamp-2">
                                            {post.tieuDe}
                                        </Text>
                                        <Group gap="apart" justify="space-between">
                                            <Text size="xs" c="dimmed" fw={500}>{dayjs(post.ngayTao).format("DD/MM/YYYY")}</Text>
                                            <Badge size="xs" color="blue" variant="dot" radius="xs">{post._count?.binhLuans || 0} bình luận</Badge>
                                        </Group>
                                    </Stack>
                                </Box>
                            ))}
                        </ScrollArea>
                    </Box>

                    {/* Right side: Comments */}
                    <Box className="flex-1 h-100 flex flex-col">
                        {selectedPost ? (
                            <>
                                <Box p="md" className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/20">
                                    <Group justify="space-between">
                                        <Stack gap={2}>
                                            <Text fw={800} size="lg" className="tracking-tight">{selectedPost.tieuDe}</Text>
                                            <Text size="xs" c="dimmed" fw={500}>ID Bài viết: #{selectedPost.id} • {dayjs(selectedPost.ngayTao).format("LLL")}</Text>
                                        </Stack>
                                    </Group>
                                </Box>

                                <ScrollArea p="xl" className="flex-1">
                                    {isCommentsLoading ? (
                                        <Stack gap="lg">
                                            <Skeleton h={100} radius="lg" />
                                            <Skeleton h={100} radius="lg" />
                                            <Skeleton h={100} radius="lg" />
                                        </Stack>
                                    ) : comments && comments.length > 0 ? (
                                        <Stack gap="xl">
                                            {comments.map((comment: TBinhLuan) => (
                                                <CommentItem
                                                    key={comment.id}
                                                    comment={comment}
                                                    onDelete={confirmDelete}
                                                />
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Stack align="center" py={120} gap="md">
                                            <Box className="bg-zinc-50 dark:bg-zinc-900 p-10 rounded-full">
                                                <IconMessage size={64} className="text-zinc-300" />
                                            </Box>
                                            <Stack gap={4} align="center">
                                                <Text fw={700} fz="lg">Chưa có bình luận nào</Text>
                                                <Text size="sm" c="dimmed">Người dùng chưa để lại bình luận nào cho bài viết này</Text>
                                            </Stack>
                                        </Stack>
                                    )}
                                </ScrollArea>
                            </>
                        ) : (
                            <Stack align="center" justify="center" h="100%" gap="xl">
                                <Box className="bg-zinc-50 dark:bg-zinc-900 p-12 rounded-full shadow-inner">
                                    <IconSearch size={80} className="text-zinc-300" />
                                </Box>
                                <Stack gap={4} align="center">
                                    <Title order={3} fw={800}>Hãy chọn một bài viết</Title>
                                    <Text size="sm" c="dimmed" fw={500}>Chọn bài viết ở danh sách bên trái để quản lý bình luận</Text>
                                </Stack>
                            </Stack>
                        )}
                    </Box>
                </Group>
            </Box>
        </LayoutList>
    );
}

function CommentItem({ comment, onDelete }: { comment: TBinhLuan; onDelete: (id: number) => void }) {
    const displayName = comment.nguoiDung?.hoSoGiaoVien?.hoTen || comment.nguoiDung?.hoSoHocSinh?.hoTen || comment.nguoiDung?.taiKhoan || "Người dùng";
    const avatar = comment.nguoiDung?.hoSoGiaoVien?.avatar || comment.nguoiDung?.hoSoHocSinh?.avatar;

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

                <Group gap={8} className="mt-3">
                    <AppButton variant="subtle" size="compact-xs" color="blue" leftSection={<IconArrowBackUp size={14} />}>
                        Phản hồi
                    </AppButton>
                    <AppButton
                        variant="subtle"
                        size="compact-xs"
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => onDelete(comment.id)}
                    >
                        Xóa
                    </AppButton>
                </Group>
            </Box>
        </Group>
    );
}
