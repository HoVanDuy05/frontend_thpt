import { ActionIcon, Textarea, useMantineColorScheme, TextInput, Text } from "@mantine/core";
import {
    IconSend,
    IconPaperclip,
    IconMoodSmile,
    IconX,
    IconThumbUp,
    IconPlus,
    IconPhoto,
    IconMicrophone,
} from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import { useAppMutation } from "@/api/hooks/useAppMutation";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { AppMutation } from "@/api/AppMutation";
import { useAppStore } from "@/providers/store/useAppStore";
import { useTranslations } from "next-intl";
import { VoiceRecorder } from "./VoiceRecorder";

interface ChatInputProps {
    channelId: number;
    onTyping: () => void;
    replyingTo: any | null;
    onReply: (message: any | null) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ channelId, onTyping, replyingTo, onReply }) => {
    const { user } = useAppStore();
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const [message, setMessage] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const t = useTranslations('chat');

    const isActive = isFocused || message.trim().length > 0;

    const sendMessageMutation = useAppMutation<"sendMessage">({
        url: { baseUrl: "/communication/chat/messages" }
    });

    const uploadImageMutation = AppMutation().upload.useUploadImage();
    const uploadAudioMutation = AppMutation().upload.useUploadAudio();

    const handleSend = async (messageContent: string = message, type: 'VAN_BAN' | 'HINH_ANH' | 'TEP' | 'GHI_AM' = 'VAN_BAN', fileUrl?: string) => {
        if (!messageContent.trim() && !fileUrl) return;

        const tempId = -Date.now();
        const messagePayload = {
            kenhChatId: channelId,
            noiDung: fileUrl || messageContent.trim(),
            loai: type,
            duongDanTep: fileUrl,
            tinNhanGocId: replyingTo?.id || undefined,
        };

        // 1. Create Optimistic Message
        const optimisticMessage = {
            id: tempId,
            kenhChatId: channelId,
            nguoiGuiId: user?.id,
            noiDung: messagePayload.noiDung,
            loai: type,
            duongDanTep: fileUrl,
            ngayGui: new Date().toISOString(),
            nguoiGui: {
                id: user?.id,
                taiKhoan: user?.taiKhoan || 'Me',
                avatar: user?.avatar || null,
                hoTen: user?.hoTen || user?.taiKhoan || 'User',
                hoSoHocSinh: user?.hoSoHocSinh || null,
                hoSoGiaoVien: user?.hoSoGiaoVien || null
            },
            tinNhanGoc: replyingTo,
            isPending: true // Flag for UI if needed
        };

        // 2. Pre-update Cache (Optimistic)
        const chatMessagesKey = ["chat", "messages", channelId];

        // Update Message List (for all pages of this channel)
        queryClient.setQueriesData({
            predicate: (query) => {
                const key = query.queryKey;
                return Array.isArray(key) && key[1] === 'chat' && key[2] === 'messages' && Number(key[3]) === Number(channelId);
            }
        }, (oldData: any) => {
            if (!Array.isArray(oldData)) return [optimisticMessage];
            // API returns chronological (Oldest -> Newest) based on ChatWindow rendering.
            return [...oldData, optimisticMessage];
        });

        // Update Channel List Preview
        queryClient.setQueriesData({
            queryKey: ["chat", "channels"] as any
        }, (oldData: any) => {
            if (!Array.isArray(oldData)) return oldData;
            const updateChannel = (ch: any) => {
                if (ch.id !== channelId) return ch;
                return {
                    ...ch,
                    tinNhans: [optimisticMessage],
                    updatedAt: new Date().toISOString()
                };
            };
            return oldData.map((item: any) =>
                item.kenhChat ? { ...item, kenhChat: updateChannel(item.kenhChat) } : updateChannel(item)
            );
        });

        if (type === 'VAN_BAN') setMessage("");
        onReply(null); // Clear replyingTo after sending

        try {
            // 3. Execute Mutation
            const newMessage = await sendMessageMutation.mutateAsync(messagePayload);

            // 4. Replace Optimistic Message with Real Message
            queryClient.setQueriesData({
                predicate: (query) => {
                    const key = query.queryKey;
                    return Array.isArray(key) && key[1] === 'chat' && key[2] === 'messages' && Number(key[3]) === Number(channelId);
                }
            }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.map(m => m.id === tempId ? newMessage : m);
            });

            // Channel list already updated via optimistic update + socket events
            // No need to invalidate/refetch here
        } catch (error: any) {
            console.error('Failed to send message:', error);

            // 5. Rollback Cache on Error
            queryClient.setQueriesData({
                predicate: (query) => {
                    const key = query.queryKey;
                    return Array.isArray(key) && key[1] === 'chat' && key[2] === 'messages' && Number(key[3]) === Number(channelId);
                }
            }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.filter(m => m.id !== tempId);
            });

            notifications.show({
                title: t('send_error_title'),
                message: error.response?.data?.message || t('send_error_message'),
                color: 'red'
            });

            // Restore message if it was a text message so user can retry
            if (type === 'VAN_BAN') setMessage(messageContent);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (!isMobile) {
                e.preventDefault();
                handleSend();
            }
            // On mobile, let Enter be Enter (line break) and use Send button to send explicitly if they have issues
            // Actually, most mobile users expect Send on Enter, but the user complained.
            // I'll keep default behavior for mobile to allow line breaks if they want.
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Immediate UI Feedback
        const tempId = -Date.now();
        const previewUrl = URL.createObjectURL(file);

        // Optimistic Message
        const optimisticMessage = {
            id: tempId,
            kenhChatId: channelId,
            nguoiGuiId: user?.id,
            noiDung: previewUrl,
            loai: 'HINH_ANH',
            duongDanTep: previewUrl,
            ngayGui: new Date().toISOString(),
            nguoiGui: {
                id: user?.id,
                taiKhoan: user?.taiKhoan || 'Me',
                avatar: user?.avatar || null,
                hoTen: user?.hoTen || user?.taiKhoan || 'User',
            },
            isPending: true
        };

        // Add to Cache
        queryClient.setQueriesData({
            predicate: (query) => {
                const key = query.queryKey;
                return Array.isArray(key) && key[1] === 'chat' && key[2] === 'messages' && Number(key[3]) === Number(channelId);
            }
        }, (oldData: any) => {
            if (!Array.isArray(oldData)) return [optimisticMessage];
            return [...oldData, optimisticMessage];
        });

        // Clear input immediately
        if (e.target) e.target.value = '';

        try {
            // 2. Upload in Background
            const formData = new FormData();
            formData.append('file', file);
            const res = await uploadImageMutation.mutateAsync(formData as any);

            // 3. Send Real Message
            // We use handleSend to send the API request for the message itself, 
            // but we need to intercept the cache update to replace our specific tempId

            const messagePayload = {
                kenhChatId: channelId,
                noiDung: res.url,
                loai: 'HINH_ANH',
                duongDanTep: res.url,
                tinNhanGocId: replyingTo?.id || undefined,
            };

            const newMessage = await sendMessageMutation.mutateAsync(messagePayload as any);

            // 4. Replace Optimistic Message
            queryClient.setQueriesData({
                predicate: (query) => {
                    const key = query.queryKey;
                    return Array.isArray(key) && key[1] === 'chat' && key[2] === 'messages' && Number(key[3]) === Number(channelId);
                }
            }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.map((m: any) => m.id === tempId ? newMessage : m);
            });

        } catch (error) {
            console.error(error);
            notifications.show({ title: t('upload_error_title'), message: t('upload_error_message'), color: 'red' });
            // Remove optimistic message on failure
            queryClient.setQueriesData({
                predicate: (query) => {
                    const key = query.queryKey;
                    return Array.isArray(key) && key[1] === 'chat' && key[2] === 'messages' && Number(key[3]) === Number(channelId);
                }
            }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.filter((m: any) => m.id !== tempId);
            });
        }
    };

    const handleVoiceSend = async (audioBlob: Blob) => {
        // 1. Close Recorder IMMEDIATELY
        setIsRecording(false);

        const tempId = -Date.now();
        const previewUrl = URL.createObjectURL(audioBlob);

        // 2. Optimistic Message
        const optimisticMessage = {
            id: tempId,
            kenhChatId: channelId,
            nguoiGuiId: user?.id,
            noiDung: 'Voice message',
            loai: 'GHI_AM',
            duongDanTep: previewUrl,
            ngayGui: new Date().toISOString(),
            nguoiGui: {
                id: user?.id,
                taiKhoan: user?.taiKhoan || 'Me',
                avatar: user?.avatar || null,
                hoTen: user?.hoTen || user?.taiKhoan || 'User',
            },
            isPending: true
        };

        queryClient.setQueriesData({
            predicate: (query) => {
                const key = query.queryKey;
                // Key format: [url, "chat", "messages", channelId, page]
                return Array.isArray(key) && key[1] === 'chat' && key[2] === 'messages' && Number(key[3]) === Number(channelId);
            }
        }, (oldData: any) => {
            if (!Array.isArray(oldData)) return [optimisticMessage];
            // API returns chronological (Oldest -> Newest) based on ChatWindow rendering.
            return [...oldData, optimisticMessage];
        });

        const formData = new FormData();
        // Use correct extension based on MIME type detection in VoiceRecorder if possible, but webm is standard for uploads usually.
        // If backend converts, it's fine. If not, we might need to be careful.
        // For now, keep sending as 'voice.webm' or detect.
        formData.append('file', audioBlob, 'voice.webm');

        try {
            // 3. Upload Background
            const res = await uploadAudioMutation.mutateAsync(formData as any);

            // 4. Send Real Message
            const messagePayload = {
                kenhChatId: channelId,
                noiDung: res.url,
                loai: 'GHI_AM',
                duongDanTep: res.url,
            };

            const newMessage = await sendMessageMutation.mutateAsync(messagePayload as any);

            // 5. Replace Optimistic Message
            queryClient.setQueriesData({
                predicate: (query) => {
                    const key = query.queryKey;
                    return Array.isArray(key) && key[0] === 'chat' && key[1] === 'messages' && key[2] === channelId;
                }
            }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.map((m: any) => m.id === tempId ? newMessage : m);
            });

        } catch (error) {
            console.error('Voice upload error:', error);
            // Remove optimistic message on failure
            queryClient.setQueriesData({
                predicate: (query) => {
                    const key = query.queryKey;
                    return Array.isArray(key) && key[0] === 'chat' && key[1] === 'messages' && key[2] === channelId;
                }
            }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.filter((m: any) => m.id !== tempId);
            });
            notifications.show({ title: t('send_error_title'), message: t('send_error_message'), color: 'red' });
        }
    };

    return (
        <div className="px-2 py-2 sm:py-3 bg-white dark:bg-[#1c1e21] border-t border-gray-100 dark:border-white/5 shrink-0">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            {replyingTo && (
                <div className="px-3 py-1.5 bg-gray-50/95 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex gap-2 items-center animate-in slide-in-from-bottom-2 duration-200 overflow-hidden">
                    <div className="w-0.5 bg-indigo-500 h-6 shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                        <Text size="10px" fw={700} c="indigo" className="uppercase tracking-wider leading-none mb-1">
                            {t('replying_to', { name: replyingTo.nguoiGui?.hoTen || replyingTo.nguoiGui?.taiKhoan })}
                        </Text>
                        <Text size="11px" c="dimmed" className="leading-tight block break-words">
                            {replyingTo.loai === 'VAN_BAN' ? replyingTo.noiDung : t('attachment')}
                        </Text>
                    </div>
                    <ActionIcon variant="subtle" color="gray" size="xs" radius="xl" onClick={() => onReply(null)} className="shrink-0">
                        <IconX size={14} />
                    </ActionIcon>
                </div>
            )}

            <div className="flex items-end gap-1.5 w-full min-h-[40px]">
                {isRecording ? (
                    <VoiceRecorder onSend={handleVoiceSend} onCancel={() => setIsRecording(false)} />
                ) : (
                    <>
                        <div className="flex items-center shrink-0 h-10 gap-0.5">
                            {!isActive ? (
                                <div className="flex items-center gap-0.5">
                                    <ActionIcon variant="subtle" radius="xl" size={32} className="text-indigo-500">
                                        <IconPlus size={20} />
                                    </ActionIcon>
                                    <ActionIcon variant="subtle" radius="xl" size={32} onClick={handleImageClick} className="text-indigo-500">
                                        <IconPhoto size={20} />
                                    </ActionIcon>
                                </div>
                            ) : (
                                <ActionIcon variant="subtle" radius="xl" size={32} className="text-indigo-500">
                                    <IconPlus size={20} />
                                </ActionIcon>
                            )}
                        </div>

                        <div className="flex-1 bg-[#f0f2f5] dark:bg-[#3A3B3C] rounded-[20px] px-3.5 flex items-end">
                            <Textarea
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.currentTarget.value);
                                    onTyping();
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={handleKeyDown}
                                placeholder={t('type_message')}
                                autosize
                                minRows={1}
                                maxRows={5}
                                variant="unstyled"
                                className="flex-1"
                                classNames={{
                                    input: "py-2 text-[15px] leading-[1.4] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                }}
                            />
                        </div>

                        <div className="shrink-0 flex items-center h-10">
                            {message.trim() ? (
                                <ActionIcon
                                    radius="xl"
                                    size={34}
                                    variant="transparent"
                                    className="text-indigo-500 hover:scale-110 active:scale-95 transition-transform"
                                    onClick={() => handleSend()}
                                    loading={sendMessageMutation.isPending}
                                >
                                    <IconSend size={24} fill="currentColor" stroke={1} />
                                </ActionIcon>
                            ) : (
                                <ActionIcon
                                    radius="xl"
                                    size={34}
                                    variant="transparent"
                                    className="text-indigo-500"
                                    onClick={() => setIsRecording(true)}
                                >
                                    <IconMicrophone size={24} />
                                </ActionIcon>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div >
    );
};
