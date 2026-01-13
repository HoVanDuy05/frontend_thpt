import React, { useEffect } from 'react';
import { Stack, Paper, Skeleton, Text, Center, Button, Group, Box, Avatar, Drawer, ScrollArea, ActionIcon, UnstyledButton } from '@mantine/core';
import { ThreadCard } from './ThreadCard';
import { Thread } from '../types';
import { AppQuery } from '@/api/AppQuery';
import { IconSparkles } from '@tabler/icons-react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useAppStore } from '@/providers/store/useAppStore';
import { useSearchParams } from 'next/navigation';
import { UserAvatar } from './UserAvatar';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';

interface ThreadFeedProps {
    threads?: Thread[];
    showCreatePost?: boolean;
    createPostPlaceholder?: string;
}

export const ThreadFeed: React.FC<ThreadFeedProps> = ({
    threads: initialThreads,
    showCreatePost = false,
    createPostPlaceholder = "Chia sẻ suy nghĩ của bạn..."
}) => {
    const { data: fetchedThreads, isLoading, refetch } = AppQuery.social.useFeed();
    const { user } = useAppStore();
    const router = useRouter();
    const pathname = usePathname();

    const threads = initialThreads || fetchedThreads;

    const handleCreateOpen = () => {
        router.push(`${pathname}?create=true`, { scroll: false });
    };

    if (isLoading && !initialThreads) {
        return <SkeletonLoader type="threads" count={5} />;
    }

    const EmptyFeed = () => (
        <Center py={120}>
            <Stack align="center" gap="xl" className="max-w-[320px] text-center">
                <Box className="w-20 h-20 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center mb-4">
                    <IconSparkles size={40} className="text-zinc-300 dark:text-zinc-700" stroke={1.5} />
                </Box>
                <Stack gap="xs">
                    <Text fw={900} size="xl" className="tracking-tight text-zinc-900 dark:text-white">
                        Bảng tin đang trống
                    </Text>
                    <Text size="sm" className="text-zinc-500 font-medium">
                        Hãy theo dõi mọi người hoặc chia sẻ suy nghĩ đầu tiên của bạn để bắt đầu trò chuyện.
                    </Text>
                </Stack>
                <Button
                    onClick={handleCreateOpen}
                    variant="filled"
                    color="black"
                    radius="xl"
                    size="md"
                    className="dark:bg-white dark:text-black font-black uppercase tracking-wider h-[54px] px-8 shadow-xl shadow-black/10 dark:shadow-white/5"
                >
                    Tạo bài viết mới
                </Button>
                <Button
                    variant="subtle"
                    color="gray"
                    onClick={() => refetch()}
                    className="text-zinc-400 hover:text-black dark:hover:text-white font-bold"
                >
                    Làm mới
                </Button>
            </Stack>
        </Center>
    );

    return (
        <Box>

            <Stack gap={0}>
                {showCreatePost && (
                    <UnstyledButton
                        p="md"
                        className="w-full bg-white dark:bg-black border-b border-gray-100 dark:border-zinc-800 transition-colors active:bg-gray-50 dark:active:bg-zinc-900 block"
                        onClick={handleCreateOpen}
                    >
                        <Group align="center" wrap="nowrap" gap="sm">
                            <UserAvatar src={user?.avatar} size={40} />
                            <Box className="flex-1">
                                <Box className="bg-gray-100 dark:bg-zinc-900/50 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors rounded-full px-4 py-2.5">
                                    <Text size="sm" c="dimmed" fw={500} className="text-gray-500 dark:text-gray-400">
                                        {createPostPlaceholder}
                                    </Text>
                                </Box>
                            </Box>
                        </Group>
                    </UnstyledButton>
                )}

                {(!threads || threads.length === 0) ? (
                    <EmptyFeed />
                ) : (
                    threads.map((thread) => (
                        <ThreadCard key={thread.id} thread={thread} />
                    ))
                )}
            </Stack>
        </Box>
    );
};

