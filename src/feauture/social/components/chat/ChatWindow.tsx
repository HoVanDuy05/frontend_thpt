import { Paper, Group, ActionIcon, Avatar, Text, Stack, Box, Loader, Center, Image, Drawer, Divider, Badge, Accordion, ThemeIcon, UnstyledButton, Modal, Button, useMantineColorScheme, Skeleton, Portal, Transition, ScrollArea } from "@mantine/core";
import { IconArrowLeft, IconPhone, IconVideo, IconUser, IconInfoCircle, IconPhoto, IconFile, IconBell, IconSearch, IconMicrophone, IconSend, IconThumbUp, IconUsers, IconX, IconDownload, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { RichLinkPreview } from "./RichLinkPreview";
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

const ChatSkeleton = () => {
    return (
        <Stack gap="lg" p="md" className="w-full h-full justify-end pb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Group key={i} justify={i % 2 === 0 ? 'flex-end' : 'flex-start'} align="flex-end" gap="xs">
                    {i % 2 !== 0 && <Skeleton height={32} width={32} circle />}
                    <Stack gap={4} className="max-w-[70%]">
                        <Skeleton height={40} width={Math.random() * 100 + 100} radius="xl" />
                    </Stack>
                </Group>
            ))}
        </Stack>
    );
};

