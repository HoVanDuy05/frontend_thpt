"use client";

import React from 'react';
import { Container, Stack, Title, Paper } from '@mantine/core';
import { CreateThread } from '@/feauture/social/components/CreateThread';
import { ThreadFeed } from '@/feauture/social/components/ThreadFeed';
import { Thread } from '@/feauture/social/types';
import dayjs from 'dayjs';

const MOCK_THREADS: Thread[] = [
    {
        id: 1,
        tacGiaId: 1,
        tacGia: { id: 1, taiKhoan: 'admin_pms', email: 'admin@school.edu.vn' },
        noiDung: 'Chào mừng các bạn đến với mạng xã hội nội bộ của trường Nguyễn Huệ! 🚀\nChúc mọi người một học kỳ mới đầy năng lượng.',
        ngayTao: new Date().toISOString(),
        _count: { likes: 12, replies: 3, reposts: 1 },
        liked: true
    },
    {
        id: 2,
        tacGiaId: 2,
        tacGia: { id: 2, taiKhoan: 'gv_huynh_mai', email: 'mai.h@school.edu.vn' },
        noiDung: 'Các bạn học sinh khối 12 chú ý lịch ôn tập thi THPT Quốc gia đã được cập nhật nhé!',
        hinhAnh: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop',
        ngayTao: dayjs().subtract(2, 'hour').toISOString(),
        _count: { likes: 45, replies: 12, reposts: 5 }
    }
];

export default function SocialPage() {
    return (
        <Container size="sm" py="xl">
            <Stack gap="xl">
                <Title order={2}>Mạng xã hội</Title>
                <Paper withBorder radius="md" p={0} shadow="xs">
                    <CreateThread onPost={(c) => console.log('Post:', c)} />
                    <ThreadFeed threads={MOCK_THREADS} />
                </Paper>
            </Stack>
        </Container>
    );
}
