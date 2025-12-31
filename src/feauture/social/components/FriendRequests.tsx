"use client";

import { useState } from "react";
import {
    Box,
    Text,
    Avatar,
    Group,
    Button,
    Stack,
    Title,
    Card,
    Loader,
    Alert
} from "@mantine/core";
import { IconUserPlus, IconUserCheck, IconUserX, IconCheck, IconX } from "@tabler/icons-react";
import { FriendRequest } from "../types";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";

export function FriendRequests() {
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

    // Queries
    const receivedRequestsQuery = AppQuery.friends.useReceivedRequests();
    const sentRequestsQuery = AppQuery.friends.useSentRequests();

    // Mutations
    const handleRequestMutation = AppMutation().friends.useHandleRequest;

    const handleAcceptRequest = (requesterId: number) => {
        handleRequestMutation(requesterId).mutate({ action: 'ACCEPT' });
    };

    const handleDeclineRequest = (requesterId: number) => {
        handleRequestMutation(requesterId).mutate({ action: 'DECLINE' });
    };

    const handleCancelRequest = (receiverId: number) => {
        handleRequestMutation(receiverId).mutate({ action: 'CANCEL' });
    };

    const isLoading = receivedRequestsQuery.isLoading || sentRequestsQuery.isLoading;
    const error = receivedRequestsQuery.error || sentRequestsQuery.error;

    if (isLoading) {
        return (
            <Box className="flex justify-center items-center py-20">
                <Loader size="lg" />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert color="red" title="Lỗi" className="mb-4">
                {error.message}
            </Alert>
        );
    }

    const renderRequestCard = (request: FriendRequest, type: 'received' | 'sent') => {
        const user = type === 'received' ? request.nguoiGui : request.nguoiNhan;

        if (!user) return null;

        return (
            <Card key={request.id} className="mb-3" withBorder>
                <Group justify="space-between" align="center">
                    <Group>
                        <Avatar
                            src={user.avatar}
                            size="md"
                            radius="xl"
                        >
                            {user.hoTen?.charAt(0) || user.taiKhoan.charAt(0)}
                        </Avatar>
                        <Box>
                            <Text fw={600}>{user.hoTen || user.taiKhoan}</Text>
                            <Text size="sm" c="dimmed">@{user.taiKhoan}</Text>
                        </Box>
                    </Group>

                    {type === 'received' ? (
                        <Group gap="xs">
                            <Button
                                size="sm"
                                variant="light"
                                color="green"
                                leftSection={<IconCheck size={16} />}
                                onClick={() => handleAcceptRequest(request.nguoiGuiId)}
                                loading={handleRequestMutation(request.nguoiGuiId).isPending}
                            >
                                Chấp nhận
                            </Button>
                            <Button
                                size="sm"
                                variant="light"
                                color="red"
                                leftSection={<IconX size={16} />}
                                onClick={() => handleDeclineRequest(request.nguoiGuiId)}
                                loading={handleRequestMutation(request.nguoiGuiId).isPending}
                            >
                                Từ chối
                            </Button>
                        </Group>
                    ) : (
                        <Button
                            size="sm"
                            variant="light"
                            color="gray"
                            leftSection={<IconX size={16} />}
                            onClick={() => handleCancelRequest(request.nguoiNhanId)}
                            loading={handleRequestMutation(request.nguoiNhanId).isPending}
                        >
                            Hủy lời mời
                        </Button>
                    )}
                </Group>
            </Card>
        );
    };

    return (
        <Box>
            <Title order={3} mb="md" className="flex items-center gap-2">
                <IconUserPlus size={24} />
                Lời mời kết bạn
            </Title>

            {/* Tabs */}
            <Group mb="md" gap="xs">
                <Button
                    variant={activeTab === 'received' ? 'filled' : 'light'}
                    onClick={() => setActiveTab('received')}
                >
                    Đã nhận ({receivedRequestsQuery.data?.length || 0})
                </Button>
                <Button
                    variant={activeTab === 'sent' ? 'filled' : 'light'}
                    onClick={() => setActiveTab('sent')}
                >
                    Đã gửi ({sentRequestsQuery.data?.length || 0})
                </Button>
            </Group>

            {/* Content */}
            <Stack>
                {activeTab === 'received' ? (
                    receivedRequestsQuery.data && receivedRequestsQuery.data.length > 0 ? (
                        receivedRequestsQuery.data.map(request => renderRequestCard(request, 'received'))
                    ) : (
                        <Box className="text-center py-10">
                            <IconUserCheck size={48} className="mx-auto mb-3 text-gray-400" />
                            <Text c="dimmed">Bạn không có lời mời kết bạn nào</Text>
                        </Box>
                    )
                ) : (
                    sentRequestsQuery.data && sentRequestsQuery.data.length > 0 ? (
                        sentRequestsQuery.data.map(request => renderRequestCard(request, 'sent'))
                    ) : (
                        <Box className="text-center py-10">
                            <IconUserX size={48} className="mx-auto mb-3 text-gray-400" />
                            <Text c="dimmed">Bạn chưa gửi lời mời kết bạn nào</Text>
                        </Box>
                    )
                )}
            </Stack>
        </Box>
    );
}
