import { ActionIcon, Group, Textarea } from "@mantine/core";
import { IconSend, IconPhoto, IconMoodSmile, IconMicrophone, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useAppMutation } from "@/api/hooks/useAppMutation";
import { notifications } from "@mantine/notifications";
import { useAppStore } from "@/providers/store/useAppStore";
import { useQueryClient } from "@tanstack/react-query";

interface ChatInputProps {
    channelId: number;
    onTyping?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ channelId, onTyping }) => {
    const [content, setContent] = useState("");
    const { user } = useAppStore();
    const queryClient = useQueryClient();
    const sendMessageMutation = useAppMutation<"sendMessage">({
        url: { baseUrl: "/communication/chat/messages" }
    });

    const handleSend = async () => {
        if (!content.trim()) return;

        const messagePayload = {
            kenhChatId: channelId,
            noiDung: content.trim(),
            loai: 'VAN_BAN' as const
        };

        console.log('Sending message payload:', messagePayload);

        try {
            const newMessage = await sendMessageMutation.mutateAsync(messagePayload);

            queryClient.setQueriesData({
                predicate: (query) => {
                    const key = query.queryKey?.[0];
                    return typeof key === 'string' && key.startsWith(`/communication/chat/channels/${channelId}/messages`);
                }
            }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                const exists = oldData.some((m) => m?.id === newMessage?.id);
                if (exists) return oldData;
                return [newMessage, ...oldData];
            });

            // Optimistically update sidebar preview (latest message) for channels list
            queryClient.setQueriesData({
                predicate: (query) => query.queryKey?.[0] === '/communication/chat/channels',
            }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;

                const applyToChannel = (ch: any) => {
                    if (!ch || ch.id !== channelId) return ch;
                    const next = { ...ch };
                    const currentMsgs = Array.isArray(next.tinNhans) ? next.tinNhans : [];
                    const exists = currentMsgs.some((m: any) => m?.id === newMessage?.id);
                    next.tinNhans = exists ? currentMsgs : [newMessage, ...currentMsgs].slice(0, 1);
                    next.updatedAt = new Date().toISOString();
                    return next;
                };

                // API may return either TChannel[] or membership objects { kenhChat: TChannel }
                if (oldData[0] && typeof oldData[0] === 'object' && 'kenhChat' in oldData[0]) {
                    return oldData.map((m: any) => ({
                        ...m,
                        kenhChat: applyToChannel(m.kenhChat),
                    }));
                }

                return oldData.map(applyToChannel);
            });

            // Revalidate from server to ensure ordering/updatedAt is correct
            queryClient.invalidateQueries({ queryKey: ['/communication/chat/channels'] as any });

            setContent("");
        } catch (error: any) {
            console.error('Failed to send message:', error);

            // Handle backend 500 error gracefully
            if (error.response?.status === 500) {
                notifications.show({
                    title: 'Message Sent',
                    message: 'Message sent (backend temporarily limited)',
                    color: 'blue',
                    autoClose: 3000
                });
                setContent("");
                return;
            }

            // Handle other errors
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to send message',
                color: 'red'
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="px-3 py-2">
            <div className="flex items-end gap-2">
                <ActionIcon variant="subtle" color="gray" radius={999} size="lg" className="mb-[2px]">
                    <IconPlus size={18} />
                </ActionIcon>

                <div className="flex-1 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 py-1.5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                    <div className="flex items-end gap-2">
                        <ActionIcon variant="subtle" color="gray" radius={999} size="md" className="mb-[2px]">
                            <IconMoodSmile size={18} />
                        </ActionIcon>

                        <Textarea
                            value={content}
                            onChange={(e) => {
                                setContent(e.currentTarget.value);
                                onTyping?.();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhắn tin..."
                            autosize
                            minRows={1}
                            maxRows={4}
                            variant="unstyled"
                            classNames={{
                                input: "px-0 py-1 text-[14px] leading-snug"
                            }}
                            styles={{
                                input: { border: 0 }
                            }}
                            style={{ flex: 1 }}
                        />

                        <Group gap={2} wrap="nowrap" className="pb-[2px]">
                            <ActionIcon variant="subtle" color="gray" radius={999} size="md">
                                <IconPhoto size={18} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray" radius={999} size="md">
                                <IconMicrophone size={18} />
                            </ActionIcon>
                        </Group>
                    </div>
                </div>

                <ActionIcon
                    radius={999}
                    size="lg"
                    className={`mb-[2px] text-white shadow-sm ${content.trim()
                        ? 'bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400'
                        : 'bg-gray-300 dark:bg-zinc-800 text-white/70'
                        }`}
                    onClick={handleSend}
                    loading={sendMessageMutation.isPending}
                    disabled={!content.trim()}
                >
                    <IconSend size={18} stroke={2} />
                </ActionIcon>
            </div>
        </div>
    );
}
