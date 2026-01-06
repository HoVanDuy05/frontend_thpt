"use client";

import React, { useState, useRef } from 'react';
import { Paper, Group, Textarea, Button, Stack, ActionIcon, FileButton, Image, Box, Text, Divider } from '@mantine/core';
import { UserAvatar } from './UserAvatar';
import { SocialButton } from './SocialButton';
import { IconPhoto, IconGif, IconList, IconAt, IconX, IconFileSmile, IconChevronLeft } from '@tabler/icons-react';
import { AppQuery } from '@/api/AppQuery';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';
import { useTranslations } from 'next-intl';

interface CreateThreadProps {
    onPost: (content: string, image?: string) => void;
    loading?: boolean;
    placeholder?: string;
    showAvatar?: boolean;
    compact?: boolean;
    variant?: 'default' | 'drawer';
    onCancel?: () => void;
}

export const CreateThread: React.FC<CreateThreadProps> = ({
    onPost,
    loading: isPosting,
    placeholder,
    showAvatar = true,
    compact = false,
    variant = 'default',
    onCancel
}) => {
    const t = useTranslations('social');
    const placeholderText = placeholder || t('create_placeholder');
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
        // Only submit on Enter if not in drawer mode (mobile users need Enter for new line easily)
        if (variant !== 'drawer' && event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const hasContent = content.trim() || file;

    // --- DRAWER LAYOUT (Threads Style) ---
    if (variant === 'drawer') {
        return (
            <Stack h="100%" gap={0} className="bg-white dark:bg-zinc-950 font-sans">
                {/* Header */}
                <div className="relative px-3 py-3 border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center justify-between gap-2">
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => {
                                if (onCancel) {
                                    onCancel();
                                } else {
                                    setContent('');
                                    setFile(null);
                                    setPreview(null);
                                }
                            }}
                            size="sm"
                            radius="full"
                            className="bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 flex-shrink-0"
                        >
                            <IconChevronLeft size={20} className="text-gray-900 dark:text-white" />
                        </ActionIcon>

                        <Text fw={700} size="md" className="text-gray-900 dark:text-white text-center flex-1 truncate px-2">
                            {t('create_post')}
                        </Text>

                        <SocialButton
                            variantType="primary"
                            size="xs"
                            disabled={!hasContent}
                            loading={isPosting || uploadImageMutation.isPending}
                            onClick={handleSubmit}
                            className={`px-3 flex-shrink-0 ${hasContent ? '' : 'opacity-50'}`}
                        >
                            {t('post')}
                        </SocialButton>
                    </div>
                </div>

                {/* Content Area */}
                <Box className="flex-1 overflow-y-auto px-4 py-4">
                    <Group align="start" wrap="nowrap" gap="sm">
                        <UserAvatar
                            src={profile?.avatar}
                            size={44}
                            className="mt-1 border border-gray-100 dark:border-zinc-800"
                        />
                        <Stack gap="xs" style={{ flex: 1 }}>
                            <Text fw={600} size="sm" className="text-gray-900 dark:text-white mt-1">
                                {profile?.hoTen || profile?.taiKhoan}
                            </Text>
                            <Textarea
                                ref={textareaRef}
                                placeholder={placeholderText}
                                variant="unstyled"
                                autosize
                                minRows={3}
                                maxRows={20}
                                value={content}
                                onChange={(event) => setContent(event.currentTarget.value)}
                                classNames={{
                                    input: "text-base font-normal text-gray-900 dark:text-gray-100 placeholder:text-gray-400 p-0 leading-relaxed"
                                }}
                            />

                            {/* Attachments & Preview */}
                            {preview && (
                                <Box className="relative rounded-xl overflow-hidden mt-2 border border-gray-100 dark:border-zinc-800 inline-block max-w-full">
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        className="max-h-[500px] w-auto object-contain bg-gray-50 dark:bg-zinc-900"
                                    />
                                    <ActionIcon
                                        variant="filled"
                                        color="black"
                                        radius="full"
                                        size="sm"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm"
                                    >
                                        <IconX size={14} />
                                    </ActionIcon>
                                </Box>
                            )}

                            <Group gap="xs" mt="sm">
                                <FileButton onChange={handleFileChange} accept="image/*">
                                    {(props) => (
                                        <ActionIcon
                                            {...props}
                                            variant="subtle"
                                            color="gray"
                                            size="lg"
                                            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            <IconPhoto size={22} stroke={1.5} />
                                        </ActionIcon>
                                    )}
                                </FileButton>
                                <ActionIcon variant="subtle" color="gray" size="lg" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors opacity-50">
                                    <IconGif size={22} stroke={1.5} />
                                </ActionIcon>
                                <ActionIcon variant="subtle" color="gray" size="lg" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors opacity-50">
                                    <IconList size={22} stroke={1.5} />
                                </ActionIcon>
                                <ActionIcon variant="subtle" color="gray" size="lg" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors opacity-50">
                                    <IconAt size={22} stroke={1.5} />
                                </ActionIcon>
                            </Group>
                        </Stack>
                    </Group>
                </Box>
            </Stack>
        );
    }

    // --- DEFAULT LAYOUT (Feed / Card) ---
    return (
        <Paper
            p={compact ? 0 : "lg"}
            bg={compact ? "transparent" : "white"}
            className={compact
                ? ""
                : `border border-gray-200 dark:border-zinc-800 dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-md transition-all ${isFocused ? 'ring-2 ring-indigo-500/20 dark:ring-indigo-400/20' : ''}`
            }
        >
            <Group align="flex-start" wrap="nowrap" gap="md">
                {showAvatar && (
                    <UserAvatar
                        src={profile?.avatar}
                        alt={profile?.hoTen}
                        size={compact ? 32 : 44}
                        className="mt-1"
                    />
                )}

                <Stack gap="sm" style={{ flex: 1 }}>
                    <Textarea
                        ref={textareaRef}
                        placeholder={placeholderText}
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
                                        <IconFileSmile size={20} />
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
