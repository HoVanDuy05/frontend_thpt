"use client";

import { Box, Stack, Avatar, Text, Group, Divider, Accordion, UnstyledButton, Button, ActionIcon, ScrollArea, ThemeIcon, Center, Loader, Drawer } from "@mantine/core";
import { IconBell, IconSearch, IconUser, IconPalette, IconMoodSmile, IconPhoto, IconFile, IconLink, IconShieldLock, IconBlockquote, IconBan, IconInfoCircle, IconArrowLeft, IconMessagePlus } from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { TChannel } from "@/api/types/api.type";
import { TUser } from "@/shared/types/user.type";
import { ChatWindow } from "@/feauture/social/components/chat/ChatWindow";
import { ChatSidebar } from "@/feauture/social/components/chat/ChatSidebar";
import { UserSearchDrawer } from "@/feauture/social/components/chat/UserSearchDrawer";
import { ChannelInfoSidebar } from "@/feauture/social/components/chat/ChannelInfoSidebar";
import { SettingsDrawer } from "@/feauture/social/components/chat/SettingsDrawer";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/providers/store/useAppStore";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAppMutation } from "@/api/hooks/useAppMutation";
import { notifications } from "@mantine/notifications";
import { useSocket } from "@/shared/hooks/useSocket";
import { useMediaQuery } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";

