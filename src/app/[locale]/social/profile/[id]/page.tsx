"use client"

import { useParams } from "next/navigation";
import { Box, Title, Stack, Text, Avatar, Group, Button, Tabs, Center, Loader, Badge, Divider, Container, Menu, ActionIcon, Grid } from "@mantine/core";
import { IconDots, IconBrandInstagram, IconLink, IconShare, IconUserPlus, IconUserCheck, IconMessage, IconWorld, IconSettings } from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { ThreadFeed } from "@/feauture/social/components/ThreadFeed";

import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/providers/store/useAppStore";
import { useState } from "react";
import { EditProfileModal } from "@/feauture/social/components/EditProfileModal";
import { usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { UserAvatar } from "@/feauture/social/components/UserAvatar";
import { UnstyledButton } from "@mantine/core";
import { SettingsDrawer } from "@/feauture/social/components/chat/SettingsDrawer";
import { BrandLoader } from "@/shared/components/BrandLoader";

export default function UserProfilePage() {
    const params = useParams();
    const id = Number(params.id);
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('profile');

    const { user, logout } = useAppStore();
    const isOwner = !!user?.id && user.id === id;
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [settingsOpened, setSettingsOpened] = useState(false);

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
                message: 'Đã sao chép liên kết profile',
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
        return <BrandLoader fullscreen />
    }

    if (!profile) {
        return <Center h="50vh">User not found</Center>;
    }

    const getButtonProps = () => {
        if (!statusData) return { label: '...', disabled: true, variant: 'default' };

        switch (statusData.status) {
            case 'NONE':
                return { label: t('follow'), variant: 'filled', bg: 'black', c: 'white' }; // Threads black button
            case 'FRIEND':
                return { label: t('following'), variant: 'outline', color: 'gray' };
            case 'SENT':
                return { label: t('sentRequest'), variant: 'outline', color: 'gray' };
            case 'RECEIVED':
                return { label: t('accept'), variant: 'filled', color: 'black' };
            default:
                return { label: t('follow'), variant: 'filled', bg: 'black', c: 'white' };
        }
    };

    const buttonProps = getButtonProps();

    return (
        <Container size="sm" px={0} className="min-h-screen bg-transparent">
            {/* Header Section */}
            <Box py="md" px="md">
                <Group justify="space-between" align="start" wrap="nowrap">
                    <Stack gap={2} className="flex-1">
                        <Group gap="xs" align="center" wrap="nowrap">
                            <Title order={2} fw={800} className="text-3xl tracking-tight leading-none">
                                {profile.hoTen || profile.taiKhoan}
                            </Title>
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                radius="full"
                                onClick={handleShare}
                                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                <IconShare size={18} />
                            </ActionIcon>
                        </Group>
                        <Group gap={6} align="center">
                            <Text size="md" className="text-gray-900 dark:text-gray-100 font-medium">
                                {profile.taiKhoan}
                            </Text>
                            <Badge
                                variant="light"
                                color="gray"
                                size="sm"
                                radius="md"
                                className="normal-case font-normal text-gray-500 bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 hidden"
                            >
                                NHers.net
                            </Badge>
                        </Group>
                    </Stack>
                    <UserAvatar
                        src={profile.avatar}
                        size={84}
                        className="border border-gray-100 dark:border-zinc-800"
                    />
                </Group>

                {/* Bio (Currently using default text if no bio field, assuming 'description' or using a placeholder) */}
                <Box mt="md">
                    {profile.hoSoGiaoVien?.chuyenMon ? (
                        <Text className="text-gray-900 dark:text-gray-100">
                            Giáo viên - {profile.hoSoGiaoVien.chuyenMon}
                        </Text>
                    ) : profile.vaiTro === 'HOC_SINH' && profile.hoSoHocSinh?.lopHoc ? (
                        <Text className="text-gray-900 dark:text-gray-100">
                            Học sinh lớp {profile.hoSoHocSinh.lopHoc.tenLop}
                        </Text>
                    ) : (
                        <Text className="text-gray-900 dark:text-gray-100">
                            {/* Placeholder for bio if not available */}
                            {t('no_info')}
                        </Text>
                    )}
                </Box>

                {/* Followers & Link */}
                <Group mt="md" gap="md">
                    <Text size="sm" c="dimmed" className="hover:underline cursor-pointer">
                        {profile._count?.followers || 0} {t('followers').toLowerCase()}
                    </Text>
                    {/* Placeholder link */}
                    {/* <Group gap={2} className="cursor-pointer hover:opacity-75">
                         <IconLink size={14} className="text-gray-500"/>
                         <Text size="sm" c="dimmed">example.com</Text>
                     </Group> */}
                </Group>

                {/* Action Buttons */}
                <Group mt="lg" grow>
                    {isOwner ? (
                        <>
                            <Button
                                variant="default"
                                radius="md"
                                className="border-gray-300 dark:border-zinc-700 font-semibold"
                                onClick={() => setEditModalOpened(true)}
                            >
                                {t('edit')}
                            </Button>
                            <Button
                                variant="default"
                                radius="md"
                                className="border-gray-300 dark:border-zinc-700 font-semibold"
                                onClick={() => setSettingsOpened(true)}
                            >
                                {t('settings')}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                radius="md"
                                onClick={handleAction}
                                loading={statusMutation.isPending}
                                {...(buttonProps.variant === 'filled' ? { bg: 'black', c: 'white', className: "hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 border-transparent" } : { variant: 'default', className: "border-gray-300 dark:border-zinc-700 font-semibold" })}
                            >
                                {buttonProps.label}
                            </Button>
                            {statusData?.status === 'FRIEND' && (
                                <Button
                                    variant="default"
                                    radius="md"
                                    className="border-gray-300 dark:border-zinc-700 font-semibold"
                                    onClick={handleMessage}
                                >
                                    {t('message')}
                                </Button>
                            )}
                        </>
                    )}
                </Group>
            </Box>

            {/* Tabs Section */}
            <Box mt="sm">
                <Tabs
                    defaultValue="threads"
                    classNames={{
                        root: "w-full",
                        list: "w-full border-b border-gray-200 dark:border-zinc-800",
                        tab: "flex-1 font-bold text-gray-400 dark:text-gray-500 data-[active=true]:text-black dark:data-[active=true]:text-white border-b border-transparent data-[active=true]:border-black dark:data-[active=true]:border-white pb-3 hover:bg-transparent transition-colors text-[15px]",
                        panel: "pt-4"
                    }}
                >
                    <Tabs.List>
                        <Tabs.Tab value="threads">{t('posts')}</Tabs.Tab>
                        <Tabs.Tab value="reposts">{t('reposts')}</Tabs.Tab>
                        <Tabs.Tab value="about">{t('about')}</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="threads" px={0}>
                        {isOwner && (
                            <Box mb="md" px="md">
                                <Group align="center" wrap="nowrap" gap="sm" className="py-2">
                                    <UserAvatar src={user?.avatar} size={40} />
                                    <UnstyledButton
                                        className="flex-1 text-left"
                                        onClick={() => router.push(`${pathname}?create=true`, { scroll: false })}
                                    >
                                        <Box className="bg-gray-50 dark:bg-zinc-900/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors rounded-full px-4 py-2.5 cursor-text">
                                            <Text size="sm" c="dimmed" fw={400} className="text-gray-400 dark:text-gray-500">
                                                {t('start_thread')}
                                            </Text>
                                        </Box>
                                    </UnstyledButton>
                                </Group>
                                <Divider color="gray.1" className="dark:border-zinc-800 mt-2" />
                            </Box>
                        )}

                        {isLoadingThreads ? (
                            <BrandLoader size="sm" minHeight={200} />
                        ) : userThreads && userThreads.length > 0 ? (
                            <ThreadFeed threads={userThreads} />
                        ) : (
                            <Center py={60} className="text-center">
                                <Text c="dimmed" size="sm" className="font-light">{t('no_posts')}</Text>
                            </Center>
                        )}
                    </Tabs.Panel>

                    <Tabs.Panel value="replies">
                        <Center py={60} className="text-center">
                            <Text c="dimmed" size="sm" className="font-light">{t('no_replies')}</Text>
                        </Center>
                    </Tabs.Panel>

                    <Tabs.Panel value="reposts">
                        <Center py={60} className="text-center">
                            <Text c="dimmed" size="sm" className="font-light">{t('no_reposts')}</Text>
                        </Center>
                    </Tabs.Panel>

                    <Tabs.Panel value="about" pt="md">
                        <Stack gap="xl">
                            <Box>
                                <Title order={4} mb="md" className="text-gray-900 dark:text-white font-bold">{t('personalInfo')}</Title>
                                <Stack gap="xs">
                                    <InfoRow label={t('email')} value={profile.email} icon={null} />
                                    <InfoRow label={t('phone')} value={profile.soDienThoai} icon={null} />
                                    <InfoRow label={t('gender')} value={profile.gioiTinh === 'NAM' ? t('male') : t('female')} icon={null} />
                                    <InfoRow label={t('dateOfBirth')} value={profile.ngaySinh ? new Date(profile.ngaySinh).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US') : null} icon={null} />
                                    <InfoRow label={t('address')} value={profile.diaChi} icon={null} />
                                </Stack>
                            </Box>

                            {(profile.hoSoHocSinh || profile.hoSoGiaoVien) && (
                                <Box>
                                    <Title order={4} mb="md" className="text-gray-900 dark:text-white font-bold">{t('class')}</Title>
                                    <Stack gap="xs">
                                        {profile.hoSoHocSinh?.lopHoc && (
                                            <InfoRow label={t('class')} value={profile.hoSoHocSinh.lopHoc.tenLop} icon={null} />
                                        )}
                                        {profile.hoSoGiaoVien?.chuyenMon && (
                                            <InfoRow label={t('specialization')} value={profile.hoSoGiaoVien.chuyenMon} icon={null} />
                                        )}
                                    </Stack>
                                </Box>
                            )}

                            {!profile.email && !profile.soDienThoai && !profile.diaChi && (
                                <Text c="dimmed" size="sm" ta="center" py="xl">{t('no_info')}</Text>
                            )}
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Box>

            {isOwner && (
                <>
                    <EditProfileModal
                        opened={editModalOpened}
                        onClose={() => setEditModalOpened(false)}
                        profile={profile}
                    />
                    <SettingsDrawer
                        opened={settingsOpened}
                        onClose={() => setSettingsOpened(false)}
                        user={user}
                        onLogout={() => {
                            logout();
                            router.push(`/${locale}/login`);
                        }}
                    />
                </>
            )}
        </Container>
    );
}

function InfoRow({ label, value, icon }: { label: string, value: any, icon?: any }) {
    if (!value) return null;
    return (
        <Group justify="space-between" align="center" py={8} className="border-b border-gray-100 dark:border-zinc-800 last:border-0">
            <Text size="sm" c="dimmed">{label}</Text>
            <Text size="sm" fw={500} className="text-gray-900 dark:text-gray-100">{value}</Text>
        </Group>
    );
}
