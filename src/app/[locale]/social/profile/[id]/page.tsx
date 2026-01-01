"use client"

import { useParams } from "next/navigation";
import { Box, Title, Stack, Text, Avatar, Group, Button, Tabs, Center, Loader, Badge, Divider, Card, SimpleGrid, Container } from "@mantine/core";
import { IconShare, IconUserPlus, IconUserCheck, IconUserX, IconMessage, IconUser, IconEdit, IconMessageCircle, IconMail, IconCalendar, IconPhone, IconMapPin, IconSchool, IconBriefcase } from "@tabler/icons-react";
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
    const [editModalOpened, setEditModalOpened] = useState(false);

    const { data: profile, isLoading: isLoadingProfile } = AppQuery.social.useSocialProfile(id);
    const { data: userThreads, isLoading: isLoadingThreads } = AppQuery.social.useUserThreads(id);
    const { data: statusData, refetch: refetchStatus } = AppQuery.friends.useStatus(id);

    // Debug: Log profile data
    console.log('Profile data:', profile);
    console.log('Is loading profile:', isLoadingProfile);

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

    const handleShare = () => {
        const userName = profile?.hoTen || profile?.taiKhoan || 'Người dùng';
        if (navigator.share) {
            navigator.share({
                title: `${userName} - Profile`,
                text: `Xem hồ sơ của ${userName}`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            notifications.show({
                title: 'Thành công',
                message: 'Đã sao chép liên kết',
                color: 'green'
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

    const statusMutation = {
        isPending: sendRequestMutation.isPending || handleRequestMutation.isPending || unfriendMutation.isPending
    };

    if (isLoadingProfile) {
        return <Center h="50vh"><Loader color="indigo" /></Center>;
    }

    if (!profile) {
        return <Center h="50vh">User not found</Center>;
    }

    const getButtonProps = () => {
        if (!statusData) return { label: '...', disabled: true, leftSection: null, onClick: () => { }, variant: 'light' as const, color: 'gray' };

        switch (statusData.status) {
            case 'NONE':
                return { label: t('follow'), variant: 'filled' as const, color: 'black', leftSection: <IconUserPlus size={18} />, onClick: handleAction };
            case 'FRIEND':
                return { label: t('following'), variant: 'outline' as const, color: 'gray', leftSection: <IconUserCheck size={18} />, onClick: handleAction };
            case 'SENT':
                return { label: t('sentRequest'), variant: 'outline' as const, color: 'gray', leftSection: <IconUserCheck size={18} />, onClick: handleAction };
            case 'RECEIVED':
                return { label: t('accept'), variant: 'filled' as const, color: 'indigo', leftSection: <IconUserCheck size={18} />, onClick: handleAction };
            case 'BLOCKED':
                return { label: t('blocked'), variant: 'outline' as const, color: 'red', disabled: true, leftSection: <IconUserX size={18} />, onClick: () => { } };
            default:
                return { label: t('follow'), variant: 'filled' as const, color: 'black', leftSection: <IconUserPlus size={18} />, onClick: handleAction };
        }
    };

    return (
        <Container size="sm" className="px-4 py-6">
            <Stack gap={6}>
                {/* Profile Header - Threads Style */}
                <Card withBorder radius="xl" className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 overflow-hidden">
                    <Box className="relative">
                        {/* Cover Image */}
                        <Box h={120} className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />

                        {/* Profile Info */}
                        <Box px="md" pb="md" className="relative">
                            <Avatar
                                src={profile.avatar}
                                size={80}
                                className="absolute -top-10 border-4 border-white dark:border-zinc-900"
                            />

                            <Box mt="12">
                                <Group justify="space-between" align="start">
                                    <Stack gap={4} className="flex-1">
                                        <Text size="xl" fw={800} className="text-gray-900 dark:text-white">
                                            {profile.hoTen || profile.taiKhoan || 'Người dùng'}
                                        </Text>
                                        <Text size="sm" c="dimmed" className="text-gray-600 dark:text-gray-400">
                                            @{profile.taiKhoan}
                                        </Text>
                                        {profile.vaiTro && (
                                            <Badge size="sm" variant="light" color="indigo" className="w-fit">
                                                {profile.vaiTro}
                                            </Badge>
                                        )}
                                    </Stack>

                                    <Group gap="sm">
                                        {isOwner && (
                                            <Button
                                                variant="light"
                                                size="sm"
                                                leftSection={<IconEdit size={16} />}
                                                onClick={() => setEditModalOpened(true)}
                                                className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                                            >
                                                {t('edit')}
                                            </Button>
                                        )}
                                        <Button
                                            variant="light"
                                            size="sm"
                                            leftSection={<IconShare size={16} />}
                                            onClick={handleShare}
                                            className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                                        >
                                            {t('share')}
                                        </Button>
                                    </Group>
                                </Group>
                            </Box>
                        </Box>
                    </Box>
                </Card>

                {/* Stats Bar - Threads Style */}
                <Card withBorder radius="xl" className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                    <Group justify="center" gap="xl">
                        <Stack gap={0} align="center" className="cursor-pointer">
                            <Text size="lg" fw={700} className="text-gray-900 dark:text-white">
                                {profile._count?.following || 0}
                            </Text>
                            <Text size="sm" c="dimmed" className="text-gray-600 dark:text-gray-400">
                                {t('following')}
                            </Text>
                        </Stack>

                        <Divider orientation="vertical" className="h-8" />

                        <Stack gap={0} align="center" className="cursor-pointer">
                            <Text size="lg" fw={700} className="text-gray-900 dark:text-white">
                                {profile._count?.followers || 0}
                            </Text>
                            <Text size="sm" c="dimmed" className="text-gray-600 dark:text-gray-400">
                                {t('followers')}
                            </Text>
                        </Stack>

                        <Divider orientation="vertical" className="h-8" />

                        <Stack gap={0} align="center" className="cursor-pointer">
                            <Text size="lg" fw={700} className="text-gray-900 dark:text-white">
                                {profile._count?.threads || 0}
                            </Text>
                            <Text size="sm" c="dimmed" className="text-gray-600 dark:text-gray-400">
                                {t('posts')}
                            </Text>
                        </Stack>
                    </Group>
                </Card>

                {/* Action Buttons */}
                <Card withBorder radius="xl" className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                    <Group justify="center" gap="sm">
                        <Button
                            size="sm"
                            leftSection={<IconMessageCircle size={16} />}
                            onClick={handleMessage}
                            className="flex-1 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
                        >
                            {t('message')}
                        </Button>

                        <Button
                            size="sm"
                            leftSection={getButtonProps().leftSection}
                            onClick={getButtonProps().onClick}
                            loading={statusMutation.isPending}
                            className="flex-1"
                            variant={getButtonProps().variant}
                            color={getButtonProps().color}
                        >
                            {getButtonProps().label}
                        </Button>
                    </Group>
                </Card>

                {/* Content Tabs - Threads Style */}
                <Card withBorder radius="xl" className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 overflow-hidden">
                    <Tabs
                        defaultValue="threads"
                        variant="pills"
                        classNames={{
                            root: "w-full",
                            list: "gap-2 px-md pt-md",
                            tab: "font-semibold data-[active=true]:bg-black data-[active=true]:text-white dark:data-[active=true]:bg-white dark:data-[active=true]:text-black"
                        }}
                    >
                        <Tabs.List>
                            <Tabs.Tab value="threads">{t('posts')}</Tabs.Tab>
                            <Tabs.Tab value="replies">{t('replies')}</Tabs.Tab>
                            <Tabs.Tab value="reposts">{t('reposts')}</Tabs.Tab>
                            <Tabs.Tab value="about">{t('about')}</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="threads" pt="lg" px="md" pb="md">
                            <Stack gap="md">
                                {isLoadingThreads ? (
                                    <Center py={40}>
                                        <Loader color="gray" size="md" />
                                    </Center>
                                ) : userThreads && userThreads.length > 0 ? (
                                    <ThreadFeed threads={userThreads} />
                                ) : (
                                    <Center py={60}>
                                        <Stack align="center" gap="sm">
                                            <IconMessage size={48} className="text-gray-300" />
                                            <Text c="dimmed">{t('no_posts')}</Text>
                                        </Stack>
                                    </Center>
                                )}
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="replies" pt="lg" px="md" pb="md">
                            <Center py={60}>
                                <Stack align="center" gap="sm">
                                    <IconMessage size={48} className="text-gray-300" />
                                    <Text c="dimmed">{t('no_replies')}</Text>
                                </Stack>
                            </Center>
                        </Tabs.Panel>

                        <Tabs.Panel value="reposts" pt="lg" px="md" pb="md">
                            <Center py={60}>
                                <Stack align="center" gap="sm">
                                    <IconShare size={48} className="text-gray-300" />
                                    <Text c="dimmed">{t('no_reposts')}</Text>
                                </Stack>
                            </Center>
                        </Tabs.Panel>

                        <Tabs.Panel value="about" pt="lg" px="md" pb="md">
                            <Stack gap="lg">
                                <Text size="lg" fw={800} className="text-gray-900 dark:text-white">{t('personalInfo')}</Text>

                                <SimpleGrid cols={1} spacing="sm">
                                    {profile.email && (
                                        <Group gap="sm" className="p-sm rounded-lg bg-gray-50 dark:bg-zinc-800">
                                            <IconMail size={16} className="text-gray-500 dark:text-gray-400" />
                                            <Text size="sm" fw={500} className="text-gray-700 dark:text-gray-300">{t('email')}:</Text>
                                            <Text size="sm" className="text-gray-900 dark:text-white">{profile.email}</Text>
                                        </Group>
                                    )}

                                    {profile.ngaySinh && (
                                        <Group gap="sm" className="p-sm rounded-lg bg-gray-50 dark:bg-zinc-800">
                                            <IconCalendar size={16} className="text-gray-500 dark:text-gray-400" />
                                            <Text size="sm" fw={500} className="text-gray-700 dark:text-gray-300">{t('dateOfBirth')}:</Text>
                                            <Text size="sm" className="text-gray-900 dark:text-white">{new Date(profile.ngaySinh).toLocaleDateString('vi-VN')}</Text>
                                        </Group>
                                    )}

                                    {profile.gioiTinh && (
                                        <Group gap="sm" className="p-sm rounded-lg bg-gray-50 dark:bg-zinc-800">
                                            <IconUser size={16} className="text-gray-500 dark:text-gray-400" />
                                            <Text size="sm" fw={500} className="text-gray-700 dark:text-gray-300">{t('gender')}:</Text>
                                            <Text size="sm" className="text-gray-900 dark:text-white">{profile.gioiTinh === 'NAM' ? t('male') : t('female')}</Text>
                                        </Group>
                                    )}

                                    {profile.soDienThoai && (
                                        <Group gap="sm" className="p-sm rounded-lg bg-gray-50 dark:bg-zinc-800">
                                            <IconPhone size={16} className="text-gray-500 dark:text-gray-400" />
                                            <Text size="sm" fw={500} className="text-gray-700 dark:text-gray-300">{t('phone')}:</Text>
                                            <Text size="sm" className="text-gray-900 dark:text-white">{profile.soDienThoai}</Text>
                                        </Group>
                                    )}

                                    {profile.diaChi && (
                                        <Group gap="sm" className="p-sm rounded-lg bg-gray-50 dark:bg-zinc-800">
                                            <IconMapPin size={16} className="text-gray-500 dark:text-gray-400" />
                                            <Text size="sm" fw={500} className="text-gray-700 dark:text-gray-300">{t('address')}:</Text>
                                            <Text size="sm" className="text-gray-900 dark:text-white">{profile.diaChi}</Text>
                                        </Group>
                                    )}

                                    {profile.hoSoHocSinh?.lopHoc?.tenLop && (
                                        <Group gap="sm" className="p-sm rounded-lg bg-gray-50 dark:bg-zinc-800">
                                            <IconSchool size={16} className="text-gray-500 dark:text-gray-400" />
                                            <Text size="sm" fw={500} className="text-gray-700 dark:text-gray-300">{t('class')}:</Text>
                                            <Text size="sm" className="text-gray-900 dark:text-white">{profile.hoSoHocSinh.lopHoc.tenLop}</Text>
                                        </Group>
                                    )}

                                    {profile.hoSoGiaoVien?.chuyenMon && (
                                        <Group gap="sm" className="p-sm rounded-lg bg-gray-50 dark:bg-zinc-800">
                                            <IconBriefcase size={16} className="text-gray-500 dark:text-gray-400" />
                                            <Text size="sm" fw={500} className="text-gray-700 dark:text-gray-300">{t('specialization')}:</Text>
                                            <Text size="sm" className="text-gray-900 dark:text-white">{profile.hoSoGiaoVien.chuyenMon}</Text>
                                        </Group>
                                    )}
                                </SimpleGrid>

                                {(!profile.email && !profile.ngaySinh && !profile.gioiTinh && !profile.soDienThoai && !profile.diaChi && !profile.hoSoHocSinh?.lopHoc?.tenLop && !profile.hoSoGiaoVien?.chuyenMon) && (
                                    <Box p="xl" className="text-center bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                        <Text size="sm" c="dimmed" className="text-gray-600 dark:text-gray-400">
                                            {t('no_info')}
                                        </Text>
                                    </Box>
                                )}
                            </Stack>
                        </Tabs.Panel>
                    </Tabs>
                </Card>
            </Stack>

            {isOwner && (
                <EditProfileModal
                    opened={editModalOpened}
                    onClose={() => setEditModalOpened(false)}
                    profile={profile}
                />
            )}
        </Container>
    );
}
