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
    Alert,
    Divider,
    Badge,
    ActionIcon,
    Tooltip,
    Tabs
} from "@mantine/core";
import { IconUserPlus, IconUserCheck, IconUserX, IconCheck, IconX, IconMessage } from "@tabler/icons-react";
import { FriendRequest } from "../types";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";

// Separate component to handle hooks properly
function RequestCard({ request, type }: { request: FriendRequest; type: 'received' | 'sent' }) {
    const user = type === 'received' ? request.nguoiGui : request.nguoiNhan;
    const requestId = type === 'received' ? request.nguoiGuiId : request.nguoiNhanId;
    const mutation = AppMutation().friends.useHandleRequest(requestId);

    const handleAcceptRequest = () => {
        mutation.mutate({ action: 'ACCEPT' });
    };

    const handleDeclineRequest = () => {
        mutation.mutate({ action: 'DECLINE' });
    };

    const handleCancelRequest = () => {
        mutation.mutate({ action: 'CANCEL' });
    };

    if (!user) return null;

    return (
        <Card className="mb-4" withBorder shadow="sm" p="md">
            <Group justify="space-between" align="center" wrap="nowrap">
                <Group gap="md" align="center">
                    <Avatar
                        src={user.avatar}
                        size="lg"
                        radius="xl"
                    >
                        {user.hoTen?.charAt(0) || user.taiKhoan.charAt(0)}
                    </Avatar>
                    <Box>
                        <Text fw={600} size="md">{user.hoTen || user.taiKhoan}</Text>
                        <Group gap="xs" align="center">
                            <Text size="sm" c="dimmed">@{user.taiKhoan}</Text>
                            {type === 'received' && (
                                <Badge size="xs" color="blue" variant="light">
                                    Lời mời mới
                                </Badge>
                            )}
                        </Group>
                        <Text size="xs" c="dimmed" mt={2}>
                            {new Date(request.ngayTao).toLocaleDateString('vi-VN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </Text>
                    </Box>
                </Group>

                {type === 'received' ? (
                    <Group gap="xs">
                        <Tooltip label="Chấp nhận lời mời">
                            <Button
                                size="sm"
                                variant="filled"
                                color="blue"
                                leftSection={<IconCheck size={14} />}
                                onClick={handleAcceptRequest}
                                loading={mutation.isPending}
                            >
                                Chấp nhận
                            </Button>
                        </Tooltip>
                        <Tooltip label="Xóa lời mời">
                            <ActionIcon
                                size="sm"
                                variant="light"
                                color="gray"
                                onClick={handleDeclineRequest}
                                loading={mutation.isPending}
                            >
                                <IconX size={14} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                ) : (
                    <Group gap="xs">
                        <Tooltip label="Hủy lời mời">
                            <Button
                                size="sm"
                                variant="light"
                                color="gray"
                                onClick={handleCancelRequest}
                                loading={mutation.isPending}
                            >
                                Hủy
                            </Button>
                        </Tooltip>
                        <Tooltip label="Gửi tin nhắn">
                            <ActionIcon
                                size="sm"
                                variant="light"
                                color="blue"
                            >
                                <IconMessage size={14} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                )}
            </Group>
        </Card>
    );
}

export function FriendRequests() {
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

    // Queries
    const receivedRequestsQuery = AppQuery.friends.useReceivedRequests();
    const sentRequestsQuery = AppQuery.friends.useSentRequests();

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

    return (
        <Box>
            <Title order={2} mb="lg" className="flex items-center gap-3">
                <IconUserPlus size={28} />
                Lời mời kết bạn
            </Title>

            {/* Tabs */}
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value as 'received' | 'sent')}>
                <Tabs.List>
                    <Tabs.Tab
                        value="received"
                        leftSection={<IconUserCheck size={16} />}
                    >
                        Đã nhận
                        {receivedRequestsQuery.data && receivedRequestsQuery.data.length > 0 && (
                            <Badge size="xs" ml="xs" color="blue">
                                {receivedRequestsQuery.data.length}
                            </Badge>
                        )}
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="sent"
                        leftSection={<IconUserX size={16} />}
                    >
                        Đã gửi
                        {sentRequestsQuery.data && sentRequestsQuery.data.length > 0 && (
                            <Badge size="xs" ml="xs" color="gray">
                                {sentRequestsQuery.data.length}
                            </Badge>
                        )}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="received" pt="md">
                    {receivedRequestsQuery.data && receivedRequestsQuery.data.length > 0 ? (
                        <Stack>
                            {receivedRequestsQuery.data.map(request => (
                                <RequestCard key={request.id} request={request} type="received" />
                            ))}
                        </Stack>
                    ) : (
                        <Box className="text-center py-16">
                            <IconUserCheck size={64} className="mx-auto mb-4 text-gray-300" />
                            <Title order={4} c="dimmed" mb="sm">Không có lời mời nào</Title>
                            <Text c="dimmed" size="sm">Bạn chưa có lời mời kết bạn nào để xem</Text>
                        </Box>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="sent" pt="md">
                    {sentRequestsQuery.data && sentRequestsQuery.data.length > 0 ? (
                        <Stack>
                            {sentRequestsQuery.data.map(request => (
                                <RequestCard key={request.id} request={request} type="sent" />
                            ))}
                        </Stack>
                    ) : (
                        <Box className="text-center py-16">
                            <IconUserX size={64} className="mx-auto mb-4 text-gray-300" />
                            <Title order={4} c="dimmed" mb="sm">Chưa gửi lời mời</Title>
                            <Text c="dimmed" size="sm">Bạn chưa gửi lời mời kết bạn cho ai</Text>
                        </Box>
                    )}
                </Tabs.Panel>
            </Tabs>
        </Box>
    );
}
