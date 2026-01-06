import { ActionIcon, Avatar, Box, Button, Group, Stack, Text, TextInput, Tooltip, UnstyledButton, ScrollArea, Indicator, Image as MantineImage, Drawer } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconHome, IconSearch, IconBell, IconUser, IconMessageCircle, IconHeart, IconTrendingUp, IconUsers, IconPlus, IconCompass, IconSettings, IconArrowLeft } from '@tabler/icons-react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { ReactNode } from 'react';
import { useAppStore } from '@/providers/store/useAppStore';
import { useTranslations } from 'next-intl';
import { CreateThread } from '../components/CreateThread';
import { UserAvatar } from '../components/UserAvatar';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { useSearchParams } from 'next/navigation';

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

    // Check if drawer should be open based on URL
    const isCreateDrawerOpen = searchParams.get('create') === 'true';

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
                <div className="hidden md:flex w-[280px] flex-col h-full border-r border-gray-100 dark:border-zinc-800 pt-6 pb-6 px-4 sticky top-0 bg-white dark:bg-black z-20">
                    <div className="px-4 mb-4 flex items-center gap-3">
                        <MantineImage src="/favicon.png" w={38} h={38} />
                        <Text size="xl" fw={800} className="tracking-tight text-black dark:text-white" style={fontStyle}>
                            Social
                        </Text>
                    </div>

                    <Stack gap={2} className="flex-1 px-2">
                        {desktopNavItems.map((item) => {
                            const isActive = item.exact ? pathname === item.link : pathname.startsWith(item.link);
                            return (
                                <Link href={item.link} key={item.link} className="no-underline">
                                    <UnstyledButton
                                        className={`w-full p-3.5 rounded-2xl flex items-center gap-4 transition-all duration-300 group relative overflow-hidden
                                            ${isActive
                                                ? 'bg-black/5 dark:bg-white/10 font-bold'
                                                : 'hover:bg-black/5 dark:hover:bg-white/5'
                                            }`}
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
                                                    ? 'text-black dark:text-white scale-110 transition-transform duration-300'
                                                    : 'text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white group-hover:scale-110 transition-all duration-300'}
                                            />
                                        )}
                                        <Text
                                            size="lg"
                                            style={fontStyle}
                                            className={isActive ? 'text-black dark:text-white font-bold' : 'text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white font-medium transition-colors'}
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
                                className="mt-4 mx-2 p-3.5 rounded-2xl flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 group"
                            >
                                <div className="w-[26px] h-[26px] flex items-center justify-center border-2 border-black dark:border-white rounded-md group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300">
                                    <IconPlus size={18} className="text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300" stroke={3} />
                                </div>
                                <Text size="lg" fw={700} className="text-black dark:text-white" style={fontStyle}>{t('nav.create')}</Text>
                            </UnstyledButton>
                        </Tooltip>

                    </Stack>

                    <div className="mt-auto px-2">
                        <UnstyledButton component={Link} href="/settings" className="w-full p-3.5 rounded-2xl flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 group">
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
                        <Group gap="xs">
                            <ActionIcon variant="transparent" color="gray" component={Link} href="/social/activity">
                                <IconHeart size={26} stroke={1.5} className="text-black dark:text-white" />
                            </ActionIcon>
                            <ActionIcon variant="transparent" color="gray" component={Link} href="/chat">
                                <IconMessageCircle size={26} stroke={1.5} className="text-black dark:text-white" />
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

                    <Box className="bg-gray-50/50 dark:bg-zinc-900/50 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800">
                        <Text fw={800} size="xl" mb="lg" style={fontStyle}>{t('widgets.trending')}</Text>
                        <Stack gap="lg">
                            {[1, 2, 3, 4].map((i) => (
                                <Group key={i} justify="space-between" className="cursor-pointer group">
                                    <div className="flex-1">
                                        <Text size="xs" c="dimmed" fw={600} className="mb-0.5">Trending in Vietnam</Text>
                                        <Text size="md" fw={700} className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">#SchoolLife</Text>
                                        <Text size="xs" c="dimmed" mt={2}>{t('widgets.trending_subtitle', { count: '12.5K' })}</Text>
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
                                        <IconTrendingUp size={16} className="text-gray-400" />
                                    </div>
                                </Group>
                            ))}
                        </Stack>
                    </Box>

                    <Box>
                        <Text fw={800} size="xl" mb="lg" style={fontStyle}>{t('widgets.suggested')}</Text>
                        <Stack gap="md">
                            {[1, 2, 3].map((i) => (
                                <Group key={i} justify="space-between" className="hover:bg-black/5 dark:hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
                                    <Group gap="sm">
                                        <Indicator inline size={10} offset={4} position="bottom-end" color="green" withBorder>
                                            <Avatar radius="full" size="md" />
                                        </Indicator>
                                        <div>
                                            <Text size="sm" fw={700} style={fontStyle}>User Name</Text>
                                            <Text size="xs" c="dimmed">@username</Text>
                                        </div>
                                    </Group>
                                    <Button variant="light" radius="xl" size="xs" color="black" className="dark:bg-white dark:text-black hover:opacity-80 font-bold px-4 h-8">{t('widgets.follow')}</Button>
                                </Group>
                            ))}
                        </Stack>
                    </Box>

                    <Text size="xs" c="dimmed" className="px-2">
                        © 2024 Nguyen Hue Social Network. All rights reserved.
                    </Text>
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
                        return (
                            <Link href={item.link} key={index} className="w-full">
                                <div className="flex flex-col items-center justify-center gap-1 py-1">
                                    {item.label === t('nav.profile') ? (
                                        <UserAvatar
                                            src={user?.avatar}
                                            size={26}
                                            className={`${isActive ? 'ring-2 ring-black dark:ring-white scale-110' : ''} transition-all duration-300`}
                                        />
                                    ) : (
                                        <item.icon
                                            size={26}
                                            stroke={isActive ? 2.5 : 2}
                                            className={isActive ? 'text-black dark:text-white scale-110 transition-transform' : 'text-gray-400 dark:text-gray-500'}
                                        />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
