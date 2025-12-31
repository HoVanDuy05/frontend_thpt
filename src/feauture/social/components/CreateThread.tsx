"use client";

import React, { useState, useRef } from 'react';
import { Paper, Group, Avatar, Textarea, Button, Stack, ActionIcon, FileButton, Image, Box, CloseButton, Loader } from '@mantine/core';
import { IconPhoto, IconGif, IconList, IconAt, IconX } from '@tabler/icons-react';
import { AppMutation } from '@/api/AppMutation';
import { AppQuery } from '@/api/AppQuery';
import { notifications } from '@mantine/notifications';

interface CreateThreadProps {
    onPost: (content: string, image?: string) => void;
    loading?: boolean;
}

export const CreateThread: React.FC<CreateThreadProps> = ({ onPost, loading: isPosting }) => {
    const { data: profile } = AppQuery.auth.useProfile();
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const uploadImageMutation = AppMutation().upload.useUploadImage();

    const handleFileChange = (payload: File | null) => {
        setFile(payload);
        if (payload) {
            const url = URL.createObjectURL(payload);
            setPreview(url);
        } else {
            setPreview(null);
        }
    };

    const removeImage = () => {
        setFile(null);
        setPreview(null);
    };

    const handleSubmit = async () => {
        if (!content.trim() && !file) return;

        let imageUrl = '';
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const res = await uploadImageMutation.mutateAsync(formData as any);
                imageUrl = res.url;
            } catch (error) {
                notifications.show({
                    title: 'Lỗi',
                    message: 'Không thể tải ảnh lên. Vui lòng thử lại.',
                    color: 'red'
                });
                return;
            }
        }

        onPost(content, imageUrl);
        setContent('');
        setFile(null);
        setPreview(null);
    };

    return (
        <Paper p="xl" bg="transparent" className="border-b border-gray-100 dark:border-zinc-900 rounded-none sm:rounded-3xl sm:border sm:bg-white/50 dark:sm:bg-zinc-900/10 backdrop-blur-sm">
            <Group align="flex-start" wrap="nowrap" gap="xl">
                <Avatar
                    src={profile?.avatar}
                    alt={profile?.hoTen}
                    radius="xl"
                    size={48}
                    className="shadow-md ring-2 ring-zinc-50 dark:ring-zinc-800"
                />
                <Stack gap="md" style={{ flex: 1 }}>
                    <Textarea
                        placeholder="Có gì mới?"
                        variant="unstyled"
                        autosize
                        minRows={2}
                        value={content}
                        onChange={(event) => setContent(event.currentTarget.value)}
                        classNames={{
                            input: "text-[18px] md:text-[22px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 p-0 leading-relaxed"
                        }}
                    />

                    {preview && (
                        <Box className="relative mt-4 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-xl group">
                            <Image src={preview} alt="Preview" radius="xl" className="max-h-[500px] object-cover" />
                            <ActionIcon
                                color="dark"
                                variant="filled"
                                radius="xl"
                                size="lg"
                                onClick={removeImage}
                                className="absolute top-4 right-4 bg-black/40 hover:bg-black/80 backdrop-blur-xl transition-all scale-90 group-hover:scale-100"
                            >
                                <IconX size={18} stroke={2.5} />
                            </ActionIcon>
                        </Box>
                    )}

                    <Group justify="space-between" align="center" mt="xl">
                        <Group gap="md">
                            <FileButton onChange={handleFileChange} accept="image/*">
                                {(props) => (
                                    <ActionIcon
                                        {...props}
                                        variant="subtle"
                                        color="gray"
                                        radius="xl"
                                        size="xl"
                                        className="hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors"
                                    >
                                        <IconPhoto size={24} stroke={2} />
                                    </ActionIcon>
                                )}
                            </FileButton>

                            <ActionIcon variant="subtle" color="gray" radius="xl" size="xl" className="opacity-20 cursor-not-allowed">
                                <IconGif size={24} stroke={2} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray" radius="xl" size="xl" className="opacity-20 cursor-not-allowed">
                                <IconList size={24} stroke={2} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray" radius="xl" size="xl" className="opacity-20 cursor-not-allowed">
                                <IconAt size={24} stroke={2} />
                            </ActionIcon>
                        </Group>

                        <Button
                            radius="xl"
                            size="md"
                            disabled={!content.trim() && !file}
                            loading={isPosting || uploadImageMutation.isPending}
                            onClick={handleSubmit}
                            color="black"
                            className="px-8 dark:bg-white dark:text-black font-black uppercase tracking-[0.2em] text-[12px] h-[44px] shadow-lg hover:translate-y-[-2px] active:translate-y-[0] transition-transform"
                        >
                            Đăng bài
                        </Button>
                    </Group>
                </Stack>
            </Group>
        </Paper>
    );
};
