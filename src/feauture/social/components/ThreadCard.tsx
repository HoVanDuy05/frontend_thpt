import React from 'react';
import { Card, Text, Avatar, Group, ActionIcon, Stack, Image, Box, Divider } from '@mantine/core';
import { IconHeart, IconMessageCircle, IconRepeat, IconShare, IconHeartFilled } from '@tabler/icons-react';
import { Thread } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface ThreadCardProps {
    thread: Thread;
    onLike?: () => void;
    onComment?: () => void;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({ thread, onLike }) => {
    return (
        <Card withBorder={false} p="md" mb="xs" bg="transparent" styles={{ root: { borderBottom: '1px solid var(--mantine-color-gray-2)' } }}>
            <Group align="flex-start" wrap="nowrap">
                <Stack align="center" gap={4}>
                    <Avatar src={thread.tacGia.anhDaiDien} radius="xl" size="md" />
                    <Box style={{ flex: 1, width: '2px', backgroundColor: 'var(--mantine-color-gray-2)', minHeight: '20px' }} />
                </Stack>

                <Stack gap={4} style={{ flex: 1 }}>
                    <Group justify="space-between" align="center">
                        <Text fw={600} size="sm">{thread.tacGia.taiKhoan}</Text>
                        <Text size="xs" c="dimmed">{dayjs(thread.ngayTao).fromNow()}</Text>
                    </Group>

                    <Text size="sm">{thread.noiDung}</Text>

                    {thread.hinhAnh && (
                        <Box mt="xs" radius="md" style={{ overflow: 'hidden', border: '1px solid var(--mantine-color-gray-2)' }}>
                            <Image src={thread.hinhAnh} alt="Thread image" />
                        </Box>
                    )}

                    <Group gap="xs" mt="sm">
                        <ActionIcon variant="subtile" color={thread.liked ? 'red' : 'gray'} onClick={onLike} size="sm">
                            {thread.liked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                        </ActionIcon>
                        <Text size="xs" c="dimmed">{thread._count.likes}</Text>

                        <ActionIcon variant="subtile" color="gray" size="sm">
                            <IconMessageCircle size={18} />
                        </ActionIcon>
                        <Text size="xs" c="dimmed">{thread._count.replies}</Text>

                        <ActionIcon variant="subtile" color="gray" size="sm">
                            <IconRepeat size={18} />
                        </ActionIcon>
                        <Text size="xs" c="dimmed">{thread._count.reposts}</Text>

                        <ActionIcon variant="subtile" color="gray" size="sm" ml="auto">
                            <IconShare size={18} />
                        </ActionIcon>
                    </Group>
                </Stack>
            </Group>
        </Card>
    );
};
