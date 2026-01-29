import React from 'react';
import { Table, Badge, Button, Group, Text, ActionIcon, Tooltip, rem, Box, Stack } from '@mantine/core';
import { IconCheck, IconX, IconEye } from '@tabler/icons-react';
import { TPhienQuyTrinh, TrangThaiPhien } from '../types';
import dayjs from 'dayjs';

interface ApprovalTableProps {
    requests: TPhienQuyTrinh[];
    onAction?: (id: number, action: 'APPROVE' | 'REJECT') => void;
    onView?: (request: TPhienQuyTrinh) => void;
    isAdmin?: boolean;
}

const statusColors: Record<TrangThaiPhien, string> = {
    CHO_DUYET: 'indigo',
    DANG_XU_LY: 'blue',
    DA_DUYET: 'green',
    TU_CHOI: 'red',
    HUY_BO: 'gray',
};

export const ApprovalTable: React.FC<ApprovalTableProps> = ({ requests, onAction, onView, isAdmin }) => {
    const rows = requests.map((req) => (
        <Table.Tr key={req.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <Table.Td>
                <Group gap="sm">
                    <Box className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold border border-zinc-200 dark:border-zinc-700">
                        #{req.id}
                    </Box>
                    <Stack gap={0}>
                        <Text size="sm" fw={700}>{req.quyTrinh?.ten}</Text>
                        <Text size="xs" c="dimmed">Quy trình hệ thống</Text>
                    </Stack>
                </Group>
            </Table.Td>
            <Table.Td>
                <Group gap="xs">
                    <Box className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-black uppercase">
                        {req.nguoiTaoId}
                    </Box>
                    <Stack gap={0}>
                        <Text size="sm" fw={600}>{req.nguoiTao?.hoTen || req.nguoiTao?.taiKhoan || `Người dùng #${req.nguoiTaoId}`}</Text>
                        <Text size="xs" c="dimmed">{req.nguoiTao?.email || 'Mã định danh'}</Text>
                    </Stack>
                </Group>
            </Table.Td>
            <Table.Td>
                <Badge color={statusColors[req.trangThai]} variant="light" size="sm">
                    {req.trangThai.replace('_', ' ')}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Text size="sm" fw={600}>Giai đoạn {req.buocHienTai}</Text>
                <Text size="xs" c="dimmed">Đang xử lý</Text>
            </Table.Td>
            <Table.Td>
                <Text size="sm" fw={500}>{dayjs(req.ngayTao).format('DD/MM HH:mm')}</Text>
            </Table.Td>
            <Table.Td>
                <Group gap="xs" justify="flex-end">
                    <Tooltip label="Xem hồ sơ / Audit" position="left" withArrow>
                        <ActionIcon variant="subtle" color="gray" size="lg" radius="md" onClick={() => onView?.(req)}>
                            <IconEye size={20} />
                        </ActionIcon>
                    </Tooltip>

                    {isAdmin && (req.trangThai === TrangThaiPhien.CHO_DUYET || req.trangThai === TrangThaiPhien.DANG_XU_LY) && (
                        <>
                            <Tooltip label="Phê duyệt cưỡng bức">
                                <ActionIcon variant="light" color="green" size="lg" radius="md" onClick={() => onAction?.(req.id, 'APPROVE')}>
                                    <IconCheck size={20} stroke={2.5} />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Hủy bỏ yêu cầu">
                                <ActionIcon variant="light" color="red" size="lg" radius="md" onClick={() => onAction?.(req.id, 'REJECT')}>
                                    <IconX size={20} stroke={2.5} />
                                </ActionIcon>
                            </Tooltip>
                        </>
                    )}
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="md" horizontalSpacing="md">
                <Table.Thead bg="var(--mantine-color-default-hover)" className="border-b border-zinc-200 dark:border-zinc-800">
                    <Table.Tr>
                        <Table.Th py="md" style={{ borderTopLeftRadius: rem(12) }}>THÔNG TIN QUY TRÌNH</Table.Th>
                        <Table.Th py="md">NGƯỜI YÊU CẦU</Table.Th>
                        <Table.Th py="md">TRẠNG THÁI</Table.Th>
                        <Table.Th py="md">TIẾN ĐỘ</Table.Th>
                        <Table.Th py="md">THỜI GIAN</Table.Th>
                        <Table.Th py="md" style={{ borderTopRightRadius: rem(12), textAlign: 'right' }}>QUYỀN HẠN</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
};