export default function ChatPage() {
    const { data: channels, isLoading: isLoadingChannels, refetch: refetchChannels } = AppQuery.chat.useChannels();
    const { data: friends, isLoading: isLoadingFriends } = AppQuery.friends.useList();
    const { user } = useAppStore();
    const { on, off, emit, isConnected } = useSocket();
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [unreadChannelIds, setUnreadChannelIds] = useState<Set<number>>(new Set());
    const [sidebarQuery, setSidebarQuery] = useState("");
    const [showUserSearch, setShowUserSearch] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [newChatQuery, setNewChatQuery] = useState("");
    const [searchResults, setSearchResults] = useState<TUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showInfo, setShowInfo] = useState(true);

    const isMobile = useMediaQuery('(max-width: 48em)');

    useEffect(() => {
        if (isMobile) setShowInfo(false);
    }, [isMobile]);

    const { data: searchQueryData, isLoading: searchQueryLoading } = AppQuery.friends.useSearch(
        newChatQuery,
        { enabled: newChatQuery.length > 0 }
    );

    const createChannelMutation = useAppMutation<"createChannel">({
        url: { baseUrl: "/communication/chat/channels" }
    });

    const channelIdParam = searchParams.get('id');
    const selectedChannelId = channelIdParam ? Number(channelIdParam) : null;

    const normalizedChannels: TChannel[] | undefined = useMemo(() => {
        if (!channels) return undefined;
        const list = channels as any[];
        if (list.length === 0) return [];
        return ('kenhChat' in list[0]
            ? list.map((m: any) => m.kenhChat)
            : list) as TChannel[];
    }, [channels]);

    const sortedChannels = useMemo(() => {
        if (!normalizedChannels) return [];
        return normalizedChannels
            .filter(c => {
                // Only show channels that have messages OR the one currently selected (ghost channel case)
                if (c.id === selectedChannelId) return true;
                return c.tinNhans && c.tinNhans.length > 0;
            })
            .sort((a, b) => {
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            });
    }, [normalizedChannels, selectedChannelId]);



    const readStateKey = (userId?: number | null) => `chat_last_read_${userId ?? 'anonymous'}`;

    const getLastReadMap = () => {
        if (typeof window === 'undefined') return {} as Record<string, number>;
        try {
            const raw = localStorage.getItem(readStateKey(user?.id));
            return raw ? (JSON.parse(raw) as Record<string, number>) : {};
        } catch {
            return {} as Record<string, number>;
        }
    };

    const setLastRead = (channelId: number, messageId: number) => {
        if (typeof window === 'undefined') return;
        const map = getLastReadMap();
        map[String(channelId)] = messageId;
        localStorage.setItem(readStateKey(user?.id), JSON.stringify(map));
        setUnreadChannelIds((prev) => {
            const next = new Set(prev);
            next.delete(channelId);
            return next;
        });
    };

    const getIsUnread = (channel: TChannel) => {
        const latestId = channel.tinNhans?.[0]?.id;
        if (!latestId) return false;
        const lastRead = getLastReadMap()[String(channel.id)] || 0;
        const latestSenderId = channel.tinNhans?.[0]?.nguoiGuiId;
        if (latestSenderId && latestSenderId === user?.id) return false;
        return latestId > lastRead;
    };

    useEffect(() => {
        if (!selectedChannelId || !sortedChannels) return;
        const ch = sortedChannels.find((c) => c.id === selectedChannelId);
        const latestId = ch?.tinNhans?.[0]?.id;
        if (latestId) setLastRead(selectedChannelId, latestId);
    }, [selectedChannelId, sortedChannels]);

    const [presenceMap, setPresenceMap] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (!isConnected) return;

        const handlePresenceUpdate = (data: { userId: number; online: boolean }) => {
            setPresenceMap(prev => ({
                ...prev,
                [data.userId]: data.online
            }));
        };

        const handleInitialPresence = (data: { userId: number; online: boolean }[]) => {
            const map: Record<number, boolean> = {};
            data.forEach(item => {
                map[item.userId] = item.online;
            });
            setPresenceMap(map);
        };

        on('presence:update', handlePresenceUpdate);
        on('presence:initial', handleInitialPresence);
        // Request initial presence if the server supports it
        emit('presence:get_initial', {});

        return () => {
            off('presence:update', handlePresenceUpdate);
            off('presence:initial', handleInitialPresence);
        };
    }, [isConnected, on, off, emit]);

    useEffect(() => {
        if (!isConnected) return;
        const handleNewMessage = (message: any) => {
            const channelId = message?.kenhChatId;
            if (!channelId) return;

            // Optimistically update channel list to move to top and update preview
            queryClient.setQueriesData({
                queryKey: ["chat", "channels"] as any
            }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;

                let found = false;
                const nextData = oldData.map((item: any) => {
                    const ch = item.kenhChat || item;
                    if (ch.id === channelId) {
                        found = true;
                        const updatedChannel = {
                            ...ch,
                            tinNhans: [message],
                            updatedAt: new Date().toISOString()
                        };
                        return item.kenhChat ? { ...item, kenhChat: updatedChannel } : updatedChannel;
                    }
                    return item;
                });

                // If not found (new channel), refetching is safer, but normally it should be there
                if (!found) refetchChannels();

                return nextData;
            });

            // Mark as unread if not current channel and not sent by me
            if (selectedChannelId !== channelId && message?.nguoiGuiId !== user?.id) {
                setUnreadChannelIds((prev) => {
                    const next = new Set(prev);
                    next.add(channelId);
                    return next;
                });
            }
        };
        on('message:new', handleNewMessage);
        return () => off('message:new', handleNewMessage);
    }, [isConnected, on, off, refetchChannels, selectedChannelId, user?.id, queryClient]);

    const matchingFriends = useMemo(() => {
        if (!newChatQuery.trim() || !friends) return [];
        const q = newChatQuery.toLowerCase();
        return friends.filter(f =>
            (f.hoTen?.toLowerCase().includes(q)) ||
            (f.taiKhoan?.toLowerCase().includes(q)) ||
            (f.email?.toLowerCase().includes(q))
        );
    }, [newChatQuery, friends]);

    useEffect(() => {
        if (searchQueryData) {
            // Merge matching friends and search results, avoiding duplicates
            const friendIds = new Set(matchingFriends.map(f => f.id));
            const otherResults = searchQueryData.filter((u: TUser) => !friendIds.has(u.id));
            setSearchResults([...matchingFriends, ...otherResults]);
        } else if (newChatQuery) {
            setSearchResults(matchingFriends);
        } else {
            setSearchResults([]);
        }
        setIsSearching(searchQueryLoading);
    }, [searchQueryData, searchQueryLoading, matchingFriends, newChatQuery]);

    const handleStartChat = async (targetUser: TUser) => {
        try {
            const result = await createChannelMutation.mutateAsync({
                loaiKenh: 'CA_NHAN',
                thanhVienIds: [targetUser.id]
            });
            if (result) {
                refetchChannels();
                setShowUserSearch(false);
                setNewChatQuery("");
                setSearchResults([]);
                handleSelectChannel(result.id);
            }
        } catch (error) {
            notifications.show({
                title: 'Không thể tạo cuộc trò chuyện',
                message: 'Bạn chỉ có thể nhắn tin cho người đã kết bạn.',
                color: 'red'
            });
        }
    };

    const selectedChannel = useMemo(() => {
        return normalizedChannels?.find(c => c.id === selectedChannelId);
    }, [normalizedChannels, selectedChannelId]);

    const handleSelectChannel = useCallback((id: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set('id', id.toString());
        router.push(`${pathname}?${params.toString()}`);
    }, [pathname, router]);

    const handleBack = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        params.delete('id');
        router.push(`${pathname}?${params.toString()}`);
    }, [pathname, router]);

    // Helper functions
    const getChannelName = useCallback((channel: TChannel, currentUserId?: number) => {
        if (!channel) return "Người dùng";
        if (channel.loaiKenh === 'NHOM') return channel.tenKenh || "Nhóm";
        if (!channel.thanhViens || channel.thanhViens.length === 0) return "Người dùng";
        const member = channel.thanhViens.find(m => Number(m.nguoiDungId) !== Number(currentUserId));
        return member?.nguoiDung?.hoTen || member?.nguoiDung?.taiKhoan || "Người dùng";
    }, []);

    const getChannelAvatar = useCallback((channel: TChannel, currentUserId?: number) => {
        if (!channel || channel.loaiKenh === 'NHOM') return null;
        const member = channel.thanhViens?.find(m => Number(m.nguoiDungId) !== Number(currentUserId));
        return member?.nguoiDung?.avatar;
    }, []);

    const formatTime = useCallback((dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        if (diff < 24 * 60 * 60 * 1000 && now.getDate() === date.getDate()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (diff < 7 * 24 * 60 * 60 * 1000) {
            return date.toLocaleDateString([], { weekday: 'short' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }, []);

    return (
        <Box className="flex w-full h-full bg-white dark:bg-black overflow-hidden relative">
            <ChatSidebar
                channels={sortedChannels || []}
                isLoading={isLoadingChannels}
                selectedChannelId={selectedChannelId}
                onSelectChannel={(id) => {
                    handleSelectChannel(id);
                }}
                currentUserId={user?.id}
                currentUser={user}
                unreadChannelIds={unreadChannelIds}
                getIsUnread={getIsUnread}
                getChannelAvatar={getChannelAvatar}
                getChannelName={getChannelName}
                formatTime={formatTime}
                onShowSearch={() => setShowUserSearch(true)}
                onShowSettings={() => setShowSettings(true)}
                sidebarQuery={sidebarQuery}
                presenceMap={presenceMap}
                friends={friends || []}
                onSidebarQueryChange={setSidebarQuery}
            />

            <Box className={`flex-1 h-full flex flex-col bg-white dark:bg-black ${!selectedChannelId ? 'hidden md:flex' : 'flex'}`}>
                {selectedChannel || selectedChannelId ? (
                    <Box className="flex h-full">
                        <Box className="flex-1 flex flex-col min-w-0">
                            {selectedChannel ? (
                                <ChatWindow
                                    channel={selectedChannel as TChannel}
                                    onBack={handleBack}
                                    onToggleInfo={() => setShowInfo(!showInfo)}
                                />
                            ) : (
                                <Center className="h-full">
                                    <Loader size="md" color="blue" />
                                </Center>
                            )}
                        </Box>

                        {showInfo && !isMobile && selectedChannel && (
                            <Box className="hidden lg:flex w-[340px] flex-col h-full bg-white dark:bg-black overflow-y-auto border-l border-gray-100 dark:border-zinc-900 animate-in slide-in-from-right duration-300">
                                <ChannelInfoSidebar
                                    channel={selectedChannel as TChannel}
                                    currentUserId={user?.id}
                                    getChannelName={getChannelName}
                                    getChannelAvatar={getChannelAvatar}
                                    presenceMap={presenceMap}
                                />
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Center className="h-full flex-col gap-4 text-gray-300 dark:text-zinc-700 select-none">
                        <IconMessagePlus size={80} stroke={1} />
                        <Text size="xl" fw={500}>Chọn một đoạn chat để bắt đầu</Text>
                    </Center>
                )}
            </Box>

            <Drawer
                opened={showInfo && isMobile}
                onClose={() => setShowInfo(false)}
                position="right"
                size="100%"
                withCloseButton={false}
                padding={0}
                styles={{
                    content: { backgroundColor: 'var(--mantine-color-body)' },
                    body: { height: '100%', display: 'flex', flexDirection: 'column' }
                }}
            >
                <Box className="h-full flex flex-col bg-white dark:bg-black">
                    <Box className="sticky top-0 z-10 px-4 h-[60px] flex items-center border-b border-gray-100 dark:border-zinc-900 bg-white/95 dark:bg-black/95 backdrop-blur">
                        <Group gap="sm">
                            <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" onClick={() => setShowInfo(false)}>
                                <IconArrowLeft size={24} stroke={2.5} />
                            </ActionIcon>
                            <Text fw={700} size="lg">Thông tin</Text>
                        </Group>
                    </Box>
                    <Box className="flex-1 overflow-y-auto pb-10">
                        {selectedChannel && (
                            <ChannelInfoSidebar
                                channel={selectedChannel as TChannel}
                                currentUserId={user?.id}
                                getChannelName={getChannelName}
                                getChannelAvatar={getChannelAvatar}
                                presenceMap={presenceMap}
                            />
                        )}
                    </Box>
                </Box>
            </Drawer>

            <UserSearchDrawer
                opened={showUserSearch}
                onClose={() => {
                    setShowUserSearch(false);
                    setNewChatQuery("");
                    setSearchResults([]);
                }}
                query={newChatQuery}
                onQueryChange={setNewChatQuery}
                isSearching={isSearching}
                searchResults={searchResults}
                isLoadingFriends={isLoadingFriends}
                friends={friends || []}
                onStartChat={handleStartChat}
            />

            <SettingsDrawer
                opened={showSettings}
                onClose={() => setShowSettings(false)}
                user={user}
                onLogout={() => {
                    localStorage.clear();
                    document.cookie.split(";").forEach((c) => {
                        document.cookie = c
                            .replace(/^ +/, "")
                            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });
                    const locale = pathname?.split('/')[1] || 'vi';
                    window.location.assign(`/${locale}/auth/login`);
                }}
            />
        </Box>
    );
}