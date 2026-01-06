import { Box, Stack, Avatar, Text, Group, Divider, Accordion, UnstyledButton, Button, ActionIcon } from "@mantine/core";
import { IconBell, IconSearch, IconUser, IconPalette, IconMoodSmile, IconPhoto, IconFile, IconLink, IconShieldLock, IconBlockquote, IconBan } from "@tabler/icons-react";
import { TChannel } from "@/api/types/api.type";
import { useTranslations } from "next-intl";

interface ChannelInfoSidebarProps {
    channel: TChannel;
    currentUserId?: number;
    getChannelName: (channel: TChannel, currentUserId?: number) => string;
    getChannelAvatar: (channel: TChannel, currentUserId?: number) => string | null | undefined;
}

export const ChannelInfoSidebar = ({ channel, currentUserId, getChannelName, getChannelAvatar }: ChannelInfoSidebarProps) => {
    const t = useTranslations('chat');

    const name = getChannelName(channel, currentUserId);
    const avatar = getChannelAvatar(channel, currentUserId);

    // Explicitly enforce the font family
    const fontStyle = { fontFamily: 'var(--font-be-vietnam), sans-serif' };

    return (
        <Stack gap={0} className="w-full">
            {/* Header / Avatar Section */}
            <Stack align="center" gap="xs" py={32}>
                <Avatar src={avatar} size={84} radius="xl" className="shadow-sm border-2 border-white dark:border-zinc-800" />
                <Stack gap={2} align="center">
                    <Text fw={700} size="xl" className="text-gray-900 dark:text-white" style={fontStyle}>{name}</Text>
                    <Group gap={6} align="center">
                        <Box className="w-2 h-2 rounded-full bg-green-500" />
                        <Text size="xs" c="dimmed" fw={400} style={fontStyle}>{t('active_now')}</Text>
                    </Group>
                </Stack>

                <Group mt="md" gap="xl">
                    <Stack gap={4} align="center" className="cursor-pointer hover:opacity-80 transition-opacity">
                        <ActionIcon variant="light" color="gray" radius="xl" size="xl" className="bg-gray-200 dark:bg-zinc-800 text-black dark:text-white">
                            <IconUser size={20} />
                        </ActionIcon>
                        <Text size="xs" fw={500} style={fontStyle}>{t('sidebar.profile')}</Text>
                    </Stack>
                    <Stack gap={4} align="center" className="cursor-pointer hover:opacity-80 transition-opacity">
                        <ActionIcon variant="light" color="gray" radius="xl" size="xl" className="bg-gray-200 dark:bg-zinc-800 text-black dark:text-white">
                            <IconBell size={20} />
                        </ActionIcon>
                        <Text size="xs" fw={500} style={fontStyle}>{t('sidebar.mute')}</Text>
                    </Stack>
                    <Stack gap={4} align="center" className="cursor-pointer hover:opacity-80 transition-opacity">
                        <ActionIcon variant="light" color="gray" radius="xl" size="xl" className="bg-gray-200 dark:bg-zinc-800 text-black dark:text-white">
                            <IconSearch size={20} />
                        </ActionIcon>
                        <Text size="xs" fw={500} style={fontStyle}>{t('sidebar.search')}</Text>
                    </Stack>
                </Group>
            </Stack>

            <Divider color="gray.1" darkHidden />
            <Divider color="zinc.9" lightHidden />

            {/* Section: Chat Info */}
            <Stack gap="xs" p="md">
                <Text size="xs" c="dimmed" fw={700} className="uppercase tracking-wider" style={fontStyle}>{t('sidebar.chat_info')}</Text>

                {/* Encryption */}
                <Group wrap="nowrap" align="flex-start" className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <IconShieldLock size={20} className="text-blue-500 shrink-0 mt-0.5" />
                    <Box>
                        <Text size="sm" fw={600} className="leading-snug text-blue-500" style={fontStyle}>{t('sidebar.encryption_notice')}</Text>
                    </Box>
                </Group>
            </Stack>

            <Divider color="gray.2" darkHidden />
            <Divider color="zinc.9" lightHidden />

            {/* Section: Customize Chat */}
            <Stack gap={2} p="md">
                <Text size="xs" c="dimmed" fw={700} className="uppercase tracking-wider mb-2" style={fontStyle}>{t('sidebar.customize_chat')}</Text>

                <UnstyledButton className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group">
                    <IconPalette size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <Text size="sm" fw={600} style={fontStyle}>{t('sidebar.theme')}</Text>
                </UnstyledButton>

                <UnstyledButton className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group">
                    <IconMoodSmile size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <Text size="sm" fw={600} style={fontStyle}>{t('sidebar.quick_emoji')}</Text>
                </UnstyledButton>
            </Stack>

            <Divider color="gray.2" darkHidden />
            <Divider color="zinc.9" lightHidden />

            {/* Section: Media, Files, Links */}
            <Stack gap={2} p="md">
                <Text size="xs" c="dimmed" fw={700} className="uppercase tracking-wider mb-2" style={fontStyle}>{t('sidebar.media_files_links')}</Text>

                <Box className="grid grid-cols-3 gap-1">
                    {[1, 2, 3].map(i => (
                        <Box key={i} className="aspect-square bg-gray-100 dark:bg-zinc-900 rounded-sm overflow-hidden flex items-center justify-center">
                            <IconPhoto size={20} className="text-gray-300 dark:text-zinc-700" />
                        </Box>
                    ))}
                </Box>
                <Button variant="subtle" color="gray" fullWidth mt="sm" size="xs" radius="md">
                    {t('sidebar.view_all')}
                </Button>
            </Stack>

            <Divider color="gray.2" darkHidden />
            <Divider color="zinc.9" lightHidden />

            {/* Section: Privacy & Support */}
            <Stack gap={2} p="md">
                <Text size="xs" c="dimmed" fw={700} className="uppercase tracking-wider mb-2" style={fontStyle}>{t('sidebar.privacy_support')}</Text>

                <UnstyledButton className="flex items-center gap-3 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                    <IconBan size={20} className="shrink-0" />
                    <Text size="sm" fw={600} style={fontStyle}>{t('sidebar.block')}</Text>
                </UnstyledButton>
            </Stack>
        </Stack>
    );
};

const SidebarActionIcon = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <Stack gap={6} align="center" className="cursor-pointer group shrink-0">
        <Box className="w-[36px] h-[36px] bg-gray-100 dark:bg-zinc-800 group-hover:bg-gray-200 dark:group-hover:bg-zinc-700 rounded-full flex items-center justify-center transition-all duration-200 text-black dark:text-white">
            {icon}
        </Box>
        <Text size="11px" fw={500} className="text-gray-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-be-vietnam), sans-serif' }}>
            {label}
        </Text>
    </Stack>
);
