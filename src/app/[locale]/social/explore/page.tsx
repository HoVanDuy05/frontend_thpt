"use client";

import { Box, Title, Stack, TextInput, Text, Center, Loader, Group, Tabs, Divider } from "@mantine/core";
import { IconSearch, IconSparkles } from "@tabler/icons-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AppQuery } from "@/api/AppQuery";
import { ThreadFeed } from "@/feauture/social/components/ThreadFeed";
import { UserCard } from "@/feauture/social/components/UserCard";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BrandLoader } from "@/shared/components/BrandLoader";

export default function ExplorePage() {
    const t = useTranslations('social.search');
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const urlQuery = searchParams.get("q") || "";
    const urlTab = searchParams.get("tab") || "all";

    const [inputValue, setInputValue] = useState(urlQuery);
    const [debounced] = useDebouncedValue(inputValue, 500);

    // Sync URL with debounced input
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debounced) {
            params.set("q", debounced);
        } else {
            params.delete("q");
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [debounced]);

    const handleTabChange = (value: string | null) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== "all") {
            params.set("tab", value);
        } else {
            params.delete("tab");
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const shouldFetchUsers = debounced.length > 0 && (urlTab === "all" || urlTab === "users");
    const shouldFetchPosts = debounced.length > 0 && (urlTab === "all" || urlTab === "posts");

    const { data: userResults, isLoading: isSearchingUsers } = AppQuery.friends.useSearch(debounced, {
        enabled: shouldFetchUsers
    });

    const { data: threadResults, isLoading: isSearchingThreads } = AppQuery.social.useSearch(debounced, {}, {
        enabled: shouldFetchPosts
    });

    const { data: trendingThreads, isLoading: isLoadingTrending } = AppQuery.social.useFeed({ limit: 10 }, {
        enabled: debounced.length === 0
    });

    const isLoading = isSearchingUsers || isSearchingThreads;
    const hasResults = (userResults && userResults.length > 0) || (threadResults && threadResults.length > 0);

    return (
        <Stack gap="md" className="pb-8">
            {/* Header */}
            <Stack gap="xs" className="px-4 pt-4">
                <Title order={2} className="text-3xl font-black tracking-tight">{t('title')}</Title>
            </Stack>

            {/* Search Input */}
            <Box className="px-4">
                <TextInput
                    placeholder={t('placeholder')}
                    size="lg"
                    radius="xl"
                    spellCheck={false}
                    leftSection={<IconSearch size={20} className="text-gray-400" />}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.currentTarget.value)}
                    classNames={{
                        input: "bg-gray-50 dark:bg-zinc-900/50 border-0 focus:bg-white dark:focus:bg-zinc-900 transition-all h-[52px] text-base pl-12"
                    }}
                />
            </Box>

            {/* Tabs */}
            <Tabs value={urlTab} onChange={handleTabChange} variant="none" classNames={{
                root: "w-full",
                list: "border-b border-gray-200 dark:border-zinc-800 px-4",
                tab: "pb-3 px-4 font-semibold text-sm transition-all border-b-2 border-transparent data-[active=true]:border-black dark:data-[active=true]:border-white data-[active=true]:text-black dark:data-[active=true]:text-white text-gray-500 dark:text-gray-400"
            }}>
                <Tabs.List>
                    <Tabs.Tab value="all">{t('tabs.all')}</Tabs.Tab>
                    <Tabs.Tab value="users">{t('tabs.users')}</Tabs.Tab>
                    <Tabs.Tab value="posts">{t('tabs.posts')}</Tabs.Tab>
                </Tabs.List>

                {/* All Tab */}
                <Tabs.Panel value="all" pt="md">
                    {debounced.length > 0 ? (
                        isLoading ? (
                            <BrandLoader size="sm" minHeight={150} />
                        ) : hasResults ? (
                            <Stack gap="lg">
                                {/* Users Section */}
                                {userResults && userResults.length > 0 && (
                                    <Stack gap="xs">
                                        <Group gap="xs" px="md">
                                            <Text fw={800} size="xs" className="uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                {t('sections.users')}
                                            </Text>
                                        </Group>
                                        <Stack gap={0}>
                                            {userResults.map(user => (
                                                <UserCard key={user.id} user={user} />
                                            ))}
                                        </Stack>
                                    </Stack>
                                )}

                                {/* Divider */}
                                {userResults && userResults.length > 0 && threadResults && threadResults.length > 0 && (
                                    <Divider className="mx-4" />
                                )}

                                {/* Posts Section */}
                                {threadResults && threadResults.length > 0 && (
                                    <Stack gap="xs">
                                        <Group gap="xs" px="md">
                                            <Text fw={800} size="xs" className="uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                {t('sections.posts')}
                                            </Text>
                                        </Group>
                                        <ThreadFeed threads={threadResults} />
                                    </Stack>
                                )}
                            </Stack>
                        ) : (
                            <Center py={80}>
                                <Stack align="center" gap="sm" className="max-w-[260px] text-center">
                                    <IconSearch size={48} className="text-gray-300 dark:text-zinc-700" stroke={1.5} />
                                    <Text size="sm" fw={600} className="text-gray-600 dark:text-gray-400">
                                        {t('empty.no_results', { query: debounced })}
                                    </Text>
                                </Stack>
                            </Center>
                        )
                    ) : (
                        <Stack gap="xs">
                            <Group gap="xs" px="md" pt="sm">
                                <IconSparkles size={16} className="text-blue-500" stroke={2.5} />
                                <Text fw={800} size="xs" className="uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    {t('sections.suggested')}
                                </Text>
                            </Group>
                            {isLoadingTrending ? (
                                <BrandLoader size="sm" minHeight={150} />
                            ) : (
                                <ThreadFeed threads={trendingThreads} />
                            )}
                        </Stack>
                    )}
                </Tabs.Panel>

                {/* Users Tab */}
                <Tabs.Panel value="users" pt="md">
                    {debounced.length > 0 ? (
                        isSearchingUsers ? (
                            <BrandLoader size="sm" minHeight={150} />
                        ) : userResults && userResults.length > 0 ? (
                            <Stack gap={0}>
                                {userResults.map(user => (
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </Stack>
                        ) : (
                            <Center py={80}>
                                <Stack align="center" gap="sm" className="max-w-[260px] text-center">
                                    <IconSearch size={48} className="text-gray-300 dark:text-zinc-700" stroke={1.5} />
                                    <Text size="sm" fw={600} className="text-gray-600 dark:text-gray-400">
                                        {t('empty.no_results', { query: debounced })}
                                    </Text>
                                </Stack>
                            </Center>
                        )
                    ) : (
                        <Center py={80}>
                            <Stack align="center" gap="md" className="max-w-[280px] text-center">
                                <Box className="p-5 bg-gray-50 dark:bg-zinc-900/50 rounded-full">
                                    <IconSearch size={28} className="text-gray-400 dark:text-zinc-600" stroke={1.5} />
                                </Box>
                                <Text fw={700} size="lg" className="text-gray-900 dark:text-white">
                                    {t('empty.search_users_title')}
                                </Text>
                                <Text size="sm" className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {t('empty.search_users_subtitle')}
                                </Text>
                            </Stack>
                        </Center>
                    )}
                </Tabs.Panel>

                {/* Posts Tab */}
                <Tabs.Panel value="posts" pt="md">
                    {debounced.length > 0 ? (
                        isSearchingThreads ? (
                            <BrandLoader size="sm" minHeight={150} />
                        ) : threadResults && threadResults.length > 0 ? (
                            <ThreadFeed threads={threadResults} />
                        ) : (
                            <Center py={80}>
                                <Stack align="center" gap="sm" className="max-w-[260px] text-center">
                                    <IconSearch size={48} className="text-gray-300 dark:text-zinc-700" stroke={1.5} />
                                    <Text size="sm" fw={600} className="text-gray-600 dark:text-gray-400">
                                        {t('empty.no_results', { query: debounced })}
                                    </Text>
                                </Stack>
                            </Center>
                        )
                    ) : (
                        <Center py={80}>
                            <Stack align="center" gap="md" className="max-w-[280px] text-center">
                                <Box className="p-5 bg-gray-50 dark:bg-zinc-900/50 rounded-full">
                                    <IconSearch size={28} className="text-gray-400 dark:text-zinc-600" stroke={1.5} />
                                </Box>
                                <Text fw={700} size="lg" className="text-gray-900 dark:text-white">
                                    {t('empty.search_posts_title')}
                                </Text>
                                <Text size="sm" className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {t('empty.search_posts_subtitle')}
                                </Text>
                            </Stack>
                        </Center>
                    )}
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}
