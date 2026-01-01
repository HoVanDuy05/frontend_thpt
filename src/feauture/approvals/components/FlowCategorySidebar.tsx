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

export function FlowCategorySidebar({ activeCategory, onCategoryChange, categories }: FlowCategorySidebarProps) {
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

        createCategoryMutation.mutate({ ten: newCategoryName }, {
            onSuccess: () => {
                notifications.show({ title: 'Thành công', message: 'Đã tạo danh mục mới', color: 'green' });
                setNewCategoryName('');
                setPopoverOpened(false);
            },
            onError: () => {
                notifications.show({ title: 'Thất bại', message: 'Không thể tạo danh mục', color: 'red' });
            }
        });
    };

    return (
        <Box
            component="aside"
            className="w-full sm:w-[280px] shrink-0 border-r border-gray-200/50 dark:border-zinc-700/50 h-full bg-white dark:bg-zinc-900 transition-all"
        >
            <Stack gap={4} p="md">
                <Group justify="space-between" mb="xs" px="md">
                    <Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={1} className="text-gray-500 dark:text-gray-400">
                        Danh mục quy trình
                    </Text>
                    <Popover opened={popoverOpened} onChange={setPopoverOpened} position="bottom-end" withArrow shadow="lg">
                        <Popover.Target>
                            <Tooltip label="Tạo danh mục mới">
                                <ActionIcon
                                    variant="light"
                                    color="indigo"
                                    size="sm"
                                    onClick={() => setPopoverOpened((o) => !o)}
                                    className="hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                                >
                                    <IconPlus size={14} />
                                </ActionIcon>
                            </Tooltip>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Stack gap="xs" style={{ width: 250 }}>
                                <Text size="sm" fw={600}>Tạo danh mục mới</Text>
                                <TextInput
                                    placeholder="Tên danh mục..."
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleCreateCategory();
                                    }}
                                    size="sm"
                                />
                                <Group justify="flex-end" gap="xs">
                                    <Button
                                        variant="subtle"
                                        size="xs"
                                        onClick={() => {
                                            setNewCategoryName('');
                                            setPopoverOpened(false);
                                        }}
                                        leftSection={<IconX size={14} />}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        size="xs"
                                        onClick={handleCreateCategory}
                                        loading={createCategoryMutation.isPending}
                                        leftSection={<IconCheck size={14} />}
                                    >
                                        Tạo
                                    </Button>
                                </Group>
                            </Stack>
                        </Popover.Dropdown>
                    </Popover>
                </Group>
                {displayCategories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const Icon = cat.icon;
                    return (
                        <UnstyledButton
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            className={`px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${isActive
                                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                                : 'hover:bg-gray-100/80 dark:hover:bg-zinc-800/80 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <Group gap="sm">
                                <Icon
                                    size={20}
                                    stroke={isActive ? 2.5 : 1.5}
                                    className={`transition-transform duration-200 ${isActive ? 'scale-110 text-indigo-600 dark:text-indigo-400' : 'group-hover:scale-105 text-gray-500 dark:text-gray-400'}`}
                                />
                                <Text size="sm" fw={isActive ? 700 : 500} className={isActive ? 'text-indigo-700 dark:text-indigo-300' : ''}>
                                    {cat.label}
                                </Text>
                            </Group>
                            <Badge
                                variant={isActive ? "filled" : "light"}
                                color={isActive ? "indigo" : "gray"}
                                size="sm"
                                radius="sm"
                                className={isActive ? 'bg-indigo-600 text-white' : ''}
                            >
                                {cat.count}
                            </Badge>
                        </UnstyledButton>
                    );
                })}
            </Stack>
        </Box>
    );
}
