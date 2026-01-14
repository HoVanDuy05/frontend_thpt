import React from 'react';
import { Table, Badge, Group, ActionIcon, Switch, Text, Menu, Button, rem } from '@mantine/core';
import { IconPencil, IconTrash, IconDotsVertical, IconCheck, IconX, IconTemplate } from '@tabler/icons-react';
import { dayjs } from '@/shared/utils/date.util';

interface FlowManagementTableProps {
    flows: any[];
    onEdit: (flow: any) => void;
    onDelete: (id: number) => void;
    onToggleStatus: (id: number, currentStatus: string) => void;
}

export function FlowManagementTable({ flows, onEdit, onDelete, onToggleStatus }: FlowManagementTableProps) {
    const rows = flows.map((flow) => (
        <Table.Tr key={flow.id}>
            <Table.Td>
                <Group gap="sm">
                    <IconTemplate size={20} className="text-gray-400" />
                    <Text size="sm" fw={600}>{flow.ten}</Text>
                </Group>
            </Table.Td>
            <Table.Td>
                <Badge variant="light" color={flow.danhMuc ? 'indigo' : 'gray'} size="sm">
                    {flow.danhMuc?.ten || 'N/A'}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Text size="sm">{dayjs(flow.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
            </Table.Td>
            <Table.Td>
                <Switch
                    checked={flow.trangThai === 'HOAT_DONG'}
                    onChange={() => onToggleStatus(flow.id, flow.trangThai)}
                    color="teal"
                    size="md"
                    thumbIcon={
                        flow.trangThai === 'HOAT_DONG' ? (
                            <IconCheck size={12} color="teal" stroke={3} />
                        ) : (
                            <IconX size={12} color="red" stroke={3} />
                        )
                    }
                />
            </Table.Td>
            <Table.Td>
                <Group gap={0} justify="flex-end">
                    <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                                <IconDotsVertical size={16} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Thao tác</Menu.Label>
                            <Menu.Item leftSection={<IconPencil size={14} />} onClick={() => onEdit(flow)}>
                                Chỉnh sửa
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => onDelete(flow.id)}
                            >
                                Xóa quy trình
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table.ScrollContainer minWidth={700}>
            <Table verticalSpacing="md" horizontalSpacing="md" withRowBorders>
                <Table.Thead bg="var(--mantine-color-default-hover)" className="border-b border-zinc-200 dark:border-zinc-800">
                    <Table.Tr>
                        <Table.Th py="md" style={{ borderTopLeftRadius: rem(12) }}>TÊN QUY TRÌNH</Table.Th>
                        <Table.Th py="md">DANH MỤC</Table.Th>
                        <Table.Th py="md">NGÀY TẠO</Table.Th>
                        <Table.Th py="md">TRẠNG THÁI</Table.Th>
                        <Table.Th py="md" style={{ borderTopRightRadius: rem(12), textAlign: 'right' }}>THAO TÁC</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
