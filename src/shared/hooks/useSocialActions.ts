"use client";

import React from "react";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";

interface UseSocialActionsProps {
    userId: number;
    profile: any;
    refetchProfile: () => void;
}

export function useSocialActions({ userId, profile, refetchProfile }: UseSocialActionsProps) {
    const t = useTranslations('profile');

    const followMutation = AppMutation().social.useFollowUser();
    const sendRequestMutation = AppMutation().friends.useSendRequest(userId);
    const handleRequestMutation = AppMutation().friends.useHandleRequest(userId);
    const unfriendMutation = AppMutation().friends.useUnfriend(userId);

    const handleAction = async (actionOrEvent?: string | any) => {
        // Fix for TypeScript event compatibility
        const action = typeof actionOrEvent === 'string' ? actionOrEvent : undefined;

        try {
            if (!profile) return;

            const status = profile.friendshipStatus;

            if (action === 'UNFOLLOW') {
                await followMutation.mutateAsync({ urlParams: { id: userId } });
            } else if (status === 'NONE') {
                // Add friend and auto-follow
                await sendRequestMutation.mutateAsync(undefined);
            } else if (status === 'RECEIVED') {
                await handleRequestMutation.mutateAsync({ action: 'ACCEPT' });
            } else if (status === 'SENT' || action === 'CANCEL') {
                await handleRequestMutation.mutateAsync({ action: 'CANCEL' });
            } else if (status === 'FRIEND' || action === 'UNFRIEND') {
                await unfriendMutation.mutateAsync(undefined);
            }
            await refetchProfile();
        } catch (error) {
            notifications.show({
                title: 'Lỗi',
                message: t('error.actionError'),
                color: 'red'
            });
        }
    };

    return {
        handleAction,
        isLoading: followMutation.isPending ||
            sendRequestMutation.isPending ||
            handleRequestMutation.isPending ||
            unfriendMutation.isPending,
        followMutation,
        sendRequestMutation,
        handleRequestMutation,
        unfriendMutation
    };
}
