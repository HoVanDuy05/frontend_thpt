"use client";

import { Box, Group, Title, Paper, Skeleton, Stack, Text, Avatar, ScrollArea, Badge, Divider, rem } from "@mantine/core";
import { useCommentManager } from "@/feauture/admin/portal/hooks/useCommentManager";
import { usePostManager } from "@/feauture/admin/portal/hooks/usePostManager";
import { TBaiViet, TBinhLuan } from "@/shared/types/portal.type";
import { IconMessage, IconTrash, IconArrowBackUp, IconSearch, IconChevronLeft } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useState } from "react";
import { modals } from "@mantine/modals";
import { LayoutList } from "@/shared/components/LayoutList";
import { AppButton } from "@/shared/components/AppButton";
import { useMediaQuery } from "@mantine/hooks";

dayjs.extend(relativeTime);
dayjs.locale("vi");

import { useTranslations } from "next-intl";

export default function CommentManagementPage() {
    const t = useTranslations("portal.comments");
    const tCommon = useTranslations("common");
    const { posts, isLoading: isPostsLoading } = usePostManager();
    const [selectedPost, setSelectedPost] = useState<TBaiViet | null>(null);
    const isMobile = useMediaQuery("(max-width: 48em)");

    const { comments, isLoading: isCommentsLoading, handleDelete } = useCommentManager(selectedPost?.id || 0);

    const confirmDelete = (id: number) => {
        modals.openConfirmModal({
            title: tCommon("delete_title"),
            centered: true,
            children: <Text size="sm">{tCommon("confirm_delete")}</Text>,
            labels: { confirm: tCommon("actions.delete"), cancel: tCommon("actions.cancel") },
            confirmProps: { color: "red" },
            onConfirm: () => handleDelete(id),
        });
    };

    return (
        <LayoutList
            title={t("title")}
            description={t("subtitle")}
        >
            <Box
                style={{
                    display: 'flex',
                    height: 'calc(100vh - 200px)',
                    overflow: 'hidden',
                    borderRadius: 'var(--mantine-radius-lg)',
                    border: `${rem(1)} solid var(--mantine-color-default-border)`,
                    background: 'var(--mantine-color-body)'
                }}
            >
                <Group gap="0" align="flex-start" wrap="nowrap" w="100%" h="100%">
                    {/* Left side: Post List */}
                    {(!isMobile || !selectedPost) && (
                        <Box
                            w={isMobile ? "100%" : 360}
                            h="100%"
                            style={{
                                borderRight: isMobile ? 'none' : `${rem(1)} solid var(--mantine-color-default-border)`,
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box
                                p="md"
                                style={{
                                    borderBottom: `${rem(1)} solid var(--mantine-color-default-border)`,
                                    background: 'var(--mantine-color-default-hover)'
                                }}
                            >
                                <Group justify="space-between" mb="xs">
                                    <Text fw={701} size="sm">{t("list_title")}</Text>
                                    <Badge variant="light" color="indigo">{posts?.length || 0}</Badge>
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
                                        style={{
                                            border: `${rem(1)} solid ${selectedPost?.id === post.id ? 'var(--mantine-color-indigo-2)' : 'transparent'}`,
                                            background: selectedPost?.id === post.id ? 'var(--mantine-color-indigo-light)' : 'transparent',
                                        }}
                                        className={`rounded-xl cursor-pointer transition-all mb-3 hover:bg-[var(--mantine-color-default-hover)]`}
                                        onClick={() => setSelectedPost(post)}
                                    >
                                        <Stack gap={6}>
                                            <Text size="sm" fw={selectedPost?.id === post.id ? 700 : 600} className="line-clamp-2">
                                                {post.tieuDe}
                                            </Text>
                                            <Group gap="apart" justify="space-between">
                                                <Text size="xs" c="dimmed" fw={500}>{dayjs(post.ngayTao).format("DD/MM/YYYY")}</Text>
                                                <Badge size="xs" color="indigo" variant="dot">{post._count?.binhLuans || 0} {t("count_suffix")}</Badge>
                                            </Group>
                                        </Stack>
                                    </Box>
                                ))}
                            </ScrollArea>
                        </Box>
                    )}

                    {/* Right side: Comments */}
                    {(!isMobile || selectedPost) && (
                        <Box className="flex-1 h-100 flex flex-col">
                            {selectedPost ? (
                                <>
                                    <Box
                                        p="md"
                                        style={{
                                            borderBottom: `${rem(1)} solid var(--mantine-color-default-border)`,
                                            background: 'var(--mantine-color-default-hover)'
                                        }}
                                    >
                                        <Group justify="space-between" wrap="nowrap">
                                            <Group gap="sm" wrap="nowrap">
                                                {isMobile && (
                                                    <AppButton variant="subtle" size="sm" p={4} onClick={() => setSelectedPost(null)}>
                                                        <IconChevronLeft size={20} />
                                                    </AppButton>
                                                )}
                                                <Stack gap={2}>
                                                    <Text fw={800} size="md" className="line-clamp-1">{selectedPost.tieuDe}</Text>
                                                    <Text size="xs" c="dimmed" fw={500}>#{selectedPost.id} • {dayjs(selectedPost.ngayTao).format("DD/MM/YYYY")}</Text>
                                                </Stack>
                                            </Group>
                                        </Group>
                                    </Box>

                                    <ScrollArea p="xl" className="flex-1">
                                        {isCommentsLoading ? (
                                            <Stack gap="lg">
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
                                                <Box
                                                    style={{ background: 'var(--mantine-color-default-hover)' }}
                                                    className="p-10 rounded-full"
                                                >
                                                    <IconMessage size={64} className="text-[var(--mantine-color-dimmed)]" />
                                                </Box>
                                                <Stack gap={4} align="center">
                                                    <Text fw={700} fz="lg">{t("no_comments")}</Text>
                                                    <Text size="sm" c="dimmed">{t("no_comments_subtitle")}</Text>
                                                </Stack>
                                            </Stack>
                                        )}
                                    </ScrollArea>
                                </>
                            ) : (
                                <Stack align="center" justify="center" h="100%" gap="xl">
                                    <Box
                                        style={{ background: 'var(--mantine-color-default-hover)' }}
                                        className="p-12 rounded-full"
                                    >
                                        <IconSearch size={80} className="text-[var(--mantine-color-dimmed)]" />
                                    </Box>
                                    <Stack gap={4} align="center">
                                        <Title order={3} fw={800}>{t("select_post")}</Title>
                                        <Text size="sm" c="dimmed" fw={500}>{t("select_post_subtitle")}</Text>
                                    </Stack>
                                </Stack>
                            )}
                        </Box>
                    )}
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
            <Avatar src={avatar} radius="xl" size="md" color="indigo" variant="light">
                {displayName[0]}
            </Avatar>
            <Box
                style={{
                    background: 'var(--mantine-color-default-hover)',
                    border: `${rem(1)} solid var(--mantine-color-default-border)`
                }}
                className="flex-1 p-4 rounded-xl relative group"
            >
                <Group justify="space-between" mb={4}>
                    <Text size="sm" fw={700}>{displayName}</Text>
                    <Text size="xs" c="dimmed">{dayjs(comment.ngayTao).fromNow()}</Text>
                </Group>
                <Text size="sm" style={{ lineHeight: 1.6 }}>{comment.noiDung}</Text>

                <Group gap={8} className="mt-4">
                    <AppButton variant="subtle" size="compact-xs" color="indigo" leftSection={<IconArrowBackUp size={14} />}>
                        {useTranslations("portal.comments")("reply")}
                    </AppButton>
                    <AppButton
                        variant="subtle"
                        size="compact-xs"
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => onDelete(comment.id)}
                    >
                        {useTranslations("common")("actions.delete")}
                    </AppButton>
                </Group>
            </Box>
        </Group>
    );
}
