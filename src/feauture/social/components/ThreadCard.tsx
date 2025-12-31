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
        <Card withBorder={false} p="md" mb={0} bg="transparent" styles={{ root: { borderBottom: '1px solid var(--mantine-color-default-border)', borderRadius: 0 } }}>
            <Group align="flex-start" wrap="nowrap" gap="md">
                <Stack align="center" gap={4} h="100%">
                    <Avatar src={thread.tacGia.anhDaiDien} radius="xl" size="md" />
                    <Box style={{ flex: 1, width: '2px', backgroundColor: 'var(--mantine-color-default-border)', minHeight: '40px' }} />
                </Stack>

                <Stack gap={4} style={{ flex: 1 }}>
                    <Group justify="space-between" align="center">
                        <Text fw={700} size="sm" className="text-gray-900 dark:text-zinc-100">{thread.tacGia.taiKhoan}</Text>
                        <Text size="xs" c="dimmed" fw={500}>{dayjs(thread.ngayTao).fromNow()}</Text>
                    </Group>

                    <Text size="sm" className="text-gray-800 dark:text-zinc-300 leading-relaxed">{thread.noiDung}</Text>

                    {thread.hinhAnh && (
                        <Box mt="xs" style={{ overflow: 'hidden', border: '1px solid var(--mantine-color-default-border)', borderRadius: 'var(--mantine-radius-lg)' }}>
                            <Image src={thread.hinhAnh} alt="Thread image" radius="md" />
                        </Box>
                    )}

                    <Group gap="xs" mt="sm" ml={-8}>
                        <Group gap={4}>
                            <ActionIcon variant="subtile" color={thread.liked ? 'red' : 'gray'} onClick={onLike} size="md" radius="xl">
                                {thread.liked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
                            </ActionIcon>
                            <Text size="xs" fw={600} c={thread.liked ? 'red' : 'dimmed'}>{thread._count.likes}</Text>
                        </Group>

                        <Group gap={4}>
                            <ActionIcon variant="subtile" color="gray" size="md" radius="xl">
                                <IconMessageCircle size={20} />
                            </ActionIcon>
                            <Text size="xs" fw={600} c="dimmed">{thread._count.replies}</Text>
                        </Group>

                        <Group gap={4}>
                            <ActionIcon variant="subtile" color="gray" size="md" radius="xl">
                                <IconRepeat size={20} />
                            </ActionIcon>
                            <Text size="xs" fw={600} c="dimmed">{thread._count.reposts}</Text>
                        </Group>

                        <ActionIcon variant="subtile" color="gray" size="md" radius="xl" ml="auto">
                            <IconShare size={20} />
                        </ActionIcon>
                    </Group>
                </Stack>
            </Group>
        </Card>
    );
};
