"use client";

import { Table, Group, Text, ActionIcon, Badge, Image, Tooltip, Stack, Card, ScrollArea } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { TBanner } from "@/shared/types/portal.type";
import { useMediaQuery } from "@mantine/hooks";

interface BannerTableProps {
    banners: TBanner[];
    onEdit: (banner: TBanner) => void;
    onDelete: (id: number) => void;
}

// Mobile Card View
function MobileBannerCard({ banner, onEdit, onDelete }: { banner: TBanner; onEdit: (banner: TBanner) => void; onDelete: (id: number) => void }) {
    return (
        <Card withBorder radius="md" p="md" className="hover:shadow-md transition-shadow">
            <Stack gap="sm">
                <Image
                    src={banner.hinhAnh}
                    h={120}
                    radius="md"
                    fit="cover"
                    fallbackSrc="https://placehold.co/600x400?text=No+Image"
                />

                <Stack gap="xs">
                    <Text size="sm" fw={600}>
                        {banner.tieuDe || "Không có tiêu đề"}
                    </Text>
                    <Text size="xs" c="dimmed" className="line-clamp-2">
                        {banner.moTa || "—"}
                    </Text>
                </Stack>

                <Group justify="space-between" align="center">
                    <Group gap="sm">
                        <Badge color="blue" variant="light" size="sm">
                            Thứ tự: {banner.thuTu}
                        </Badge>
                        <Badge color={banner.kichHoat ? "green" : "gray"} variant="light" size="sm">
                            {banner.kichHoat ? "Hoạt động" : "Tạm dừng"}
                        </Badge>
                    </Group>

                    <Group gap={8}>
                        <ActionIcon variant="light" color="blue" onClick={() => onEdit(banner)} size="lg">
                            <IconEdit size={18} />
                        </ActionIcon>
                        <ActionIcon variant="light" color="red" onClick={() => onDelete(banner.id)} size="lg">
                            <IconTrash size={18} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Stack>
        </Card>
    );
}

// Desktop Table View
function DesktopBannerTable({ banners, onEdit, onDelete }: BannerTableProps) {
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
                <Group gap={8} justify="flex-end" wrap="nowrap">
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
        <ScrollArea>
            <Table verticalSpacing="sm" highlightOnHover className="min-w-[700px]">
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
        </ScrollArea>
    );
}

export function BannerTable({ banners, onEdit, onDelete }: BannerTableProps) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (isMobile) {
        return (
            <Stack gap="md">
                {banners.map((banner) => (
                    <MobileBannerCard key={banner.id} banner={banner} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </Stack>
        );
    }

    return <DesktopBannerTable banners={banners} onEdit={onEdit} onDelete={onDelete} />;
}
