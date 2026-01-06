"use client";

import { useEffect } from "react";
import { useSocket } from "@/shared/hooks/useSocket";
import { useAppStore } from "@/providers/store/useAppStore";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { notifications as mantineNotifications } from "@mantine/notifications";
import { IconBellRinging } from "@tabler/icons-react";

export function GlobalSocketHandler() {
    const { on, off, isConnected } = useSocket();
    const { user } = useAppStore();
    const t = useTranslations('chat');
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!isConnected || !user) return;

        const handleNewMessage = (message: any) => {
            const isFromMe = Number(message?.nguoiGuiId) === Number(user?.id);
            if (isFromMe) return;

            // Check if we are already in this chat channel
            const selectedChannelId = searchParams.get('id');
            const isChatPage = pathname.includes(`/chat`);
            const isCurrentChannel = isChatPage && selectedChannelId === String(message.kenhChatId);

            // Only notify if app is in background OR user is not in the specific channel
            if (document.visibilityState !== 'visible' || !isCurrentChannel) {
                const title = t('new_message_from', { name: message.nguoiGui?.hoTen || message.nguoiGui?.taiKhoan || 'User' });
                const body = message.loai === 'VAN_BAN' ? message.noiDung : t('sent_attachment');
                const icon = message.nguoiGui?.avatar || '/icons/icon-192x192.png';

                // 1. Native Notification
                if ("Notification" in window && Notification.permission === "granted") {
                    const options: any = {
                        body,
                        icon,
                        badge: '/icons/icon-192x192.png',
                        tag: `chat-${message.kenhChatId}`,
                        renotify: true
                    };

                    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                        navigator.serviceWorker.ready.then(reg => {
                            reg.showNotification(title, options);
                        });
                    } else {
                        new Notification(title, options);
                    }
                }

                // 2. In-app Mantine notification (only if window is visible but not in channel)
                if (document.visibilityState === 'visible' && !isCurrentChannel) {
                    mantineNotifications.show({
                        title,
                        message: body,
                        icon: <IconBellRinging size={16} />,
                        autoClose: 5000,
                    });
                }
            }
        };

        on('message:new', handleNewMessage);

        return () => {
            off('message:new', handleNewMessage);
        };
    }, [isConnected, user, t, pathname, on, off]);

    return null;
}
