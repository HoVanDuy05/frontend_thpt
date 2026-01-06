import { Drawer, Stack, Text, TextInput, ScrollArea, Center, Loader, Group, Avatar } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { TUser } from "@/shared/types/user.type";
import { useTranslations } from "next-intl";

interface UserSearchDrawerProps {
    opened: boolean;
    onClose: () => void;
    query: string;
    onQueryChange: (val: string) => void;
    isSearching: boolean;
    searchResults: TUser[];
    isLoadingFriends: boolean;
    friends: TUser[];
    onStartChat: (user: TUser) => void;
}

export const UserSearchDrawer = ({
    opened,
    onClose,
    query,
    onQueryChange,
    isSearching,
    searchResults,
    isLoadingFriends,
    friends,
    onStartChat
}: UserSearchDrawerProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const t = useTranslations('chat');
    const fontStyle = { fontFamily: 'var(--font-be-vietnam), sans-serif' };

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            title={<Text fw={700} size="xl" style={fontStyle}>{t('new_message')}</Text>}
            size={isMobile ? "100%" : "md"}
            position="left"
            styles={{
                content: { ...fontStyle },
                body: { height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', ...fontStyle },
                header: { padding: '16px', ...fontStyle }
            }}
        >
            <Stack gap="md" className="h-full">
                <TextInput
                    placeholder={t('search_users_placeholder')}
                    leftSection={<IconSearch size={16} className="text-gray-500" />}
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    autoFocus
                    radius="xl"
                    size="md"
                    classNames={{ input: "bg-gray-100 dark:bg-zinc-800/50" }}
                />

                <ScrollArea className="flex-1">
                    <Stack gap="xs">
                        {isSearching ? (
                            <Center py="xl"><Loader size="sm" color="indigo" /></Center>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((searchUser) => (
                                <Group
                                    key={searchUser.id}
                                    wrap="nowrap"
                                    p="sm"
                                    className="cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-xl"
                                    onClick={() => onStartChat(searchUser)}
                                >
                                    <Avatar
                                        src={searchUser.avatar}
                                        size={48}
                                        radius="xl"
                                    />
                                    <Stack gap={2} style={{ flex: 1, overflow: 'hidden' }}>
                                        <Text size="sm" fw={600} className="text-gray-900 dark:text-gray-200" style={fontStyle}>
                                            {searchUser.hoTen || searchUser.taiKhoan}
                                        </Text>
                                        <Text size="xs" c="dimmed" truncate style={fontStyle}>
                                            {searchUser.email}
                                        </Text>
                                    </Stack>
                                </Group>
                            ))
                        ) : query ? (
                            <Center py="xl" className="flex-col gap-2 text-center text-gray-400">
                                <Text size="sm">{t('user_not_found')}</Text>
                                <Text size="xs" c="dimmed">{t('try_different_keyword')}</Text>
                            </Center>
                        ) : (
                            <>
                                <Text size="xs" c="dimmed" px="xs" fw={700} mt="sm">{t('suggested')}</Text>
                                {isLoadingFriends ? (
                                    <Center py="xl"><Loader size="sm" color="indigo" /></Center>
                                ) : friends && friends.length > 0 ? (
                                    friends.map((f: any) => (
                                        <Group
                                            key={f.id}
                                            wrap="nowrap"
                                            p="sm"
                                            className="cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-xl"
                                            onClick={() => onStartChat(f)}
                                        >
                                            <Avatar src={f.avatar} size={48} radius="xl" />
                                            <Stack gap={2} style={{ flex: 1, overflow: 'hidden' }}>
                                                <Text size="sm" fw={600} className="text-gray-900 dark:text-gray-200" truncate style={fontStyle}>
                                                    {f.hoTen || f.taiKhoan}
                                                </Text>
                                                <Text size="xs" c="dimmed" truncate style={fontStyle}>
                                                    {f.email || 'Học sinh'}
                                                </Text>
                                            </Stack>
                                        </Group>
                                    ))
                                ) : (
                                    <Center py="xl" className="flex-col gap-2 text-center text-gray-400">
                                        <Text size="sm">{t('no_friends')}</Text>
                                        <Text size="xs" c="dimmed">{t('add_friend_hint')}</Text>
                                    </Center>
                                )}
                            </>
                        )}
                    </Stack>
                </ScrollArea>
            </Stack>
        </Drawer>
    );
};
