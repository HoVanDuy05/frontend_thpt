import { IconWorld, IconSmartHome, IconSearch, IconPlus, IconMessagePlus } from "@tabler/icons-react";
import { useMantineColorScheme, TextInput, Box, Group, ActionIcon, UnstyledButton, Avatar, Text, ScrollArea, Stack, Center, Loader } from "@mantine/core";
import { TChannel } from "@/api/types/api.type";
import { TUser } from "@/shared/types/user.type";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChatListSkeleton } from "./ChatListSkeleton";

interface ChatSidebarProps {
    channels: TChannel[];
    isLoading: boolean;
    selectedChannelId: number | null;
    onSelectChannel: (id: number) => void;
    currentUserId?: number;
    currentUser: TUser | null;
    unreadChannelIds: Set<number>;
    getIsUnread: (channel: TChannel) => boolean;
    getChannelAvatar: (channel: TChannel, currentUserId?: number) => string | null | undefined;
    getChannelName: (channel: TChannel, currentUserId?: number) => string;
    formatTime: (dateStr: string) => string;
    onShowSearch: () => void;
    onShowSettings: () => void;
    sidebarQuery: string;
    onSidebarQueryChange: (val: string) => void;
    presenceMap: Record<number, boolean>;
    friends: TUser[];
}

