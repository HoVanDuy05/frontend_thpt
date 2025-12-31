"use client";

import { useParams } from "next/navigation";
import { Box, Title, Stack, Text, Avatar, Group, Button, Tabs, Center, Loader, ActionIcon, Badge } from "@mantine/core";
import { IconShare, IconLink, IconDots, IconUserPlus, IconUserCheck, IconUserX, IconMessage, IconSend, IconUser } from "@tabler/icons-react";
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
        <Stack gap="xl">
            {/* Profile Header */}
            <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Group gap="lg" align="flex-start">
                    <Avatar
                        src={profile.avatar}
                        size={100}
                        radius="xl"
                        className="ring-2 ring-gray-200 dark:ring-zinc-800"
                    />
                    <Stack gap="xs">
                        <Group gap="sm" align="center">
                            <Title order={1} className="text-3xl font-bold">
                                {profile.hoTen || profile.taiKhoan}
                            </Title>
                            <Badge
                                variant="light"
                                color={getRoleColor(profile.vaiTro)}
                                size="md"
                                radius="md"
                                className="font-semibold"
                            >
                                {profile.vaiTro}
                            </Badge>
                        </Group>
                        <Text size="sm" c="dimmed" fw={500}>
                            @{profile.taiKhoan}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 max-w-md">
                            Hồ sơ mạng xã hội của {profile.hoTen || profile.taiKhoan}
                        </Text>
                    </Stack>
                </Group>

                <Group gap="xs">
                    <ActionIcon variant="light" color="gray" radius="xl" size="lg">
                        <IconShare size={18} />
                    </ActionIcon>
                    <ActionIcon variant="light" color="gray" radius="xl" size="lg">
                        <IconDots size={20} />
                    </ActionIcon>
                </Group>
            </Group>

            {/* Stats */}
            <Group gap="xl">
                <Stack gap={4}>
                    <Text size="xl" fw={700}>
                        {profile._count.followers}
                    </Text>
                    <Text size="sm" c="dimmed">
                        Người theo dõi
                    </Text>
                </Stack>
                <Stack gap={4}>
                    <Text size="xl" fw={700}>
                        {profile._count.following}
                    </Text>
                    <Text size="sm" c="dimmed">
                        Đang theo dõi
                    </Text>
                </Stack>
                <Stack gap={4}>
                    <Text size="xl" fw={700}>
                        {userThreads?.length || 0}
                    </Text>
                    <Text size="sm" c="dimmed">
                        Bài viết
                    </Text>
                </Stack>
            </Group>

            {/* Action Buttons */}
            <Group gap="sm">
                <Button
                    {...actionBtn}
                    leftSection={actionBtn.icon}
                    radius="md"
                    size="md"
                    fw={600}
                    onClick={handleAction}
                    loading={sendRequestMutation.isPending || handleRequestMutation.isPending || unfriendMutation.isPending}
                    className="flex-1"
                >
                    {actionBtn.children}
                </Button>
                <Button
                    variant="light"
                    color="gray"
                    radius="md"
                    size="md"
                    fw={600}
                    leftSection={<IconMessage size={18} />}
                    onClick={handleMessage}
                    loading={createChannelMutation.isPending}
                    className="flex-1"
                >
                    Nhắn tin
                </Button>
            </Group>

            {/* Content Tabs */}
            <Tabs
                defaultValue="threads"
                variant="pills"
                classNames={{
                    root: "w-full",
                    list: "gap-2",
                    tab: "font-semibold data-[active=true]:bg-black data-[active=true]:text-white dark:data-[active=true]:bg-white dark:data-[active=true]:text-black"
                }}
            >
                <Tabs.List>
                    <Tabs.Tab value="threads">Bài viết</Tabs.Tab>
                    <Tabs.Tab value="replies">Phản hồi</Tabs.Tab>
                    <Tabs.Tab value="reposts">Chia sẻ</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="threads" pt="lg">
                    {isLoadingThreads ? (
                        <Center py={40}>
                            <Loader color="gray" size="md" />
                        </Center>
                    ) : userThreads && userThreads.length > 0 ? (
                        <ThreadFeed threads={userThreads} />
                    ) : (
                        <Center py={60}>
                            <Stack align="center" gap="sm">
                                <IconUser size={48} className="text-gray-300" />
                                <Text c="dimmed">Chưa có bài viết nào</Text>
                            </Stack>
                        </Center>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="replies" pt="lg">
                    <Center py={60}>
                        <Stack align="center" gap="sm">
                            <IconMessage size={48} className="text-gray-300" />
                            <Text c="dimmed">Chưa có phản hồi nào</Text>
                        </Stack>
                    </Center>
                </Tabs.Panel>

                <Tabs.Panel value="reposts" pt="lg">
                    <Center py={60}>
                        <Stack align="center" gap="sm">
                            <IconShare size={48} className="text-gray-300" />
                            <Text c="dimmed">Chưa có bài đăng lại nào</Text>
                        </Stack>
                    </Center>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}
