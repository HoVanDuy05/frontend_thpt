import { Paper, Group, ActionIcon, Avatar, Text, Stack, ScrollArea, Box, Loader, Center, Image, Drawer, Divider, Badge, Accordion, ThemeIcon, UnstyledButton, Modal, Button, useMantineColorScheme } from "@mantine/core";
import { IconArrowLeft, IconPhone, IconVideo, IconInfoCircle, IconPhoto, IconFile, IconBell, IconSearch } from "@tabler/icons-react";
import { TChannel } from "@/api/types/api.type";
import { AppQuery } from "@/api/AppQuery";
import { useAppStore } from "@/providers/store/useAppStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { useSocket } from "@/shared/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMediaQuery } from "@mantine/hooks";
import { useTranslations } from "next-intl";

interface ChatWindowProps {
    channel: TChannel;
    onBack?: () => void;
    onToggleInfo?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ channel, onBack, onToggleInfo }) => {
    const { user } = useAppStore();
    const queryClient = useQueryClient();
    const t = useTranslations('chat');
    const [page, setPage] = useState(1);
    const [allMessages, setAllMessages] = useState<any[]>([]);
    const { data: pageMessages, isLoading, isFetching } = AppQuery.chat.useMessages(channel.id, { page });
    const hasMoreRef = useRef(true);
    const scrollBeforeRef = useRef<number>(0);
    const { on, off, emit, joinChannel, leaveChannel, startTyping, stopTyping, isConnected } = useSocket();
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const [presence, setPresence] = useState<{ online: boolean; lastSeen: string | null } | null>(null);
    const [receiptByMessageId, setReceiptByMessageId] = useState<Record<number, 'sent' | 'delivered' | 'seen'>>({});
    const [infoOpened, setInfoOpened] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<any | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const viewport = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 48em)');
    const firstLoadRef = useRef(true);

    useEffect(() => {
        dayjs.extend(relativeTime);
    }, []);

    // Join channel on mount
    useEffect(() => {
        if (isConnected && channel.id) {
            joinChannel(channel.id);
        }
        return () => {
            if (channel.id) {
                leaveChannel(channel.id);
            }
        };
    }, [isConnected, channel.id, joinChannel, leaveChannel]);

    // Request Notification Permission
    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    // Listen for new messages
    useEffect(() => {
        if (!isConnected) return;

        const handleNewMessage = (message: any) => {
            if (message?.kenhChatId !== channel.id) return;

            const isFromMe = Number(message?.nguoiGuiId) === Number(user?.id);

            // Notify if window not focused and not from me
            if (!isFromMe && document.visibilityState !== 'visible' && Notification.permission === "granted") {
                new Notification(t('new_message_from', { name: targetUser?.hoTen || targetUser?.taiKhoan || 'User' }), {
                    body: message.loai === 'VAN_BAN' ? message.noiDung : t('sent_attachment'),
                    icon: targetUser?.avatar || '/icon.png'
                });
            }

            // If message is from other user, acknowledge delivered (realtime)
            if (message?.nguoiGuiId && !isFromMe && message?.id) {
                emit('message:delivered', { channelId: channel.id, messageId: message.id });
            }

            // Update local state directly for immediate UI feedback
            setAllMessages(prev => {
                // Check if this message ID already exists (real message already arrived)
                if (prev.some(m => m.id === message.id)) return prev;

                // Deduplicate optimistic messages for 'me'
                if (isFromMe) {
                    const optimisticIdx = prev.findIndex(m => m.id < 0 && (m.noiDung === message.noiDung || m.duongDanTep === message.duongDanTep));
                    if (optimisticIdx !== -1) {
                        const next = [...prev];
                        next[optimisticIdx] = message;
                        return next.sort((a, b) => dayjs(a.ngayGui).valueOf() - dayjs(b.ngayGui).valueOf());
                    }
                }

                const updated = [...prev, message];
                return updated.sort((a, b) => dayjs(a.ngayGui).valueOf() - dayjs(b.ngayGui).valueOf());
            });

            // Invalidate queries to sync with other windows/tabs
            queryClient.invalidateQueries({
                queryKey: ["chat", "messages", channel.id] as any
            });
        };

        const handleTypingStart = ({ userName }: { userName: string }) => {
            setTypingUsers(prev => [...new Set([...prev, userName])]);
        };

        const handleTypingStop = ({ userId }: { userId: number }) => {
            setTypingUsers(prev => prev.filter(name => name !== userId.toString()));
        };

        try {
            on('message:new', handleNewMessage);
            on('typing:start', handleTypingStart);
            on('typing:stop', handleTypingStop);
        } catch (error) {
            console.warn('Socket event listener setup failed:', error);
        }

        return () => {
            try {
                off('message:new', handleNewMessage);
                off('typing:start', handleTypingStart);
                off('typing:stop', handleTypingStop);
            } catch (error) {
                console.warn('Socket event listener cleanup failed:', error);
            }
        };
    }, [isConnected, channel.id, on, off, emit, queryClient, user?.id]);

    // Reset when channel changes
    useEffect(() => {
        setAllMessages([]);
        setPage(1);
        hasMoreRef.current = true;
        firstLoadRef.current = true;
    }, [channel.id]);

    // Merge messages and handle scroll anchoring
    useEffect(() => {
        if (pageMessages) {
            if (pageMessages.length < 20) hasMoreRef.current = false;

            // Before updating state, save current scroll height if we are loading history
            if (page > 1 && viewport.current) {
                scrollBeforeRef.current = viewport.current.scrollHeight;
            }

            setAllMessages(prev => {
                const existingIds = new Set(prev.map(m => m.id));
                const newMsgs = pageMessages.filter((m: any) => !existingIds.has(m.id));
                const merged = [...prev, ...newMsgs];
                // Sort by time (newest at bottom)
                return merged.sort((a, b) => dayjs(a.ngayGui).valueOf() - dayjs(b.ngayGui).valueOf());
            });
        }
    }, [pageMessages, page]);

    // Apply scroll anchoring after messages render
    useEffect(() => {
        if (page > 1 && scrollBeforeRef.current && viewport.current) {
            const newHeight = viewport.current.scrollHeight;
            const diff = newHeight - scrollBeforeRef.current;
            if (diff > 0) {
                viewport.current.scrollTop = diff;
                scrollBeforeRef.current = 0;
            }
        }
    }, [allMessages, page]);

    // Intersection Observer for infinite scroll at the top
    const topSentinelRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading && !isFetching && hasMoreRef.current && pageMessages && pageMessages.length >= 20) {
                setPage(p => p + 1);
            }
        }, { threshold: 0, rootMargin: '100px 0px 0px 0px' });

        if (topSentinelRef.current) observer.observe(topSentinelRef.current);
        return () => observer.disconnect();
    }, [isLoading, isFetching, pageMessages]);

    // Scroll to bottom logic
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior, block: 'end' });
        } else if (viewport.current) {
            viewport.current.scrollTo({
                top: viewport.current.scrollHeight,
                behavior
            });
        }
    };

    useEffect(() => {
        if (isLoading || allMessages.length === 0) return;

        if (firstLoadRef.current) {
            // Consolidated scroll on mount to avoid forced reflows
            const timer = setTimeout(() => {
                scrollToBottom('auto');
                firstLoadRef.current = false;
            }, 100);
            return () => clearTimeout(timer);
        } else if (page === 1) {
            const lastMsg = allMessages[allMessages.length - 1];
            const isMe = Number(lastMsg?.nguoiGuiId) === Number(user?.id);
            // Non-blocking smooth scroll
            requestAnimationFrame(() => {
                scrollToBottom(isMe ? 'auto' : 'smooth');
            });
        }
    }, [allMessages.length, channel.id, isLoading, page, user?.id]);

    // Handle typing indicator
    const handleTyping = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        startTyping(channel.id, user?.hoTen || user?.taiKhoan || 'User');

        typingTimeoutRef.current = setTimeout(() => {
            stopTyping(channel.id);
        }, 2000);
    };

    const getOtherMember = () => {
        return channel.thanhViens?.find(m => Number(m.nguoiDungId) !== Number(user?.id))?.nguoiDung;
    };

    const targetUser = getOtherMember();

    useEffect(() => {
        if (!isConnected) return;

        const handlePresenceUpdate = (data: any) => {
            if (!targetUser?.id) return;
            if (Number(data?.userId) !== Number(targetUser.id)) return;
            setPresence({ online: !!data.online, lastSeen: data.lastSeen ?? null });
        };

        const handleDelivered = (data: any) => {
            if (data?.channelId !== channel.id) return;
            if (Number(data?.userId) === Number(user?.id)) return;
            const messageId = data?.messageId;
            if (!messageId) return;
            setReceiptByMessageId((prev) => {
                const current = prev[messageId];
                if (current === 'seen') return prev;
                return { ...prev, [messageId]: 'delivered' };
            });
        };

        const handleSeen = (data: any) => {
            if (data?.channelId !== channel.id) return;
            if (Number(data?.userId) === Number(user?.id)) return;
            const messageId = data?.messageId;
            if (!messageId) return;
            setReceiptByMessageId((prev) => {
                const next = { ...prev };
                for (const k of Object.keys(next)) {
                    const id = Number(k);
                    if (id <= messageId) next[id] = 'seen';
                }
                next[messageId] = 'seen';
                return next;
            });
        };

        on('presence:update', handlePresenceUpdate);
        on('message:delivered', handleDelivered);
        on('message:seen', handleSeen);

        return () => {
            off('presence:update', handlePresenceUpdate);
            off('message:delivered', handleDelivered);
            off('message:seen', handleSeen);
        };
    }, [isConnected, on, off, channel.id, targetUser?.id, user?.id]);

    // When messages change, mark latest as seen (realtime, non-persistent)
    useEffect(() => {
        if (!isConnected) return;
        if (!allMessages || allMessages.length === 0) return;

        // Only mark as seen for the newest *incoming* message.
        const newestIncoming = [...allMessages].reverse().find((m: any) => m?.nguoiGuiId && Number(m.nguoiGuiId) !== Number(user?.id));
        const newestIncomingId = newestIncoming?.id;
        if (!newestIncomingId) return;

        emit('message:seen', { channelId: channel.id, messageId: newestIncomingId });
    }, [isConnected, allMessages, emit, channel.id, user?.id]);

    const newestOutgoingId = useMemo(() => {
        if (!allMessages || allMessages.length === 0) return null;
        const mine = [...allMessages].reverse().find((m: any) => Number(m.nguoiGuiId) === Number(user?.id));
        return mine?.id ?? null;
    }, [allMessages, user?.id]);

    const lastSeenMessageId = useMemo(() => {
        const ids = Object.keys(receiptByMessageId)
            .filter(k => receiptByMessageId[Number(k)] === 'seen')
            .map(Number);
        return ids.length > 0 ? Math.max(...ids) : null;
    }, [receiptByMessageId]);

    const getReceiptLabel = (messageId: number) => {
        const status = receiptByMessageId[messageId];
        if (status === 'seen') return t('read');
        if (status === 'delivered') return t('delivered');
        return t('sent');
    };

    return (
        <div className="h-full flex flex-col overflow-hidden bg-white dark:bg-[#1c1e21]">

            {/* Header */}
            <div className="shrink-0 border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#1c1e21]/80 backdrop-blur-md z-30 shadow-sm">
                <div className="h-[68px] px-4 flex items-center justify-between gap-2">
                    <Group gap="xs" className="min-w-0 flex-1">
                        <ActionIcon variant="subtle" color="gray" onClick={onBack} className="md:hidden">
                            <IconArrowLeft size={24} stroke={2.5} />
                        </ActionIcon>

                        <UnstyledButton
                            className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200"
                            onClick={onToggleInfo}
                        >
                            <Box className="relative">
                                <Avatar
                                    src={targetUser?.avatar || null}
                                    radius={999}
                                    size={44}
                                    className="border border-gray-100 dark:border-white/10 shadow-sm"
                                />
                                {presence?.online && (
                                    <Box className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#31A24C] border-[3px] border-white dark:border-[#1c1e21] rounded-full" />
                                )}
                            </Box>
                            <div className="min-w-0">
                                <Text size="16px" fw={700} className="truncate text-gray-900 dark:text-gray-100 leading-tight">
                                    {channel.loaiKenh === 'NHOM' ? channel.tenKenh : (targetUser?.hoTen || targetUser?.taiKhoan)}
                                </Text>
                                <Text size="13px" c="dimmed" fw={400} className="truncate leading-tight mt-0.5">
                                    {typingUsers.length > 0
                                        ? "Đang nhập..."
                                        : (presence?.online ? 'Đang hoạt động' : 'Ngoại tuyến')}
                                </Text>
                            </div>
                        </UnstyledButton>
                    </Group>

                    <Group gap={8}>
                        <ActionIcon variant="subtle" radius="xl" size={40} className="text-[#0084FF] hover:bg-gray-100 dark:hover:bg-white/5">
                            <IconPhone size={24} fill="currentColor" stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" radius="xl" size={40} className="text-[#0084FF] hover:bg-gray-100 dark:hover:bg-white/5">
                            <IconVideo size={26} fill="currentColor" stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </div>
            </div>

            <ScrollArea viewportRef={viewport} className="flex-1 px-4 py-4 no-scrollbar">
                <Stack gap={0} className="min-h-full justify-end">
                    {/* Sentinel for infinite scroll */}
                    <div ref={topSentinelRef} style={{ height: 1, marginBottom: 10 }} />

                    {isFetching && page > 1 && (
                        <Center py="xs">
                            <Loader size="xs" color="blue" />
                        </Center>
                    )}

                    {isLoading && page === 1 ? (
                        <Center h={100}><Loader size="sm" color="blue" /></Center>
                    ) : (allMessages || []).length === 0 ? (
                        <Center h={400} className="flex-col animate-in fade-in zoom-in duration-500">
                            <Avatar src={targetUser?.avatar || null} size={100} radius={999} mb="md" />
                            <Text fw={700} size="xl">{channel.loaiKenh === 'NHOM' ? channel.tenKenh : (targetUser?.hoTen || targetUser?.taiKhoan)}</Text>
                            <Text size="sm" c="dimmed" mt={4}>Bắt đầu cuộc trò chuyện trên Messenger</Text>
                        </Center>
                    ) : (
                        (allMessages || []).map((msg, idx, arr) => {
                            const isMe = Number(msg.nguoiGuiId) === Number(user?.id);
                            const prevMsg = arr[idx - 1];
                            const nextMsg = arr[idx + 1];

                            const isFirstInGroup = !prevMsg || Number(prevMsg.nguoiGuiId) !== Number(msg.nguoiGuiId);
                            const isLastInGroup = !nextMsg || Number(nextMsg.nguoiGuiId) !== Number(msg.nguoiGuiId);

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'} ${isFirstInGroup ? 'mt-4' : 'mt-[2px]'}`}
                                >
                                    <div className={`flex items-end gap-1.5 max-w-[85%] sm:max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {!isMe && (
                                            <div className="w-8 shrink-0 pb-0.5">
                                                {isLastInGroup && (
                                                    <Avatar src={msg.nguoiGui?.avatar || targetUser?.avatar || null} size={28} radius="xl" />
                                                )}
                                            </div>
                                        )}

                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            {msg.loai === 'VAN_BAN' ? (
                                                <Paper
                                                    px="14px"
                                                    py="8px"
                                                    withBorder={false}
                                                    className={`shadow-none ${isMe ? 'text-white' : 'text-black dark:text-white'}`}
                                                    style={{
                                                        backgroundColor: isMe ? '#0084FF' : undefined,
                                                        borderTopRightRadius: isMe ? (isFirstInGroup ? 18 : 4) : 18,
                                                        borderBottomRightRadius: isMe ? (isLastInGroup ? 18 : 4) : 18,
                                                        borderTopLeftRadius: !isMe ? (isFirstInGroup ? 18 : 4) : 18,
                                                        borderBottomLeftRadius: !isMe ? (isLastInGroup ? 18 : 4) : 18,
                                                        maxWidth: 'fit-content',
                                                        overflowWrap: 'anywhere',
                                                        wordBreak: 'break-word'
                                                    }}
                                                    bg={!isMe ? (dark ? '#3e4042' : '#F0F2F5') : undefined}
                                                >
                                                    <Text size="15px" className="leading-snug whitespace-pre-wrap">{msg.noiDung}</Text>
                                                </Paper>
                                            ) : msg.loai === 'HINH_ANH' ? (
                                                <Box
                                                    className="cursor-pointer overflow-hidden rounded-[18px] transition-all hover:brightness-95 active:scale-[0.98]"
                                                    onClick={() => setPreviewImage(msg.duongDanTep || msg.noiDung || null)}
                                                    style={{ maxWidth: '300px' }}
                                                >
                                                    <Image
                                                        src={msg.duongDanTep || msg.noiDung}
                                                        alt="Image"
                                                        radius={18}
                                                        fit="contain"
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            display: 'block'
                                                        }}
                                                    />
                                                </Box>
                                            ) : (
                                                <Paper
                                                    px="14px"
                                                    py="8px"
                                                    withBorder={false}
                                                    className={`shadow-none ${isMe ? 'text-white' : 'text-black dark:text-white'}`}
                                                    style={{
                                                        backgroundColor: isMe ? '#0084FF' : undefined,
                                                        borderTopRightRadius: isMe ? (isFirstInGroup ? 18 : 4) : 18,
                                                        borderBottomRightRadius: isMe ? (isLastInGroup ? 18 : 4) : 18,
                                                        borderTopLeftRadius: !isMe ? (isFirstInGroup ? 18 : 4) : 18,
                                                        borderBottomLeftRadius: !isMe ? (isLastInGroup ? 18 : 4) : 18,
                                                        borderRadius: 18,
                                                        maxWidth: 'fit-content'
                                                    }}
                                                    bg={!isMe ? (dark ? '#3e4042' : '#F0F2F5') : undefined}
                                                >
                                                    <Group gap="xs" wrap="nowrap" className="py-0.5">
                                                        <Box className="bg-white/20 p-2 rounded-full">
                                                            <IconFile size={16} fill="white" />
                                                        </Box>
                                                        <Text size="sm" className="font-medium cursor-pointer" onClick={() => window.open(msg.duongDanTep, '_blank')}>
                                                            {t('attachment')}
                                                        </Text>
                                                    </Group>
                                                </Paper>
                                            )}
                                        </div>
                                    </div>

                                    {isLastInGroup && (
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} w-full mt-1`}>
                                            {isMe && lastSeenMessageId === msg.id && (
                                                <Avatar src={targetUser?.avatar} size={16} radius="xl" mr={4} className="opacity-90 transition-all zoom-in animate-in" />
                                            )}
                                            {isMe && newestOutgoingId === msg.id && (!lastSeenMessageId || lastSeenMessageId < msg.id) && (
                                                <Text size="11px" fw={600} c="dimmed" pr={4} className="opacity-70">
                                                    {getReceiptLabel(msg.id)}
                                                </Text>
                                            )}
                                            <Text size="11px" fw={500} c="dimmed" px={isMe ? 4 : 42} className="opacity-40">
                                                {dayjs(msg.ngayGui).format('HH:mm')}
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}

                    {typingUsers.length > 0 && (
                        <div className="flex items-end gap-2 mt-2">
                            <div className="w-8 shrink-0" />
                            <Box className="bg-[#F0F2F5] dark:bg-[#3E4042] px-4 py-3 rounded-[18px] flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                            </Box>
                        </div>
                    )}
                    <div ref={bottomRef} style={{ height: 1, marginTop: -1 }} />
                </Stack>
            </ScrollArea>

            {/* Image Preview Modal */}
            <Modal
                opened={!!previewImage}
                onClose={() => setPreviewImage(null)}
                size="xl"
                centered
                withCloseButton={false}
                padding={0}
                styles={{
                    content: { backgroundColor: 'transparent', boxShadow: 'none' },
                    body: { display: 'flex', justifyContent: 'center' }
                }}
            >
                {previewImage && (
                    <Image
                        src={previewImage}
                        alt="Full preview"
                        radius="md"
                        style={{ maxHeight: '90vh', maxWidth: '100vw', objectFit: 'contain' }}
                    />
                )}
            </Modal>

            <div className="shrink-0 border-t border-gray-200/70 dark:border-zinc-800 bg-white/90 dark:bg-[#1c1e21]/80 backdrop-blur">
                <ChatInput channelId={channel.id} onTyping={handleTyping} replyingTo={replyingTo} onReply={setReplyingTo} />
            </div>
        </div>
    );
};
