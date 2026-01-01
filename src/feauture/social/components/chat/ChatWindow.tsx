import { Paper, Group, ActionIcon, Avatar, Text, Stack, ScrollArea, Box, Loader, Center, Image, Drawer, Divider, Badge, Accordion, ThemeIcon, UnstyledButton } from "@mantine/core";
import { IconArrowLeft, IconPhone, IconVideo, IconInfoCircle, IconPhoto, IconFile, IconBell, IconSearch } from "@tabler/icons-react";
import { TChannel } from "@/api/types/api.type";
import { AppQuery } from "@/api/AppQuery";
import { useAppStore } from "@/providers/store/useAppStore";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { useSocket } from "@/shared/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMediaQuery } from "@mantine/hooks";

interface ChatWindowProps {
    channel: TChannel;
    onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ channel, onBack }) => {
    const { user } = useAppStore();
    const queryClient = useQueryClient();
    const { data: messages, isLoading } = AppQuery.chat.useMessages(channel.id, { page: 1 });
    const { on, off, emit, joinChannel, leaveChannel, startTyping, stopTyping, isConnected } = useSocket();
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [presence, setPresence] = useState<{ online: boolean; lastSeen: string | null } | null>(null);
    const [receiptByMessageId, setReceiptByMessageId] = useState<Record<number, 'sent' | 'delivered' | 'seen'>>({});
    const [infoOpened, setInfoOpened] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const viewport = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 48em)');

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

    // Listen for new messages
    useEffect(() => {
        if (!isConnected) return;

        const handleNewMessage = (message: any) => {
            if (message?.kenhChatId !== channel.id) return;

            // If message is from other user, acknowledge delivered (realtime)
            if (message?.nguoiGuiId && message.nguoiGuiId !== user?.id && message?.id) {
                emit('message:delivered', { channelId: channel.id, messageId: message.id });
            }

            queryClient.invalidateQueries({
                predicate: (query) => {
                    const key = query.queryKey?.[0];
                    return typeof key === 'string' && key.startsWith(`/communication/chat/channels/${channel.id}/messages`);
                }
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
    }, [isConnected === true, channel.id, on, off, emit, queryClient, user?.id]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (viewport.current) {
            viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

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
        return channel.thanhViens?.find(m => m.nguoiDungId !== user?.id)?.nguoiDung;
    };

    const targetUser = getOtherMember();

    useEffect(() => {
        if (!isConnected) return;

        const handlePresenceUpdate = (data: any) => {
            if (!targetUser?.id) return;
            if (data?.userId !== targetUser.id) return;
            setPresence({ online: !!data.online, lastSeen: data.lastSeen ?? null });
        };

        const handleDelivered = (data: any) => {
            if (data?.channelId !== channel.id) return;
            if (data?.userId === user?.id) return;
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
            if (data?.userId === user?.id) return;
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
        if (!messages || messages.length === 0) return;

        // Only mark as seen for the newest *incoming* message.
        // This avoids instantly marking my own sent message as "Đã xem".
        const newestIncoming = messages.find((m: any) => m?.nguoiGuiId && m.nguoiGuiId !== user?.id);
        const newestIncomingId = newestIncoming?.id;
        if (!newestIncomingId) return;

        emit('message:seen', { channelId: channel.id, messageId: newestIncomingId });
    }, [isConnected, messages, emit, channel.id]);

    const newestOutgoingId = (() => {
        if (!messages || messages.length === 0) return null;
        const mine = messages.find((m: any) => m?.nguoiGuiId === user?.id);
        return mine?.id ?? null;
    })();

    const getReceiptLabel = (messageId: number) => {
        const status = receiptByMessageId[messageId];
        if (status === 'seen') return 'Đã xem';
        if (status === 'delivered') return 'Đã nhận';
        return 'Đã gửi';
    };

    return (
        <div className="h-full flex flex-col overflow-hidden bg-white dark:bg-black">
            <Drawer
                opened={infoOpened}
                onClose={() => setInfoOpened(false)}
                position="right"
                size={isMobile ? '100%' : 360}
                withCloseButton={false}
                overlayProps={{ opacity: 0.25, blur: 2 }}
                styles={{
                    body: { padding: 0 },
                }}
            >
                <div className="h-full flex flex-col bg-white dark:bg-black">
                    <div className="px-4 py-3 border-b border-gray-200/70 dark:border-zinc-900">
                        <Group justify="space-between" wrap="nowrap">
                            <Text fw={700}>Thông tin đoạn chat</Text>
                            <ActionIcon variant="subtle" color="gray" radius="xl" onClick={() => setInfoOpened(false)}>
                                <IconArrowLeft size={18} />
                            </ActionIcon>
                        </Group>
                    </div>

                    <ScrollArea className="flex-1">
                        <Stack gap={0} p="md">
                            <Center className="flex-col gap-2" py="md">
                                <Avatar src={targetUser?.avatar} size={84} radius={999} />
                                <Text fw={800} size="lg" className="text-gray-900 dark:text-white">
                                    {channel.loaiKenh === 'NHOM' ? channel.tenKenh : (targetUser?.hoTen || targetUser?.taiKhoan)}
                                </Text>
                                <Badge variant="light" color="gray" radius="sm" className="normal-case font-normal bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
                                    Được mã hóa đầu cuối
                                </Badge>
                            </Center>

                            <Divider my="md" />

                            <Group grow gap="sm">
                                <UnstyledButton className="rounded-xl p-3 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                                    <Group wrap="nowrap" gap="sm">
                                        <ThemeIcon variant="light" color="blue" radius="xl"><IconSearch size={16} /></ThemeIcon>
                                        <Text size="sm" fw={600}>Tìm kiếm</Text>
                                    </Group>
                                </UnstyledButton>
                                <UnstyledButton className="rounded-xl p-3 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                                    <Group wrap="nowrap" gap="sm">
                                        <ThemeIcon variant="light" color="gray" radius="xl"><IconBell size={16} /></ThemeIcon>
                                        <Text size="sm" fw={600}>Thông báo</Text>
                                    </Group>
                                </UnstyledButton>
                            </Group>

                            <Divider my="md" />

                            <Accordion variant="separated" radius="md" classNames={{ item: 'border border-gray-200/70 dark:border-zinc-800 bg-white dark:bg-black', control: 'hover:bg-gray-50 dark:hover:bg-zinc-900' }}>
                                <Accordion.Item value="about">
                                    <Accordion.Control icon={<ThemeIcon variant="light" color="gray" radius="xl"><IconInfoCircle size={16} /></ThemeIcon>}>
                                        <Text size="sm" fw={700}>Thông tin về đoạn chat</Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Text size="sm" c="dimmed">Tình trạng: {presence?.online ? 'Đang hoạt động' : 'Ngoại tuyến'}</Text>
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="media">
                                    <Accordion.Control icon={<ThemeIcon variant="light" color="gray" radius="xl"><IconPhoto size={16} /></ThemeIcon>}>
                                        <Text size="sm" fw={700}>File phương tiện & file</Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Group gap="sm">
                                            <ThemeIcon variant="light" color="gray" radius="xl"><IconPhoto size={16} /></ThemeIcon>
                                            <ThemeIcon variant="light" color="gray" radius="xl"><IconFile size={16} /></ThemeIcon>
                                        </Group>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>

                            <div className="h-6" />
                        </Stack>
                    </ScrollArea>
                </div>
            </Drawer>

            <div className="shrink-0 border-b border-gray-200/70 dark:border-zinc-900 bg-white/90 dark:bg-black/80 backdrop-blur">
                <div className="h-14 px-3 flex items-center gap-2">
                    <ActionIcon variant="subtle" color="gray" onClick={onBack} className="md:hidden">
                        <IconArrowLeft size={20} />
                    </ActionIcon>

                    <UnstyledButton
                        className="min-w-0 flex-1 flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-gray-100/70 dark:hover:bg-zinc-900/60 transition-colors"
                        onClick={() => setInfoOpened(true)}
                    >
                        <Avatar src={targetUser?.avatar} radius={999} size={34} />
                        <div className="min-w-0 flex-1">
                            <Text size="sm" fw={700} className="truncate">
                                {channel.loaiKenh === 'NHOM' ? channel.tenKenh : (targetUser?.hoTen || targetUser?.taiKhoan)}
                            </Text>
                            <Text size="xs" c="dimmed" className="truncate">
                                {typingUsers.length > 0
                                    ? 'đang nhập…'
                                    : (presence?.online
                                        ? 'Đang hoạt động'
                                        : (presence?.lastSeen ? `Hoạt động ${dayjs(presence.lastSeen).fromNow()}` : 'Ngoại tuyến'))}
                            </Text>
                        </div>
                    </UnstyledButton>

                    <Group gap={4} wrap="nowrap">
                        <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                            <IconPhone size={20} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                            <IconVideo size={20} />
                        </ActionIcon>
                    </Group>
                </div>
            </div>

            <ScrollArea className="flex-1" viewportRef={viewport}>
                <div className="min-h-full bg-[#f5f7fb] dark:bg-zinc-950">
                    <Stack gap={8} p="md" className="pb-6">
                        {isLoading ? (
                            <Center py={50}><Loader color="indigo" size="sm" /></Center>
                        ) : (messages || []).length === 0 ? (
                            <Center py={80}>
                                <Stack gap={6} align="center">
                                    <Avatar src={targetUser?.avatar} radius={999} size={64} />
                                    <Text fw={700}>Bắt đầu cuộc trò chuyện</Text>
                                    <Text size="sm" c="dimmed" ta="center">Gửi tin nhắn đầu tiên để bắt đầu.</Text>
                                </Stack>
                            </Center>
                        ) : (messages || []).slice().reverse().map((msg) => {
                            const isMe = msg.nguoiGuiId === user?.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[78%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                        {!isMe && (
                                            <div className="flex items-end gap-2">
                                                <Avatar src={msg.nguoiGui.avatar} size={24} radius={999} />
                                                <div className="flex flex-col gap-1">
                                                    <Paper
                                                        p="sm"
                                                        radius={14}
                                                        className="bg-white dark:bg-zinc-900 border border-gray-200/70 dark:border-zinc-800"
                                                    >
                                                        {msg.loai === 'VAN_BAN' && (
                                                            <Text size="sm" className="leading-snug text-gray-900 dark:text-zinc-100">{msg.noiDung}</Text>
                                                        )}

                                                        {msg.loai === 'HINH_ANH' && (
                                                            <Box style={{ maxWidth: 360 }}>
                                                                <Image src={msg.duongDanTep || msg.noiDung} alt="Image" radius="md" />
                                                            </Box>
                                                        )}

                                                        {msg.loai === 'TEP' && (
                                                            <Box>
                                                                <a href={msg.duongDanTep} target="_blank" rel="noopener noreferrer" className="text-sm underline text-blue-600">Tải tệp đính kèm</a>
                                                            </Box>
                                                        )}
                                                    </Paper>
                                                    <Text size="xs" c="dimmed" ml={10}>{msg.ngayGui ? dayjs(msg.ngayGui).format('HH:mm') : ''}</Text>
                                                </div>
                                            </div>
                                        )}

                                        {isMe && (
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="rounded-[14px] px-3 py-2 text-white bg-[#1a73e8]">
                                                    {msg.loai === 'VAN_BAN' && (
                                                        <Text size="sm" className="leading-snug">{msg.noiDung}</Text>
                                                    )}

                                                    {msg.loai === 'HINH_ANH' && (
                                                        <Box style={{ maxWidth: 360 }}>
                                                            <Image src={msg.duongDanTep || msg.noiDung} alt="Image" radius="md" />
                                                        </Box>
                                                    )}

                                                    {msg.loai === 'TEP' && (
                                                        <Box>
                                                            <a href={msg.duongDanTep} target="_blank" rel="noopener noreferrer" className="text-sm underline text-white">Tải tệp đính kèm</a>
                                                        </Box>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <Text size="xs" c="dimmed" mr={8}>{msg.ngayGui ? dayjs(msg.ngayGui).format('HH:mm') : ''}</Text>
                                                    {newestOutgoingId === msg.id && (
                                                        <Text size="xs" c="dimmed" mr={8}>{getReceiptLabel(msg.id)}</Text>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </Stack>
                </div>
            </ScrollArea>

            <div className="shrink-0 border-t border-gray-200/70 dark:border-zinc-900 bg-white/90 dark:bg-black/80 backdrop-blur">
                <ChatInput channelId={channel.id} onTyping={handleTyping} />
            </div>
        </div>
    );
}
