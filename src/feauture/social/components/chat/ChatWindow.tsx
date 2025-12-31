import { Paper, Group, ActionIcon, Avatar, Text, Stack, ScrollArea, Box, Loader, Center } from "@mantine/core";
import { IconArrowLeft, IconDotsVertical, IconPhone, IconVideo } from "@tabler/icons-react";
import { TChannel } from "@/api/types/api.type";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { useAppStore } from "@/providers/store/useAppStore";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";

interface ChatWindowProps {
    channel: TChannel;
    onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ channel, onBack }) => {
    const { user } = useAppStore();
    const { data: messages, isLoading } = AppQuery.chat.useMessages(channel.id, { page: 1 }, {
        refetchInterval: 3000 // Poll every 3s
    });

    const viewport = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (viewport.current) {
            viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const getOtherMember = () => {
        return channel.thanhViens.find(m => m.nguoiDungId !== user?.id)?.nguoiDung;
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
                        <Box component="span" className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active now
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
                    ) : (messages || []).slice().reverse().map((msg) => { // Reverse to show latest at bottom
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
                                    {/* Add Image support here */}
                                </Paper>
                            </Group>
                        );
                    })}
                </Stack>
            </ScrollArea>

            {/* Input Area */}
            <ChatInput channelId={channel.id} />
        </div>
    );
}
