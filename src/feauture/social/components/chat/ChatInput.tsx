import { ActionIcon, Textarea, useMantineColorScheme, TextInput } from "@mantine/core";
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
                avatar: user?.avatar,
                hoTen: user?.hoTen
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
                return Array.isArray(key) && key[0] === 'chat' && key[1] === 'messages' && key[2] === channelId;
            }
        }, (oldData: any) => {
            if (!Array.isArray(oldData)) return [optimisticMessage];
            // If the API returns newest first, we should prepend. 
            // If oldest first, we append.
            // Based on ChatWindow's sort, we probably want oldest at start of array for the cache too, 
            // but usually ChatWindow sorts everything itself. 
            // Let's prepend to match the "newest first" pattern common in caches.
            return [optimisticMessage, ...oldData];
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
                    return Array.isArray(key) && key[0] === 'chat' && key[1] === 'messages' && key[2] === channelId;
                }
            }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.map(m => m.id === tempId ? newMessage : m);
            });

            // Re-sync channel list to be sure
            queryClient.invalidateQueries({ queryKey: ["chat", "channels"] as any });
        } catch (error: any) {
            console.error('Failed to send message:', error);

            // 5. Rollback Cache on Error
            queryClient.setQueriesData({
                predicate: (query) => {
                    const key = query.queryKey;
                    return Array.isArray(key) && key[0] === 'chat' && key[1] === 'messages' && key[2] === channelId;
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
            e.preventDefault();
            handleSend();
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            notifications.show({ id: 'uploading', title: t('uploading_image_title'), message: t('uploading_image_message'), loading: true, autoClose: false });
            const res = await uploadImageMutation.mutateAsync(formData as any);
            notifications.update({ id: 'uploading', title: t('upload_success_title'), message: t('upload_success_message'), color: 'green', autoClose: 2000, loading: false });
            await handleSend(res.url, 'HINH_ANH', res.url);
        } catch (error) {
            console.error(error);
            notifications.update({ id: 'uploading', title: t('upload_error_title'), message: t('upload_error_message'), color: 'red', autoClose: 3000, loading: false });
        } finally {
            if (e.target) e.target.value = '';
        }
    };

    const handleVoiceSend = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice.webm');

        try {
            notifications.show({ id: 'uploading-voice', title: t('uploading_voice_title'), message: t('uploading_voice_message'), loading: true, autoClose: false });
            const res = await uploadAudioMutation.mutateAsync(formData as any);
            notifications.update({ id: 'uploading-voice', title: t('upload_success_title'), message: t('upload_success_message'), color: 'green', autoClose: 2000, loading: false });
            await handleSend(res.url, 'GHI_AM', res.url);
        } catch (error) {
            console.error(error);
            notifications.update({ id: 'uploading-voice', title: t('upload_error_title'), message: t('upload_error_message'), color: 'red', autoClose: 3000, loading: false });
        } finally {
            setIsRecording(false);
        }
    };

    return (
        <div className="px-2 py-3 bg-white dark:bg-[#1c1e21] border-t border-gray-100 dark:border-white/5">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            {replyingTo && (
                <div className="px-4 py-2 bg-gray-50 dark:bg-zinc-800 border-t border-gray-100 dark:border-zinc-700 flex justify-between items-center text-xs text-gray-500">
                    <span>
                        {t('replying_to', { name: replyingTo.nguoiGui?.hoTen || replyingTo.nguoiGui?.taiKhoan })}
                    </span>
                    <ActionIcon variant="transparent" size="xs" onClick={() => onReply(null)}>
                        <IconX size={14} />
                    </ActionIcon>
                </div>
            )}

            <div className="flex items-end gap-1 sm:gap-1 max-w-[1244px] mx-auto min-h-[36px]">
                {isRecording ? (
                    <VoiceRecorder onSend={handleVoiceSend} onCancel={() => setIsRecording(false)} />
                ) : (
                    <>
                        {/* Left Actions */}
                        <div className="flex items-center shrink-0 mb-[2px]">
                            {!isActive ? (
                                <div className="flex items-center gap-0.5 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <ActionIcon variant="subtle" radius="xl" size="lg" className="hover:bg-gray-100 dark:hover:bg-white/10 text-[#0084FF]">
                                        <IconPlus size={24} stroke={2.5} />
                                    </ActionIcon>
                                    <ActionIcon variant="subtle" radius="xl" size="lg" onClick={handleImageClick} className="hover:bg-gray-100 dark:hover:bg-white/10 text-[#0084FF]">
                                        <IconPhoto size={24} stroke={2.5} />
                                    </ActionIcon>
                                    <ActionIcon variant="subtle" radius="xl" size="lg" className="hover:bg-gray-100 dark:hover:bg-white/10 text-[#0084FF]">
                                        <IconMoodSmile size={24} stroke={2.5} />
                                    </ActionIcon>
                                </div>
                            ) : (
                                <div className="animate-in fade-in zoom-in duration-300">
                                    <ActionIcon variant="subtle" radius="xl" size="lg" className="hover:bg-gray-100 dark:hover:bg-white/10 text-[#0084FF]">
                                        <IconPaperclip size={24} stroke={3} />
                                    </ActionIcon>
                                </div>
                            )}
                        </div>

                        {/* Input Pill */}
                        <div className="flex-1 min-w-0 flex items-end bg-[#F0F2F5] dark:bg-[#3A3B3C] rounded-[20px] px-3 py-[3px] mb-[2px]">
                            <div className="flex-1 overflow-hidden">
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
                                    maxRows={8}
                                    variant="unstyled"
                                    className="w-full"
                                    classNames={{
                                        input: "text-[15px] leading-tight text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 py-1.5 min-h-[20px]"
                                    }}
                                    styles={{
                                        input: {
                                            border: 0,
                                            width: '100%',
                                            '&::placeholder': {
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden'
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <ActionIcon variant="subtle" radius="xl" size="md" className="shrink-0 hover:bg-transparent text-[#0084FF] mb-[2px]">
                                <IconMoodSmile size={24} stroke={2} />
                            </ActionIcon>
                        </div>

                        {/* Right Action (Send/Like/Voice) */}
                        <div className="shrink-0 flex items-center pl-1 mb-[2px]">
                            {message.trim() ? (
                                <ActionIcon
                                    radius="xl"
                                    size="lg"
                                    variant="transparent"
                                    className="transition-all hover:scale-110 active:scale-90 text-[#0084FF]"
                                    onClick={() => handleSend()}
                                    loading={sendMessageMutation.isPending || uploadImageMutation.isPending || uploadAudioMutation.isPending}
                                >
                                    <IconSend size={26} fill="currentColor" stroke={1} />
                                </ActionIcon>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <ActionIcon
                                        radius="xl"
                                        size="lg"
                                        variant="transparent"
                                        className="transition-all hover:scale-110 active:scale-90 text-[#0084FF]"
                                        onClick={() => setIsRecording(true)}
                                    >
                                        <IconMicrophone size={26} stroke={2} />
                                    </ActionIcon>
                                    <ActionIcon
                                        radius="xl"
                                        size="lg"
                                        variant="transparent"
                                        className="transition-all hover:scale-110 active:scale-90 text-[#0084FF]"
                                        onClick={() => handleSend("👍")}
                                    >
                                        <IconThumbUp size={26} fill="currentColor" stroke={1} />
                                    </ActionIcon>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
