"use client";

import React, { useState } from "react";
import {
    Box,
    Text,
    Avatar,
    Group,
    Button,
    Stack,
    Card,
    Badge,
    ActionIcon,
    Title,
    Tabs
} from "@mantine/core";
import { IconUserPlus, IconUserCheck, IconUserX, IconCheck, IconX, IconSend } from "@tabler/icons-react";
import { FriendRequest } from "../types";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { BrandLoader } from "@/shared/components/BrandLoader";
import { useTranslations } from "next-intl";

// Separate component to handle hooks properly
function RequestCard({ request, type }: { request: FriendRequest; type: 'received' | 'sent' }) {
    const t = useTranslations('social.friends.card');
    const user = type === 'received' ? request.nguoiGui : request.nguoiNhan;
    // AppMutation is a function, so calling it with () is correct
    const mutation = AppMutation().friends.useHandleRequest(user?.id || 0);

    if (!user) return null;

    const handleAcceptRequest = async () => {
        try {
            await mutation.mutateAsync({ action: 'ACCEPT' });
        } catch (error) {
            console.error("Failed to accept friend request:", error);
        }
    };

    const handleDeclineRequest = async () => {
        try {
            await mutation.mutateAsync({ action: 'DECLINE' });
        } catch (error) {
            console.error("Failed to decline friend request:", error);
        }
    };

    const handleCancelRequest = async () => {
        try {
            await mutation.mutateAsync({ action: 'CANCEL' });
        } catch (error) {
            console.error("Failed to cancel friend request:", error);
        }
    };

    return (
        <Card radius="xl" shadow="sm" p="md" className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all duration-300">
            <Group justify="space-between" wrap="nowrap" gap="md">
                <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                    <Box className="relative flex-shrink-0">
                        <Avatar
                            src={user.avatar}
                            size={52}
                            radius="xl"
                            className="border-2 border-white dark:border-zinc-800 shadow-sm"
                        >
                            {user.hoTen?.charAt(0) || user.taiKhoan.charAt(0)}
                        </Avatar>
                        <Box
                            className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900 bg-green-500"
                        />
                    </Box>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                        <Text fw={700} size="sm" className="text-zinc-900 dark:text-zinc-100 truncate">
                            {user.hoTen || user.taiKhoan}
                        </Text>
                        <Group gap={6} align="center" wrap="nowrap">
                            <Text size="xs" fw={500} className="text-zinc-500 dark:text-zinc-400 truncate">
                                @{user.taiKhoan}
                            </Text>
                            {type === 'received' && (
                                <Badge size="xs" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} className="rounded-sm px-1 h-3.5 scale-90 border-0">
                                    {t('new')}
                                </Badge>
                            )}
                        </Group>
                    </Box>
                </Group>

                <Group gap={6} wrap="nowrap" className="flex-shrink-0">
                    {type === 'received' ? (
                        <>
                            <Button
                                size="compact-xs"
                                variant="filled"
                                color="indigo"
                                radius="xl"
                                onClick={handleAcceptRequest}
                                loading={mutation.isPending}
                                className="h-8 px-4 text-xs font-bold shadow-sm shadow-indigo-500/20"
                            >
                                {t('accept')}
                            </Button>
                            <ActionIcon
                                size="md"
                                variant="subtle"
                                color="gray"
                                radius="xl"
                                onClick={handleDeclineRequest}
                                loading={mutation.isPending}
                                className="h-8 w-8 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                            >
                                <IconX size={16} />
                            </ActionIcon>
                        </>
                    ) : (
                        <Button
                            size="compact-xs"
                            variant="light"
                            color="gray"
                            radius="xl"
                            onClick={handleCancelRequest}
                            loading={mutation.isPending}
                            className="h-8 px-4 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            {t('cancel')}
                        </Button>
                    )}
                </Group>
            </Group>
        </Card>
    );
}

