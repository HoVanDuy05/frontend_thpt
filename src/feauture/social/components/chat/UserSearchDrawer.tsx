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

const UserItem = ({ user, onClick, fontStyle }: { user: TUser, onClick: () => void, fontStyle: any }) => (
    <Group
        wrap="nowrap"
        p="sm"
        className="cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-xl group"
        onClick={onClick}
    >
        <Avatar src={user.avatar} size={48} radius="xl" className="group-hover:scale-105 transition-transform" />
        <Stack gap={2} style={{ flex: 1, overflow: 'hidden' }}>
            <Text size="sm" fw={600} className="text-gray-900 dark:text-gray-200" style={fontStyle}>
                {user.hoTen || user.taiKhoan}
            </Text>
            <Text size="xs" c="dimmed" truncate style={fontStyle}>
                {user.email || (user.vaiTro === 'HOC_SINH' ? 'Học sinh' : user.vaiTro)}
            </Text>
        </Stack>
    </Group>
);

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
                            <>
                                {(() => {
                                    const friendIds = new Set((friends || []).map(f => f.id));
                                    const matchingFriends = searchResults.filter(u => friendIds.has(u.id));
                                    const otherUsers = searchResults.filter(u => !friendIds.has(u.id));

                                    return (
                                        <>
                                            {matchingFriends.length > 0 && (
                                                <>
                                                    <Text size="xs" c="indigo" px="xs" fw={700} mt="xs" mb={4}>{t('friends') || 'BẠN BÈ'}</Text>
                                                    {matchingFriends.map((u) => (
                                                        <UserItem key={u.id} user={u} onClick={() => onStartChat(u)} fontStyle={fontStyle} />
                                                    ))}
                                                </>
                                            )}

                                            {otherUsers.length > 0 && (
                                                <>
                                                    <Text size="xs" c="dimmed" px="xs" fw={700} mt="md" mb={4}>{t('others') || 'NGƯỜI DÙNG KHÁC'}</Text>
                                                    {otherUsers.map((u) => (
                                                        <UserItem key={u.id} user={u} onClick={() => onStartChat(u)} fontStyle={fontStyle} />
                                                    ))}
                                                </>
                                            )}
                                        </>
                                    );
                                })()}
                            </>
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
                                        <UserItem key={f.id} user={f} onClick={() => onStartChat(f)} fontStyle={fontStyle} />
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
