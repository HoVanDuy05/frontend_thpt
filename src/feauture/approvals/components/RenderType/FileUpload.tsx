"use client";

import React from 'react';
import { Paper, Stack, Group, Box, Text, rem } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX, IconFile, IconPaperclip } from '@tabler/icons-react';

interface FileUploadProps {
    label: string;
    value: File | null;
    onChange: (val: File | null) => void;
    accept?: string[];
    required?: boolean;
    error?: string;
    isImage?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, value, onChange, accept, required, error, isImage }) => {
    return (
        <Paper
            p="md"
            radius="20px"
            className="border-gray-100 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 transition-all border shadow-sm hover:shadow-md group"
        >
            <Stack gap="sm">
                <Group gap="xs">
                    <Box className="text-indigo-600 opacity-80 bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                        <IconPaperclip size={16} />
                    </Box>
                    <Text fw={800} size="sm" className="text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                        {label} {required && <span className="text-red-500">*</span>}
                    </Text>
                </Group>

                <Box className="relative">
                    <Dropzone
                        onDrop={(files) => onChange(files[0])}
                        onReject={(files) => console.log('rejected files', files)}
                        maxSize={5 * 1024 ** 2}
                        accept={isImage ? IMAGE_MIME_TYPE : accept}
                        multiple={false}
                        radius="16px"
                        styles={{
                            root: {
                                border: '2px dashed var(--mantine-color-default-border)',
                                backgroundColor: 'transparent',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: 'var(--mantine-color-indigo-6)',
                                    backgroundColor: 'rgba(99, 102, 241, 0.04)'
                                }
                            }
                        }}
                    >
                        <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
                            <Dropzone.Accept>
                                <IconUpload
                                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                                    stroke={1.5}
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX
                                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                                    stroke={1.5}
                                />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                {isImage ? (
                                    <IconPhoto
                                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                        stroke={1.5}
                                    />
                                ) : (
                                    <IconFile
                                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                        stroke={1.5}
                                    />
                                )}
                            </Dropzone.Idle>

                            <div>
                                <Text size="xl" inline fw={700}>
                                    {value ? value.name : 'Kéo thả tệp vào đây hoặc click để chọn'}
                                </Text>
                                <Text size="sm" c="dimmed" inline mt={7}>
                                    {isImage ? 'Chỉ chấp nhận định dạng ảnh (png, jpg, jpeg)' : 'Dung lượng tối đa 5MB'}
                                </Text>
                            </div>
                        </Group>
                    </Dropzone>

                    {error && (
                        <Text c="red" size="xs" mt={4}>
                            {error}
                        </Text>
                    )}
                </Box>
            </Stack>
        </Paper>
    );
};
