import { ActionIcon, Group, Textarea, useMantineTheme } from "@mantine/core";
import { IconSend, IconPhoto, IconMoodSmile, IconMicrophone } from "@tabler/icons-react";
import { useState } from "react";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";

interface ChatInputProps {
    channelId: number;
    onTyping?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ channelId, onTyping }) => {
    const [content, setContent] = useState("");
    const sendMessageMutation = AppMutation().chat.useSendMessage();

    const handleSend = async () => {
        if (!content.trim()) return;

        try {
            await sendMessageMutation.mutateAsync({
                kenhChatId: channelId,
                noiDung: content,
                loai: 'VAN_BAN'
            });
            setContent("");
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to send message',
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
        <Group p="sm" gap="xs" align="flex-end" className="bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-900">
            <Group gap={4} pb={4} visibleFrom="sm">
                <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                    <IconPhoto size={20} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                    <IconMicrophone size={20} />
                </ActionIcon>
            </Group>

            <Textarea
                value={content}
                onChange={(e) => {
                    setContent(e.currentTarget.value);
                    onTyping?.();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
                autosize
                minRows={1}
                maxRows={5}
                radius="xl"
                size="md"
                classNames={{
                    input: "bg-gray-100 dark:bg-zinc-900 border-0 focus:ring-0 py-2.5 px-4"
                }}
                style={{ flex: 1 }}
            />

            <ActionIcon
                variant="filled"
                color="black"
                radius="xl"
                size="lg"
                className="mb-1 dark:bg-white dark:text-black transition-transform active:scale-90"
                onClick={handleSend}
                loading={sendMessageMutation.isPending}
                disabled={!content.trim()}
            >
                <IconSend size={18} stroke={2} className="ml-0.5" />
            </ActionIcon>
        </Group>
    );
}
