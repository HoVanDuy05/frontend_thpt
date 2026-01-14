"use client";

import React, { useState } from 'react';
import { Stack, Text, UnstyledButton, Group, Badge, Box, ActionIcon, Tooltip, TextInput, Button, Popover } from '@mantine/core';
import { IconStack, IconBriefcase, IconDeviceDesktop, IconFileAnalytics, IconSchool, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import { AppMutation } from '@/api/AppMutation';
import { notifications } from '@mantine/notifications';

interface Category {
    id: string;
    label: string;
    icon: React.ElementType;
    count: number;
}

interface FlowCategorySidebarProps {
    activeCategory: string;
    onCategoryChange: (id: string) => void;
    categories?: Category[];
}

const DEFAULT_CATEGORIES: Category[] = [
    { id: 'all', label: 'Tất cả Quy trình', icon: IconStack, count: 0 },
    { id: 'recruitment', label: 'Tuyển dụng', icon: IconBriefcase, count: 0 },
    { id: 'device', label: 'Thiết bị & Web', icon: IconDeviceDesktop, count: 0 },
    { id: 'report', label: 'Báo cáo & Thống kê', icon: IconFileAnalytics, count: 0 },
    { id: 'academic', label: 'Học vụ & Đào tạo', icon: IconSchool, count: 0 },
];

export function FlowCategorySidebar({ activeCategory, onCategoryChange, categories, onRefetch }: FlowCategorySidebarProps & { onRefetch?: () => void }) {
    const [popoverOpened, setPopoverOpened] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const mutation = AppMutation();
    const createCategoryMutation = mutation.approvals.useCreateCategory();

    // Use provided categories or default categories
    const displayCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

    const handleCreateCategory = () => {
        if (!newCategoryName.trim()) {
            notifications.show({ title: 'Lỗi', message: 'Vui lòng nhập tên danh mục', color: 'red' });
            return;
        }

        createCategoryMutation.mutate({ name: newCategoryName, description: '' }, {
            onSuccess: () => {
                notifications.show({ title: 'Thành công', message: 'Đã tạo danh mục mới', color: 'green' });
                setNewCategoryName('');
                setPopoverOpened(false);
                onRefetch?.();
            },
            onError: () => {
                notifications.show({ title: 'Thất bại', message: 'Không thể tạo danh mục', color: 'red' });
            }
        });
    };

    return (
        <Box
            component="aside"
            className="w-full h-full bg-white dark:bg-zinc-900 flex flex-col"
        >
            <Stack gap={0} className="flex-1">
                <Box p="md" className="border-b border-gray-100 dark:border-zinc-800/50">
                    <Group justify="space-between" align="center">
                        <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
                            Danh mục quy trình
                        </Text>
                        <Popover opened={popoverOpened} onChange={setPopoverOpened} position="bottom-end" withArrow shadow="md">
                            <Popover.Target>
                                <Tooltip label="Tạo danh mục mới">
                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        size="sm"
                                        onClick={() => setPopoverOpened((o) => !o)}
                                    >
                                        <IconPlus size={16} />
                                    </ActionIcon>
                                </Tooltip>
                            </Popover.Target>
                            <Popover.Dropdown p="xs">
                                <Stack gap="xs" style={{ width: 220 }}>
                                    <Text size="xs" fw={600}>Tên danh mục mới</Text>
                                    <TextInput
                                        placeholder="Ví dụ: Nhân sự"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') handleCreateCategory();
                                        }}
                                        size="xs"
                                        autoFocus
                                    />
                                    <Group justify="flex-end" gap="xs">
                                        <Button
                                            variant="subtle"
                                            size="xs"
                                            color="gray"
                                            onClick={() => {
                                                setNewCategoryName('');
                                                setPopoverOpened(false);
                                            }}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            size="xs"
                                            color="indigo"
                                            onClick={handleCreateCategory}
                                            loading={createCategoryMutation.isPending}
                                        >
                                            Tạo
                                        </Button>
                                    </Group>
                                </Stack>
                            </Popover.Dropdown>
                        </Popover>
                    </Group>
                </Box>

                <Box p="xs" className="flex-1 overflow-auto">
                    <Stack gap={2}>
                        {displayCategories.map((cat) => {
                            const isActive = activeCategory === cat.id;
                            const Icon = cat.icon;
                            return (
                                <UnstyledButton
                                    key={cat.id}
                                    onClick={() => onCategoryChange(cat.id)}
                                    className={`
                                        w-full px-4 py-3 rounded-xl transition-all flex items-center justify-between group
                                        ${isActive
                                            ? 'bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none text-white'
                                            : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                                        }
                                    `}
                                >
                                    <Group gap="md">
                                        <Box className={`
                                            w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                                            ${isActive ? 'bg-white/20' : 'bg-gray-50 dark:bg-zinc-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40'}
                                        `}>
                                            <Icon
                                                size={18}
                                                stroke={isActive ? 2.5 : 1.5}
                                                className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'}
                                            />
                                        </Box>
                                        <Text size="sm" fw={isActive ? 700 : 500}>
                                            {cat.label}
                                        </Text>
                                    </Group>
                                    {cat.count > 0 && (
                                        <Badge
                                            variant={isActive ? "white" : "light"}
                                            color={isActive ? "indigo" : "gray"}
                                            size="sm"
                                            radius="md"
                                        >
                                            {cat.count}
                                        </Badge>
                                    )}
                                </UnstyledButton>
                            );
                        })}
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}
