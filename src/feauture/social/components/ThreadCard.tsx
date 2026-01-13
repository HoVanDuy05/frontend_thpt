import React from 'react';
import { Card, Text, Group, ActionIcon, Stack, Image, Box, Divider, UnstyledButton } from '@mantine/core';
import { UserAvatar } from './UserAvatar';
import { IconHeart, IconMessageCircle, IconRepeat, IconShare, IconHeartFilled, IconUsers } from '@tabler/icons-react';
import { Thread } from '../types';
import { useRouter, usePathname } from '@/i18n/routing';
import { formatSocialTime } from '@/shared/utils/social.util';

import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { useTranslations } from 'next-intl';

interface ThreadCardProps {
    thread: Thread;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({ thread: initialThread }) => {
    const t = useTranslations('social');
    const likeMutation = AppMutation().social.useLikeThread();
    const [thread, setThread] = React.useState(initialThread);
    const router = useRouter();
    const pathname = usePathname();

    // Sync local state if props change (e.g. from parent re-fetch)
    React.useEffect(() => {
        setThread(initialThread);
    }, [initialThread]);



    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Optimistic update
        const isLiked = !thread.liked;
        const newLikesCount = Math.max(0, isLiked ? thread._count.likes + 1 : thread._count.likes - 1);

        setThread(prev => ({
            ...prev,
            liked: isLiked,
            _count: {
                ...prev._count,
                likes: newLikesCount
            }
        }));

        likeMutation.mutate({ urlParams: { id: thread.id } }, {
            onError: () => {
                // Revert on error
                setThread(prev => ({
                    ...prev,
                    liked: !isLiked,
                    _count: {
                        ...prev._count,
                        likes: isLiked ? prev._count.likes - 1 : prev._count.likes + 1
                    }
                }));
                notifications.show({
                    title: 'Lỗi',
                    message: 'Không thể thực hiện hành động này',
                    color: 'red'
                });
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
                <Stack align="center" gap={0} className="h-full">
                    <UserAvatar
                        src={thread.tacGia.avatar}
                        size={44}
                        className="shadow-sm"
                    />
                </Stack>

                <Stack gap={6} className="flex-1">
                    <Group justify="space-between" align="center" mb={2}>
                        <Group gap="xs">
                            <Text fw={700} size="sm" className="text-zinc-900 dark:text-zinc-100 tracking-tight hover:underline cursor-pointer">
                                {thread.tacGia.taiKhoan}
                            </Text>
                            <Text size="xs" c="dimmed">•</Text>
                            <Text size="xs" c="dimmed" fw={500} className="tracking-tight">
                                {formatSocialTime(thread.ngayTao, t)}
                            </Text>
                        </Group>
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
                                color={thread.liked ? 'red' : 'gray'}
                                size="lg"
                                radius="xl"
                                className={`transition-all duration-300 ${thread.liked ? 'text-red-600 bg-red-50/80 dark:bg-red-500/10 scale-110' : 'group-hover/action:bg-red-50/50 group-hover/action:text-red-500'}`}
                            >
                                {thread.liked ? <IconHeartFilled size={20} /> : <IconHeart size={20} stroke={2.2} />}
                            </ActionIcon>
                            <Text size="xs" fw={800} className={`tracking-tighter transition-colors ${thread.liked ? 'text-red-600 font-bold' : 'text-zinc-400 group-hover/action:text-red-500'}`}>
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
