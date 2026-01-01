import { Paper, Group, ActionIcon, Avatar, Text, Stack, ScrollArea, Box, Loader, Center, Image } from "@mantine/core";
import { IconArrowLeft, IconDotsVertical, IconPhone, IconVideo } from "@tabler/icons-react";
import { TChannel } from "@/api/types/api.type";
import { AppQuery } from "@/api/AppQuery";
import { useAppStore } from "@/providers/store/useAppStore";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { useSocket } from "@/shared/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";

interface ChatWindowProps {
    channel: TChannel;
    onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ channel, onBack }) => {
    const { user } = useAppStore();
    const queryClient = useQueryClient();
    const { data: messages, isLoading } = AppQuery.chat.useMessages(channel.id, { page: 1 });
    const { on, off, joinChannel, leaveChannel, startTyping, stopTyping, isConnected } = useSocket();
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const viewport = useRef<HTMLDivElement>(null);

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
            if (message.kenhId === channel.id) {
                queryClient.invalidateQueries({ queryKey: ['chat', 'messages', channel.id] });
            }
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
    }, [isConnected === true, channel.id, on, off, queryClient]);

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

    return (
        <div className="h-full flex flex-col bg-white dark:bg-black overflow-hidden relative">
            {/* Header */}
            <Group p="md" className="border-b border-gray-100 dark:border-zinc-900 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10">
                <ActionIcon variant="subtle" color="gray" onClick={onBack} className="md:hidden">
                    <IconArrowLeft size={20} />
                </ActionIcon>

                <Avatar src={targetUser?.avatar} radius="xl" size="md" />
                <Stack gap={0} style={{ flex: 1 }}>
                    <Text size="sm" fw={700}>
                        {channel.loaiKenh === 'NHOM' ? channel.tenKenh : (targetUser?.hoTen || targetUser?.taiKhoan)}
                    </Text>
                    <Text size="xs" c="dimmed" className="flex items-center gap-1">
                        {typingUsers.length > 0 ? (
                            <span className="text-blue-500 italic">đang nhập...</span>
                        ) : (
                            <>
                                <Box component="span" className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                                {isConnected ? 'Đang hoạt động' : 'Ngoại tuyến'}
                            </>
                        )}
                    </Text>
                </Stack>

                <Group gap="xs">
                    <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                        <IconPhone size={20} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                        <IconVideo size={20} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                        <IconDotsVertical size={20} />
                    </ActionIcon>
                </Group>
            </Group>

            {/* Messages Area */}
            <ScrollArea className="flex-1 bg-gray-50/30 dark:bg-zinc-900/10" viewportRef={viewport}>
                <Stack gap="xs" p="md">
                    {isLoading ? (
                        <Center py={50}><Loader color="indigo" size="sm" /></Center>
                    ) : (messages || []).slice().reverse().map((msg) => {
                        const isMe = msg.nguoiGuiId === user?.id;
                        return (
                            <Group
                                key={msg.id}
                                justify={isMe ? 'flex-end' : 'flex-start'}
                                align="flex-end"
                                gap="xs"
                                wrap="nowrap"
                            >
                                {!isMe && (
                                    <Avatar src={msg.nguoiGui.avatar} size={28} radius="xl" className="mb-1" />
                                )}
                                <Paper
                                    p="xs"
                                    px="md"
                                    radius="xl"
                                    className={`max-w-[70%] break-words shadow-sm ${isMe
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-bl-none'
                                        }`}
                                >
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
                                            <a href={msg.duongDanTep} target="_blank" rel="noopener noreferrer" className="text-sm underline text-blue-600">Tải tệp đính kèm</a>
                                        </Box>
                                    )}
                                </Paper>
                            </Group>
                        );
                    })}
                </Stack>
            </ScrollArea>

            {/* Input Area */}
            <ChatInput channelId={channel.id} onTyping={handleTyping} />
        </div>
    );
}
