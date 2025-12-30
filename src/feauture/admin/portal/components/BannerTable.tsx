"use client";

import { Table, Group, Text, ActionIcon, Badge, Image, Tooltip } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { TBanner } from "@/shared/types/portal.type";

interface BannerTableProps {
    banners: TBanner[];
    onEdit: (banner: TBanner) => void;
    onDelete: (id: number) => void;
}

export function BannerTable({ banners, onEdit, onDelete }: BannerTableProps) {
    const rows = banners.map((banner) => (
        <Table.Tr key={banner.id}>
            <Table.Td>
                <Image
                    src={banner.hinhAnh}
                    h={40}
                    w={80}
                    radius="md"
                    fit="cover"
                    fallbackSrc="https://placehold.co/600x400?text=No+Image"
                />
            </Table.Td>
            <Table.Td>
                <Text size="sm" fw={500}>{banner.tieuDe || "Không có tiêu đề"}</Text>
            </Table.Td>
            <Table.Td>
                <Text size="xs" c="dimmed" className="line-clamp-1">{banner.moTa || "—"}</Text>
            </Table.Td>
            <Table.Td>
                <Text size="sm" fw={700} c="blue">{banner.thuTu}</Text>
            </Table.Td>
            <Table.Td>
                <Badge color={banner.kichHoat ? "green" : "gray"} variant="light">
                    {banner.kichHoat ? "Đang hoạt động" : "Tạm dừng"}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Group gap={8} justify="flex-end">
                    <Tooltip label="Chỉnh sửa">
                        <ActionIcon variant="light" color="blue" onClick={() => onEdit(banner)}>
                            <IconEdit size={16} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Xóa">
                        <ActionIcon variant="light" color="red" onClick={() => onDelete(banner.id)}>
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead className="bg-zinc-50 dark:bg-zinc-900">
                <Table.Tr>
                    <Table.Th w={100}>Hình ảnh</Table.Th>
                    <Table.Th>Tiêu đề</Table.Th>
                    <Table.Th>Mô tả</Table.Th>
                    <Table.Th w={80}>Thứ tự</Table.Th>
                    <Table.Th w={120}>Trạng thái</Table.Th>
                    <Table.Th w={100}></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}
