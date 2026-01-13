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
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useTranslations } from "next-intl";
import { formatRelativeTime } from "@/shared/utils/date.util";
import dayjs from "dayjs";

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
        <Group align="flex-start" gap="md" py="sm" wrap="nowrap" className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 rounded-xl px-2 transition-colors duration-200">
            <Avatar
                src={user.avatar}
                size={86}
                radius="xl"
                className="flex-shrink-0"
            >
                {user.hoTen?.charAt(0) || user.taiKhoan.charAt(0)}
            </Avatar>

            <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <Group justify="space-between" wrap="nowrap" align="flex-start">
                    <Text fw={700} size="md" className="text-zinc-900 dark:text-zinc-100 truncate pb-1">
                        {user.hoTen || user.taiKhoan}
                    </Text>
                    <Text size="xs" c="dimmed" className="flex-shrink-0 pt-0.5">
                        {formatRelativeTime(request.ngayTao)}
                    </Text>
                </Group>

                <Text size="xs" c="dimmed" mb={4}>
                    @{user.taiKhoan}
                </Text>

                <Group gap="xs" mt={2} grow wrap="nowrap">
                    {type === 'received' ? (
                        <>
                            <Button
                                fullWidth
                                size="sm"
                                variant="filled"
                                onClick={handleAcceptRequest}
                                loading={mutation.isPending}
                                radius="md"
                                className="h-9 font-bold bg-[#1877F2] hover:bg-[#166fe5]"
                            >
                                {t('accept')}
                            </Button>
                            <Button
                                fullWidth
                                size="sm"
                                variant="filled"
                                onClick={handleDeclineRequest}
                                loading={mutation.isPending}
                                radius="md"
                                className="h-9 font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700 active:scale-95 transition-transform"
                            >
                                {t('decline')}
                            </Button>
                        </>
                    ) : (
                        <Button
                            fullWidth
                            size="sm"
                            variant="filled"
                            onClick={handleCancelRequest}
                            loading={mutation.isPending}
                            radius="md"
                            className="h-9 font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700 active:scale-95 transition-transform"
                        >
                            {t('cancel')}
                        </Button>
                    )}
                </Group>
            </Stack>
        </Group>
    );
}

export function FriendRequests() {
    const t = useTranslations('social.friends');
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

    // AppQuery is an object, so calling it with () is WRONG. Accessing it directly is correct.
    const receivedRequestsQuery = AppQuery.friends.useReceivedRequests();
    const sentRequestsQuery = AppQuery.friends.useSentRequests();

    // Move loading state inside return to keep header visible
    const isLoading = (activeTab === 'received' && receivedRequestsQuery.isLoading) ||
        (activeTab === 'sent' && sentRequestsQuery.isLoading);

    const error = receivedRequestsQuery.error || sentRequestsQuery.error;

    if (error) {
        return (
            <Box className="text-center py-20">
                <Text color="red">Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</Text>
            </Box>
        );
    }

    return (
        <Stack gap="md" className="pb-20 mt-4 px-1">
            {/* Simple Header */}
            <Group justify="space-between" align="center" px="xs" mb={4}>
                <Text fw={800} size="xl" className="text-zinc-900 dark:text-white">
                    {t('title')} ({receivedRequestsQuery.data?.length || 0})
                </Text>
                <Text fw={600} size="sm" component="a" className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">
                    {t('sort')}
                </Text>
            </Group>

            {/* Tabs section */}
            <Tabs
                value={activeTab}
                onChange={(value) => setActiveTab(value as 'received' | 'sent')}
                variant="pills"
                radius="xl"
                classNames={{
                    root: 'w-full',
                    list: 'bg-transparent p-0 gap-2 overflow-x-auto no-scrollbar mb-6 border-0',
                    tab: 'px-4 py-2 font-bold transition-all duration-300 text-zinc-500 dark:text-zinc-400 border-0 bg-zinc-100 dark:bg-zinc-900/50 data-[active]:bg-indigo-600 dark:data-[active]:bg-indigo-500 data-[active]:text-white data-[active]:shadow-md data-[active]:shadow-indigo-500/20 rounded-full',
                    tabLabel: 'flex items-center gap-2'
                }}
            >
                <Tabs.List>
                    <Tabs.Tab
                        value="received"
                        leftSection={<IconUserCheck size={18} />}
                    >
                        <Group gap={6} wrap="nowrap">
                            {t('tabs.received')}
                            {receivedRequestsQuery.data && receivedRequestsQuery.data.length > 0 && (
                                <Badge
                                    size="xs"
                                    variant={activeTab === 'received' ? 'white' : 'filled'}
                                    color={activeTab === 'received' ? 'indigo' : 'red'}
                                    className={`h-4 min-w-[16px] p-0 px-1 text-[10px] font-bold rounded-full ${activeTab === 'received' ? 'text-indigo-600' : 'text-white'}`}
                                >
                                    {receivedRequestsQuery.data.length}
                                </Badge>
                            )}
                        </Group>
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="sent"
                        leftSection={<IconSend size={18} />}
                    >
                        <Group gap={6} wrap="nowrap">
                            {t('tabs.sent')}
                            {sentRequestsQuery.data && sentRequestsQuery.data.length > 0 && (
                                <Badge
                                    size="xs"
                                    variant={activeTab === 'sent' ? 'white' : 'filled'}
                                    color={activeTab === 'sent' ? 'indigo' : 'zinc'}
                                    className={`h-4 min-w-[16px] p-0 px-1 text-[10px] font-bold rounded-full ${activeTab === 'sent' ? 'text-indigo-600' : 'text-white bg-zinc-400'}`}
                                >
                                    {sentRequestsQuery.data.length}
                                </Badge>
                            )}
                        </Group>
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="received">
                    {receivedRequestsQuery.isLoading ? (
                        <SkeletonLoader type="users" count={5} />
                    ) : receivedRequestsQuery.data && receivedRequestsQuery.data.length > 0 ? (
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
                    {sentRequestsQuery.isLoading ? (
                        <SkeletonLoader type="users" count={5} />
                    ) : sentRequestsQuery.data && sentRequestsQuery.data.length > 0 ? (
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
