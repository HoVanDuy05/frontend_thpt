"use client";

import React from 'react';
import { Group, Avatar, Text, Button, Stack, Paper, Badge } from '@mantine/core';
import { TUser } from '@/shared/types/user.type';
import { AppQuery } from '@/api/AppQuery';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface UserCardProps {
    user: TUser;
    isMe?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ user, isMe }) => {
    const { data: statusData, refetch: refetchStatus } = AppQuery.friends.useStatus(user.id);
    const sendRequestMutation = AppMutation().friends.useSendRequest(user.id);
    const handleRequestMutation = AppMutation().friends.useHandleRequest(user.id);
    const unfriendMutation = AppMutation().friends.useUnfriend(user.id);
    const t = useTranslations('profile');

    const handleAction = async () => {
        try {
            if (!statusData) return;

            if (statusData.status === 'NONE') {
                await sendRequestMutation.mutateAsync(undefined);
            } else if (statusData.status === 'RECEIVED') {
                await handleRequestMutation.mutateAsync({ action: 'ACCEPT' });
            } else if (statusData.status === 'SENT') {
                await handleRequestMutation.mutateAsync({ action: 'CANCEL' });
            } else if (statusData.status === 'FRIEND') {
                await unfriendMutation.mutateAsync(undefined);
            }
            refetchStatus();
        } catch (error) {
            notifications.show({
                title: 'Lỗi',
                message: 'Không thể thực hiện thao tác. Vui lòng thử lại.',
                color: 'red'
            });
        }
    };

    const getButtonProps = () => {
        if (!statusData) return { children: '...', disabled: true };

        switch (statusData.status) {
            case 'NONE':
                return { children: t('add_friend'), variant: 'filled' as const, color: 'black' };
            case 'FRIEND':
                return { children: t('is_friend'), variant: 'outline' as const, color: 'gray' };
            case 'SENT':
                return { children: t('cancel_request'), variant: 'outline' as const, color: 'gray' };
            case 'RECEIVED':
                return { children: t('accept'), variant: 'filled' as const, color: 'indigo' };
            case 'BLOCKED':
                return { children: 'Blocked', variant: 'outline' as const, color: 'red', disabled: true };
            default:
                return { children: t('add_friend'), variant: 'filled' as const, color: 'black' };
        }
    };

    const btnProps = getButtonProps();

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'red';
            case 'GIAO_VIEN': return 'indigo';
            case 'HOC_SINH': return 'teal';
            default: return 'gray';
        }
    };

    return (
        <Paper
            component={Link}
            href={`/social/profile/${user.id}`}
            p="md"
            mb="xs"
            bg="transparent"
            className={`transition-all cursor-pointer group rounded-2xl border ${isMe
                ? 'bg-indigo-50/40 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30'
                : 'bg-transparent hover:bg-gray-50/80 dark:hover:bg-zinc-900/50 border-transparent hover:border-gray-100 dark:hover:border-zinc-800'
                }`}
        >
            {isMe ? (
                <Stack align="center" gap="xs" py="xs">
                    <Avatar
                        src={user.avatar}
                        size={80}
                        radius={999}
                        className="shadow-md ring-4 ring-white dark:ring-zinc-800"
                    />
                    <Stack gap={0} align="center">
                        <Group gap="xs">
                            <Text fw={800} size="lg" className="truncate dark:text-white tracking-tight">
                                {user.hoTen || user.taiKhoan}
                            </Text>
                            <Badge
                                size="sm"
                                variant="light"
                                color={getRoleColor(user.vaiTro || '')}
                            >
                                {user.vaiTro}
                            </Badge>
                        </Group>
                        <Text size="sm" className="text-zinc-500 font-medium">
                            @{user.taiKhoan}
                        </Text>
                        <Text size="xs" className="text-zinc-400">
                            {user.email}
                        </Text>
                    </Stack>
                </Stack>
            ) : (
                <Group justify="space-between" wrap="nowrap">
                    <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
                        <Avatar
                            src={user.avatar}
                            size={54}
                            radius={999}
                            className="shadow-md ring-2 ring-transparent group-hover:ring-zinc-100 dark:group-hover:ring-zinc-800 transition-all duration-300"
                        />
                        <Stack gap={2} style={{ overflow: 'hidden' }}>
                            <Group gap="xs">
                                <Text fw={800} size="md" className="truncate dark:text-white tracking-tight">
                                    {user.hoTen || user.taiKhoan}
                                </Text>
                                <Badge
                                    size="xs"
                                    variant="outline"
                                    color={getRoleColor(user.vaiTro || '')}
                                    className="font-black uppercase tracking-widest text-[8px] h-[16px] px-1.5"
                                >
                                    {user.vaiTro}
                                </Badge>
                            </Group>
                            <Text size="xs" className="text-zinc-500 font-medium truncate tracking-tight">
                                @{user.taiKhoan}
                            </Text>
                            <Text size="xs" className="text-zinc-400 font-medium truncate mt-0.5">
                                {user.email}
                            </Text>
                        </Stack>
                    </Group>

                    {!isMe && (
                        <Button
                            {...btnProps}
                            radius="md"
                            size="xs"
                            fw={900}
                            loading={sendRequestMutation.isPending || handleRequestMutation.isPending || unfriendMutation.isPending}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAction();
                            }}
                            className={`px-4 min-w-[100px] h-[34px] uppercase tracking-widest text-[10px] shadow-sm ${btnProps.variant === 'filled' && btnProps.color === 'black'
                                ? 'dark:bg-white dark:text-black'
                                : btnProps.variant === 'outline'
                                    ? 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-600'
                                    : ''
                                }`}
                        >
                            {btnProps.children}
                        </Button>
                    )}
                </Group>
            )}
        </Paper>
    );
};
