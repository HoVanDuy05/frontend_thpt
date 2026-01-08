import { Box, Stack, Avatar, Text, Group, Divider, Accordion, UnstyledButton, Button, ActionIcon, ScrollArea, ThemeIcon, Tooltip } from "@mantine/core";
import { IconBell, IconSearch, IconUser, IconPalette, IconMoodSmile, IconPhoto, IconFile, IconLink, IconShieldLock, IconInfoCircle, IconArrowLeft, IconBlockquote, IconBan, IconChevronDown } from "@tabler/icons-react";
import { TChannel } from "@/api/types/api.type";
import { useTranslations } from "next-intl";

interface ChannelInfoSidebarProps {
    channel: TChannel;
    currentUserId?: number;
    getChannelName: (channel: TChannel, currentUserId?: number) => string;
    getChannelAvatar: (channel: TChannel, currentUserId?: number) => string | null | undefined;
    presenceMap: Record<number, boolean>;
}

export const ChannelInfoSidebar = ({ channel, currentUserId, getChannelName, getChannelAvatar, presenceMap }: ChannelInfoSidebarProps) => {
    const t = useTranslations('chat');

    const name = getChannelName(channel, currentUserId);
    const avatar = getChannelAvatar(channel, currentUserId);

    // Logic for presence
    const otherMember = channel.thanhViens?.find(m => Number(m.nguoiDungId) !== Number(currentUserId));
    const isOnline = otherMember && presenceMap[otherMember.nguoiDungId];

    // Explicitly enforce the font family
    const fontStyle = { fontFamily: 'var(--font-be-vietnam), sans-serif' };

    return (
        <Stack gap={0} className="w-full h-full bg-white dark:bg-[#1c1e21]">
            <ScrollArea scrollbarSize={4} className="h-full">
                {/* Header / Avatar Section */}
                <Stack align="center" gap={4} py={32} px="md">
                    <Box className="relative mb-2">
                        <Avatar
                            src={avatar}
                            size={100}
                            radius={999}
                            className="shadow-sm border-[4px] border-white dark:border-zinc-800"
                        />
                        {isOnline && (
                            <Box className="absolute bottom-1 right-2 w-5 h-5 bg-green-500 border-[3px] border-white dark:border-[#1c1e21] rounded-full" />
                        )}
                    </Box>

                    <Text fw={700} size="20px" className="text-gray-900 dark:text-gray-100 text-center px-4 leading-tight" style={fontStyle}>
                        {name}
                    </Text>
                    <Text size="sm" c="dimmed" fw={400} style={fontStyle}>
                        {isOnline ? t('active_now') : t('offline')}
                    </Text>

                    <Group mt="lg" gap={20} justify="center">
                        <SidebarActionItem icon={<IconUser size={20} />} label={t('sidebar.profile')} />
                        <SidebarActionItem icon={<IconBell size={20} />} label={t('sidebar.mute')} />
                        <SidebarActionItem icon={<IconSearch size={20} />} label={t('sidebar.search')} />
                    </Group>
                </Stack>

                {/* Sections */}
                <Stack gap={0}>
                    <Accordion
                        variant="default"
                        defaultValue="customize"
                        styles={{
                            item: { borderBottom: 'none' },
                            control: { padding: '12px 16px', '&:hover': { backgroundColor: 'var(--mantine-color-gray-0)' } },
                            content: { padding: '0 8px 16px 8px' },
                            label: { fontSize: '13px', fontWeight: 600, color: 'var(--mantine-color-dimmed)' },
                            chevron: { width: 16, height: 16 }
                        }}
                        chevron={<IconChevronDown size={16} />}
                    >
                        {/* Customize Chat */}
                        <Accordion.Item value="customize">
                            <Accordion.Control>{t('sidebar.customize_chat')}</Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={2}>
                                    <SidebarMenuButton icon={<IconPalette size={20} className="text-[#6366f1]" />} label={t('sidebar.theme')} />
                                    <SidebarMenuButton icon={<IconMoodSmile size={20} className="text-[#6366f1]" />} label={t('sidebar.quick_emoji')} />
                                    <SidebarMenuButton icon={<IconBlockquote size={20} />} label="Biệt danh" />
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>

                        {/* Media & Files */}
                        <Accordion.Item value="media">
                            <Accordion.Control>{t('sidebar.media_files_links')}</Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={12} px={4}>
                                    <Box className="grid grid-cols-3 gap-1">
                                        {[1, 2, 3].map(i => (
                                            <Box key={i} className="aspect-square bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-90">
                                                <Box className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <IconPhoto size={24} />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                    <SidebarMenuButton icon={<IconFile size={20} />} label="File" />
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>

                        {/* Privacy & Support */}
                        <Accordion.Item value="privacy">
                            <Accordion.Control>{t('sidebar.privacy_support')}</Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={2}>
                                    <SidebarMenuButton icon={<IconShieldLock size={20} />} label={t('sidebar.encryption_notice')} />
                                    <SidebarMenuButton icon={<IconBan size={20} />} label={t('sidebar.block')} danger />
                                    <SidebarMenuButton icon={<IconInfoCircle size={20} />} label={t('sidebar.report')} />
                                    <SidebarMenuButton icon={<IconBan size={20} />} label={t('sidebar.delete_chat')} danger />
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Stack>
            </ScrollArea>
        </Stack>
    );
};

const SidebarActionItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <Stack gap={6} align="center" className="cursor-pointer group">
        <Box className="w-[44px] h-[44px] bg-[#E4E6EB] dark:bg-[#3A3B3C] group-hover:opacity-80 rounded-full flex items-center justify-center transition-all duration-200 text-black dark:text-gray-200">
            {icon}
        </Box>
        <Text size="11px" c="dimmed" fw={500} className="group-hover:text-black dark:group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-be-vietnam), sans-serif' }}>
            {label}
        </Text>
    </Stack>
);

const SidebarMenuButton = ({ icon, label, danger, rightSection }: { icon: React.ReactNode, label: string, danger?: boolean, rightSection?: React.ReactNode }) => (
    <UnstyledButton className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${danger ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
        <Group gap="md">
            <Box className={`${danger ? 'text-red-500' : 'text-black dark:text-gray-200'}`}>
                {icon}
            </Box>
            <Text size="14px" fw={500} className={danger ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'} style={{ fontFamily: 'var(--font-be-vietnam), sans-serif' }}>{label}</Text>
        </Group>
        {rightSection || <IconArrowLeft size={16} className={`${danger ? 'text-red-400' : 'text-gray-400 dark:text-zinc-500'} rotate-180`} />}
    </UnstyledButton>
);

const SidebarMediaButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <Button variant="light" color="gray" size="xs" radius="md" leftSection={icon} styles={{ label: { fontWeight: 700 } }}>
        {label}
    </Button>
);
