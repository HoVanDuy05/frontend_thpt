"use client";

import { useParams } from "next/navigation";
import { Box, Title, Stack, Text, Avatar, Group, Button, Tabs, Center, Loader, ActionIcon, Badge } from "@mantine/core";
import { IconShare, IconLink, IconDots, IconUserPlus, IconUserCheck, IconUserX, IconMessage } from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { ThreadFeed } from "@/feauture/social/components/ThreadFeed";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
    const params = useParams();
    const id = Number(params.id);

    const { data: profile, isLoading: isLoadingProfile } = AppQuery.social.useSocialProfile(id);
    const { data: userThreads, isLoading: isLoadingThreads } = AppQuery.social.useUserThreads(id);
    const { data: statusData, refetch: refetchStatus } = AppQuery.friends.useStatus(id);

    const sendRequestMutation = AppMutation().friends.useSendRequest(id);
    const handleRequestMutation = AppMutation().friends.useHandleRequest(id);
    const unfriendMutation = AppMutation().friends.useUnfriend(id);
    const router = useRouter();
    const createChannelMutation = AppMutation().chat.useCreateChannel();

    const handleMessage = async () => {
        try {
            const channel = await createChannelMutation.mutateAsync({
                loaiKenh: 'CA_NHAN',
                thanhVienIds: [id]
            });
            router.push(`/chat?id=${channel.id}`);
        } catch (error) {
            notifications.show({
                title: 'Lỗi',
                message: 'Không thể mở cuộc trò chuyện. Vui lòng kết bạn trước.',
                color: 'red'
            });
        }
    };

    const handleAction = async () => {
        try {
            if (!statusData) return;

            if (statusData.status === 'NONE') {
                await sendRequestMutation.mutateAsync(undefined);
            } else if (statusData.status === 'RECEIVED') {
                await handleRequestMutation.mutateAsync({ action: 'ACCEPT' });
            } else if (statusData.status === 'SENT') {
                await handleRequestMutation.mutateAsync({ action: 'CANCEL' });
            } else if (statusData.status === 'FRIEND') {
                await unfriendMutation.mutateAsync(undefined);
            }
            refetchStatus();
        } catch (error) {
            notifications.show({
                title: 'Lỗi',
                message: 'Không thể thực hiện thao tác. Vui lòng thử lại.',
                color: 'red'
            });
        }
    };

    if (isLoadingProfile) {
        return <Center h="50vh"><Loader color="indigo" /></Center>;
    }

    if (!profile) {
        return <Center h="50vh">User not found</Center>;
    }

    const getButtonProps = () => {
        if (!statusData) return { children: '...', disabled: true, icon: null };

        switch (statusData.status) {
            case 'NONE':
                return { children: 'Theo dõi', variant: 'filled' as const, color: 'black', icon: <IconUserPlus size={18} /> };
            case 'FRIEND':
                return { children: 'Đang theo dõi', variant: 'outline' as const, color: 'gray', icon: <IconUserCheck size={18} /> };
            case 'SENT':
                return { children: 'Đã gửi lời mời', variant: 'outline' as const, color: 'gray', icon: <IconUserCheck size={18} /> };
            case 'RECEIVED':
                return { children: 'Chấp nhận', variant: 'filled' as const, color: 'indigo', icon: <IconUserCheck size={18} /> };
            case 'BLOCKED':
                return { children: 'Đã chặn', variant: 'outline' as const, color: 'red', disabled: true, icon: <IconUserX size={18} /> };
            default:
                return { children: 'Theo dõi', variant: 'filled' as const, color: 'black', icon: <IconUserPlus size={18} /> };
        }
    };

    const actionBtn = getButtonProps();

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'red';
            case 'GIAO_VIEN': return 'indigo';
            case 'HOC_SINH': return 'teal';
            default: return 'gray';
        }
    };

    return (
        <Stack gap={32}>
            {/* User Info Header */}
            <Stack gap="xl">
                <Group justify="space-between" align="flex-start">
                    <Stack gap={8}>
                        <Group gap="sm">
                            <Title order={1} className="text-4xl font-black tracking-tighter">
                                {profile.hoTen || profile.taiKhoan}
                            </Title>
                            <Badge
                                variant="outline"
                                color={getRoleColor(profile.vaiTro)}
                                size="sm"
                                radius="sm"
                                className="font-black uppercase tracking-widest px-2"
                            >
                                {profile.vaiTro}
                            </Badge>
                        </Group>
                        <Group gap={6}>
                            <Text size="md" fw={600} className="text-zinc-500">
                                @{profile.taiKhoan}
                            </Text>
                            <Box className="bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-[10px] font-black uppercase text-zinc-400">
                                threads.net
                            </Box>
                        </Group>
                    </Stack>
                    <Avatar
                        src={profile.avatar}
                        size={84}
                        radius="xl"
                        className="shadow-2xl ring-4 ring-zinc-50 dark:ring-zinc-900"
                    />
                </Group>

                <Text className="text-zinc-600 dark:text-zinc-400 font-medium max-w-[450px] leading-relaxed">
                    Hồ sơ mạng xã hội của {profile.hoTen || profile.taiKhoan}. Tham gia để kết nối và chia sẻ.
                </Text>

                <Group justify="space-between" align="center">
                    <Group gap="xs">
                        <Text size="sm" fw={700} className="text-zinc-400">
                            {profile._count.followers} người theo dõi
                        </Text>
                        <Box className="w-1 h-1 rounded-full bg-zinc-300" />
                        <Text size="sm" component="a" href="#" className="text-zinc-400 hover:underline font-semibold">
                            mxh.hue.edu.vn
                        </Text>
                    </Group>
                    <Group gap="xs">
                        <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" className="border border-zinc-100 dark:border-zinc-800">
                            <IconShare size={18} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" className="border border-zinc-100 dark:border-zinc-800">
                            <IconDots size={20} />
                        </ActionIcon>
                    </Group>
                </Group>

                <Group grow gap="md">
                    <Button
                        {...actionBtn}
                        leftSection={actionBtn.icon}
                        radius="md"
                        size="md"
                        fw={900}
                        onClick={handleAction}
                        loading={sendRequestMutation.isPending || handleRequestMutation.isPending || unfriendMutation.isPending}
                        className={`uppercase tracking-widest text-[11px] h-[48px] shadow-sm transform transition-all active:scale-95 ${actionBtn.variant === 'filled' && actionBtn.color === 'black' ? 'dark:bg-white dark:text-black' : ''}`}
                    >
                        {actionBtn.children}
                    </Button>
                    <Button
                        variant="outline"
                        color="gray"
                        radius="md"
                        size="md"
                        fw={900}
                        leftSection={<IconMessage size={18} />}
                        onClick={handleMessage}
                        loading={createChannelMutation.isPending}
                        className="border-gray-200 dark:border-zinc-800 uppercase tracking-widest text-[11px] h-[48px]"
                    >
                        Nhắn tin
                    </Button>
                </Group>
            </Stack>

            {/* Content Tabs */}
            <Tabs defaultValue="threads" variant="none" classNames={{
                root: "w-full",
                list: "border-b border-gray-100 dark:border-zinc-900 flex justify-around",
                tab: "pb-4 px-0 fw-800 text-sm tracking-widest uppercase transition-all border-b-2 border-transparent data-[active=true]:border-black dark:data-[active=true]:border-white data-[active=true]:text-black dark:data-[active=true]:text-white text-zinc-400"
            }}>
                <Tabs.List>
                    <Tabs.Tab value="threads">Social</Tabs.Tab>
                    <Tabs.Tab value="replies">Replies</Tabs.Tab>
                    <Tabs.Tab value="reposts">Reposts</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="threads" pt="md">
                    {isLoadingThreads ? (
                        <Center py={40}><Loader color="indigo" size="sm" /></Center>
                    ) : (
                        <ThreadFeed threads={userThreads} />
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="replies">
                    <Center py={100} className="text-zinc-400 font-medium">Chưa có phản hồi nào</Center>
                </Tabs.Panel>

                <Tabs.Panel value="reposts">
                    <Center py={100} className="text-zinc-400 font-medium">Chưa có bài đăng lại nào</Center>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}
