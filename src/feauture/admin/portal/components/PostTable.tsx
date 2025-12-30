"use client";

import { Table, Group, Text, ActionIcon, Badge, Image, Tooltip, Stack, Card, Box, ScrollArea } from "@mantine/core";
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react";
import { TBaiViet, ELoaiBaiViet } from "@/shared/types/portal.type";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";

interface PostTableProps {
    posts: TBaiViet[];
    onEdit: (post: TBaiViet) => void;
    onDelete: (id: number) => void;
}

const TYPE_COLORS: Record<ELoaiBaiViet, string> = {
    [ELoaiBaiViet.TIN_TUC]: "blue",
    [ELoaiBaiViet.THONG_BAO_CHUNG]: "orange",
    [ELoaiBaiViet.SU_KIEN]: "pink",
    [ELoaiBaiViet.HUONG_DAN]: "teal",
};

const TYPE_LABELS: Record<ELoaiBaiViet, string> = {
    [ELoaiBaiViet.TIN_TUC]: "Tin tức",
    [ELoaiBaiViet.THONG_BAO_CHUNG]: "Thông báo",
    [ELoaiBaiViet.SU_KIEN]: "Sự kiện",
    [ELoaiBaiViet.HUONG_DAN]: "Hướng dẫn",
};

// Mobile Card View
function MobilePostCard({ post, onEdit, onDelete }: { post: TBaiViet; onEdit: (post: TBaiViet) => void; onDelete: (id: number) => void }) {
    return (
        <Card withBorder radius="md" p="md" className="hover:shadow-md transition-shadow">
            <Stack gap="sm">
                <Group gap="sm" wrap="nowrap">
                    <Image
                        src={post.anhBia}
                        h={60}
                        w={80}
                        radius="sm"
                        fallbackSrc="https://placehold.co/400x300?text=No+Thumb"
                        className="flex-shrink-0"
                    />
                    <Stack gap={4} className="flex-1 min-w-0">
                        <Text size="sm" fw={600} className="line-clamp-2">
                            {post.tieuDe}
                        </Text>
                        <Group gap="xs">
                            <Badge color={TYPE_COLORS[post.loai]} variant="light" size="xs">
                                {TYPE_LABELS[post.loai]}
                            </Badge>
                            <Badge color={post.daXuatBan ? "green" : "gray"} variant="dot" size="xs">
                                {post.daXuatBan ? "Hiển thị" : "Ẩn"}
                            </Badge>
                        </Group>
                    </Stack>
                </Group>

                <Group justify="space-between" align="center">
                    <Group gap="md">
                        <Group gap={4} c="dimmed">
                            <IconEye size={14} />
                            <Text size="xs">{post.luotXem || 0}</Text>
                        </Group>
                        <Text size="xs" c="dimmed">
                            {dayjs(post.ngayTao).format("DD/MM/YYYY")}
                        </Text>
                    </Group>

                    <Group gap={8}>
                        <ActionIcon variant="light" color="blue" onClick={() => onEdit(post)} size="lg">
                            <IconEdit size={18} />
                        </ActionIcon>
                        <ActionIcon variant="light" color="red" onClick={() => onDelete(post.id)} size="lg">
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Stack>
        </Card>
    );
}

// Desktop Table View
function DesktopPostTable({ posts, onEdit, onDelete }: PostTableProps) {
    const rows = posts.map((post) => (
        <Table.Tr key={post.id}>
            <Table.Td>
                <Group gap="sm" wrap="nowrap">
                    <Image
                        src={post.anhBia}
                        h={40}
                        w={60}
                        radius="sm"
                        fallbackSrc="https://placehold.co/400x300?text=No+Thumb"
                        className="flex-shrink-0"
                    />
                    <Stack gap={0} className="min-w-0">
                        <Text size="sm" fw={600} className="line-clamp-1">
                            {post.tieuDe}
                        </Text>
                        <Text size="xs" c="dimmed" className="line-clamp-1">
                            {post.duongDan}
                        </Text>
                    </Stack>
                </Group>
            </Table.Td>
            <Table.Td>
                <Badge color={TYPE_COLORS[post.loai]} variant="light">
                    {TYPE_LABELS[post.loai]}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Group gap={4} c="dimmed">
                    <IconEye size={14} />
                    <Text size="xs">{post.luotXem || 0}</Text>
                </Group>
            </Table.Td>
            <Table.Td>
                <Text size="xs">{dayjs(post.ngayTao).format("DD/MM/YYYY")}</Text>
            </Table.Td>
            <Table.Td>
                <Badge color={post.daXuatBan ? "green" : "gray"} variant="dot">
                    {post.daXuatBan ? "Hiển thị" : "Ẩn"}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Group gap={8} justify="flex-end" wrap="nowrap">
                    <Tooltip label="Sửa">
                        <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(post)}>
                            <IconEdit size={18} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Xóa">
                        <ActionIcon variant="subtle" color="red" onClick={() => onDelete(post.id)}>
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <ScrollArea>
            <Table verticalSpacing="sm" highlightOnHover className="min-w-[800px]">
                <Table.Thead className="bg-zinc-50 dark:bg-zinc-900">
                    <Table.Tr>
                        <Table.Th>Bài viết</Table.Th>
                        <Table.Th w={120}>Loại</Table.Th>
                        <Table.Th w={80}>Lượt xem</Table.Th>
                        <Table.Th w={120}>Ngày tạo</Table.Th>
                        <Table.Th w={100}>Trạng thái</Table.Th>
                        <Table.Th w={100}></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea>
    );
}

export function PostTable({ posts, onEdit, onDelete }: PostTableProps) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (isMobile) {
        return (
            <Stack gap="md">
                {posts.map((post) => (
                    <MobilePostCard key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </Stack>
        );
    }

    return <DesktopPostTable posts={posts} onEdit={onEdit} onDelete={onDelete} />;
}
