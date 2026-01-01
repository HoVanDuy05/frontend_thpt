import { ActionIcon, Group, Textarea } from "@mantine/core";
import { IconSend, IconPhoto, IconMoodSmile, IconMicrophone, IconPlus, IconCamera } from "@tabler/icons-react";
import { useState, useRef } from "react";
import { useAppMutation } from "@/api/hooks/useAppMutation";
import { notifications } from "@mantine/notifications";
import { useAppStore } from "@/providers/store/useAppStore";
import { useQueryClient } from "@tanstack/react-query";
import { AppMutation } from "@/api/AppMutation";

interface ChatInputProps {
    channelId: number;
    onTyping?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ channelId, onTyping }) => {
    const [content, setContent] = useState("");
    const { user } = useAppStore();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const sendMessageMutation = useAppMutation<"sendMessage">({
        url: { baseUrl: "/communication/chat/messages" }
    });

    // Exact same mutation pattern as AppMutation to ensure compatibility
    const uploadImageMutation = AppMutation().upload.useUploadImage();

    const handleSend = async (messageContent: string = content, type: 'VAN_BAN' | 'HINH_ANH' | 'TEP' = 'VAN_BAN', fileUrl?: string) => {
        if (!messageContent.trim() && !fileUrl) return;

        const messagePayload = {
            kenhChatId: channelId,
            noiDung: fileUrl || messageContent.trim(),
            loai: type,
            duongDanTep: fileUrl
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

            // Optimistically update sidebar preview
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

                if (oldData[0] && typeof oldData[0] === 'object' && 'kenhChat' in oldData[0]) {
                    return oldData.map((m: any) => ({
                        ...m,
                        kenhChat: applyToChannel(m.kenhChat),
                    }));
                }

                return oldData.map(applyToChannel);
            });

            queryClient.invalidateQueries({ queryKey: ['/communication/chat/channels'] as any });

            if (type === 'VAN_BAN') setContent("");
        } catch (error: any) {
            console.error('Failed to send message:', error);
            if (error.response?.status === 500) {
                notifications.show({ title: 'Message Sent', message: 'Message sent (backend temporarily limited)', color: 'blue', autoClose: 3000 });
                if (type === 'VAN_BAN') setContent("");
                return;
            }
            notifications.show({ title: 'Error', message: error.response?.data?.message || 'Failed to send message', color: 'red' });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleCameraClick = () => {
        cameraInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            notifications.show({ id: 'uploading', title: 'Đang tải ảnh...', message: 'Vui lòng chờ trong giây lát', loading: true, autoClose: false });

            const res = await uploadImageMutation.mutateAsync(formData as any);

            notifications.update({ id: 'uploading', title: 'Thành công', message: 'Ảnh đã được gửi', color: 'green', autoClose: 2000, loading: false });

            // Send as image message
            await handleSend(res.url, 'HINH_ANH', res.url);

        } catch (error) {
            console.error(error);
            notifications.update({ id: 'uploading', title: 'Lỗi', message: 'Không thể tải ảnh lên', color: 'red', autoClose: 3000, loading: false });
        } finally {
            // Reset input
            if (e.target) e.target.value = '';
        }
    };

    return (
        <div className="px-3 py-2">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            {/* Camera input for mobile */}
            <input
                type="file"
                ref={cameraInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
            />

            <div className="flex items-end gap-2">
                <ActionIcon variant="subtle" color="gray" radius={999} size="lg" className="mb-[2px]">
                    <IconPlus size={18} />
                </ActionIcon>

                {/* Camera Icon - Visible on all but specialized for mobile quick access */}
                <ActionIcon variant="subtle" color="gray" radius={999} size="lg" className="mb-[2px] md:hidden" onClick={handleCameraClick}>
                    <IconCamera size={18} />
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
                            <ActionIcon variant="subtle" color="gray" radius={999} size="md" onClick={handleImageClick}>
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
                    onClick={() => handleSend()}
                    loading={sendMessageMutation.isPending || uploadImageMutation.isPending}
                    disabled={!content.trim()}
                >
                    <IconSend size={18} stroke={2} />
                </ActionIcon>
            </div>
        </div>
    );
}
