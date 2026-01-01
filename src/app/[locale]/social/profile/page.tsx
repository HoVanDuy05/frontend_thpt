"use client";

import { useState } from "react";
import {
    Box,
    Title,
    Stack,
    Text,
    Avatar,
    Group,
    Button,
    Tabs,
    Center,
    Loader,
    ActionIcon,
    Badge,
    Divider
} from "@mantine/core";
import {
    IconSettings,
    IconShare,
    IconLink,
    IconEdit
} from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { useAppStore } from "@/providers/store/useAppStore";
import { useRouter } from "next/navigation";
import { EditProfileModal } from "@/feauture/social/components/EditProfileModal";

export default function ProfilePage() {
    const { data: profile, isLoading: isLoadingProfile } = AppQuery.auth.useProfile();
    const { setToken } = useAppStore();
    const router = useRouter();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (isLoadingProfile) {
        return <Center h="50vh"><Loader color="indigo" /></Center>;
    }

    const handleLogout = () => {
        setToken("");
        router.push("/auth/login");
    };

    const handleEditProfile = () => {
        setIsEditModalOpen(true);
    };

    return (
        <Stack gap={40}>
            {/* Profile Header */}
            <Stack gap="xl">
                <Group justify="space-between" align="flex-start">
                    <Stack gap={4}>
                        <Group gap="sm">
                            <Title order={1} className="text-4xl font-black tracking-tighter">
                                {profile?.hoTen || profile?.taiKhoan}
                            </Title>
                            <Badge
                                variant="outline"
                                color={profile?.vaiTro === 'ADMIN' ? 'red' : profile?.vaiTro === 'GIAO_VIEN' ? 'indigo' : 'teal'}
                                size="sm"
                                radius="sm"
                                className="font-black uppercase tracking-widest px-2"
                            >
                                {profile?.vaiTro}
                            </Badge>
                        </Group>
                        <Text component="div" size="md" fw={500} className="text-zinc-500 flex items-center gap-1">
                            {profile?.taiKhoan} <Box component="span" className="bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-[10px] font-black uppercase text-zinc-400">threads.net</Box>
                        </Text>
                    </Stack>
                    <Avatar
                        src={profile?.avatar}
                        size={84}
                        radius="xl"
                        className="shadow-xl ring-4 ring-zinc-50 dark:ring-zinc-900"
                    />
                </Group>

                <Text className="text-zinc-600 dark:text-zinc-400 font-medium max-w-[400px]">
                    {profile?.hoSoGiaoVien?.chuyenMon || profile?.hoSoHocSinh?.lopHoc?.tenLop || 'Software developer & design enthusiast. Building Nguyen Hue Academy.'}
                </Text>

                <Group justify="space-between">
                    <Text size="sm" fw={600} className="text-zinc-400">
                        {profile?.tongKetBan || 0} followers · <Text component="span" className="hover:underline cursor-pointer">threads.net</Text>
                    </Text>
                    <Group gap="xs">
                        <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" className="border border-zinc-100 dark:border-zinc-800">
                            <IconLink size={18} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" className="border border-zinc-100 dark:border-zinc-800">
                            <IconSettings size={18} />
                        </ActionIcon>
                    </Group>
                </Group>

                <Group grow gap="md">
                    <Button
                        variant="outline"
                        color="gray"
                        radius="md"
                        fw={700}
                        className="border-gray-200 dark:border-zinc-800"
                        leftSection={<IconEdit size={16} />}
                        onClick={handleEditProfile}
                    >
                        Chỉnh sửa hồ sơ
                    </Button>
                    <Button
                        variant="outline"
                        color="gray"
                        radius="md"
                        fw={700}
                        className="border-gray-200 dark:border-zinc-800"
                        leftSection={<IconShare size={16} />}
                    >
                        Chia sẻ hồ sơ
                    </Button>
                    <Button
                        variant="filled"
                        color="black"
                        radius="md"
                        fw={900}
                        onClick={handleLogout}
                        className="dark:bg-white dark:text-black uppercase tracking-widest text-[10px]"
                    >
                        Đăng xuất
                    </Button>
                </Group>
            </Stack>

            {/* Content Tabs */}
            <Tabs defaultValue="threads" variant="none" classNames={{
                root: "w-full",
                list: "border-b border-gray-100 dark:border-zinc-900 flex justify-around",
                tab: "pb-4 px-0 fw-800 text-sm tracking-widest uppercase transition-all border-b-2 border-transparent data-[active=true]:border-black dark:data-[active=true]:border-white data-[active=true]:text-black dark:data-[active=true]:text-white text-zinc-400"
            }}>
                <Tabs.List>
                    <Tabs.Tab value="threads">Bài viết</Tabs.Tab>
                    <Tabs.Tab value="friends">Bạn bè</Tabs.Tab>
                    <Tabs.Tab value="about">Giới thiệu</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="threads" pt="md">
                    <Center py={100} className="text-zinc-400 font-medium">
                        Chưa có bài viết nào
                    </Center>
                </Tabs.Panel>

                <Tabs.Panel value="friends" pt="md">
                    <Center py={100} className="text-zinc-400 font-medium">
                        Chưa có bạn bè nào
                    </Center>
                </Tabs.Panel>

                <Tabs.Panel value="about" pt="md">
                    <Stack gap="md">
                        <Box>
                            <Title order={4} mb="sm">Giới thiệu</Title>
                            <Text size="md" lineClamp={5}>
                                {profile?.hoSoGiaoVien?.chuyenMon || profile?.hoSoHocSinh?.lopHoc?.tenLop || 'Software developer & design enthusiast. Building Nguyen Hue Academy.'}
                            </Text>
                        </Box>

                        <Divider />

                        <Box>
                            <Title order={4} mb="sm">Thông tin liên hệ</Title>
                            <Stack gap="xs">
                                {profile?.email && (
                                    <Group gap="xs">
                                        <Text size="sm" c="dimmed">Email:</Text>
                                        <Text size="sm">{profile.email}</Text>
                                    </Group>
                                )}
                                {profile?.soDienThoai && (
                                    <Group gap="xs">
                                        <Text size="sm" c="dimmed">Điện thoại:</Text>
                                        <Text size="sm">{profile.soDienThoai}</Text>
                                    </Group>
                                )}
                                {profile?.diaChi && (
                                    <Group gap="xs">
                                        <Text size="sm" c="dimmed">Địa chỉ:</Text>
                                        <Text size="sm">{profile.diaChi}</Text>
                                    </Group>
                                )}
                                {profile?.hoSoHocSinh?.lopHoc && (
                                    <Group gap="xs">
                                        <Text size="sm" c="dimmed">Lớp học:</Text>
                                        <Text size="sm">{profile.hoSoHocSinh.lopHoc.tenLop}</Text>
                                    </Group>
                                )}
                                {profile?.hoSoGiaoVien?.chuyenMon && (
                                    <Group gap="xs">
                                        <Text size="sm" c="dimmed">Chuyên môn:</Text>
                                        <Text size="sm">{profile.hoSoGiaoVien.chuyenMon}</Text>
                                    </Group>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </Tabs.Panel>
            </Tabs>

            {/* Edit Profile Modal */}
            <EditProfileModal
                opened={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
            />
        </Stack>
    );
}
