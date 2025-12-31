"use client";

import { Box, Paper, Stack, Text, Avatar, Group, ScrollArea, TextInput, ActionIcon, Loader, Center, UnstyledButton, Badge, Accordion, ThemeIcon } from "@mantine/core";
import { IconSearch, IconMessagePlus, IconDots, IconEdit, IconVideo, IconPhone, IconInfoCircle, IconBell, IconPhoto, IconFile, IconLink } from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { TChannel } from "@/api/types/api.type";
import { ChatWindow } from "@/feauture/social/components/chat/ChatWindow";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/providers/store/useAppStore";
import { useState } from "react";

export default function ChatPage() {
    const { data: channels, isLoading: isLoadingChannels } = AppQuery.chat.useChannels();
    const { user } = useAppStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Get channel ID from URL or null
    const channelIdParam = searchParams.get('id');
    const selectedChannelId = channelIdParam ? Number(channelIdParam) : null;

    const selectedChannel = channels?.find(c => c.id === selectedChannelId);

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
        <Box className="flex w-full h-full bg-white dark:bg-black overflow-hidden">
            {/* Left Sidebar - Channel List (360px) */}
            <Box
                className={`w-full md:w-[360px] border-r border-gray-100 dark:border-zinc-900 flex flex-col h-full bg-white dark:bg-black ${selectedChannelId ? 'hidden md:flex' : 'flex'
                    }`}
            >
                {/* Sidebar Header */}
                <Box p="md" pb="xs">
                    <Group justify="space-between" mb="md">
                        <Text fw={900} size="24px" className="tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>NHers Chat</Text>
                        <Group gap="xs">
                            <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700">
                                <IconDots size={20} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700">
                                <IconEdit size={20} />
                            </ActionIcon>
                        </Group>
                    </Group>

                    <TextInput
                        placeholder="Tìm kiếm trên Messenger"
                        leftSection={<IconSearch size={16} className="text-gray-500" />}
                        radius="xl"
                        size="md"
                        classNames={{ input: "bg-gray-100 dark:bg-zinc-800/50 border-transparent focus:bg-gray-100 dark:focus:bg-zinc-800 transition-all text-gray-900 dark:text-white placeholder:text-gray-500" }}
                    />

                    {/* Filter Pills */}
                    <Group mt="md" gap={8} className="overflow-x-auto no-scrollbar flex-nowrap pb-2">
                        <Pill label="Tất cả" active />
                        <Pill label="Chưa đọc" />
                        <Pill label="Nhóm" />
                        <Pill label="Cộng đồng" />
                    </Group>
                </Box>

                <ScrollArea className="flex-1">
                    <Stack gap={0} px="xs">
                        {isLoadingChannels ? (
                            <Center py="xl"><Loader size="sm" color="indigo" /></Center>
                        ) : channels && channels.length > 0 ? (
                            channels.map((channel: TChannel) => {
                                // Skip channels without members to prevent errors
                                if (!channel || !channel.thanhViens) return null;

                                return (
                                    <Group
                                        key={channel.id}
                                        wrap="nowrap"
                                        className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group ${selectedChannelId === channel.id
                                            ? 'bg-blue-50/50 dark:bg-blue-500/10'
                                            : 'hover:bg-gray-50 dark:hover:bg-zinc-900'
                                            }`}
                                        onClick={() => handleSelectChannel(channel.id)}
                                    >
                                        <Box className="relative">
                                            <Avatar
                                                src={getChannelAvatar(channel, user?.id)}
                                                size={56}
                                                radius="xl"
                                            />
                                            <Box className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-black rounded-full" />
                                        </Box>
                                        <Stack gap={1} style={{ flex: 1, overflow: 'hidden' }}>
                                            <Text size="md" fw={500} c={selectedChannelId === channel.id ? undefined : "dimmed"} className={selectedChannelId === channel.id ? "text-gray-900 dark:text-white font-semibold" : "text-gray-900 dark:text-gray-200"}>
                                                {getChannelName(channel, user?.id)}
                                            </Text>
                                            <Group gap="xs" wrap="nowrap">
                                                <Text size="sm" c="dimmed" truncate style={{ flex: 1 }} fw={channelIdParam ? 400 : 500}>
                                                    {channel.tinNhans?.[0]
                                                        ? (channel.tinNhans[0].nguoiGuiId === user?.id ? "Bạn: " : "") +
                                                        (channel.tinNhans[0].loai === 'HINH_ANH' ? 'Đã gửi một ảnh' : channel.tinNhans[0].noiDung)
                                                        : "Chưa có tin nhắn"}
                                                </Text>
                                                <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                                                    · {formatTime(channel.updatedAt)}
                                                </Text>
                                            </Group>
                                        </Stack>
                                        {/* Unread indicator mock - would be conditional */}
                                        {/* <Box className="w-3 h-3 bg-blue-500 rounded-full" /> */}
                                    </Group>
                                );
                            })
                        ) : (
                            <Center py="xl" className="flex-col gap-2 text-center text-gray-400">
                                <Text size="sm">Chưa có cuộc trò chuyện nào</Text>
                            </Center>
                        )}
                    </Stack>
                </ScrollArea>
            </Box>

            {/* Main Chat Area */}
            <Box className={`flex-1 h-full flex flex-col bg-white dark:bg-black ${!selectedChannelId ? 'hidden md:flex' : 'flex'}`}>
                {selectedChannel ? (
                    <Box className="flex h-full">
                        {/* Chat Window */}
                        <Box className="flex-1 flex flex-col min-w-0 border-r border-gray-100 dark:border-zinc-900">
                            <ChatWindow
                                channel={selectedChannel}
                                onBack={handleBack}
                            />
                        </Box>

                        {/* Right Info Sidebar (Hidden on smaller screens, can toggle) */}
                        <Box className="hidden lg:flex w-[360px] flex-col h-full bg-white dark:bg-black overflow-y-auto border-l border-gray-100 dark:border-zinc-900">
                            <ChannelInfoSidebar channel={selectedChannel} currentUserId={user?.id} />
                        </Box>
                    </Box>
                ) : (
                    <Center className="h-full flex-col gap-4 text-gray-300 dark:text-zinc-700 select-none">
                        <IconMessagePlus size={80} stroke={1} />
                        <Text size="xl" fw={500}>Chọn một đoạn chat để bắt đầu</Text>
                    </Center>
                )}
            </Box>
        </Box>
    );
}

const Pill = ({ label, active }: { label: string, active?: boolean }) => (
    <UnstyledButton
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${active
            ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300"
            : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
            }`}
    >
        {label}
    </UnstyledButton>
);

const ChannelInfoSidebar = ({ channel, currentUserId }: { channel: TChannel, currentUserId?: number }) => {
    const targetUser = channel.loaiKenh === 'NHOM' ? null : channel.thanhViens.find(m => m.nguoiDungId !== currentUserId)?.nguoiDung;
    const name = getChannelName(channel, currentUserId);
    const avatar = getChannelAvatar(channel, currentUserId);

    return (
        <Stack gap={0} className="h-full">
            <Center p="xl" className="flex-col gap-3 pt-10">
                <Avatar src={avatar} size={80} radius="xl" className="mb-2" />
                <Text fw={700} size="lg">{name}</Text>
                <Badge variant="light" color="gray" radius="sm" className="normal-case font-normal bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
                    Được mã hóa đầu cuối
                </Badge>

                <Group gap="xl" mt="sm">
                    <ActionIcon size="xl" variant="subtle" color="gray" className="flex-col w-auto h-auto gap-1 text-gray-700 dark:text-gray-300">
                        <Box className="bg-gray-100 dark:bg-zinc-800 p-2.5 rounded-full"><IconPhoto size={20} /></Box>
                        <Text size="xs">Trang cá nhân</Text>
                    </ActionIcon>
                    <ActionIcon size="xl" variant="subtle" color="gray" className="flex-col w-auto h-auto gap-1 text-gray-700 dark:text-gray-300">
                        <Box className="bg-gray-100 dark:bg-zinc-800 p-2.5 rounded-full"><IconBell size={20} /></Box>
                        <Text size="xs">Tắt thông báo</Text>
                    </ActionIcon>
                    <ActionIcon size="xl" variant="subtle" color="gray" className="flex-col w-auto h-auto gap-1 text-gray-700 dark:text-gray-300">
                        <Box className="bg-gray-100 dark:bg-zinc-800 p-2.5 rounded-full"><IconSearch size={20} /></Box>
                        <Text size="xs">Tìm kiếm</Text>
                    </ActionIcon>
                </Group>
            </Center>

            <Accordion variant="separated" radius="none" classNames={{ item: "border-0", control: "hover:bg-gray-50 dark:hover:bg-zinc-900" }}>
                <Accordion.Item value="info">
                    <Accordion.Control icon={<Text size="sm" fw={600}>Thông tin về đoạn chat</Text>} />
                    <Accordion.Panel>Content...</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="custom">
                    <Accordion.Control icon={<Text size="sm" fw={600}>Tùy chỉnh đoạn chat</Text>} />
                    <Accordion.Panel>Change theme, emoji...</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="media">
                    <Accordion.Control icon={<Text size="sm" fw={600}>File phương tiện & file</Text>} />
                    <Accordion.Panel>
                        <Group>
                            <ThemeIcon variant="light" color="gray"><IconPhoto size={16} /></ThemeIcon>
                            <ThemeIcon variant="light" color="gray"><IconFile size={16} /></ThemeIcon>
                        </Group>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="privacy">
                    <Accordion.Control icon={<Text size="sm" fw={600}>Quyền riêng tư và hỗ trợ</Text>} />
                    <Accordion.Panel>Block, Report...</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Stack>
    );
};


// Helpers
function getChannelName(channel: TChannel, currentUserId?: number) {
    if (channel.loaiKenh === 'NHOM') return channel.tenKenh || "Nhóm";
    if (!channel.thanhViens || channel.thanhViens.length === 0) return "Người dùng";
    const member = channel.thanhViens.find(m => m.nguoiDung.id !== currentUserId);
    return member?.nguoiDung.hoTen || member?.nguoiDung.taiKhoan || "Người dùng";
}

function getChannelAvatar(channel: TChannel, currentUserId?: number) {
    if (channel.loaiKenh === 'NHOM') return null; // Default group icon
    if (!channel.thanhViens || channel.thanhViens.length === 0) return null;
    const member = channel.thanhViens.find(m => m.nguoiDung.id !== currentUserId);
    return member?.nguoiDung.avatar;
}

function formatTime(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // If less than 24h, show time
    if (diff < 24 * 60 * 60 * 1000 && now.getDate() === date.getDate()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // If within same week, show day name
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        return date.toLocaleDateString([], { weekday: 'short' });
    }
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
