"use client";

import { Box, Group, Text, Image, Stack, ActionIcon, Loader, Paper, Center, Transition } from "@mantine/core";
import { IconUpload, IconX, IconCheck, IconPhoto } from "@tabler/icons-react";
import { useState } from "react";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";

interface FileUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    type?: "image" | "avatar";
    aspectRatio?: number;
}

export function FileUpload({ value, onChange, label, type = "image" }: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const mutation = AppMutation();
    const uploadMutation = type === "avatar"
        ? mutation.upload.useUploadAvatar()
        : mutation.upload.useUploadImage();

    const handleDrop = async (files: FileWithPath[]) => {
        const file = files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadMutation.mutateAsync({
                payload: formData
            } as any);

            onChange(result.url);
            notifications.show({
                title: "Thành công",
                message: "Tải lên hình ảnh thành công",
                color: "teal",
                icon: <IconCheck size={16} />,
            });
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể tải lên hình ảnh. Vui lòng thử lại.",
                color: "red",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    return (
        <Stack gap="xs">
            {label && <Text size="sm" fw={600} c="zinc.7">{label}</Text>}

            <Dropzone
                onDrop={handleDrop}
                maxSize={5 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
                loading={isUploading}
                multiple={false}
                radius="md"
                styles={{
                    root: {
                        border: "2px dashed var(--mantine-color-zinc-2)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            borderColor: "var(--mantine-color-blue-4)",
                            backgroundColor: "var(--mantine-color-zinc-0)"
                        }
                    }
                }}
                className={`group relative overflow-hidden transition-all duration-200 ${value ? 'p-1' : 'py-8'}`}
            >
                <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
                    {value ? (
                        <Box className="relative w-full rounded-md overflow-hidden">
                            <Image
                                src={value}
                                className="max-h-[300px] w-full object-cover rounded-md"
                                alt="Preview"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-auto">
                                <Stack align="center" gap="xs">
                                    <IconUpload size={24} color="white" />
                                    <Text size="xs" color="white" fw={500}>Kéo thả để thay đổi</Text>
                                </Stack>
                            </div>
                            <ActionIcon
                                color="red"
                                variant="filled"
                                size="sm"
                                className="absolute top-2 right-2 z-10 pointer-events-auto"
                                onClick={clearImage}
                            >
                                <IconX size={14} />
                            </ActionIcon>
                        </Box>
                    ) : (
                        <Stack align="center" gap="sm">
                            <Dropzone.Accept>
                                <IconUpload size={40} stroke={1.5} color="var(--mantine-color-blue-6)" />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX size={40} stroke={1.5} color="var(--mantine-color-red-6)" />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <Paper radius="xl" p="md" className="bg-blue-50 dark:bg-zinc-800">
                                    <IconPhoto size={32} stroke={1.5} className="text-blue-500" />
                                </Paper>
                            </Dropzone.Idle>

                            <Stack gap={2} align="center">
                                <Text size="sm" inline fw={600}>
                                    Kéo thả hoặc nhấn để tải lên
                                </Text>
                                <Text size="xs" c="dimmed" inline mt={7}>
                                    JPG, PNG, WEBP (Tối đa 5MB)
                                </Text>
                            </Stack>
                        </Stack>
                    )}
                </Group>
            </Dropzone>
        </Stack>
    );
}
