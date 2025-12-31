import React from 'react';
import { Stack, Container, Title, Paper, Skeleton } from '@mantine/core';
import { ThreadCard } from './ThreadCard';
import { Thread } from '../types';

interface ThreadFeedProps {
    threads: Thread[];
    loading?: boolean;
}

export const ThreadFeed: React.FC<ThreadFeedProps> = ({ threads, loading }) => {
    if (loading) {
        return (
            <Stack gap="md">
                {[1, 2, 3].map((i) => (
                    <Paper key={i} p="md" withBorder>
                        <Skeleton height={20} width="30%" mb="sm" />
                        <Skeleton height={100} mb="sm" />
                        <Skeleton height={20} width="50%" />
                    </Paper>
                ))}
            </Stack>
        );
    }

    return (
        <Container size="sm" p={0}>
            <Stack gap={0}>
                {threads.map((thread) => (
                    <ThreadCard key={thread.id} thread={thread} />
                ))}
            </Stack>
        </Container>
    );
};
