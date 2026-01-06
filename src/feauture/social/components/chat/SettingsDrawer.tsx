import { Drawer, Stack, Text, Avatar, Group, UnstyledButton, Divider, Switch, useMantineColorScheme, Box, ActionIcon, SegmentedControl } from "@mantine/core";
import { IconUser, IconShieldLock, IconBell, IconMoon, IconLogout, IconChevronRight, IconX, IconLanguage, IconWorld, IconSchool } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { TUser } from "@/shared/types/user.type";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

interface SettingsDrawerProps {
    opened: boolean;
    onClose: () => void;
    user: TUser | null;
    onLogout?: () => void;
}

export const SettingsDrawer = ({ opened, onClose, user, onLogout }: SettingsDrawerProps) => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const isMobile = useMediaQuery('(max-width: 768px)');
    const t = useTranslations('chat');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    // Explicitly enforce the font family
    const fontStyle = { fontFamily: 'var(--font-be-vietnam), sans-serif' };

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            size={isMobile ? "100%" : "md"}
            position="left"
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            transitionProps={{ transition: 'slide-right', duration: 300, timingFunction: 'ease' }}
            styles={{
                content: {
                    backgroundColor: dark ? '#242526' : '#FFFFFF',
                    color: dark ? '#E4E6EB' : '#050505',
                    ...fontStyle
                },
                body: { padding: 0, ...fontStyle },
                header: { ...fontStyle },
                title: { ...fontStyle }
            }}
        >
            <div className="flex flex-col h-full bg-white dark:bg-[#1c1e21]">
                {/* Header */}
                <div className="h-[68px] px-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 shrink-0">
                    <Text size="22px" fw={800} style={{ fontFamily: 'var(--font-be-vietnam), sans-serif', letterSpacing: '-0.5px' }}>{t('settings.title')}</Text>
                    <UnstyledButton onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                        <IconX size={22} className="text-gray-500" />
                    </UnstyledButton>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center py-8 px-4 bg-gradient-to-b from-transparent to-gray-50/10 dark:to-zinc-800/20">
                        <div className="relative group cursor-pointer">
                            <Avatar
                                src={user?.avatar}
                                size={100}
                                radius={999}
                                className="shadow-xl ring-4 ring-white dark:ring-zinc-800 group-hover:brightness-90 transition-all duration-300"
                            />
                            <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                <IconUser size={24} className="text-white" />
                            </div>
                        </div>
                        <Text size="17px" fw={700} mt="md" className="text-gray-900 dark:text-white mb-[-2px]" style={fontStyle}>
                            {user?.hoTen || user?.taiKhoan || t('you')}
                        </Text>
                        <Text size="sm" c="dimmed" style={fontStyle}>{user?.email}</Text>
                    </div>

                    <Stack p="md" gap="xl">
                        {/* Section: Navigation */}
                        <div className="mt-2">
                            <Text c="dimmed" size="13px" fw={600} className="px-3 mb-2 uppercase tracking-wider" style={fontStyle}>{t('settings.navigation')}</Text>
                            <Stack gap={2}>
                                <SettingsItem
                                    icon={<IconWorld size={20} />}
                                    label={t('settings.social')}
                                    color="#1877F2"
                                    onClick={() => router.push('/social')}
                                />
                                <SettingsItem
                                    icon={<IconSchool size={20} />}
                                    label={t('settings.pms')}
                                    color="#FA383E"
                                    onClick={() => router.push(user?.vaiTro === 'HOC_SINH' ? '/student' : '/admin/dashboard')}
                                />
                            </Stack>
                        </div>

                        {/* Section: General */}
                        <div className="mt-2">
                            <Text c="dimmed" size="13px" fw={600} className="px-3 mb-2 uppercase tracking-wider" style={fontStyle}>{t('settings.general')}</Text>
                            <Stack gap={2}>
                                <SettingsItem
                                    icon={<IconUser size={20} />}
                                    label={t('settings.profile')}
                                    color="#1877F2"
                                    onClick={() => router.push(`/ social / profile / ${user?.id} `)}
                                />
                                <SettingsItem
                                    icon={<IconShieldLock size={20} />}
                                    label={t('settings.privacy_security')}
                                    color="#42B72A"
                                />
                                <SettingsItem
                                    icon={<IconBell size={20} />}
                                    label={t('settings.notifications')}
                                    color="#F02849"
                                />
                            </Stack>
                        </div>

                        {/* Section: Preferences */}
                        <div className="mt-2">
                            <Text c="dimmed" size="13px" fw={600} className="px-3 mb-2 uppercase tracking-wider" style={fontStyle}>{t('settings.preferences')}</Text>

                            <Stack gap={2}>
                                {/* Dark Mode */}
                                <UnstyledButton
                                    onClick={() => toggleColorScheme()}
                                    className="w-full h-14 px-3 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all"
                                >
                                    <Group gap="md">
                                        <div className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-full">
                                            <IconMoon size={20} className={dark ? 'text-blue-400' : 'text-gray-600'} />
                                        </div>
                                        <Text size="15px" fw={600} style={fontStyle}>{t('settings.dark_mode')}</Text>
                                    </Group>
                                    <Switch
                                        checked={dark}
                                        onChange={() => toggleColorScheme()}
                                        size="md"
                                        styles={{ track: { cursor: 'pointer' } }}
                                    />
                                </UnstyledButton>

                                {/* Language Switcher */}
                                <UnstyledButton
                                    component="div"
                                    className="w-full h-14 px-3 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all outline-none"
                                >
                                    <Group gap="md">
                                        <div className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-full">
                                            <IconLanguage size={20} className="text-orange-500" />
                                        </div>
                                        <Text size="15px" fw={600} style={fontStyle}>{t('settings.language')}</Text>
                                    </Group>
                                    <SegmentedControl
                                        value={locale}
                                        onChange={(val) => router.replace(pathname, { locale: val })}
                                        data={[
                                            { label: 'VI', value: 'vi' },
                                            { label: 'EN', value: 'en' },
                                        ]}
                                        size="xs"
                                        radius="xl"
                                        classNames={{
                                            root: 'bg-gray-100 dark:bg-zinc-800 border-0',
                                            indicator: 'bg-white dark:bg-zinc-700 shadow-sm',
                                            control: 'border-0'
                                        }}
                                        styles={{
                                            label: { ...fontStyle, fontWeight: 700, padding: '4px 10px' }
                                        }}
                                    />
                                </UnstyledButton>
                            </Stack>
                        </div>

                        {/* Section: Danger Zone */}
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                            <SettingsItem
                                icon={<IconLogout size={20} />}
                                label="Đăng xuất"
                                color="#808080"
                                onClick={onLogout}
                            />
                        </div>
                    </Stack>
                </div>
            </div>
        </Drawer>
    );
};

const SettingsItem = ({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick?: () => void }) => (
    <UnstyledButton
        onClick={onClick}
        className="w-full h-14 px-3 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all group"
    >
        <Group gap="md">
            <div
                className="w-9 h-9 flex items-center justify-center rounded-full shadow-sm"
                style={{ backgroundColor: color }}
            >
                <div className="text-white">
                    {icon}
                </div>
            </div>
            <Text size="15px" fw={600} style={{ fontFamily: 'var(--font-be-vietnam), sans-serif' }}>{label}</Text>
        </Group>
        <IconChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
    </UnstyledButton>
);
