"use client";

import { Box, Title, Stack, TextInput, Text, Center, Loader, Group, Tabs } from "@mantine/core";
import { IconSearch, IconSparkles } from "@tabler/icons-react";
import { useState } from "react";
import { AppQuery } from "@/api/AppQuery";
import { ThreadFeed } from "@/feauture/social/components/ThreadFeed";
import { UserCard } from "@/feauture/social/components/UserCard";
import { useDebouncedValue } from "@mantine/hooks";

export default function ExplorePage() {
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState("threads");
    const [debounced] = useDebouncedValue(query, 500);

    const { data: threadResults, isLoading: isSearchingThreads } = AppQuery.social.useSearch(debounced, {}, {
        enabled: debounced.length > 0 && activeTab === "threads"
    });

    const { data: userResults, isLoading: isSearchingUsers } = AppQuery.friends.useSearch(debounced, {
        enabled: debounced.length > 0 && activeTab === "users"
    });

    const { data: trendingThreads, isLoading: isLoadingTrending } = AppQuery.social.useFeed({ limit: 10 }, {
        enabled: debounced.length === 0
    });

    return (
        <Stack gap="xl">
            <Stack gap="xs">
                <Title order={2} className="text-4xl font-black tracking-tighter">Search</Title>
            </Stack>

            <TextInput
                placeholder="Search..."
                size="lg"
                radius="xl"
                leftSection={<IconSearch size={22} stroke={3} className="text-zinc-400" />}
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                classNames={{
                    input: "bg-zinc-100/50 dark:bg-zinc-900/50 border-0 focus:bg-white dark:focus:bg-black transition-all shadow-sm h-[60px] text-lg font-medium"
                }}
            />

            <Tabs value={activeTab} onChange={(val) => setActiveTab(val || "threads")} variant="none" classNames={{
                root: "w-full",
                list: "border-b border-gray-100 dark:border-zinc-900 flex justify-around",
                tab: "pb-4 px-0 fw-800 text-sm tracking-widest uppercase transition-all border-b-2 border-transparent data-[active=true]:border-black dark:data-[active=true]:border-white data-[active=true]:text-black dark:data-[active=true]:text-white text-zinc-400"
            }}>
                <Tabs.List>
                    <Tabs.Tab value="threads">NHers Social</Tabs.Tab>
                    <Tabs.Tab value="users">Search Users</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="threads" pt="xl">
                    {debounced.length > 0 ? (
                        isSearchingThreads ? (
                            <Center py={40}><Loader color="indigo" size="sm" /></Center>
                        ) : threadResults && threadResults.length > 0 ? (
                            <ThreadFeed threads={threadResults} />
                        ) : (
                            <Center py={100}>
                                <Stack align="center" gap="md">
                                    <IconSearch size={48} className="text-zinc-200" stroke={1.5} />
                                    <Text c="dimmed" size="sm" fw={600}>No posts found for "{debounced}"</Text>
                                </Stack>
                            </Center>
                        )
                    ) : (
                        <Stack gap="md">
                            <Group gap="xs" px="md">
                                <IconSparkles size={18} className="text-indigo-500" stroke={2.5} />
                                <Text fw={800} size="sm" className="uppercase tracking-widest text-zinc-400">Suggested</Text>
                            </Group>
                            {isLoadingTrending ? (
                                <Center py={40}><Loader color="indigo" size="sm" /></Center>
                            ) : (
                                <ThreadFeed threads={trendingThreads} />
                            )}
                        </Stack>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="users" pt="xl">
                    {debounced.length > 0 ? (
                        isSearchingUsers ? (
                            <Center py={40}><Loader color="indigo" size="sm" /></Center>
                        ) : userResults && userResults.length > 0 ? (
                            <Stack gap={0}>
                                {userResults.map(user => (
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </Stack>
                        ) : (
                            <Center py={100}>
                                <Stack align="center" gap="md">
                                    <IconSearch size={48} className="text-zinc-200" stroke={1.5} />
                                    <Text c="dimmed" size="sm" fw={600}>No users found for "{debounced}"</Text>
                                </Stack>
                            </Center>
                        )
                    ) : (
                        <Center py={100}>
                            <Stack align="center" gap="md" className="max-w-[280px] text-center">
                                <Box className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-full">
                                    <IconSearch size={32} className="text-zinc-300" stroke={1.5} />
                                </Box>
                                <Text fw={800} size="lg">Search for friends</Text>
                                <Text size="sm" className="text-zinc-500 font-medium leading-relaxed">
                                    Search by name, username or email to find and follow your friends.
                                </Text>
                            </Stack>
                        </Center>
                    )}
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}
