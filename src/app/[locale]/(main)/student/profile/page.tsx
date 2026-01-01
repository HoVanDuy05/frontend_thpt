"use client";

import { Container, Stack, Title, Card, Text, Group, Avatar, Button, Switch, Divider, Box, Badge, ActionIcon } from "@mantine/core";
import { useAppStore } from "@/providers/store/useAppStore";
import { useMantineColorScheme } from "@mantine/core";
import { useRouter, Link } from "@/i18n/routing";
import {
    IconLogout, IconMoon, IconSun, IconChevronRight, IconUser, IconBell, IconLock,
    IconLanguage, IconSchool, IconId, IconCertificate, IconBrandInstagram, IconExternalLink
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
    const { user, logout } = useAppStore();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const router = useRouter();
    const t = useTranslations("student.nav"); // Assuming we might add profile keys here later or reuse common ones

    const handleLogout = () => {
        logout();
        notifications.show({
            title: "Đăng xuất thành công",
            message: "Hẹn gặp lại bạn!",
            color: "blue",
        });
        router.push("/auth/login");
    };

    const menuItems = [
        { icon: IconUser, label: "Thông tin cá nhân", href: "/student/profile/info" },
        { icon: IconBell, label: "Cài đặt thông báo", href: "/student/profile/notifications" },
        { icon: IconLock, label: "Bảo mật & Quyền riêng tư", href: "/student/profile/security" },
        { icon: IconLanguage, label: "Ngôn ngữ", href: "/student/profile/language" },
    ];

    // Mock academic data
    const academicInfo = {
        studentId: "HS2023001",
        class: "12A1",
        major: "Khoa học Tự nhiên",
        schoolYear: "2023 - 2026",
        dob: "15/08/2008"
    };

    return (
        <Container size="lg" className="py-4 pb-24">
            <Stack gap="lg">
                <Group justify="space-between" align="center">
                    <div>
                        <Title order={2} className="font-black mb-1">
                            Hồ sơ học sinh
                        </Title>
                        <Text size="sm" c="dimmed">
                            Thẻ học sinh & Thông tin cá nhân
                        </Text>
                    </div>
                </Group>

                {/* Digital Student ID Card */}
                <Card
                    radius="xl"
                    padding="xl"
                    className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl"
                >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <IconSchool size={180} />
                    </div>

                    <Stack className="relative z-10" gap="lg">
                        <Group justify="space-between" align="flex-start">
                            <Group gap="xs">
                                <Box className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                                    <IconSchool size={24} className="text-white" />
                                </Box>
                                <div>
                                    <Text fw={800} size="sm" className="leading-tight uppercase tracking-wide opacity-90">
                                        Trường THPT
                                    </Text>
                                    <Text fw={900} size="lg" className="leading-tight uppercase tracking-tight">
                                        NGUYEN HUE
                                    </Text>
                                </div>
                            </Group>
                            <Badge
                                variant="white"
                                color="indigo"
                                size="lg"
                                radius="md"
                                className="font-bold shadow-sm"
                            >
                                THẺ HỌC SINH
                            </Badge>
                        </Group>

                        <Group align="flex-start" gap="lg" className="mt-2">
                            <div className="relative">
                                <Avatar
                                    src={user?.avatar}
                                    size={100}
                                    radius="md"
                                    className="border-4 border-white/20 shadow-md"
                                />
                                <div className="absolute -bottom-3 -right-3">
                                    <Box className="bg-green-500 rounded-full p-1 border-4 border-indigo-700">
                                        <IconCertificate size={16} className="text-white" />
                                    </Box>
                                </div>
                            </div>

                            <Stack gap={4} className="flex-1">
                                <Text size="xs" className="uppercase opacity-70 font-bold tracking-wider">Họ và tên</Text>
                                <Text size="xl" fw={900} className="line-clamp-1">
                                    {user?.hoTen || user?.taiKhoan || "Nguyễn Văn A"}
                                </Text>

                                <Group gap="xl" className="mt-2">
                                    <div>
                                        <Text size="xs" className="uppercase opacity-70 font-bold tracking-wider">Mã HS</Text>
                                        <Text fw={700} className="font-mono">{academicInfo.studentId}</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" className="uppercase opacity-70 font-bold tracking-wider">Lớp</Text>
                                        <Text fw={700}>{academicInfo.class}</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" className="uppercase opacity-70 font-bold tracking-wider">Niên khóa</Text>
                                        <Text fw={700}>{academicInfo.schoolYear}</Text>
                                    </div>
                                </Group>
                            </Stack>
                        </Group>

                        <Divider color="white" opacity={0.2} />

                        <Group justify="space-between" align="center">
                            <Text size="xs" className="opacity-70">
                                Thẻ này có giá trị sử dụng nội bộ nhà trường
                            </Text>
                            <Text fw={700} size="xs" className="font-mono bg-black/20 px-2 py-1 rounded">
                                {academicInfo.dob}
                            </Text>
                        </Group>
                    </Stack>
                </Card>

                {/* Social Profile Link */}
                <Card
                    component={Link}
                    href={user?.id ? `/social/profile/${user.id}` : '#'}
                    withBorder
                    radius="lg"
                    padding="md"
                    className="hover:border-indigo-500 transition-colors group cursor-pointer"
                >
                    <Group justify="space-between">
                        <Group>
                            <Box className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white">
                                <IconBrandInstagram size={20} />
                            </Box>
                            <div>
                                <Text fw={700} size="sm">Hồ sơ Mạng xã hội</Text>
                                <Text size="xs" c="dimmed">Xem trang cá nhân công khai của bạn</Text>
                            </div>
                        </Group>
                        <ActionIcon variant="light" color="gray" className="group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                            <IconExternalLink size={18} />
                        </ActionIcon>
                    </Group>
                </Card>

                {/* Settings Section */}
                <Card withBorder radius="lg" padding="lg">
                    <Title order={4} className="font-bold mb-4 flex items-center gap-2">
                        <IconSettings size={20} className="text-gray-500" />
                        Cài đặt chung
                    </Title>

                    <Stack gap="xs">
                        {/* Dark Mode Toggle */}
                        <Group justify="space-between" className="py-2 px-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-colors">
                            <Group gap="sm">
                                <div className={`p-2 rounded-lg ${colorScheme === 'dark' ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                                    {colorScheme === "dark" ? <IconMoon size={20} /> : <IconSun size={20} />}
                                </div>
                                <div>
                                    <Text fw={600} size="sm">
                                        Giao diện
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        {colorScheme === 'dark' ? 'Đang dùng chế độ tối' : 'Đang dùng chế độ sáng'}
                                    </Text>
                                </div>
                            </Group>
                            <Switch
                                checked={colorScheme === "dark"}
                                onChange={() => toggleColorScheme()}
                                size="md"
                                color="indigo"
                            />
                        </Group>

                        <Divider variant="dashed" my="xs" />

                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Group
                                    key={item.label}
                                    justify="space-between"
                                    className="py-3 px-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                                    onClick={() => router.push(item.href)}
                                >
                                    <Group gap="sm">
                                        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg text-gray-600 dark:text-gray-300">
                                            <Icon size={20} stroke={1.5} />
                                        </div>
                                        <Text fw={600} size="sm">
                                            {item.label}
                                        </Text>
                                    </Group>
                                    <IconChevronRight size={18} className="text-gray-400" />
                                </Group>
                            );
                        })}
                    </Stack>
                </Card>

                {/* Logout Area */}
                <Box className="px-2">
                    <Button
                        variant="subtle"
                        color="red"
                        size="md"
                        radius="xl"
                        leftSection={<IconLogout size={20} />}
                        onClick={handleLogout}
                        className="hover:bg-red-50 dark:hover:bg-red-950/30"
                        fullWidth
                    >
                        Đăng xuất tài khoản
                    </Button>

                    <Text size="xs" c="dimmed" className="text-center mt-4">
                        Phiên bản 1.2.0 • Build 20260101
                    </Text>
                </Box>
            </Stack>
        </Container>
    );
}

// Helper icon component since we used it above but didn't import it in the original generic import
function IconSettings({ size, className }: { size: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        </svg>
    )
}
