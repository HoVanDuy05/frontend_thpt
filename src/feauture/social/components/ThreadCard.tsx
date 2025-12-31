import React from 'react';
import { Card, Text, Avatar, Group, ActionIcon, Stack, Image, Box, Divider } from '@mantine/core';
import { IconHeart, IconMessageCircle, IconRepeat, IconShare, IconHeartFilled } from '@tabler/icons-react';
import { Thread } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';

interface ThreadCardProps {
    thread: Thread;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({ thread: initialThread }) => {
    const likeMutation = AppMutation().social.useLikeThread(initialThread.id);
    const [thread, setThread] = React.useState(initialThread);

    const handleLike = () => {
        likeMutation.mutate(undefined, {
            onSuccess: (data) => {
                setThread(prev => ({
                    ...prev,
                    liked: data.liked,
                    _count: {
                        ...prev._count,
                        likes: data.liked ? prev._count.likes + 1 : prev._count.likes - 1
                    }
                }));
            }
        });
    };

    return (
        <Card
            withBorder={false}
            p="md"
            mb={0}
            bg="transparent"
            className="border-b border-gray-100 dark:border-zinc-900 last:border-0 hover:bg-gray-50/30 dark:hover:bg-zinc-900/10 transition-colors"
            radius={0}
        >
            <Group align="flex-start" wrap="nowrap" gap="md">
                <Stack align="center" gap={4} className="h-full">
                    <Avatar
                        src={thread.tacGia.avatar}
                        radius="xl"
                        size="md"
                        className="shadow-sm border border-zinc-100 dark:border-zinc-800"
                    />
                    <Box className="w-[1.5px] flex-1 bg-zinc-100 dark:bg-zinc-900 min-h-[40px] rounded-full" />
                </Stack>

                <Stack gap={4} className="flex-1">
                    <Group justify="space-between" align="center">
                        <Text fw={800} size="sm" className="text-zinc-900 dark:text-zinc-100 tracking-tight hover:underline cursor-pointer">
                            {thread.tacGia.taiKhoan}
                        </Text>
                        <Text size="xs" c="dimmed" fw={600} className="tracking-tighter">
                            {dayjs(thread.ngayTao).fromNow()}
                        </Text>
                    </Group>

                    <Text size="sm" className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                        {thread.noiDung}
                    </Text>

                    {thread.hinhAnh && (
                        <Box mt="xs" className="overflow-hidden border border-zinc-100 dark:border-zinc-900 rounded-2xl shadow-sm">
                            <Image src={thread.hinhAnh} alt="Thread image" radius="md" />
                        </Box>
                    )}

                    <Group gap="sm" mt="md">
                        <Group gap={4} className="group/action cursor-pointer" onClick={handleLike}>
                            <ActionIcon
                                variant="subtle"
                                color={thread.liked ? 'rose' : 'gray'}
                                size="lg"
                                radius="xl"
                                className={`transition-all ${thread.liked ? 'text-rose-500 bg-rose-50/50 dark:bg-rose-500/10' : 'group-hover/action:bg-rose-50 group-hover/action:text-rose-500'}`}
                            >
                                {thread.liked ? <IconHeartFilled size={18} stroke={2} /> : <IconHeart size={18} stroke={2} />}
                            </ActionIcon>
                            <Text size="xs" fw={800} className={`tracking-tighter ${thread.liked ? 'text-rose-600' : 'text-zinc-400 group-hover/action:text-rose-500'}`}>
                                {thread._count.likes > 0 && thread._count.likes}
                            </Text>
                        </Group>

                        <Group gap={4} className="group/action cursor-pointer">
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                size="lg"
                                radius="xl"
                                className="group-hover/action:bg-indigo-50 group-hover/action:text-indigo-500"
                            >
                                <IconMessageCircle size={18} stroke={2} />
                            </ActionIcon>
                            <Text size="xs" fw={800} className="text-zinc-400 group-hover/action:text-indigo-500 tracking-tighter">
                                {thread._count.replies > 0 && thread._count.replies}
                            </Text>
                        </Group>

                        <Group gap={4} className="group/action cursor-pointer">
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                size="lg"
                                radius="xl"
                                className="group-hover/action:bg-teal-50 group-hover/action:text-teal-500"
                            >
                                <IconRepeat size={18} stroke={2} />
                            </ActionIcon>
                            <Text size="xs" fw={800} className="text-zinc-400 group-hover/action:text-teal-500 tracking-tighter">
                                {thread._count.reposts > 0 && thread._count.reposts}
                            </Text>
                        </Group>

                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="lg"
                            radius="xl"
                            className="ml-auto hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <IconShare size={18} stroke={2} />
                        </ActionIcon>
                    </Group>
                </Stack>
            </Group>
        </Card>
    );
};