export function FriendRequests() {
    const t = useTranslations('social.friends');
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

    // AppQuery is an object, so calling it with () is WRONG. Accessing it directly is correct.
    const receivedRequestsQuery = AppQuery.friends.useReceivedRequests();
    const sentRequestsQuery = AppQuery.friends.useSentRequests();

    const isLoading = receivedRequestsQuery.isLoading || sentRequestsQuery.isLoading;
    const error = receivedRequestsQuery.error || sentRequestsQuery.error;

    if (isLoading) {
        return <BrandLoader minHeight={300} />;
    }

    if (error) {
        return (
            <Box className="text-center py-20">
                <Text color="red">Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</Text>
            </Box>
        );
    }

    return (
        <Stack gap="xl" className="pb-20 mt-4">
            {/* Header section */}
            <Box>
                <Title order={2} className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                    <Box className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10">
                        <IconUserPlus size={24} stroke={2.5} />
                    </Box>
                    {t('title')}
                </Title>
            </Box>

            {/* Tabs section */}
            <Tabs
                value={activeTab}
                onChange={(value) => setActiveTab(value as 'received' | 'sent')}
                variant="pills"
                radius="xl"
                classNames={{
                    root: 'w-full',
                    list: 'bg-zinc-50 dark:bg-zinc-900/50 p-1.5 mb-8 border border-zinc-100 dark:border-zinc-800',
                    tab: 'flex-1 py-2 font-bold transition-all duration-300 text-zinc-500 dark:text-zinc-400 data-[active]:bg-indigo-600 dark:data-[active]:bg-indigo-500 data-[active]:text-white data-[active]:shadow-md data-[active]:shadow-indigo-500/20'
                }}
            >
                <Tabs.List>
                    <Tabs.Tab
                        value="received"
                        leftSection={<IconUserCheck size={18} />}
                    >
                        {t('tabs.received')}
                        {receivedRequestsQuery.data && receivedRequestsQuery.data.length > 0 && (
                            <Badge
                                size="xs"
                                circle
                                ml="xs"
                                color="indigo"
                                className="shadow-sm shadow-indigo-500/20"
                            >
                                {receivedRequestsQuery.data.length}
                            </Badge>
                        )}
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="sent"
                        leftSection={<IconSend size={18} />}
                    >
                        {t('tabs.sent')}
                        {sentRequestsQuery.data && sentRequestsQuery.data.length > 0 && (
                            <Badge size="xs" circle ml="xs" color="gray">
                                {sentRequestsQuery.data.length}
                            </Badge>
                        )}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="received">
                    {receivedRequestsQuery.data && receivedRequestsQuery.data.length > 0 ? (
                        <Stack gap="xs">
                            {receivedRequestsQuery.data.map(request => (
                                <RequestCard key={request.id} request={request} type="received" />
                            ))}
                        </Stack>
                    ) : (
                        <Box className="text-center py-20 flex flex-col items-center px-4">
                            <Box className="w-24 h-24 bg-zinc-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
                                <IconUserCheck size={48} stroke={1.2} className="text-zinc-300 dark:text-zinc-600" />
                            </Box>
                            <Title order={4} className="text-zinc-800 dark:text-zinc-200 font-black mb-2 leading-tight">
                                {t('empty.received_title')}
                            </Title>
                            <Text className="text-zinc-500 dark:text-zinc-500 text-sm font-medium max-w-xs mx-auto">
                                {t('empty.received_subtitle')}
                            </Text>
                        </Box>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="sent">
                    {sentRequestsQuery.data && sentRequestsQuery.data.length > 0 ? (
                        <Stack gap="xs">
                            {sentRequestsQuery.data.map(request => (
                                <RequestCard key={request.id} request={request} type="sent" />
                            ))}
                        </Stack>
                    ) : (
                        <Box className="text-center py-20 flex flex-col items-center px-4">
                            <Box className="w-24 h-24 bg-zinc-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
                                <IconSend size={48} stroke={1.2} className="text-zinc-300 dark:text-zinc-600" />
                            </Box>
                            <Title order={4} className="text-zinc-800 dark:text-zinc-200 font-black mb-2 leading-tight">
                                {t('empty.sent_title')}
                            </Title>
                            <Text className="text-zinc-500 dark:text-zinc-500 text-sm font-medium max-w-xs mx-auto">
                                {t('empty.sent_subtitle')}
                            </Text>
                        </Box>
                    )}
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}
