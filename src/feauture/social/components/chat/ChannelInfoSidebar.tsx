import { Box, Stack, Avatar, Text, Group, Divider, Accordion, UnstyledButton, Button, ActionIcon, ScrollArea, ThemeIcon, Tooltip } from "@mantine/core";
import { IconBell, IconSearch, IconUser, IconPalette, IconMoodSmile, IconPhoto, IconFile, IconLink, IconShieldLock, IconInfoCircle, IconArrowLeft, IconBlockquote, IconBan, IconChevronDown } from "@tabler/icons-react";
import { TChannel } from "@/api/types/api.type";
import { useTranslations } from "next-intl";
import { AppQuery } from "@/api/AppQuery";
import { useMemo, useState } from "react";

interface ChannelInfoSidebarProps {
    channel: TChannel;
    currentUserId?: number;
    getChannelName: (channel: TChannel, currentUserId?: number) => string;
    getChannelAvatar: (channel: TChannel, currentUserId?: number) => string | null | undefined;
    presenceMap: Record<number, boolean>;
}

export const ChannelInfoSidebar = ({ channel, currentUserId, getChannelName, getChannelAvatar, presenceMap }: ChannelInfoSidebarProps) => {
    const t = useTranslations('chat');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const name = getChannelName(channel, currentUserId);
    const avatar = getChannelAvatar(channel, currentUserId);

    // Fetch all messages to extract media (page 1 only for now, can paginate if needed)
    const { data: allMessages } = AppQuery.chat.useMessages(channel.id, { page: 1 });

    const mediaImages = useMemo(() => {
        if (!allMessages) return [];
        return allMessages
            .filter(m => m.loai === 'HINH_ANH')
            .map(m => ({
                id: m.id,
                url: m.duongDanTep || m.noiDung,
                date: m.ngayGui
            }))
            .reverse(); // Newest first
    }, [allMessages]);

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
                    <Box className="relative mb-1">
                        <Avatar
                            src={avatar}
                            size={80}
                            radius={999}
                            className="shadow-sm border-[1px] border-gray-100 dark:border-zinc-800"
                        />
                        {isOnline && (
                            <Box className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-[2.5px] border-white dark:border-[#1c1e21] rounded-full" />
                        )}
                    </Box>

                    <Text fw={700} size="18px" className="text-gray-900 dark:text-white text-center px-4 leading-tight mt-1" style={fontStyle}>
                        {name}
                    </Text>
                    {channel.loaiKenh === 'CA_NHAN' && (
                        <Text size="13px" c="dimmed" fw={500} style={fontStyle}>
                            {isOnline ? t('active_now') : t('offline')}
                        </Text>
                    )}

                    <Group mt="xl" gap={24} justify="center">
                        <SidebarActionItem icon={<IconUser size={22} />} label={t('sidebar.profile')} />
                        <SidebarActionItem icon={<IconBell size={22} />} label={t('sidebar.mute')} />
                    </Group>
                </Stack>

                {/* Sections */}
                <Stack gap={0} px="xs">
                    <Accordion
                        variant="default"
                        defaultValue="customize"
                        styles={{
                            item: { borderBottom: 'none' },
                            control: { padding: '12px 8px', '&:hover': { backgroundColor: 'transparent' } },
                            content: { padding: '0 8px 16px 8px' },
                            label: { fontSize: '14px', fontWeight: 600, color: 'var(--mantine-color-text)' },
                            chevron: { width: 18, height: 18 }
                        }}
                        chevron={<IconChevronDown size={18} />}
                    >
                        {/* Customize Chat */}
                        <Accordion.Item value="customize">
                            <Accordion.Control>{t('sidebar.customize_chat')}</Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={1}>
                                    <SidebarMenuButton icon={<IconPalette size={20} className="text-[#6366f1]" />} label={t('sidebar.theme')} />
                                    <SidebarMenuButton icon={<IconMoodSmile size={20} className="text-[#6366f1]" />} label={t('sidebar.quick_emoji')} />
                                    <SidebarMenuButton icon={<IconBlockquote size={20} className="text-black dark:text-white" />} label="Biệt danh" />
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>

                        {/* Media & Files */}
                        <Accordion.Item value="media">
                            <Accordion.Control>{t('sidebar.media_files_links')}</Accordion.Control>
                            <Accordion.Panel>
                                {mediaImages.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-1 px-2">
                                        {mediaImages.slice(0, 9).map((img) => (
                                            <div
                                                key={img.id}
                                                className="aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-gray-100 dark:bg-zinc-800"
                                                onClick={() => img.url && setPreviewImage(img.url)}
                                            >
                                                <img src={img.url} className="w-full h-full object-cover" loading="lazy" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Text size="sm" c="dimmed" className="text-center py-4">
                                        Chưa có ảnh nào
                                    </Text>
                                )}
                                {mediaImages.length > 9 && (
                                    <Text size="xs" c="dimmed" className="text-center mt-2">
                                        +{mediaImages.length - 9} ảnh khác
                                    </Text>
                                )}
                            </Accordion.Panel>
                        </Accordion.Item>

                        {/* Privacy & Support */}
                        <Accordion.Item value="privacy">
                            <Accordion.Control>{t('sidebar.privacy_support')}</Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={1}>
                                    <SidebarMenuButton icon={<IconShieldLock size={20} className="text-gray-600 dark:text-gray-400" />} label={t('sidebar.encryption_notice')} />
                                    <SidebarMenuButton icon={<IconBan size={20} />} label={t('sidebar.block')} danger />
                                    <SidebarMenuButton icon={<IconInfoCircle size={20} className="text-gray-600 dark:text-gray-400" />} label={t('sidebar.report')} />
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

const SidebarActionItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
    <Stack gap={6} align="center" className="cursor-pointer group">
        <UnstyledButton
            onClick={onClick}
            className="w-[36px] h-[36px] md:w-[44px] md:h-[44px] bg-gray-200 dark:bg-[#3A3B3C] hover:bg-gray-300 dark:hover:brightness-110 rounded-full flex items-center justify-center transition-all duration-200 text-black dark:text-gray-200"
        >
            {icon}
        </UnstyledButton>
        <Text size="12px" c="dimmed" fw={500} className="group-hover:text-black dark:group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-be-vietnam), sans-serif' }}>
            {label}
        </Text>
    </Stack>
);

const SidebarMenuButton = ({ icon, label, danger, rightSection, onClick }: { icon: React.ReactNode, label: string, danger?: boolean, rightSection?: React.ReactNode, onClick?: () => void }) => (
    <UnstyledButton
        onClick={onClick}
        className={`w-full flex items-center justify-between px-2 py-3 rounded-lg transition-colors group ${danger ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' : 'hover:bg-gray-100 dark:hover:bg-[#2A2B2C]'}`}
    >
        <Group gap="md">
            <Box className={`${danger ? 'text-red-500' : 'text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white'} transition-colors`}>
                {icon}
            </Box>
            <Text size="15px" fw={500} className={danger ? 'text-red-500' : 'text-gray-900 dark:text-gray-200'} style={{ fontFamily: 'var(--font-be-vietnam), sans-serif' }}>{label}</Text>
        </Group>
        {rightSection || <IconChevronDown size={18} className={`transform -rotate-90 ${danger ? 'text-red-400' : 'text-gray-400 dark:text-zinc-500'}`} />}
    </UnstyledButton>
);
