"use client";

import { Box, Title, Stack, Text, Avatar, Group, Tabs, Center, Loader, Paper, ActionIcon } from "@mantine/core";
import { IconHeart, IconUserPlus, IconMessageCircle, IconRepeat, IconPointFilled } from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatSocialTime } from "@/shared/utils/social.util";
import { useTranslations } from "next-intl";
import { BrandLoader } from "@/shared/components/BrandLoader";

dayjs.extend(relativeTime);

export default function ActivityPage() {
    const t = useTranslations('social');
    const { data: activity, isLoading } = AppQuery.social.useActivity();

    const ActivityIcon = ({ type }: { type: string }) => {
        switch (type) {
            case 'FOLLOW': return <Box className="bg-blue-500 rounded-full p-1.5 shadow-sm translate-x-2 -translate-y-2 border-2 border-white dark:border-black"><IconUserPlus size={12} color="white" fill="white" /></Box>;
            case 'LIKE': return <Box className="bg-rose-500 rounded-full p-1.5 shadow-sm translate-x-2 -translate-y-2 border-2 border-white dark:border-black"><IconHeart size={12} color="white" fill="white" /></Box>;
            case 'REPLY': return <Box className="bg-indigo-500 rounded-full p-1.5 shadow-sm translate-x-2 -translate-y-2 border-2 border-white dark:border-black"><IconMessageCircle size={12} color="white" fill="white" /></Box>;
            default: return null;
        }
    };

    const getActivityText = (item: any) => {
        switch (item.type) {
            case 'FOLLOW': return t('activity.types.follow');
            case 'LIKE': return `${t('activity.types.like')}: "${item.data.thread.noiDung.substring(0, 30)}${item.data.thread.noiDung.length > 30 ? '...' : ''}"`;
            case 'REPLY': return `${t('activity.types.reply')}: "${item.data.noiDung.substring(0, 30)}${item.data.noiDung.length > 30 ? '...' : ''}"`;
            default: return "";
        }
    };

    const getUser = (item: any) => {
        if (item.type === 'FOLLOW') return item.data.nguoiTheoDoi;
        if (item.type === 'LIKE') return item.data.nguoiDung;
        if (item.type === 'REPLY') return item.data.tacGia;
        return null;
    };

    if (isLoading) {
        return <BrandLoader fullscreen />
    }

    return (
        <Stack gap="xl" className="px-4 pt-4 pb-12">
            <Title order={2} className="text-3xl font-black tracking-tight">{t('activity.title')}</Title>

            <Tabs defaultValue="all" variant="none" classNames={{
                root: "w-full",
                list: "flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide",
                tab: "px-6 py-2.5 rounded-xl fw-800 text-[10px] tracking-widest uppercase transition-all bg-gray-50 dark:bg-zinc-900 text-gray-400 data-[active=true]:bg-black dark:data-[active=true]:bg-white data-[active=true]:text-white dark:data-[active=true]:text-black border border-transparent"
            }}>
                <Tabs.List>
                    <Tabs.Tab value="all">{t('activity.tabs.all')}</Tabs.Tab>
                    <Tabs.Tab value="follows">{t('activity.tabs.follows')}</Tabs.Tab>
                    <Tabs.Tab value="replies">{t('activity.tabs.replies')}</Tabs.Tab>
                    <Tabs.Tab value="likes">{t('activity.tabs.likes')}</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="all">
                    {activity && activity.length > 0 ? (
                        <Stack gap={0}>
                            {activity.map((item: any, idx: number) => {
                                const user = getUser(item);
                                return (
                                    <Box
                                        key={idx}
                                        className="py-4 border-b border-gray-50 dark:border-zinc-900/50 hover:bg-gray-50/50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer group px-2 rounded-xl"
                                    >
                                        <Group wrap="nowrap" align="flex-start" gap="md">
                                            <Box className="relative">
                                                <Avatar src={user?.avatar} size="md" radius="xl" className="bg-zinc-100 dark:bg-zinc-800" />
                                                <Box className="absolute bottom-0 right-0">
                                                    <ActivityIcon type={item.type} />
                                                </Box>
                                            </Box>
                                            <Stack gap={2} style={{ flex: 1 }}>
                                                <Group justify="space-between" wrap="nowrap">
                                                    <Text size="sm" fw={800} className="text-zinc-900 dark:text-white group-hover:underline">
                                                        {user?.taiKhoan}
                                                    </Text>
                                                    <Text size="xs" c="dimmed" fw={600}>
                                                        {formatSocialTime(item.date, t)}
                                                    </Text>
                                                </Group>
                                                <Text size="sm" className="text-zinc-500 font-medium line-clamp-2">
                                                    {getActivityText(item)}
                                                </Text>
                                            </Stack>
                                        </Group>
                                    </Box>
                                );
                            })}
                        </Stack>
                    ) : (
                        <Center py={100}>
                            <Stack align="center" gap="sm">
                                <Text c="dimmed" fw={600} size="sm">{t('activity.empty')}</Text>
                            </Stack>
                        </Center>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="follows">
                    <Center py={100} className="text-zinc-400 font-medium">{t('activity.no_followers')}</Center>
                </Tabs.Panel>
                <Tabs.Panel value="replies">
                    <Center py={100} className="text-zinc-400 font-medium">{t('activity.no_replies')}</Center>
                </Tabs.Panel>
                <Tabs.Panel value="likes">
                    <Center py={100} className="text-zinc-400 font-medium">{t('activity.no_likes')}</Center>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}