// Helper to linkify text
const Linkify = ({ text }: { text: string }) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return (
        <>
            {parts.map((part, i) => {
                if (part.match(urlRegex)) {
                    return (
                        <a
                            key={i}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline break-all hover:opacity-80"
                            onClick={(e) => e.stopPropagation()}
                            style={{ color: 'inherit', textDecorationColor: 'inherit' }}
                        >
                            {part}
                        </a>
                    );
                }
                return part;
            })}
        </>
    );
};

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
    const [waveformBars, setWaveformBars] = useState<{ height: number; delay: number }[]>([]);

    useEffect(() => {
        setWaveformBars(Array.from({ length: 25 }).map((_, i) => ({
            height: Math.floor(Math.random() * 60) + 20,
            delay: i * 0.05
        })));
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
        <div className={`flex flex-col ${isMe ? 'items-end ml-auto' : 'items-start'} ${isLastInGroup ? 'mb-5' : 'mb-1'} group w-full`}>
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
                            className="bg-gray-50/50 dark:bg-white/5 mb-[-12px] pb-[16px] opacity-70 scale-[0.95] min-w-[100px]"
                            style={{
                                borderRadius: '14px',
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                                transformOrigin: isMe ? 'right' : 'left',
                                width: 'fit-content',
                                maxWidth: '100%'
                            }}
                        >
                            <Text size="12px" fw={600} className="break-words line-clamp-1">
                                {msg.tinNhanGoc.nguoiGui?.hoTen || msg.tinNhanGoc.nguoiGui?.taiKhoan}
                            </Text>
                            <Text size="11px" className="break-words leading-tight whitespace-pre-wrap line-clamp-3">
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
                                    <Text size="15px" className="leading-[1.4] whitespace-pre-wrap">
                                        <Linkify text={msg.noiDung} />
                                    </Text>
                                    {/* Link Preview (if any URL is found) */}
                                    {(() => {
                                        const match = msg.noiDung?.match(/(https?:\/\/[^\s]+)/);
                                        return match ? <RichLinkPreview url={match[0]} /> : null;
                                    })()}
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
            console.log('Socket received message:new', message);
            if (Number(message?.kenhChatId) !== Number(channel.id)) {
                console.log('Ignored message for different channel:', message?.kenhChatId, channel.id);
                return;
            }
            const isFromMe = Number(message?.nguoiGuiId) === Number(user?.id);

            if (message?.nguoiGuiId && !isFromMe && message?.id) {
                emit('message:delivered', { channelId: channel.id, messageId: message.id });
            }

            setAllMessages(prev => {
                const exists = prev.some(m => m.id === message.id);
                if (exists) return prev;

                if (isFromMe) {
                    const optimisticIdx = prev.findIndex(m => m.id < 0 && (m.noiDung === message.noiDung || m.duongDanTep === message.duongDanTep));
                    if (optimisticIdx !== -1) {
                        const next = [...prev];
                        next[optimisticIdx] = message;
                        return next.sort((a, b) => dayjs(a.ngayGui).valueOf() - dayjs(b.ngayGui).valueOf());
                    }
                }
                const updated = [...prev, message];
                const sorted = updated.sort((a, b) => dayjs(a.ngayGui).valueOf() - dayjs(b.ngayGui).valueOf());
                return sorted;
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
                    // 1. If message exists by ID, update it
                    if (existingIds.has(newMsg.id)) {
                        const idx = next.findIndex(m => m.id === newMsg.id);
                        if (idx !== -1) next[idx] = newMsg;
                        return;
                    }

                    // 2. If it's a new real message (id > 0), check if it replaces an optimistic one
                    if (newMsg.id > 0) {
                        // Find strictly matching optimistic message
                        const optimisticIdx = next.findIndex(m =>
                            m.id < 0 &&
                            Number(m.nguoiGuiId) === Number(newMsg.nguoiGuiId) &&
                            // Use flexible matching for content as backend might sanitize/trim
                            (m.noiDung === newMsg.noiDung || m.duongDanTep === newMsg.duongDanTep)
                        );

                        if (optimisticIdx !== -1) {
                            next[optimisticIdx] = newMsg;
                        } else {
                            next.push(newMsg);
                        }
                    } else {
                        // 3. For new optimistic messages (from cache updates)
                        // Ensure we don't add duplicates based on tempId
                        if (!existingIds.has(newMsg.id)) {
                            next.push(newMsg);
                        }
                    }
                });

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
            // Strict 'seen' handler
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

    const imagesList = useMemo(() => {
        return allMessages
            .filter(m => m.loai === 'HINH_ANH')
            .map(m => ({
                id: m.id,
                url: m.duongDanTep || m.noiDung,
                user: m.nguoiGui
            }))
            .reverse(); // Show oldest first for strict order, or keep render order. Actually rendering is chrono.
        // Let's keep it consistent with display order (which is usually Newest at bottom visually, so filtered chrono list).
        // allMessages is sorted by date ascending? Let's check.
        // setAllMessages sorts by dayjs(a.ngayGui).valueOf(). So it's oldest first.
        // So index 0 is oldest.
    }, [allMessages]);

    const handleNextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!previewImage) return;
        const idx = imagesList.findIndex(img => img.url === previewImage);
        if (idx < imagesList.length - 1) {
            setPreviewImage(imagesList[idx + 1].url);
        }
    };

    const handlePrevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!previewImage) return;
        const idx = imagesList.findIndex(img => img.url === previewImage);
        if (idx > 0) {
            setPreviewImage(imagesList[idx - 1].url);
        }
    };

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
        <div className="h-full flex flex-col min-h-0 overflow-hidden bg-white dark:bg-[#1c1e21] relative isolate">
            {/* Header - Sticky for stability and natural flow */}
            <div className="shrink-0 border-b border-gray-100 dark:border-white/5 bg-white/95 dark:bg-[#1c1e21]/95 backdrop-blur-md z-[100] shadow-sm relative">
                <div className="h-[64px] px-3 sm:px-4 flex items-center justify-between gap-2">
                    <Group gap="xs" className="min-w-0 flex-1">
                        <ActionIcon variant="subtle" color="gray" onClick={onBack} className="md:hidden">
                            <IconArrowLeft size={24} stroke={2.5} />
                        </ActionIcon>
                        <Avatar
                            src={targetUser?.avatar}
                            size={42}
                            radius="xl"
                            className="shrink-0 border-2 border-white dark:border-zinc-800 shadow-sm"
                        >
                            <IconUser size={24} />
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                            <Text size="16px" fw={700} truncate className="text-gray-900 dark:text-white leading-tight">
                                {channel.loaiKenh === 'NHOM' ? channel.tenKenh : (targetUser?.hoTen || targetUser?.taiKhoan)}
                            </Text>
                            <Group gap={4} wrap="nowrap">
                                <Box className={`w-2 h-2 rounded-full ${presence?.online ? 'bg-green-500' : 'bg-gray-300 dark:bg-zinc-600'}`} />
                                <Text size="11px" c="dimmed" fw={500} className="uppercase tracking-wider">
                                    {presence?.online ? t('active') : t('offline')}
                                </Text>
                            </Group>
                        </div>
                    </Group>

                    <Group gap={8}>
                        <ActionIcon variant="subtle" radius="xl" size={40} className="text-[#6366f1] hover:bg-gray-100 dark:hover:bg-white/5">
                            <IconPhone size={24} fill="currentColor" stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" radius="xl" size={40} className="text-[#6366f1] hover:bg-gray-100 dark:hover:bg-white/5">
                            <IconVideo size={26} fill="currentColor" stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" onClick={onToggleInfo}>
                            <IconInfoCircle size={20} />
                        </ActionIcon>
                    </Group>
                </div>
            </div>

            <div
                ref={viewport}
                className="flex-1 px-4 py-4 overflow-y-auto min-h-0"
                onScroll={handleScroll}
            >
                <Stack gap={0} className="min-h-full justify-end">
                    {isFetching && page > 1 && (
                        <Center py="xs"><Loader size="xs" color="blue" /></Center>
                    )}

                    {(isLoading && page === 1 && allMessages.length === 0) ? (
                        <ChatSkeleton />
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
            </div>

            <Transition mounted={!!previewImage} transition="fade" duration={200} timingFunction="ease">
                {(styles) => (
                    <Portal>
                        <div style={{ ...styles, zIndex: 9999 }} className="fixed inset-0 bg-black/95 backdrop-blur-sm flex flex-col pt-safe">
                            {/* Toolbar */}
                            <div className="absolute top-4 right-4 z-[10000] flex items-center gap-3">
                                <ActionIcon
                                    variant="filled" color="gray" size="xl" radius="xl"
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md"
                                    onClick={() => {
                                        if (previewImage) {
                                            const link = document.createElement('a');
                                            link.href = previewImage;
                                            link.download = 'image.png';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }
                                    }}
                                >
                                    <IconDownload size={24} />
                                </ActionIcon>
                                <ActionIcon
                                    variant="filled" color="gray" size="xl" radius="xl"
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md"
                                    onClick={() => setPreviewImage(null)}
                                >
                                    <IconX size={24} />
                                </ActionIcon>
                            </div>

                            {/* Image Container */}
                            <div
                                className="flex-1 flex items-center justify-center p-4 overflow-hidden relative group/nav"
                                onClick={() => setPreviewImage(null)}
                            >
                                {/* Nav Buttons */}
                                {imagesList.length > 1 && (
                                    <>
                                        <ActionIcon
                                            variant="filled" radius="xl" size={48}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md opacity-0 group-hover/nav:opacity-100 transition-opacity disabled:opacity-0"
                                            onClick={handlePrevImage}
                                            disabled={imagesList.findIndex(img => img.url === previewImage) <= 0}
                                        >
                                            <IconChevronLeft size={32} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="filled" radius="xl" size={48}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md opacity-0 group-hover/nav:opacity-100 transition-opacity disabled:opacity-0"
                                            onClick={handleNextImage}
                                            disabled={imagesList.findIndex(img => img.url === previewImage) >= imagesList.length - 1}
                                        >
                                            <IconChevronRight size={32} />
                                        </ActionIcon>
                                    </>
                                )}

                                <img
                                    src={previewImage || ''}
                                    alt="Full preview"
                                    className="max-w-full max-h-[80vh] object-contain shadow-2xl animate-in zoom-in-95 duration-300 rounded-md select-none"
                                    onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
                                />
                            </div>

                            {/* Thumbnail Strip */}
                            <div className="h-20 shrink-0 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center justify-center">
                                <ScrollArea type="never" viewportProps={{ style: { overflowX: 'auto', whiteSpace: 'nowrap' } }} className="w-full max-w-4xl px-4">
                                    <div className="flex items-center justify-center gap-2 py-2 min-w-full">
                                        {imagesList.map((img) => (
                                            <div
                                                key={img.id}
                                                className={`relative w-12 h-12 rounded-lg overflow-hidden cursor-pointer transition-all ${img.url === previewImage
                                                    ? 'ring-2 ring-white opacity-100 scale-110'
                                                    : 'opacity-50 hover:opacity-100 hover:scale-105'
                                                    }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewImage(img.url);
                                                }}
                                            >
                                                <img src={img.url} className="w-full h-full object-cover" loading="lazy" />
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </Portal>
                )}
            </Transition>

            <div className="shrink-0 border-t border-gray-200/70 dark:border-zinc-800 bg-white/90 dark:bg-[#1c1e21]/80 backdrop-blur pb-safe">
                <ChatInput channelId={channel.id} onTyping={handleTyping} replyingTo={replyingTo} onReply={setReplyingTo} />
            </div>
        </div >
    );
};