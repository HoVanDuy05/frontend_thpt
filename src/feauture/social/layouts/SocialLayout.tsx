import { ActionIcon, Avatar, Box, Button, Group, Stack, Text, TextInput, Tooltip, UnstyledButton, ScrollArea, Indicator, Image as MantineImage, Drawer, Badge } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconHome, IconSearch, IconBell, IconUser, IconMessageCircle, IconHeart, IconTrendingUp, IconUsers, IconPlus, IconCompass, IconSettings, IconArrowLeft } from '@tabler/icons-react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { ReactNode, useState, useEffect } from 'react';
import { useAppStore } from '@/providers/store/useAppStore';
import { useTranslations } from 'next-intl';
import { useSocket } from '@/shared/hooks/useSocket';
import { CreateThread } from '../components/CreateThread';
import { UserAvatar } from '../components/UserAvatar';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { useSearchParams } from 'next/navigation';
import { AppQuery } from '@/api/AppQuery';

interface SocialLayoutProps {
    children: ReactNode;
}

export const SocialLayout = ({ children }: SocialLayoutProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAppStore();
    const t = useTranslations('social');
    const searchParams = useSearchParams();
    const createThreadMutation = AppMutation().social.useCreateThread();
    const followMutation = AppMutation().social.useFollowUser();
    const { on, off, isConnected } = useSocket();

    // Unified Notification Counts from API
    const { data: receivedRequests, refetch: refetchRequests } = AppQuery.friends.useReceivedRequests();
    const { data: serverNotifications, refetch: refetchActivities } = AppQuery.auth.useNotifications();
    const { data: channels } = AppQuery.chat.useChannels();

    const [friendRequestCount, setFriendRequestCount] = useState(0);
    const [activityCount, setActivityCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);

    // Right Sidebar Data
    const { data: trendingData } = AppQuery.social.useTrending();
    const { data: suggestedUsers, refetch: refetchSuggested } = AppQuery.social.useSuggestedUsers({ limit: 5 });

    const [hasNewFriendRequest, setHasNewFriendRequest] = useState(false);
    const [hasNewActivity, setHasNewActivity] = useState(false);

    // Synchronize unseen activities from server on initial load
    useEffect(() => {
        if (serverNotifications) {
            const unread = serverNotifications.filter((n: any) => !n.daXem);
            if (unread.length > 0) setHasNewActivity(true);
        }
    }, [serverNotifications]);

    // Reset flags when navigating
    useEffect(() => {
        if (pathname === '/social/friends') setHasNewFriendRequest(false);
        if (pathname === '/social/activity') setHasNewActivity(false);
    }, [pathname]);

    // Check if drawer should be open based on URL
    const isCreateDrawerOpen = searchParams.get('create') === 'true';

    // Persistent seen status
    useEffect(() => {
        if (receivedRequests) {
            setFriendRequestCount(receivedRequests.length);
            const lastSeen = Number(localStorage.getItem('lastSeenFriends') || 0);
            if (receivedRequests.length > lastSeen) {
                setHasNewFriendRequest(true);
            } else if (receivedRequests.length === 0) {
                setHasNewFriendRequest(false);
            }
        }
    }, [receivedRequests]);

    useEffect(() => {
        if (serverNotifications) {
            const unread = serverNotifications.filter((n: any) => !n.daXem).length;
            setActivityCount(unread);
            const lastSeen = Number(localStorage.getItem('lastSeenActivities') || 0);
            if (unread > lastSeen) {
                setHasNewActivity(true);
            } else if (unread === 0) {
                setHasNewActivity(false);
            }
        }
    }, [serverNotifications]);

    useEffect(() => {
        if (pathname === '/social/friends' && receivedRequests) {
            setHasNewFriendRequest(false);
            localStorage.setItem('lastSeenFriends', receivedRequests.length.toString());
        }
        if (pathname === '/social/activity' && serverNotifications) {
            setHasNewActivity(false);
            const unread = serverNotifications.filter((n: any) => !n.daXem).length;
            localStorage.setItem('lastSeenActivities', unread.toString());
        }
    }, [pathname, receivedRequests, serverNotifications]);

    // Real-time notifications
    useEffect(() => {
        if (!isConnected) return;

        const handleFriendRequest = () => {
            refetchRequests();
            setHasNewFriendRequest(true);
            notifications.show({
                title: t('nav.friends'),
                message: 'Bạn có lời mời kết bạn mới',
                color: 'indigo'
            });
        };

        const handleActivity = () => {
            refetchActivities();
            setHasNewActivity(true);
        };

        on('friend:request', handleFriendRequest);
        on('activity:new', handleActivity);

        return () => {
            off('friend:request', handleFriendRequest);
            off('activity:new', handleActivity);
        };
    }, [isConnected, on, off, refetchRequests, refetchActivities, t]);

    // Explicitly enforce 'Be Vietnam Pro' for premium feel
    const fontStyle = { fontFamily: 'var(--font-be-vietnam), sans-serif' };

    const navItems = [
        { label: t('nav.home'), icon: IconHome, link: '/social', exact: true },
        { label: t('nav.explore'), icon: IconCompass, link: '/social/explore' },
        { label: t('nav.friends'), icon: IconUsers, link: '/social/friends' },
        // Middle "Create" button placeholder for visual loop
        { label: 'CREATE_BUTTON', icon: IconPlus, link: '#' },
        { label: t('nav.messages'), icon: IconMessageCircle, link: '/chat' },
        { label: t('nav.activities'), icon: IconHeart, link: '/social/activity' },
        { label: t('nav.profile'), icon: UserAvatar, link: `/social/profile/${user?.id}` },
    ];

    // Filter out "Create" button for desktop sidebar list, handle separate
    const desktopNavItems = navItems.filter(item => item.label !== 'CREATE_BUTTON');

    const handleCreateClick = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`${pathname}?create=true`, { scroll: false });
    };

    const handleCreateClose = () => {
        router.push(pathname, { scroll: false });
    };

    const handlePost = async (content: string, image?: string) => {
        try {
            await createThreadMutation.mutateAsync({ noiDung: content, hinhAnh: image });
            notifications.show({
                title: 'Thành công',
                message: 'Bài viết đã được đăng',
                color: 'green'
            });
            handleCreateClose();
        } catch (error) {
            notifications.show({
                title: 'Lỗi',
                message: 'Không thể đăng bài. Vui lòng thử lại.',
                color: 'red'
            });
        }
    };

    const handleFollow = async (id: number) => {
        try {
            await followMutation.mutateAsync({ urlParams: { id } });
            notifications.show({
                title: 'Thành công',
                message: 'Đã theo dõi người dùng',
                color: 'green'
            });
            refetchSuggested();
        } catch (error) {
            notifications.show({
                title: 'Lỗi',
                message: 'Không thể thực hiện yêu cầu',
                color: 'red'
            });
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-indigo-100 selection:text-indigo-900" style={fontStyle}>
            {/* Create Post Drawer Global */}
            <Drawer
                opened={isCreateDrawerOpen}
                onClose={handleCreateClose}
                position="bottom"
                size="100%"
                radius={0}
                withCloseButton={false}
                transitionProps={{ duration: 300, transition: 'slide-up' }}
                classNames={{
                    content: 'bg-white dark:bg-black',
                    body: 'p-0 h-full flex flex-col',
                }}
            >
                <Box h="100%">
                    <CreateThread
                        onPost={handlePost}
                        loading={createThreadMutation.isPending}
                        placeholder={t('create_placeholder')}
                        variant="drawer"
                        onCancel={handleCreateClose}
                    />
                </Box>
            </Drawer>

            <div className="max-w-[1350px] mx-auto h-screen flex">

                {/* Left Sidebar - Navigation (Desktop only) */}
                <div className="hidden md:flex w-[300px] shrink-0 flex-col h-full border-r border-gray-100 dark:border-zinc-800 pt-6 pb-6 px-4 sticky top-0 bg-white dark:bg-black z-20">
                    <div className="px-4 mb-8 flex items-center gap-3">
                        <MantineImage src="/favicon.png" w={38} h={38} />
                        <Text size="xl" fw={800} className="tracking-tight text-black dark:text-white" style={fontStyle}>
                            Social
                        </Text>
                    </div>

                    <Stack gap={8} className="flex-1 px-2">
                        {desktopNavItems.map((item) => {
                            const isActive = item.exact ? pathname === item.link : pathname.startsWith(item.link);
                            return (
                                <Link href={item.link} key={item.link} className="no-underline">
                                    <UnstyledButton
                                        className={`w-full py-4 px-5 rounded-2xl flex items-center gap-5 transition-all duration-300 group relative overflow-hidden
                                            ${isActive
                                                ? 'bg-indigo-50 dark:bg-indigo-950/30 font-bold'
                                                : 'hover:bg-black/5 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        <Indicator
                                            color="red"
                                            disabled={
                                                !(
                                                    (item.label === t('nav.friends') && hasNewFriendRequest) ||
                                                    (item.label === t('nav.activities') && hasNewActivity)
                                                )
                                            }
                                            label={
                                                item.label === t('nav.friends') ? (friendRequestCount > 9 ? '9+' : friendRequestCount) :
                                                    item.label === t('nav.activities') ? (activityCount > 9 ? '9+' : activityCount) : null
                                            }
                                            size={18}
                                            offset={2}
                                            withBorder
                                            styles={{ indicator: { fontSize: '10px', fontWeight: 700 } }}
                                        >
                                            {item.label === t('nav.profile') ? (
                                                <UserAvatar
                                                    src={user?.avatar}
                                                    size={26}
                                                    className={`${isActive ? 'ring-2 ring-black dark:ring-white scale-110' : 'group-hover:scale-110'} transition-all duration-300`}
                                                />
                                            ) : (
                                                <item.icon
                                                    size={26}
                                                    stroke={isActive ? 2.5 : 1.8}
                                                    className={isActive
                                                        ? 'text-indigo-600 dark:text-indigo-400 scale-110 transition-transform duration-300'
                                                        : 'text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white group-hover:scale-110 transition-all duration-300'}
                                                />
                                            )}
                                        </Indicator>
                                        <Text
                                            size="lg"
                                            style={fontStyle}
                                            className={isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-medium transition-colors'}
                                        >
                                            {item.label}
                                        </Text>
                                    </UnstyledButton>
                                </Link>
                            );
                        })}

                        {/* Centered Create Button for Desktop Sidebar */}
                        <Tooltip label={t('nav.create')} position="right" withArrow>
                            <UnstyledButton
                                onClick={handleCreateClick}
                                className="mt-8 mx-2 py-4 px-5 rounded-2xl flex items-center gap-5 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 group"
                            >
                                <div className="w-[26px] h-[26px] flex items-center justify-center border-2 border-black dark:border-white rounded-md group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300">
                                    <IconPlus size={18} className="text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300" stroke={3} />
                                </div>
                                <Text size="lg" fw={700} className="text-black dark:text-white" style={fontStyle}>{t('nav.create')}</Text>
                            </UnstyledButton>
                        </Tooltip>

                    </Stack>

                    <div className="mt-auto px-2">
                        <UnstyledButton component={Link} href="/settings" className="w-full py-4 px-5 rounded-2xl flex items-center gap-5 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 group">
                            <IconSettings size={26} stroke={1.8} className="text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                            <Text size="lg" fw={500} className="text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white" style={fontStyle}>
                                {t('nav.settings')}
                            </Text>
                        </UnstyledButton>
                    </div>
                </div>

                {/* Center Content - Feed / Page */}
                <div className="flex-1 w-full border-r border-gray-100 dark:border-zinc-800 overflow-y-auto no-scrollbar relative min-w-0">
                    {/* Glassmorphism Header for Mobile */}
                    <div className="sticky top-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 px-4 py-3 flex items-center justify-between md:hidden transition-all">
                        <div className="flex items-center gap-3">
                            <MantineImage src="/favicon.png" w={32} h={32} />
                            <Text size="xl" fw={900} className="tracking-tight" style={fontStyle}>Social</Text>
                        </div>
                        <Group gap="sm">
                            <ActionIcon variant="transparent" color="gray" component={Link} href="/social/activity">
                                <Indicator
                                    color="red"
                                    offset={2}
                                    label={activityCount > 0 ? (activityCount > 9 ? '9+' : activityCount) : null}
                                    disabled={!hasNewActivity}
                                    size={16}
                                    withBorder
                                    styles={{ indicator: { fontSize: '8px', fontWeight: 800, padding: 0 } }}
                                >
                                    <IconHeart size={26} stroke={1.5} className="text-black dark:text-white" />
                                </Indicator>
                            </ActionIcon>
                            <ActionIcon variant="transparent" color="gray" component={Link} href="/chat">
                                <Indicator
                                    color="red"
                                    offset={2}
                                    label={messageCount > 0 ? (messageCount > 9 ? '9+' : messageCount) : null}
                                    disabled={messageCount === 0}
                                    size={16}
                                    withBorder
                                    styles={{ indicator: { fontSize: '8px', fontWeight: 800, padding: 0 } }}
                                >
                                    <IconMessageCircle size={26} stroke={1.5} className="text-black dark:text-white" />
                                </Indicator>
                            </ActionIcon>
                        </Group>
                    </div>

                    <div className="pb-24 md:pb-0">
                        {children}
                    </div>
                </div>

                {/* Right Sidebar - Widgets (Desktop only) */}
                <div className="hidden lg:flex w-[380px] pl-10 py-8 pr-6 flex-col gap-8 h-screen sticky top-0 overflow-y-auto no-scrollbar">
                    <TextInput
                        placeholder={t('widgets.search_placeholder')}
                        radius="xl"
                        size="md"
                        leftSection={<IconSearch size={18} className="text-gray-400" />}
                        classNames={{
                            input: 'bg-gray-100 dark:bg-zinc-900 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300 font-medium'
                        }}
                    />

                    <Box>
                        <Text fw={800} size="xl" mb="lg" style={fontStyle}>{t('widgets.suggested')}</Text>
                        <Stack gap="md">
                            {suggestedUsers?.map((suggested: any) => (
                                <Group key={suggested.id} justify="space-between" className="hover:bg-black/5 dark:hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
                                    <Link href={`/social/profile/${suggested.id}`} className="no-underline text-inherit flex-1">
                                        <Group gap="sm">
                                            <Indicator inline size={10} offset={4} position="bottom-end" color="green" withBorder>
                                                <UserAvatar src={suggested.avatar} size="md" />
                                            </Indicator>
                                            <div>
                                                <Text size="sm" fw={700} style={fontStyle}>{suggested.hoTen}</Text>
                                                <Text size="xs" c="dimmed">@{suggested.taiKhoan}</Text>
                                            </div>
                                        </Group>
                                    </Link>
                                    <Button
                                        variant="light"
                                        radius="xl"
                                        size="xs"
                                        color="black"
                                        className="dark:bg-white dark:text-black hover:opacity-80 font-bold px-4 h-8"
                                        onClick={() => handleFollow(suggested.id)}
                                    >
                                        {t('widgets.follow')}
                                    </Button>
                                </Group>
                            ))}
                        </Stack>
                    </Box>
                </div>

            </div>

            {/* Mobile Bottom Navigation with centered Plus */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-t border-gray-100 dark:border-zinc-800 pb-[env(safe-area-inset-bottom)] z-50 overflow-visible">
                <div className="flex items-center justify-between px-4 h-[60px] overflow-visible">
                    {/* Define specific mobile nav items for 2-1-2 balance */}
                    {[
                        navItems.find(i => i.label === t('nav.home')),
                        navItems.find(i => i.label === t('nav.friends')),
                        { label: 'CREATE_BUTTON', icon: IconPlus, link: '#' },
                        navItems.find(i => i.label === t('nav.explore')),
                        navItems.find(i => i.label === t('nav.profile'))
                    ].filter(Boolean).map((item: any, index) => {
                        if (item.label === 'CREATE_BUTTON') {
                            return (
                                <div key="create-btn" className="relative flex flex-col items-center justify-center w-full -mt-10 overflow-visible">
                                    <UnstyledButton
                                        onClick={handleCreateClick}
                                        className="relative z-50"
                                    >
                                        <div className="w-14 h-14 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-xl shadow-black/20 dark:shadow-white/10 active:scale-95 transition-transform border-[4px] border-white dark:border-black ring-1 ring-black/5 dark:ring-white/10">
                                            <IconPlus size={28} className="text-white dark:text-black" stroke={3} />
                                        </div>
                                    </UnstyledButton>
                                </div>
                            );
                        }

                        const isActive = item.exact ? pathname === item.link : pathname.startsWith(item.link);
                        const isNewItem = (item.label === t('nav.friends') && hasNewFriendRequest) ||
                            (item.label === t('nav.activities') && hasNewActivity);
                        const badgeCount = item.label === t('nav.friends') ? friendRequestCount : activityCount;

                        return (
                            <Link href={item.link} key={index} className="w-full">
                                <div className="flex flex-col items-center justify-center gap-1 py-1 relative">
                                    <Indicator
                                        color="red"
                                        disabled={!isNewItem}
                                        label={badgeCount > 9 ? '9+' : badgeCount}
                                        size={16}
                                        offset={2}
                                        withBorder
                                        styles={{ indicator: { fontSize: '9px', fontWeight: 700 } }}
                                    >
                                        {item.label === t('nav.profile') ? (
                                            <UserAvatar
                                                src={user?.avatar}
                                                size={24}
                                                className={`${isActive ? 'ring-2 ring-black dark:ring-white scale-110' : ''} transition-all duration-300`}
                                            />
                                        ) : (
                                            <item.icon
                                                size={24}
                                                stroke={isActive ? 2.5 : 2}
                                                className={isActive ? 'text-indigo-600 dark:text-indigo-400 scale-110 transition-transform' : 'text-gray-400 dark:text-gray-500'}
                                            />
                                        )}
                                    </Indicator>
                                    <Text
                                        size="10px"
                                        fw={isActive ? 700 : 500}
                                        className={`${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-600'} transition-colors leading-none mt-0.5`}
                                        style={fontStyle}
                                    >
                                        {item.label}
                                    </Text>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div >
        </div >
    );
};
