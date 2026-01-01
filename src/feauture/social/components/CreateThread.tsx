"use client";

import React, { useState, useRef } from 'react';
import { Paper, Group, Avatar, Textarea, Button, Stack, ActionIcon, FileButton, Image, Box, Text, Divider } from '@mantine/core';
import { IconPhoto, IconGif, IconList, IconAt, IconX, IconFaceSmile } from '@tabler/icons-react';
import { AppQuery, AppMutation } from '@/api/AppQuery';
import { notifications } from '@mantine/notifications';
import { useTranslations } from 'next-intl';

interface CreateThreadProps {
    onPost: (content: string, image?: string) => void;
    loading?: boolean;
    placeholder?: string;
    showAvatar?: boolean;
    compact?: boolean;
}

export const CreateThread: React.FC<CreateThreadProps> = ({
    onPost,
    loading: isPosting,
    placeholder = "Có gì mới?",
    showAvatar = true,
    compact = false
}) => {
    const t = useTranslations('social');
    const { data: profile } = AppQuery.auth.useProfile();
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const uploadImageMutation = AppMutation().upload.useUploadImage();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        setIsFocused(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const hasContent = content.trim() || file;

    return (
        <Paper
            p={compact ? "md" : "lg"}
            bg="white"
            darkBg="zinc-900"
            className={`border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all ${isFocused ? 'ring-2 ring-indigo-500/20 dark:ring-indigo-400/20' : ''}`}
        >
            <Group align="flex-start" wrap="nowrap" gap="md">
                {showAvatar && (
                    <Avatar
                        src={profile?.avatar}
                        alt={profile?.hoTen}
                        radius="full"
                        size={compact ? 40 : 48}
                        className="shadow-sm ring-2 ring-gray-100 dark:ring-zinc-800"
                    />
                )}

                <Stack gap="sm" style={{ flex: 1 }}>
                    <Textarea
                        ref={textareaRef}
                        placeholder={placeholder}
                        variant="unstyled"
                        autosize
                        minRows={compact ? 1 : 2}
                        maxRows={8}
                        value={content}
                        onChange={(event) => setContent(event.currentTarget.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            if (!hasContent) {
                                setIsFocused(false);
                            }
                        }}
                        classNames={{
                            input: `text-[15px] md:text-[16px] font-normal text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 p-0 leading-relaxed resize-none ${compact ? 'py-2' : 'py-3'}`
                        }}
                        styles={{
                            root: {
                                minHeight: compact ? 'auto' : '60px'
                            }
                        }}
                    />

                    {preview && (
                        <Box className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-sm">
                            <Image
                                src={preview}
                                alt="Preview"
                                radius="md"
                                className="max-h-[400px] w-full object-cover"
                            />
                            <ActionIcon
                                variant="filled"
                                color="dark"
                                radius="full"
                                size="sm"
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm transition-all"
                            >
                                <IconX size={16} />
                            </ActionIcon>
                        </Box>
                    )}

                    {(hasContent || isFocused) && (
                        <>
                            <Divider variant="dashed" />
                            <Group justify="space-between" align="center" py="xs">
                                <Group gap="xs">
                                    <FileButton onChange={handleFileChange} accept="image/*">
                                        {(props) => (
                                            <ActionIcon
                                                {...props}
                                                variant="subtle"
                                                color="gray"
                                                radius="full"
                                                size="lg"
                                                className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                                title="Thêm ảnh"
                                            >
                                                <IconPhoto size={20} />
                                            </ActionIcon>
                                        )}
                                    </FileButton>

                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        radius="full"
                                        size="lg"
                                        className="opacity-40 cursor-not-allowed"
                                        title="GIF (Sắp có)"
                                    >
                                        <IconGif size={20} />
                                    </ActionIcon>

                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        radius="full"
                                        size="lg"
                                        className="opacity-40 cursor-not-allowed"
                                        title="Cuộc thăm dò (Sắp có)"
                                    >
                                        <IconList size={20} />
                                    </ActionIcon>

                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        radius="full"
                                        size="lg"
                                        className="opacity-40 cursor-not-allowed"
                                        title="Gắn thẻ (Sắp có)"
                                    >
                                        <IconAt size={20} />
                                    </ActionIcon>

                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        radius="full"
                                        size="lg"
                                        className="opacity-40 cursor-not-allowed"
                                        title="Emoji (Sắp có)"
                                    >
                                        <IconFaceSmile size={20} />
                                    </ActionIcon>
                                </Group>

                                <Group gap="sm">
                                    <Button
                                        variant="subtle"
                                        color="gray"
                                        size="sm"
                                        onClick={() => {
                                            setContent('');
                                            setFile(null);
                                            setPreview(null);
                                            setIsFocused(false);
                                        }}
                                        className="font-medium"
                                    >
                                        Hủy
                                    </Button>

                                    <Button
                                        radius="full"
                                        size="sm"
                                        disabled={!hasContent}
                                        loading={isPosting || uploadImageMutation.isPending}
                                        onClick={handleSubmit}
                                        className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 font-semibold px-6 transition-all"
                                    >
                                        Đăng
                                    </Button>
                                </Group>
                            </Group>
                        </>
                    )}
                </Stack>
            </Group>
        </Paper>
    );
};
