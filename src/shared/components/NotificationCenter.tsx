"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/shared/hooks/useSocket";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { TNotification } from "@/shared/types/user.type";
import {
    Box,
    Text,
    Group,
    Button,
    Stack,
    Title,
    Badge,
    ActionIcon,
    ScrollArea,
    UnstyledButton,
    Tooltip
} from "@mantine/core";
import {
    IconBell,
    IconBellRinging,
    IconCheck,
    IconMessage,
    IconUserPlus,
    IconHeart
} from "@tabler/icons-react";
import { notifications as mantineNotifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();
    const { socket, isConnected } = useSocket();

    /* ================== QUERIES ================== */
    const notificationsQuery = AppQuery.auth.useNotifications();

    /* ================== MUTATIONS ================== */
    const markAsReadMutation = AppMutation().notifications.useMarkAsRead;
    const markAllAsReadMutation = AppMutation().notifications.useMarkAllAsRead;

    /* ================== UNREAD COUNT ================== */
    useEffect(() => {
        if (Array.isArray(notificationsQuery.data)) {
            setUnreadCount(
                notificationsQuery.data.filter(n => !n.daDoc).length
            );
        }
    }, [notificationsQuery.data]);

    /* ================== SOCKET LISTENER ================== */
    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleNewNotification = (data: any) => {
            // Browser notification
            if ("Notification" in window && Notification.permission === "granted") {
                const title = data.message?.nguoiGui?.hoTen || "Thông báo mới";
                const options: any = {
                    body: data.message?.noiDung || data.noiDung,
                    icon: data.message?.nguoiGui?.avatar || "/default-avatar.png",
                    badge: "/icons/icon-192x192.png",
                    tag: data.id ? `noti-${data.id}` : undefined,
                    renotify: true
                };

                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.ready.then(reg => {
                        reg.showNotification(title, options);
                    });
                } else {
                    const noti = new Notification(title, options);
                    noti.onclick = () => {
                        window.focus();
                        data.lienKet && router.push(data.lienKet);
                    };
                }
            }

            // In-app notification
            mantineNotifications.show({
                title: "Thông báo mới",
                message: data.message?.noiDung || data.noiDung,
                icon: <IconBellRinging size={16} />,
                autoClose: 5000,
                onClick: () => {
                    data.lienKet && router.push(data.lienKet);
                }
            });

            notificationsQuery.refetch();
        };

        socket.on("notification:new", handleNewNotification);

        return () => {
            socket.off("notification:new", handleNewNotification);
        };
    }, [socket, isConnected, router, notificationsQuery]);

    /* Notification permission handled by PWAProvider and Settings */

    /* ================== HANDLERS ================== */
    const handleMarkAsRead = (id: number) => {
        const mutation = markAsReadMutation(id);
        mutation.mutate(undefined, {
            onSuccess: () => {
                setUnreadCount(prev => Math.max(prev - 1, 0));
            },
        });
    };

    const handleMarkAllAsRead = () => {
        const mutation = markAllAsReadMutation();
        mutation.mutate(undefined, {
            onSuccess: () => setUnreadCount(0),
        });
    };

    const isMarkAllLoading = markAllAsReadMutation().isPending;

    const handleClickNotification = (n: TNotification) => {
        if (!n.daDoc) handleMarkAsRead(n.id);
        n.lienKet && router.push(n.lienKet);
        setIsOpen(false);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "TIN_NHAN":
                return <IconMessage size={16} color="#3B82F6" />;
            case "KET_BAN":
                return <IconUserPlus size={16} color="#10B981" />;
            case "THICH":
                return <IconHeart size={16} color="#EF4444" />;
            default:
                return <IconBell size={16} />;
        }
    };

    /* ================== RENDER ================== */
    return (
        <Box pos="relative">
            <Tooltip label="Thông báo">
                <UnstyledButton onClick={() => setIsOpen(v => !v)}>
                    <IconBell size={20} />
                    {unreadCount > 0 && (
                        <Badge
                            size="xs"
                            pos="absolute"
                            top={-4}
                            right={-4}
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </UnstyledButton>
            </Tooltip>

            {isOpen && (
                <Box className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50">
                    <Group justify="space-between" p="sm">
                        <Title order={6}>Thông báo</Title>
                        {unreadCount > 0 && (
                            <Button
                                size="xs"
                                variant="subtle"
                                onClick={handleMarkAllAsRead}
                                loading={isMarkAllLoading}
                            >
                                Đánh dấu đã đọc
                            </Button>
                        )}
                    </Group>

                    <ScrollArea h={400}>
                        {notificationsQuery.data?.length ? (
                            <Stack p="xs">
                                {notificationsQuery.data.map(n => (
                                    <UnstyledButton
                                        key={n.id}
                                        onClick={() => handleClickNotification(n)}
                                    >
                                        <Group align="flex-start">
                                            {getIcon(n.loaiThongBao)}
                                            <Box>
                                                <Text fw={500}>{n.tieuDe}</Text>
                                                <Text size="xs" c="dimmed">
                                                    {n.noiDung}
                                                </Text>
                                            </Box>
                                            {!n.daDoc && (
                                                <ActionIcon
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        handleMarkAsRead(n.id);
                                                    }}
                                                >
                                                    <IconCheck size={14} />
                                                </ActionIcon>
                                            )}
                                        </Group>
                                    </UnstyledButton>
                                ))}
                            </Stack>
                        ) : (
                            <Text ta="center" c="dimmed" p="md">
                                Chưa có thông báo
                            </Text>
                        )}
                    </ScrollArea>
                </Box>
            )}
        </Box>
    );
}
