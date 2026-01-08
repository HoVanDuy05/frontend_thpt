import { Paper, Group, ActionIcon, Avatar, Text, Stack, ScrollArea, Box, Loader, Center, Image, Drawer, Divider, Badge, Accordion, ThemeIcon, UnstyledButton, Modal, Button, useMantineColorScheme } from "@mantine/core";
import { IconArrowLeft, IconPhone, IconVideo, IconInfoCircle, IconPhoto, IconFile, IconBell, IconSearch, IconMicrophone, IconSend, IconThumbUp, IconUsers } from "@tabler/icons-react";
import { TChannel } from "@/api/types/api.type";
import { AppQuery } from "@/api/AppQuery";
import { useAppStore } from "@/providers/store/useAppStore";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

const CustomVoicePlayer = ({ url, isMe, dark, isFirstInGroup, isLastInGroup }: { url: string; isMe: boolean; dark: boolean; isFirstInGroup?: boolean; isLastInGroup?: boolean }) => {
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Generate random bars for waveform effect
    const waveformBars = useMemo(() => {
        return Array.from({ length: 25 }).map((_, i) => ({
            height: Math.floor(Math.random() * 60) + 20,
            delay: i * 0.05
        }));
    }, []);

    return (
        <Paper
            px="12px"
            py="10px"
            radius="20px"
            withBorder={false}
            className={`shadow-sm transition-all hover:shadow-md active:scale-[0.98] ${isMe ? 'text-white' : 'text-black dark:text-white'}`}
            style={{
                backgroundColor: isMe ? '#6366f1' : (dark ? '#3a3b3c' : '#E4E6EB'),
                width: 'fit-content',
                minWidth: '220px',
                borderTopRightRadius: isMe ? (isFirstInGroup ? '20px' : '4px') : '20px',
                borderBottomRightRadius: isMe ? (isLastInGroup ? '20px' : '4px') : '20px',
                borderTopLeftRadius: !isMe ? (isFirstInGroup ? '20px' : '4px') : '20px',
                borderBottomLeftRadius: !isMe ? (isLastInGroup ? '20px' : '4px') : '20px',
            }}
        >
            <Group gap="sm" wrap="nowrap">
                <ActionIcon
                    variant="filled"
                    radius="xl"
                    size="lg"
                    onClick={togglePlay}
                    className={`${isMe ? 'bg-white text-[#6366f1] hover:bg-gray-100' : 'bg-[#6366f1] text-white hover:bg-blue-600'} transition-transform hover:scale-105`}
                >
                    {playing ? (
                        <div className="flex items-center gap-[3px]">
                            <div className="w-[3px] h-3.5 bg-current rounded-full animate-pulse" />
                            <div className="w-[3px] h-3.5 bg-current rounded-full animate-pulse [animation-delay:0.2s]" />
                        </div>
                    ) : (
                        <div style={{ marginLeft: '2px', borderLeft: '11px solid currentColor', borderTop: '7px solid transparent', borderBottom: '7px solid transparent' }} />
                    )}
                </ActionIcon>

                <div className="flex-1 flex flex-col gap-1.5 min-w-[120px]">
                    <div className="flex items-end gap-[2px] h-8 px-1">
                        {waveformBars.map((bar, i) => {
                            const progress = (currentTime / (duration || 1)) * waveformBars.length;
                            const isActive = i < progress;
                            return (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-full transition-all duration-300 ${isActive
                                        ? (isMe ? 'bg-white' : 'bg-[#6366f1]')
                                        : (isMe ? 'bg-white/30' : 'bg-gray-400/30')
                                        }`}
                                    style={{
                                        height: `${bar.height}%`,
                                        opacity: playing ? 1 : 0.8
                                    }}
                                />
                            );
                        })}
                    </div>
                    <Group justify="space-between" px={2}>
                        <Text size="10px" fw={700} style={{ opacity: 0.9 }}>{formatTime(currentTime)}</Text>
                        <Text size="10px" fw={700} style={{ opacity: 0.9 }}>{formatTime(duration)}</Text>
                    </Group>
                </div>

                <audio
                    ref={audioRef}
                    src={url}
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onEnded={() => setPlaying(false)}
                    className="hidden"
                />
            </Group>
        </Paper>
    );
};

const MessageBubble = React.memo(({ msg, isMe, isLastInGroup, isFirstInGroup, dark, setPreviewImage, t, targetUser, lastSeenMessageId, newestOutgoingId, getReceiptLabel, onReply }: any) => {
    return (
        <div className={`flex flex-col ${isMe ? 'items-end ml-auto' : 'items-start'} ${isLastInGroup ? 'mb-3' : 'mb-[3px]'} group w-full`}>
            {/* Show Date Divider if first in group and from long ago (optional, but good for "chuẩn" UI) */}

            <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && (
                    <div className="w-[32px] shrink-0">
                        {isLastInGroup ? (
                            <Avatar
                                src={targetUser?.avatar || msg.nguoiGui?.avatar || msg.nguoiGui?.hoSoHocSinh?.avatar || msg.nguoiGui?.hoSoGiaoVien?.avatar}
                                size={32}
                                radius="xl"
                                className="shadow-sm border border-white/10"
                            />
                        ) : null}
                    </div>
                )}

                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} min-w-0`}>
                    {/* Reply Preview */}
                    {msg.tinNhanGoc && (
                        <Paper
                            px="12px" py="4px" withBorder
                            className="bg-gray-50/50 dark:bg-white/5 mb-[-12px] pb-[16px] opacity-70 scale-[0.95]"
                            style={{
                                borderRadius: '14px',
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                                transformOrigin: isMe ? 'right' : 'left'
                            }}
                        >
                            <Text size="12px" fw={600} className="truncate" maw={200}>
                                {msg.tinNhanGoc.nguoiGui?.hoTen || msg.tinNhanGoc.nguoiGui?.taiKhoan}
                            </Text>
                            <Text size="11px" className="truncate" maw={200}>
                                {msg.tinNhanGoc.loai === 'VAN_BAN' ? msg.tinNhanGoc.noiDung : t('attachment')}
                            </Text>
                        </Paper>
                    )}

                    <div className="flex items-center gap-1 group/row">
                        {isMe && (
                            <ActionIcon
                                variant="subtle" color="gray" size="sm" radius="xl"
                                className="opacity-0 group-hover/row:opacity-100 transition-opacity order-first"
                                onClick={() => onReply(msg)}
                            >
                                <IconArrowLeft size={16} />
                            </ActionIcon>
                        )}

                        <div className={`relative transition-all duration-200 ${isMe ? 'hover:brightness-105' : ''}`}>
                            {msg.loai === 'VAN_BAN' ? (
                                <Paper
                                    px="14px" py="10px" withBorder={false}
                                    className={`shadow-none ${isMe ? 'text-white' : 'text-black dark:text-white'}`}
                                    style={{
                                        backgroundColor: isMe ? '#6366f1' : undefined,
                                        borderTopRightRadius: isMe ? (isFirstInGroup ? 20 : 4) : 20,
                                        borderBottomRightRadius: isMe ? (isLastInGroup ? 20 : 4) : 20,
                                        borderTopLeftRadius: !isMe ? (isFirstInGroup ? 20 : 4) : 20,
                                        borderBottomLeftRadius: !isMe ? (isLastInGroup ? 20 : 4) : 20,
                                        maxWidth: 'fit-content',
                                        overflowWrap: 'anywhere',
                                        wordBreak: 'break-word'
                                    }}
                                    bg={!isMe ? (dark ? '#3e4042' : '#E4E6EB') : undefined}
                                >
                                    <Text size="15px" className="leading-[1.4] whitespace-pre-wrap">{msg.noiDung}</Text>
                                </Paper>
                            ) : msg.loai === 'HINH_ANH' ? (
                                <Box
                                    className="cursor-pointer overflow-hidden rounded-[18px] transition-all hover:brightness-95 active:scale-[0.98]"
                                    onClick={() => setPreviewImage(msg.duongDanTep || msg.noiDung || null)}
                                    style={{ maxWidth: '300px' }}
                                >
                                    <Image src={msg.duongDanTep || msg.noiDung} alt="Image" radius={18} fit="contain" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </Box>
                            ) : msg.loai === 'GHI_AM' ? (
                                <CustomVoicePlayer url={msg.duongDanTep || msg.noiDung} isMe={isMe} dark={dark} isFirstInGroup={isFirstInGroup} isLastInGroup={isLastInGroup} />
                            ) : (
                                <Paper
                                    px="14px" py="10px" withBorder={false}
                                    className={`shadow-none ${isMe ? 'text-white' : 'text-black dark:text-white'}`}
                                    style={{ backgroundColor: isMe ? '#6366f1' : undefined, borderRadius: 20, maxWidth: 'fit-content' }}
                                    bg={!isMe ? (dark ? '#3e4042' : '#E4E6EB') : undefined}
                                >
                                    <Group gap="xs" wrap="nowrap" className="py-0.5">
                                        <Box className="bg-white/20 p-2 rounded-full"><IconFile size={16} fill="white" /></Box>
                                        <Text size="sm" className="font-medium cursor-pointer" onClick={() => window.open(msg.duongDanTep, '_blank')}>{t('attachment')}</Text>
                                    </Group>
                                </Paper>
                            )}
                        </div>

                        {!isMe && (
                            <ActionIcon
                                variant="subtle" color="gray" size="sm" radius="xl"
                                className="opacity-0 group-hover/row:opacity-100 transition-opacity"
                                onClick={() => onReply(msg)}
                            >
                                <IconArrowLeft size={16} />
                            </ActionIcon>
                        )}
                    </div>
                </div>
            </div>

            {isLastInGroup && (
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} w-full mt-1.5`}>
                    {/* Show recipient avatar if message is seen */}
                    {isMe && lastSeenMessageId >= msg.id && (
                        <Group gap={4} mr={4}>
                            <Avatar src={targetUser?.avatar} size={14} radius="xl" className="opacity-80" />
                            <Text size="11px" fw={600} c="dimmed" className="opacity-60">{t('seen')}</Text>
                        </Group>
                    )}
                    {/* Show delivery status if not seen yet */}
                    {isMe && (!lastSeenMessageId || lastSeenMessageId < msg.id) && (
                        <Text size="11px" fw={600} c="dimmed" pr={12} className="opacity-60">{getReceiptLabel(msg.id)}</Text>
                    )}
                    {/* Timestamp */}
                    <Text size="11px" fw={500} c="dimmed" px={isMe ? 12 : 44} className="opacity-40">{dayjs(msg.ngayGui).format('HH:mm')}</Text>
                </div>
            )}
        </div>
    );
});

export const ChatWindow: React.FC<ChatWindowProps> = ({ channel, onBack, onToggleInfo }) => {
    const { user } = useAppStore();
    const queryClient = useQueryClient();
    const t = useTranslations('chat');

    const targetUser = useMemo(() => {
        if (!channel?.thanhViens) return null;
        return channel.thanhViens.find((m: any) => Number(m.nguoiDung.id) !== Number(user?.id))?.nguoiDung;
    }, [channel?.thanhViens, user?.id]);

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
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<any | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const viewport = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 48em)');
    const firstLoadRef = useRef(true);

    useEffect(() => {
        dayjs.extend(relativeTime);
    }, []);

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

    useEffect(() => {
        if (!isConnected) return;

        const handleNewMessage = (message: any) => {
            if (message?.kenhChatId !== channel.id) return;
            const isFromMe = Number(message?.nguoiGuiId) === Number(user?.id);

            if (message?.nguoiGuiId && !isFromMe && message?.id) {
                emit('message:delivered', { channelId: channel.id, messageId: message.id });
            }

            setAllMessages(prev => {
                if (prev.some(m => m.id === message.id)) return prev;
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

            // No need to invalidate - optimistic update already handled it
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

    useEffect(() => {
        setAllMessages([]);
        setPage(1);
        hasMoreRef.current = true;
        firstLoadRef.current = true;
    }, [channel.id]);

    useEffect(() => {
        if (pageMessages) {
            if (pageMessages.length < 20) hasMoreRef.current = false;

            // Maintain scroll position when loading older messages
            if (page > 1 && viewport.current) {
                scrollBeforeRef.current = viewport.current.scrollHeight;
            }

            setAllMessages(prev => {
                const next = [...prev];
                const existingIds = new Set(prev.map(m => m.id));

                pageMessages.forEach((newMsg: any) => {
                    // 1. If message exists by ID, update it (though usually immutable)
                    if (existingIds.has(newMsg.id)) {
                        const idx = next.findIndex(m => m.id === newMsg.id);
                        if (idx !== -1) next[idx] = newMsg;
                        return;
                    }

                    // 2. If it's a new real message (id > 0), check if it replaces an optimistic one
                    if (newMsg.id > 0) {
                        const optimisticIdx = next.findIndex(m =>
                            m.id < 0 &&
                            // Match content and type
                            m.noiDung === newMsg.noiDung &&
                            m.loai === newMsg.loai &&
                            // Only match messages sent by me
                            Number(m.nguoiGuiId) === Number(newMsg.nguoiGuiId)
                        );

                        if (optimisticIdx !== -1) {
                            // Replace optimistic with real
                            next[optimisticIdx] = newMsg;
                        } else {
                            // Genuine new message
                            next.push(newMsg);
                        }
                    } else {
                        // 3. For new optimistic messages (from cache updates), just add if not exists
                        next.push(newMsg);
                    }
                });

                // Sort by date
                return next.sort((a, b) => dayjs(a.ngayGui).valueOf() - dayjs(b.ngayGui).valueOf());
            });
        }
    }, [pageMessages, page]);

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

        try {

            on('presence:update', handlePresenceUpdate);
            on('message:delivered', handleDelivered);
            on('message:seen', handleSeen);
        } catch (error) {
            console.warn('Socket event listener setup failed:', error);
        }

        return () => {
            try {

                off('presence:update', handlePresenceUpdate);
                off('message:delivered', handleDelivered);
                off('message:seen', handleSeen);
            } catch (error) {
                console.warn('Socket event listener cleanup failed:', error);
            }
        };
    }, [isConnected, channel.id, on, off, emit, queryClient, user?.id, targetUser?.id]);

    useEffect(() => {
        if (!isConnected || !allMessages || allMessages.length === 0) return;
        const newestIncoming = [...allMessages].reverse().find((m: any) => m?.nguoiGuiId && Number(m.nguoiGuiId) !== Number(user?.id));
        if (newestIncoming?.id) {
            emit('message:seen', { channelId: channel.id, messageId: newestIncoming.id });
        }
    }, [isConnected, allMessages, emit, channel.id, user?.id]);

    const handleScroll = () => {
        if (!viewport.current || !hasMoreRef.current || isFetching) return;
        if (viewport.current.scrollTop < 50) {
            setPage(p => p + 1);
        }
    };

    // Scroll handling
    useEffect(() => {
        if (viewport.current) {
            if (firstLoadRef.current && allMessages.length > 0) {
                // Scroll to bottom on first load
                setTimeout(() => {
                    if (viewport.current) viewport.current.scrollTop = viewport.current.scrollHeight;
                    firstLoadRef.current = false;
                }, 0);
            } else if (page > 1 && scrollBeforeRef.current) {
                viewport.current.scrollTop = viewport.current.scrollHeight - scrollBeforeRef.current;
                scrollBeforeRef.current = 0;
            } else if (allMessages.length > 0) {
                // For new messages, scroll to bottom if already near bottom
                const lastMsg = allMessages[allMessages.length - 1];
                const isMe = Number(lastMsg?.nguoiGuiId) === Number(user?.id);
                const isNearBottom = viewport.current.scrollHeight - viewport.current.scrollTop - viewport.current.clientHeight < 100; // Threshold
                if (isMe || isNearBottom) {
                    viewport.current.scrollTo({
                        top: viewport.current.scrollHeight,
                        behavior: isMe ? 'auto' : 'smooth'
                    });
                }
            }
        }
    }, [allMessages, page, user?.id]);

    const handleTyping = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        startTyping(channel.id, user?.hoTen || user?.taiKhoan || 'User');
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping(channel.id);
        }, 2000);
    };

    const lastSeenMessageId = useMemo(() => {
        // Simple logic: find last message by me that is seen (based on local receipt state or presence?)
        // Actually, receiptByMessageId tracks specific message status.
        // We can just find the max ID that is 'seen'.
        const seenIds = Object.keys(receiptByMessageId).filter(k => receiptByMessageId[Number(k)] === 'seen').map(Number);
        return seenIds.length ? Math.max(...seenIds) : 0;
    }, [receiptByMessageId]);

    const newestOutgoingId = useMemo(() => {
        const myMessages = allMessages.filter(m => Number(m.nguoiGuiId) === Number(user?.id));
        return myMessages.length ? myMessages[myMessages.length - 1].id : 0;
    }, [allMessages, user?.id]);

    const getReceiptLabel = (msgId: number) => {
        const status = receiptByMessageId[msgId];
        if (status === 'seen') return t('seen');
        if (status === 'delivered') return t('delivered');
        return t('sent');
    };

    return (
        <div className="h-full flex flex-col overflow-hidden bg-white dark:bg-[#1c1e21] relative isolate">
            {/* Header - Fixed to top of VIEWPORT for absolute stability on mobile */}
            <div className="shrink-0 border-b border-gray-100 dark:border-white/5 bg-white/95 dark:bg-[#1c1e21]/95 backdrop-blur-md z-[100] shadow-sm fixed top-0 left-0 right-0 md:relative">
                <div className="h-[64px] px-3 sm:px-4 flex items-center justify-between gap-2">
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
                                    src={channel.loaiKenh === 'NHOM' ? undefined : targetUser?.avatar || null}
                                    radius={999}
                                    size={44}
                                    className="border border-gray-100 dark:border-white/10 shadow-sm"
                                >
                                    {channel.loaiKenh === 'NHOM' ? <IconUsers size={20} /> : null}
                                </Avatar>
                                {presence?.online && (
                                    <Box className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#31A24C] border-[3px] border-white dark:border-[#1c1e21] rounded-full" />
                                )}
                            </Box>
                            <div className="min-w-0 flex-1">
                                <Text size="16px" fw={700} className="truncate text-gray-900 dark:text-gray-100 leading-tight block">
                                    {channel.loaiKenh === 'NHOM' ? channel.tenKenh : (targetUser?.hoTen || targetUser?.taiKhoan)}
                                </Text>
                                <Text size="13px" c="dimmed" fw={400} className="truncate leading-tight mt-0.5 block">
                                    {typingUsers.length > 0
                                        ? t("typing")
                                        : (presence?.online ? t("active") : t("offline"))}
                                </Text>
                            </div>
                        </UnstyledButton>
                    </Group>

                    <Group gap={8}>
                        <ActionIcon variant="subtle" radius="xl" size={40} className="text-[#6366f1] hover:bg-gray-100 dark:hover:bg-white/5">
                            <IconPhone size={24} fill="currentColor" stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" radius="xl" size={40} className="text-[#6366f1] hover:bg-gray-100 dark:hover:bg-white/5">
                            <IconVideo size={26} fill="currentColor" stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </div>
            </div>

            {/* Header Spacer for mobile fixed header */}
            <div className="h-[64px] md:hidden shrink-0" />

            <ScrollArea
                viewportRef={viewport}
                className="flex-1 px-4 py-4 no-scrollbar"
                onScrollPositionChange={handleScroll}
                type="scroll"
                scrollbarSize={6}
            >
                <Stack gap={0} className="min-h-full justify-end">
                    {isFetching && page > 1 && (
                        <Center py="xs"><Loader size="xs" color="blue" /></Center>
                    )}

                    {allMessages.length === 0 && isLoading ? (
                        <Center h={100}><Loader size="sm" color="blue" /></Center>
                    ) : allMessages.length === 0 ? (
                        <Center h={400} className="flex-col animate-in fade-in zoom-in duration-500">
                            <Avatar src={targetUser?.avatar || null} size={100} radius={999} mb="md" />
                            <Text fw={700} size="xl">{channel.loaiKenh === 'NHOM' ? channel.tenKenh : (targetUser?.hoTen || targetUser?.taiKhoan)}</Text>
                            <Text size="sm" c="dimmed" mt={4}>{t('start_conversation')}</Text>
                        </Center>
                    ) : (
                        (allMessages || []).map((msg, idx, arr) => {
                            const isMe = Number(msg.nguoiGuiId) === Number(user?.id);
                            const prevMsg = arr[idx - 1];
                            const nextMsg = arr[idx + 1];

                            const isFirstInGroup = !prevMsg || Number(prevMsg.nguoiGuiId) !== Number(msg.nguoiGuiId) || (dayjs(msg.ngayGui).diff(dayjs(prevMsg.ngayGui), 'minute') > 5);
                            const isLastInGroup = !nextMsg || Number(nextMsg.nguoiGuiId) !== Number(msg.nguoiGuiId) || (dayjs(nextMsg.ngayGui).diff(dayjs(msg.ngayGui), 'minute') > 5);

                            return (
                                <MessageBubble
                                    key={msg.id}
                                    msg={msg}
                                    isMe={isMe}
                                    isFirstInGroup={isFirstInGroup}
                                    isLastInGroup={isLastInGroup}
                                    dark={dark}
                                    setPreviewImage={setPreviewImage}
                                    t={t}
                                    targetUser={targetUser}
                                    lastSeenMessageId={lastSeenMessageId}
                                    newestOutgoingId={newestOutgoingId}
                                    getReceiptLabel={getReceiptLabel}
                                    onReply={setReplyingTo}
                                />
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
                </Stack>
            </ScrollArea>

            <Modal
                opened={!!previewImage} onClose={() => setPreviewImage(null)} size="xl" centered withCloseButton={false} padding={0}
                styles={{ content: { backgroundColor: 'transparent', boxShadow: 'none' }, body: { display: 'flex', justifyContent: 'center' } }}
            >
                {previewImage && <Image src={previewImage} alt="Full preview" radius="md" style={{ maxHeight: '90vh', maxWidth: '100vw', objectFit: 'contain' }} />}
            </Modal>

            <div className="shrink-0 border-t border-gray-200/70 dark:border-zinc-800 bg-white/90 dark:bg-[#1c1e21]/80 backdrop-blur pb-safe">
                <ChatInput channelId={channel.id} onTyping={handleTyping} replyingTo={replyingTo} onReply={setReplyingTo} />
            </div>
        </div>
    );
};