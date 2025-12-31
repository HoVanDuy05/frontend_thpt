"use client";

import { Box, Title, Stack, Text, Avatar, Group, Button, Tabs, Center, Loader, ActionIcon, Badge } from "@mantine/core";
import { IconSettings, IconShare, IconLink } from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { ThreadFeed } from "@/feauture/social/components/ThreadFeed";
import { useAppStore } from "@/providers/store/useAppStore";
import { useRouter } from "@/i18n/routing";

export default function ProfilePage() {
    const { data: profile, isLoading: isLoadingProfile } = AppQuery.auth.useProfile();
    const { data: userThreads, isLoading: isLoadingThreads } = AppQuery.social.useUserThreads(profile?.id || 0, {}, {
        enabled: !!profile?.id
    });

    const { setToken } = useAppStore();
    const router = useRouter();

    if (isLoadingProfile) {
        return <Center h="50vh"><Loader color="indigo" /></Center>;
    }

    const handleLogout = () => {
        setToken("");
        router.push("/auth/login");
    };

    return (
        <Stack gap={40}>
            {/* Profile Header */}
            <Stack gap="xl">
                <Group justify="space-between" align="flex-start">
                    <Stack gap={4}>
                        <Group gap="sm">
                            <Title order={1} className="text-4xl font-black tracking-tighter">
                                {profile?.hoTen || profile?.taiKhoan}
                            </Title>
                            <Badge
                                variant="outline"
                                color={profile?.vaiTro === 'ADMIN' ? 'red' : profile?.vaiTro === 'GIAO_VIEN' ? 'indigo' : 'teal'}
                                size="sm"
                                radius="sm"
                                className="font-black uppercase tracking-widest px-2"
                            >
                                {profile?.vaiTro}
                            </Badge>
                        </Group>
                        <Text component="div" size="md" fw={500} className="text-zinc-500 flex items-center gap-1">
                            {profile?.taiKhoan} <Box component="span" className="bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-[10px] font-black uppercase text-zinc-400">threads.net</Box>
                        </Text>
                    </Stack>
                    <Avatar
                        src={profile?.avatar}
                        size={84}
                        radius="xl"
                        className="shadow-xl ring-4 ring-zinc-50 dark:ring-zinc-900"
                    />
                </Group>

                <Text className="text-zinc-600 dark:text-zinc-400 font-medium max-w-[400px]">
                    Software developer & design enthusiast. Building Nguyen Hue Academy.
                </Text>

                <Group justify="space-between">
                    <Text size="sm" fw={600} className="text-zinc-400">
                        12 followers · <Text component="span" className="hover:underline cursor-pointer">linkedin.com</Text>
                    </Text>
                    <Group gap="xs">
                        <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" className="border border-zinc-100 dark:border-zinc-800">
                            <IconLink size={18} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" className="border border-zinc-100 dark:border-zinc-800">
                            <IconSettings size={18} />
                        </ActionIcon>
                    </Group>
                </Group>

                <Group grow gap="md">
                    <Button variant="outline" color="gray" radius="md" fw={700} className="border-gray-200 dark:border-zinc-800">Edit profile</Button>
                    <Button variant="outline" color="gray" radius="md" fw={700} className="border-gray-200 dark:border-zinc-800">Share profile</Button>
                    <Button variant="filled" color="black" radius="md" fw={900} onClick={handleLogout} className="dark:bg-white dark:text-black uppercase tracking-widest text-[10px]">Logout</Button>
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
                    <Tabs.Tab value="friends">Friends</Tabs.Tab>
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
                    <Center py={100} className="text-zinc-400 font-medium">No replies yet</Center>
                </Tabs.Panel>

                <Tabs.Panel value="friends" pt="md">
                    <FriendsTab />
                </Tabs.Panel>

                <Tabs.Panel value="reposts">
                    <Center py={100} className="text-zinc-400 font-medium">No reposts yet</Center>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}

function FriendsTab() {
    const { data: friends, isLoading: isLoadingFriends } = AppQuery.friends.useList();
    const { data: pending, isLoading: isLoadingPending } = AppQuery.friends.usePending();

    if (isLoadingFriends || isLoadingPending) {
        return <Center py={40}><Loader color="indigo" size="sm" /></Center>;
    }

    return (
        <Stack gap="xl">
            {pending && pending.length > 0 && (
                <Stack gap="md">
                    <Text fw={800} size="sm" className="uppercase tracking-widest text-zinc-400 px-md">Pending Requests ({pending.length})</Text>
                    <Stack gap={0}>
                        {pending.map((req: any) => (
                            <UserCard key={req.id} user={req.nguoiGui} />
                        ))}
                    </Stack>
                </Stack>
            )}

            <Stack gap="md">
                <Text fw={800} size="sm" className="uppercase tracking-widest text-zinc-400 px-md">Your Friends ({friends?.length || 0})</Text>
                {friends && friends.length > 0 ? (
                    <Stack gap={0}>
                        {friends.map(friend => (
                            <UserCard key={friend.id} user={friend} />
                        ))}
                    </Stack>
                ) : (
                    <Center py={60}>
                        <Text c="dimmed" size="sm" fw={600}>You haven't added any friends yet.</Text>
                    </Center>
                )}
            </Stack>
        </Stack>
    );
}

import { UserCard } from "@/feauture/social/components/UserCard";
