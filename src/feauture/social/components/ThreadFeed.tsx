import React, { useState } from 'react';
import { Stack, Paper, Skeleton, Text, Center, Button, Group, Box } from '@mantine/core';
import { ThreadCard } from './ThreadCard';
import { CreateThread } from './CreateThread';
import { Thread } from '../types';
import { AppQuery } from '@/api/AppQuery';
import { AppMutation } from '@/api/AppMutation';
import { IconSparkles } from '@tabler/icons-react';
import { Link } from '@/i18n/routing';
import { notifications } from '@mantine/notifications';

interface ThreadFeedProps {
    threads?: Thread[];
    showCreatePost?: boolean;
    createPostPlaceholder?: string;
}

export const ThreadFeed: React.FC<ThreadFeedProps> = ({
    threads: initialThreads,
    showCreatePost = false,
    createPostPlaceholder = "Có gì mới?"
}) => {
    const { data: fetchedThreads, isLoading, refetch } = AppQuery.social.useFeed();
    const createThreadMutation = AppMutation().social.useCreateThread();

    const threads = initialThreads || fetchedThreads;

    const handlePost = async (content: string, image?: string) => {
        try {
            await createThreadMutation.mutateAsync({ noiDung: content, hinhAnh: image });
            notifications.show({
                title: 'Thành công',
                message: 'Bài viết đã được đăng',
                color: 'green'
            });
            refetch();
        } catch (error) {
            notifications.show({
                title: 'Lỗi',
                message: 'Không thể đăng bài. Vui lòng thử lại.',
                color: 'red'
            });
        }
    };

    if (isLoading && !initialThreads) {
        return (
            <Stack gap="md">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Paper key={i} p="md" withBorder={false} style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
                        <Group gap="sm" mb="sm">
                            <Skeleton height={40} circle />
                            <Skeleton height={20} width="30%" />
                        </Group>
                        <Skeleton height={80} mb="sm" radius="md" />
                        <Skeleton height={20} width="50%" />
                    </Paper>
                ))}
            </Stack>
        );
    }

    if (!threads || threads.length === 0) {
        return (
            <Center py={120}>
                <Stack align="center" gap="xl" className="max-w-[320px] text-center">
                    <Box className="w-20 h-20 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center mb-4">
                        <IconSparkles size={40} className="text-zinc-300 dark:text-zinc-700" stroke={1.5} />
                    </Box>
                    <Stack gap="xs">
                        <Text fw={900} size="xl" className="tracking-tight text-zinc-900 dark:text-white">
                            Your feed is quiet
                        </Text>
                        <Text size="sm" className="text-zinc-500 font-medium">
                            Start following people or share your first thought to kick off the conversation.
                        </Text>
                    </Stack>
                    <Button
                        component={Link}
                        href="/social/create"
                        variant="filled"
                        color="black"
                        radius="xl"
                        size="md"
                        className="dark:bg-white dark:text-black font-black uppercase tracking-wider h-[54px] px-8 shadow-xl shadow-black/10 dark:shadow-white/5"
                    >
                        Create your first post
                    </Button>
                    <Button
                        variant="subtle"
                        color="gray"
                        onClick={() => refetch()}
                        className="text-zinc-400 hover:text-black dark:hover:text-white font-bold"
                    >
                        Refresh feed
                    </Button>
                </Stack>
            </Center>
        );
    }

    return (
        <Box>
            <Stack gap={0}>
                {showCreatePost && (
                    <Box mb="md">
                        <CreateThread
                            onPost={handlePost}
                            loading={createThreadMutation.isPending}
                            placeholder={createPostPlaceholder}
                        />
                    </Box>
                )}

                {threads.map((thread) => (
                    <ThreadCard key={thread.id} thread={thread} />
                ))}
            </Stack>
        </Box>
    );
};

