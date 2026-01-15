"use client";

import { useEffect, useState } from 'react';
import { Button, Paper, Text, Group, Box } from '@mantine/core';
import { IconRefresh, IconX } from '@tabler/icons-react';

export function PWAUpdateNotification() {
    const [showUpdate, setShowUpdate] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        // Lắng nghe sự kiện cập nhật Service Worker
        navigator.serviceWorker.ready.then((reg) => {
            setRegistration(reg);

            // Kiểm tra có Service Worker mới đang chờ không
            if (reg.waiting) {
                setShowUpdate(true);
            }

            // Lắng nghe sự kiện có SW mới
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                if (!newWorker) return;

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Có bản cập nhật mới
                        setShowUpdate(true);
                    }
                });
            });
        });

        // Lắng nghe message từ Service Worker
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    }, []);

    const handleUpdate = () => {
        if (!registration || !registration.waiting) return;

        // Gửi message cho Service Worker để skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });

        setShowUpdate(false);
    };

    const handleDismiss = () => {
        setShowUpdate(false);
    };

    if (!showUpdate) return null;

    return (
        <Box
            style={{
                position: 'fixed',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                maxWidth: '90vw',
                width: '400px',
            }}
        >
            <Paper
                shadow="xl"
                p="md"
                radius="lg"
                withBorder
                className="bg-gradient-to-r from-indigo-500 to-purple-600 border-none"
            >
                <Group justify="space-between" wrap="nowrap">
                    <Box style={{ flex: 1 }}>
                        <Text fw={700} size="sm" c="white" mb={4}>
                            🎉 Phiên bản mới đã sẵn sàng!
                        </Text>
                        <Text size="xs" c="white" opacity={0.9}>
                            Nhấn "Cập nhật" để sử dụng tính năng mới nhất
                        </Text>
                    </Box>
                    <Group gap="xs">
                        <Button
                            size="xs"
                            variant="white"
                            color="indigo"
                            leftSection={<IconRefresh size={14} />}
                            onClick={handleUpdate}
                            fw={700}
                        >
                            Cập nhật
                        </Button>
                        <Button
                            size="xs"
                            variant="subtle"
                            c="white"
                            onClick={handleDismiss}
                        >
                            <IconX size={16} />
                        </Button>
                    </Group>
                </Group>
            </Paper>
        </Box>
    );
}
