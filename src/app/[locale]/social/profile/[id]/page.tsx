"use client";

import { useParams } from "next/navigation";
import { Box, Title, Stack, Text, Avatar, Group, Button, Tabs, Center, Loader, Badge, Divider } from "@mantine/core";
import { IconShare, IconUserPlus, IconUserCheck, IconUserX, IconMessage, IconUser, IconEdit } from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { ThreadFeed } from "@/feauture/social/components/ThreadFeed";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/providers/store/useAppStore";
import { useState } from "react";
import { EditProfileModal } from "@/feauture/social/components/EditProfileModal";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function UserProfilePage() {
    const params = useParams();
    const id = Number(params.id);
    const pathname = usePathname();
    const locale = pathname.split('/')[1];
    const t = useTranslations('profile');

    const { user } = useAppStore();
    const isOwner = !!user?.id && user.id === id;
    const [editOpened, setEditOpened] = useState(false);

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
            router.push(`/${locale}/chat?id=${channel.id}`);
        } catch (error) {
            notifications.show({
                title: 'Lỗi',
                message: t('error.chatError'),
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
                message: t('error.actionError'),
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
                return { children: t('follow'), variant: 'filled' as const, color: 'black', icon: <IconUserPlus size={18} /> };
            case 'FRIEND':
                return { children: t('following'), variant: 'outline' as const, color: 'gray', icon: <IconUserCheck size={18} /> };
            case 'SENT':
                return { children: t('sentRequest'), variant: 'outline' as const, color: 'gray', icon: <IconUserCheck size={18} /> };
            case 'RECEIVED':
                return { children: t('accept'), variant: 'filled' as const, color: 'indigo', icon: <IconUserCheck size={18} /> };
            case 'BLOCKED':
                return { children: t('blocked'), variant: 'outline' as const, color: 'red', disabled: true, icon: <IconUserX size={18} /> };
            default:
                return { children: t('follow'), variant: 'filled' as const, color: 'black', icon: <IconUserPlus size={18} /> };
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
        <Stack gap="lg">
            {/* Threads-like header (no banner) */}
            <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Group gap="md" wrap="nowrap" className="min-w-0">
                    <Avatar src={profile.avatar} size={84} radius={999} className="shadow-sm" />
                    <Stack gap={4} className="min-w-0">
                        <Group gap="sm" wrap="nowrap">
                            <Title order={2} className="text-2xl font-black tracking-tight truncate">
                                {profile.hoTen || profile.taiKhoan}
                            </Title>
                            <Badge
                                variant="light"
                                color={getRoleColor(profile.vaiTro)}
                                radius="sm"
                                className="font-bold uppercase tracking-widest"
                            >
                                {profile.vaiTro}
                            </Badge>
                        </Group>
                        <Text size="sm" c="dimmed" fw={600} className="truncate">@{profile.taiKhoan}</Text>
                        <Text size="sm" fw={500} c="dimmed" className="truncate">
                            {profile?._count?.followers ?? 0} {t('followers')} · {profile?._count?.following ?? 0} {t('following')}
                        </Text>
                    </Stack>
                </Group>

                <Group gap="xs" wrap="nowrap">
                    {isOwner && (
                        <Button variant="light" color="gray" radius="md" fw={700} leftSection={<IconEdit size={16} />} onClick={() => setEditOpened(true)}>
                            {t('edit')}
                        </Button>
                    )}
                    <Button variant="light" color="gray" radius="md" fw={700} leftSection={<IconShare size={16} />}>
                        {t('share')}
                    </Button>
                </Group>
            </Group>

            <Group gap="sm" wrap="nowrap">
                {!isOwner && (
                    <>
                        <Button
                            {...actionBtn}
                            leftSection={actionBtn.icon}
                            radius="md"
                            fw={700}
                            onClick={handleAction}
                            loading={sendRequestMutation.isPending || handleRequestMutation.isPending || unfriendMutation.isPending}
                            fullWidth
                        >
                            {actionBtn.children}
                        </Button>
                        <Button
                            variant="light"
                            color="gray"
                            radius="md"
                            fw={700}
                            leftSection={<IconMessage size={18} />}
                            onClick={handleMessage}
                            loading={createChannelMutation.isPending}
                            fullWidth
                        >
                            {t('message')}
                        </Button>
                    </>
                )}
            </Group>

            <Divider />

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
                    <Tabs.Tab value="about">{t('about')}</Tabs.Tab>
                    <Tabs.Tab value="threads">{t('posts')}</Tabs.Tab>
                    <Tabs.Tab value="replies">{t('replies')}</Tabs.Tab>
                    <Tabs.Tab value="reposts">{t('reposts')}</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="about" pt="lg">
                    <Stack gap="md">
                        <Box>
                            <Text size="lg" fw={600} mb="md">{t('personalInfo')}</Text>
                            <Stack gap="sm">
                                {profile.email && (
                                    <Group gap="sm">
                                        <Text size="sm" fw={500}>{t('email')}:</Text>
                                        <Text size="sm">{profile.email}</Text>
                                    </Group>
                                )}
                                {profile.ngaySinh && (
                                    <Group gap="sm">
                                        <Text size="sm" fw={500}>{t('dateOfBirth')}:</Text>
                                        <Text size="sm">{new Date(profile.ngaySinh).toLocaleDateString('vi-VN')}</Text>
                                    </Group>
                                )}
                                {profile.gioiTinh && (
                                    <Group gap="sm">
                                        <Text size="sm" fw={500}>{t('gender')}:</Text>
                                        <Text size="sm">{profile.gioiTinh === 'NAM' ? t('male') : t('female')}</Text>
                                    </Group>
                                )}
                                {profile.soDienThoai && (
                                    <Group gap="sm">
                                        <Text size="sm" fw={500}>{t('phone')}:</Text>
                                        <Text size="sm">{profile.soDienThoai}</Text>
                                    </Group>
                                )}
                                {profile.diaChi && (
                                    <Group gap="sm">
                                        <Text size="sm" fw={500}>{t('address')}:</Text>
                                        <Text size="sm">{profile.diaChi}</Text>
                                    </Group>
                                )}
                                {profile?.hoSoHocSinh?.lopHoc?.tenLop && (
                                    <Group gap="sm">
                                        <Text size="sm" fw={500}>{t('class')}:</Text>
                                        <Text size="sm">{profile.hoSoHocSinh.lopHoc.tenLop}</Text>
                                    </Group>
                                )}
                                {profile?.hoSoGiaoVien?.chuyenMon && (
                                    <Group gap="sm">
                                        <Text size="sm" fw={500}>{t('specialization')}:</Text>
                                        <Text size="sm">{profile.hoSoGiaoVien.chuyenMon}</Text>
                                    </Group>
                                )}
                                {!profile.email && !profile.ngaySinh && !profile.gioiTinh && !profile.soDienThoai && !profile.diaChi && !profile?.hoSoHocSinh?.lopHoc?.tenLop && !profile?.hoSoGiaoVien?.chuyenMon && (
                                    <Text size="sm" c="dimmed">{t('noInfo')}</Text>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </Tabs.Panel>

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
                                <Text c="dimmed">{t('noPosts')}</Text>
                            </Stack>
                        </Center>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="replies" pt="lg">
                    <Center py={60}>
                        <Stack align="center" gap="sm">
                            <IconMessage size={48} className="text-gray-300" />
                            <Text c="dimmed">{t('noReplies')}</Text>
                        </Stack>
                    </Center>
                </Tabs.Panel>

                <Tabs.Panel value="reposts" pt="lg">
                    <Center py={60}>
                        <Stack align="center" gap="sm">
                            <IconShare size={48} className="text-gray-300" />
                            <Text c="dimmed">{t('noReposts')}</Text>
                        </Stack>
                    </Center>
                </Tabs.Panel>
            </Tabs>

            {isOwner && (
                <EditProfileModal
                    opened={editOpened}
                    onClose={() => setEditOpened(false)}
                    profile={profile}
                />
            )}
        </Stack>
    );
}
