"use client";

import { Box, Grid, Paper, Stack, Text, Avatar, Group, ScrollArea, TextInput, ActionIcon, Loader, Center, Button } from "@mantine/core";
import { IconSearch, IconMessagePlus } from "@tabler/icons-react";
import { useState } from "react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { TChannel } from "@/api/types/api.type";
import { ChatWindow } from "@/feauture/social/components/chat/ChatWindow";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useAppStore } from "@/providers/store/useAppStore";

export default function ChatPage() {
    const { data: channels, isLoading: isLoadingChannels } = AppQuery.chat.useChannels();
    const { data: friends } = AppQuery.friends.useList();
    const { user } = useAppStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const createChannelMutation = AppMutation().chat.useCreateChannel();
    const [searchTerm, setSearchTerm] = useState('');

    // Normalize API response: some endpoints may return an array of membership objects
    // with a `kenhChat` property instead of plain channel objects.
    const normalizedChannels: TChannel[] | undefined = channels && channels.length > 0
        ? ('kenhChat' in (channels as any)[0] ? (channels as any).map((m: any) => m.kenhChat) : channels as TChannel[])
        : (channels as any);

    const q = searchTerm.trim().toLowerCase();
    const filteredChannels = q && normalizedChannels
        ? normalizedChannels.filter(ch => {
            const name = getChannelName(ch, user?.id).toLowerCase();
            return name.includes(q);
        })
        : [];

    // Get channel ID from URL or null
    const channelIdParam = searchParams.get('id');
    const selectedChannelId = channelIdParam ? Number(channelIdParam) : null;

    const selectedChannel = normalizedChannels?.find(c => c.id === selectedChannelId);

    const handleSelectChannel = (id: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('id', id.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleBack = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('id');
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Grid gutter="md" className="h-[calc(100vh-140px)]">
            {/* Channel List - Left Side */}
            <Grid.Col span={{ base: 12, md: 4 }} className={`h-full ${selectedChannelId ? 'hidden md:block' : 'block'}`}>
                <Paper p="md" radius="lg" className="h-full flex flex-col bg-white dark:bg-black border border-gray-100 dark:border-zinc-900 shadow-sm">
                    <Group justify="space-between" mb="md">
                        <Text fw={900} size="xl" className="tracking-tight">Messages</Text>
                        <ActionIcon variant="light" color="black" radius="xl" className="dark:bg-zinc-800 dark:text-white">
                            <IconMessagePlus size={20} />
                        </ActionIcon>
                    </Group>

                    <TextInput
                        placeholder="Tìm kiếm bạn bè hoặc cuộc trò chuyện..."
                        mb="md"
                        leftSection={<IconSearch size={16} />}
                        radius="md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        classNames={{ input: "bg-gray-50 dark:bg-zinc-900/50 border-0" }}
                    />

                    <ScrollArea className="flex-1 pr-2">
                        {isLoadingChannels ? (
                            <Center py="xl"><Loader size="sm" color="indigo" /></Center>
                        ) : q ? (
                            <Stack gap="xs">
                                {filteredChannels && filteredChannels.length > 0 && (
                                    <Stack gap="xs">
                                        {filteredChannels.map((channel: TChannel) => (
                                            <Group
                                                key={channel.id}
                                                wrap="nowrap"
                                                className={`p-3 rounded-xl cursor-pointer transition-colors ${selectedChannelId === channel.id ? 'bg-indigo-50 dark:bg-zinc-900' : 'hover:bg-gray-50 dark:hover:bg-zinc-900/50'}`}
                                                onClick={() => handleSelectChannel(channel.id)}
                                            >
                                                <Avatar src={getChannelAvatar(channel, user?.id)} size="lg" radius="xl" />
                                                <Stack gap={2} style={{ flex: 1, overflow: 'hidden' }}>
                                                    <Group justify="space-between" wrap="nowrap">
                                                        <Text size="sm" fw={700} truncate>{getChannelName(channel, user?.id)}</Text>
                                                        <Text size="xs" c="dimmed">{formatTime(channel.updatedAt)}</Text>
                                                    </Group>
                                                    <Text size="xs" c="dimmed" truncate>
                                                        {channel.tinNhans?.[0]
                                                            ? (channel.tinNhans[0].nguoiGuiId === user?.id ? "You: " : "") +
                                                            (channel.tinNhans[0].loai === 'HINH_ANH' ? 'Sent an image' : channel.tinNhans[0].noiDung)
                                                            : "No messages yet"}
                                                    </Text>
                                                </Stack>
                                            </Group>
                                        ))}
                                    </Stack>
                                )}

                                {/* Friend matches */}
                                {friends && friends.length > 0 ? (
                                    friends
                                        .filter((f: any) => {
                                            const name = (f.hoTen || f.taiKhoan || '').toLowerCase();
                                            return name.includes(q);
                                        })
                                        .map((friend: any) => (
                                            <Group key={friend.id} wrap="nowrap" className={`p-3 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900/50`}>
                                                <Avatar src={friend.avatar || '/default-avatar.svg'} size="lg" radius="xl" />
                                                <Stack gap={2} style={{ flex: 1, overflow: 'hidden' }}>
                                                    <Group justify="space-between" wrap="nowrap">
                                                        <Text size="sm" fw={700} truncate>{friend.hoTen || friend.taiKhoan}</Text>
                                                        <Button size="xs" onClick={async () => {
                                                            try {
                                                                const channel = await createChannelMutation.mutateAsync({ loaiKenh: 'CA_NHAN', thanhVienIds: [friend.id] });
                                                                router.push(`/chat?id=${channel.id}`);
                                                            } catch (error) {
                                                                console.error(error);
                                                            }
                                                        }}>Nhắn tin</Button>
                                                    </Group>
                                                </Stack>
                                            </Group>
                                        ))
                                ) : (
                                    <Center py="xl"><Text c="dimmed">Không tìm thấy bạn bè</Text></Center>
                                )}
                            </Stack>
                        ) : normalizedChannels && normalizedChannels.length > 0 ? (
                            <Stack gap="xs">
                                {normalizedChannels.map((channel: TChannel) => (
                                    <Group
                                        key={channel.id}
                                        wrap="nowrap"
                                        className={`p-3 rounded-xl cursor-pointer transition-colors ${selectedChannelId === channel.id ? 'bg-indigo-50 dark:bg-zinc-900' : 'hover:bg-gray-50 dark:hover:bg-zinc-900/50'}`}
                                        onClick={() => handleSelectChannel(channel.id)}
                                    >
                                        <Avatar
                                            src={getChannelAvatar(channel, user?.id)}
                                            size="lg"
                                            radius="xl"
                                        />
                                        <Stack gap={2} style={{ flex: 1, overflow: 'hidden' }}>
                                            <Group justify="space-between" wrap="nowrap">
                                                <Text size="sm" fw={700} truncate>{getChannelName(channel, user?.id)}</Text>
                                                <Text size="xs" c="dimmed">{formatTime(channel.updatedAt)}</Text>
                                            </Group>
                                            <Text size="xs" c="dimmed" truncate>
                                                {channel.tinNhans?.[0]
                                                    ? (channel.tinNhans[0].nguoiGuiId === user?.id ? "You: " : "") +
                                                    (channel.tinNhans[0].loai === 'HINH_ANH' ? 'Sent an image' : channel.tinNhans[0].noiDung)
                                                    : "No messages yet"}
                                            </Text>
                                        </Stack>
                                    </Group>
                                ))}
                            </Stack>
                        ) : (
                            <Center py="xl" className="flex-col gap-2">
                                <Text c="dimmed" size="sm">No conversations yet</Text>
                                <Text c="dimmed" size="xs">Start a chat with a friend!</Text>
                            </Center>
                        )}
                    </ScrollArea>
                </Paper>
            </Grid.Col>

            {/* Chat Window - Right Side */}
            <Grid.Col span={{ base: 12, md: 8 }} className={`h-full ${!selectedChannelId ? 'hidden md:block' : 'block'}`}>
                {selectedChannel ? (
                    <ChatWindow
                        channel={selectedChannel}
                        onBack={handleBack}
                    />
                ) : (
                    <Paper className="h-full flex items-center justify-center bg-gray-50/50 dark:bg-zinc-900/20 border border-transparent dark:border-zinc-900 rounded-2xl">
                        <Stack align="center" gap="md" className="text-zinc-400">
                            <IconMessagePlus size={64} stroke={1} />
                            <Text size="lg" fw={600}>Select a conversation to start chatting</Text>
                        </Stack>
                    </Paper>
                )}
            </Grid.Col>
        </Grid>
    );
}

// Helpers
function getChannelName(channel: TChannel, currentUserId?: number) {
    if (channel.loaiKenh === 'NHOM') return channel.tenKenh || "Group Chat";

    // Find the other member in a 1:1 channel. Support both shapes: member.nguoiDung.id or member.nguoiDungId
    const member = channel.thanhViens.find(m => {
        const memberId = (m as any).nguoiDung?.id ?? (m as any).nguoiDungId;
        if (typeof currentUserId === 'number') return memberId !== currentUserId;
        return true;
    }) || channel.thanhViens[0];

    const user = (member as any)?.nguoiDung ?? (member ? { taiKhoan: String((member as any).nguoiDungId) } : undefined);
    return user?.hoTen || user?.taiKhoan || "User";
}

function getChannelAvatar(channel: TChannel, currentUserId?: number) {
    if (channel.loaiKenh === 'NHOM') return null; // Default group icon

    const member = channel.thanhViens.find(m => {
        const memberId = (m as any).nguoiDung?.id ?? (m as any).nguoiDungId;
        if (typeof currentUserId === 'number') return memberId !== currentUserId;
        return true;
    }) || channel.thanhViens[0];

    const avatar = (member as any)?.nguoiDung?.avatar;
    // Provide a client-side fallback so avatar UI shows something when backend returns null
    return avatar || '/default-avatar.svg';
}

function formatTime(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