export const ChatSidebar = ({
    channels,
    isLoading,
    selectedChannelId,
    onSelectChannel,
    currentUserId,
    currentUser,
    unreadChannelIds,
    getIsUnread,
    getChannelAvatar,
    getChannelName,
    formatTime,
    onShowSearch,
    onShowSettings,
    sidebarQuery,
    onSidebarQueryChange,
    presenceMap,
    friends
}: ChatSidebarProps) => {
    const router = useRouter();
    const t = useTranslations('chat');
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const [searchQuery, setSearchQuery] = useState("");

    const q = searchQuery.trim().toLowerCase();

    // Apply tab and search filtering
    const filteredChannels = useMemo(() => {
        let list = channels || [];

        if (q) {
            list = list.filter(c => getChannelName(c, currentUserId).toLowerCase().includes(q));
        }

        return list;
    }, [channels, getIsUnread, searchQuery, getChannelName, currentUserId]);

    // Active Now from Friends + Self (Self is always first)
    const activeFriends = useMemo(() => {
        const onlineOthers = (friends || []).filter(u => u.id !== currentUserId && presenceMap[u.id]);

        return onlineOthers; // Only return online friends, self is handled separately in JSX
    }, [friends, presenceMap, currentUser, currentUserId]);

    return (
        <Box
            className={`w-full md:w-[360px] border-r border-gray-100 dark:border-zinc-800 flex flex-col h-full bg-white dark:bg-[#1c1e21] ${selectedChannelId ? 'hidden md:flex' : 'flex'
                }`}
        >
            {/* Header */}
            <Group justify="space-between" px="md" py="xs" className="shrink-0 h-[68px]">
                <Text fw={800} className="text-black dark:text-white" style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', letterSpacing: '-0.5px', fontSize: 'var(--font-size-2xl)' }}>
                    {t('conversations')}
                </Text>
                <Group gap="xs">
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        radius="xl"
                        size="lg"
                        className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
                        onClick={() => {
                            if (currentUser?.vaiTro === 'HOC_SINH') {
                                router.push('/student');
                            } else if (currentUser?.vaiTro === 'ADMIN' || currentUser?.vaiTro === 'GIAO_VIEN') {
                                router.push('/admin/dashboard');
                            }
                        }}
                    >
                        <IconSmartHome size={20} />
                    </ActionIcon>
                    <ActionIcon
                        variant="subtle"
                        color="indigo"
                        radius="xl"
                        size="lg"
                        className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                        onClick={onShowSearch}
                        title={t('new_message')}
                    >
                        <IconMessagePlus size={20} />
                    </ActionIcon>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        radius="xl"
                        size="lg"
                        className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
                        onClick={() => router.push('/social')}
                    >
                        <IconWorld size={20} />
                    </ActionIcon>
                    <UnstyledButton
                        onClick={onShowSettings}
                        className="transition-transform active:scale-95"
                    >
                        <Avatar
                            src={currentUser?.avatar}
                            size={32}
                            radius="xl"
                            className="cursor-pointer border border-gray-100 dark:border-zinc-700 hover:brightness-95 transition-all"
                        />
                    </UnstyledButton>
                </Group>
            </Group>

            <Box px="md" py="xs" className="shrink-0">
                <TextInput
                    placeholder={t('search_placeholder')}
                    leftSection={<IconSearch size={16} className="text-gray-500" />}
                    radius="xl"
                    size="md"
                    variant="filled"
                    readOnly
                    onClick={onShowSearch}
                    classNames={{
                        input: "bg-[#F0F2F5] dark:bg-[#3A3B3C] border-none text-[15px] cursor-pointer hover:bg-gray-200 dark:hover:bg-[#4E4F50] transition-colors"
                    }}
                />
            </Box>

            {/* Active Now Carousel */}
            <Box mt="md" mb="xs" px="md">
                <Group gap="md" wrap="nowrap" className="overflow-x-auto no-scrollbar pb-1">
                    {/* Self - Always First */}
                    <div className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer">
                        <div className="relative">
                            <Avatar src={currentUser?.avatar} size={56} radius="xl" className="border-2 border-white dark:border-zinc-900" />
                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-[2px]">
                                <IconPlus size={16} className="text-blue-500 bg-gray-100 dark:bg-zinc-800 rounded-full p-[2px]" />
                            </div>
                        </div>
                        <Text size="xs" c="dimmed" style={{ fontFamily: 'var(--font-be-vietnam), sans-serif' }}>{t('you')}</Text>
                    </div>

                    {/* Online Friends */}
                    {activeFriends.map((friend) => (
                        <div key={friend.id} className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer">
                            <div className="relative">
                                <Avatar src={friend.avatar} size={56} radius="xl" className="border-2 border-white dark:border-zinc-900" />
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>
                            </div>
                            <Text size="xs" c="dimmed" w={60} truncate="end" ta="center" style={{ fontFamily: 'var(--font-be-vietnam), sans-serif' }}>
                                {(friend.hoTen?.split(' ').pop()) || friend.taiKhoan}
                            </Text>
                        </div>
                    ))}
                </Group>
            </Box>

            <ScrollArea className="flex-1 px-6">
                <Stack gap={4} pb="xl">
                    {channels && channels.length > 0 ? (
                        <>
                            {filteredChannels.map((channel: TChannel) => {
                                if (!channel || !channel.thanhViens) return null;
                                const isUnread = unreadChannelIds.has(channel.id) || getIsUnread(channel);
                                const isActive = selectedChannelId === channel.id;

                                return (
                                    <UnstyledButton
                                        key={channel.id}
                                        w="100%"
                                        className={`pl-2.5 pr-2 py-3 mb-2 rounded-xl transition-all duration-200 group relative ${isActive
                                            ? 'bg-blue-50 dark:bg-[#263951]'
                                            : 'hover:bg-gray-100 dark:hover:bg-[#242526]'
                                            }`}
                                        onClick={() => onSelectChannel(channel.id)}
                                    >
                                        <Group wrap="nowrap" gap="md">
                                            <Box className="relative shrink-0">
                                                <Avatar
                                                    src={getChannelAvatar(channel, currentUserId)}
                                                    size={56}
                                                    radius="xl"
                                                    className="shadow-sm"
                                                />
                                                {(() => {
                                                    const otherMember = channel.thanhViens.find(m => Number(m.nguoiDungId) !== Number(currentUserId));
                                                    const isOnline = otherMember && presenceMap[otherMember.nguoiDungId];
                                                    if (channel.loaiKenh === 'CA_NHAN' && isOnline) {
                                                        return <Box className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-[#31A24C] border-[3px] border-white dark:border-[#1c1e21] rounded-full" />;
                                                    }
                                                    return null;
                                                })()}
                                            </Box>
                                            <Stack gap={3} style={{ flex: 1, overflow: 'hidden' }}>
                                                <Text size="15px" fw={700} truncate className={isUnread ? "text-gray-950 dark:text-white" : "text-gray-900 dark:text-gray-200"}>
                                                    {getChannelName(channel, currentUserId)}
                                                </Text>
                                                <Group gap="xs" wrap="nowrap">
                                                    <Text size="13px" c={isUnread ? (dark ? "white" : "black") : "dimmed"} truncate style={{ flex: 1 }} fw={isUnread ? 700 : 400}>
                                                        {channel.tinNhans?.[0]
                                                            ? (channel.tinNhans[0].nguoiGuiId === currentUserId ? "Bạn: " : "") +
                                                            (channel.tinNhans[0].loai === 'HINH_ANH' ? 'Đã gửi một ảnh' :
                                                                channel.tinNhans[0].loai === 'GHI_AM' ? 'Đã gửi một đoạn ghi âm' :
                                                                    channel.tinNhans[0].loai === 'TEP' ? 'Đã gửi một tệp đính kèm' :
                                                                        channel.tinNhans[0].noiDung)
                                                            : "Bắt đầu cuộc trò chuyện"}
                                                    </Text>
                                                    <Text size="12px" c="dimmed" style={{ whiteSpace: 'nowrap' }} fw={isUnread ? 600 : 400} suppressHydrationWarning>
                                                        · {formatTime(channel.updatedAt)}
                                                    </Text>
                                                </Group>
                                            </Stack>
                                            {isUnread && (
                                                <Box className="absolute right-4 self-center">
                                                    <Box className="w-3 h-3 bg-blue-500 rounded-full shadow-sm" />
                                                </Box>
                                            )}
                                        </Group>
                                    </UnstyledButton>
                                );
                            })}
                            {isLoading && <Box className="scale-75 origin-top"><Center><Loader size="xs" color="blue" /></Center></Box>}
                        </>
                    ) : isLoading ? (
                        <ChatListSkeleton />
                    ) : (
                        <Center py="xl" className="flex-col gap-2 text-center text-gray-400 opacity-60">
                            <Text size="sm" fw={500}>{t('no_conversations_title')}</Text>
                            <Text size="xs">{t('no_conversations_subtitle')}</Text>
                        </Center>
                    )}
                </Stack>
            </ScrollArea>
        </Box>
    );
};

const Pill = ({ label, active, onClick }: { label: string, active?: boolean, onClick?: () => void }) => (
    <UnstyledButton
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${active
            ? "bg-blue-50 dark:bg-[#1a2b4b] text-[#0084FF] dark:text-blue-400"
            : "bg-gray-100 dark:bg-[#3a3b3c] text-gray-700 dark:text-gray-300 hover:brightness-95"
            }`}
    >
        {label}
    </UnstyledButton>
);
