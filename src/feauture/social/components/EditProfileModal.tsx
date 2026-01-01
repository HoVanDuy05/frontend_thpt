"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Title,
    Stack,
    Text,
    Avatar,
    Group,
    Button,
    TextInput,
    Textarea,
    Select,
    Drawer,
    SimpleGrid,
    Input,
    ActionIcon,
    Overlay,
    Center,
    Badge
} from "@mantine/core";
import {
    IconCamera,
    IconEdit,
    IconX,
    IconMail,
    IconUser,
    IconPhone,
    IconMapPin,
    IconCalendar,
    IconSchool,
    IconCheck,
    IconBuildingSkyscraper
} from "@tabler/icons-react";
import { useAppStore } from "@/providers/store/useAppStore";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";
import { dayjs } from "@/shared/utils/date.util";

interface ProfileFormData {
    hoTen?: string;
    email?: string;
    // Date parts
    dobDay: string;
    dobMonth: string;
    dobYear: string;

    gioiTinh?: 'NAM' | 'NU';
    soDienThoai?: string;

    // Address parts
    addrCity: string;
    addrDetail: string;

    lopHocId?: number;
    chuyenMon?: string;
}

interface EditProfileModalProps {
    opened: boolean;
    onClose: () => void;
    profile: any;
}

const CITIES = [
    "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái", "Phú Yên", "Khác"
];

const MONTHS = [
    { value: "1", label: "Tháng 1" },
    { value: "2", label: "Tháng 2" },
    { value: "3", label: "Tháng 3" },
    { value: "4", label: "Tháng 4" },
    { value: "5", label: "Tháng 5" },
    { value: "6", label: "Tháng 6" },
    { value: "7", label: "Tháng 7" },
    { value: "8", label: "Tháng 8" },
    { value: "9", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
];

export function EditProfileModal({ opened, onClose, profile }: EditProfileModalProps) {
    const updateProfileMutation = AppMutation().auth.useUpdateProfile();
    const uploadAvatarMutation = AppMutation().auth.useUploadAvatar();

    const isMobile = useMediaQuery('(max-width: 48em)');

    // Helper to separate address
    const splitAddress = (fullAddress: string) => {
        if (!fullAddress) return { city: '', detail: '' };
        // Simple logic: assume "Detail, City" format
        const parts = fullAddress.split(',').map(p => p.trim());
        if (parts.length > 1) {
            const potentialCity = parts[parts.length - 1];
            if (CITIES.includes(potentialCity)) {
                return {
                    city: potentialCity,
                    detail: parts.slice(0, parts.length - 1).join(', ')
                };
            }
        }
        return { city: '', detail: fullAddress };
    };

    // Helper to separate date
    const splitDate = (dateStr?: string) => {
        if (!dateStr) return { day: '', month: '', year: '' };
        const d = dayjs(dateStr);
        return {
            day: d.format('DD'),
            month: d.format('M'),
            year: d.format('YYYY')
        };
    };

    const { user } = useAppStore();

    const initializeForm = () => {
        const addr = splitAddress(profile?.diaChi);
        const date = splitDate(profile?.ngaySinh);

        return {
            hoTen: profile?.hoTen || '',
            email: profile?.email || user?.email || '',

            dobDay: date.day,
            dobMonth: date.month,
            dobYear: date.year,

            gioiTinh: profile?.gioiTinh || 'NAM',
            soDienThoai: profile?.soDienThoai || '',

            addrCity: addr.city,
            addrDetail: addr.detail,

            lopHocId: profile?.hoSoHocSinh?.lopHocId || undefined,
            chuyenMon: profile?.hoSoGiaoVien?.chuyenMon || ''
        };
    };

    const [formData, setFormData] = useState<ProfileFormData>(initializeForm());
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Reset form when profile changes or drawer opens
    useEffect(() => {
        if (opened) {
            setFormData(initializeForm());
            setAvatarFile(null);
            setAvatarPreview(null);
        }
    }, [opened, profile]);

    const handleInputChange = (field: keyof ProfileFormData, value: string | number | undefined) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            // Reconstruct Date
            let finalDate = undefined;
            if (formData.dobDay && formData.dobMonth && formData.dobYear) {
                // Pad day with 0 if single digit
                const d = formData.dobDay.padStart(2, '0');
                const m = formData.dobMonth.padStart(2, '0');
                const y = formData.dobYear;
                const isoDate = `${y}-${m}-${d}`;
                if (dayjs(isoDate).isValid()) {
                    finalDate = isoDate;
                }
            }

            // Reconstruct Address
            let finalAddress = formData.addrDetail;
            if (formData.addrCity && formData.addrCity !== 'Khác') {
                finalAddress = finalAddress ? `${finalAddress}, ${formData.addrCity}` : formData.addrCity;
            }

            const apiData = {
                ...formData,
                ngaySinh: finalDate,
                diaChi: finalAddress
            };

            await updateProfileMutation.mutateAsync(apiData);

            notifications.show({
                title: "Thành công",
                message: "Cập nhật hồ sơ thành công!",
                color: "green",
                icon: <IconCheck size={18} />
            });
            onClose();
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể lưu thay đổi.",
                color: "red"
            });
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);
            await uploadAvatarMutation.mutateAsync(formData);

            setAvatarFile(null);
            setAvatarPreview(null);

            notifications.show({
                title: "Thành công",
                message: "Đã cập nhật ảnh đại diện mới",
                color: "teal"
            });
        } catch (error) {
            notifications.show({ title: "Lỗi", message: "Upload thất bại", color: "red" });
        }
    };

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            position="right"
            size={isMobile ? '100%' : 600}
            padding={0}
            withCloseButton={false}
            overlayProps={{ opacity: 0.4, blur: 4 }}
        >
            <Stack h="100%" gap={0} className="bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors">
                {/* Header */}
                <Box className="px-6 py-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-20">
                    <Group justify="space-between">
                        <Group gap="sm">
                            <Box className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/20">
                                <IconEdit size={20} stroke={2} />
                            </Box>
                            <div>
                                <Title order={4} fw={800} className="text-gray-900 dark:text-white">Chỉnh sửa hồ sơ</Title>
                                <Text size="xs" c="dimmed">Cập nhật thông tin cá nhân</Text>
                            </div>
                        </Group>
                        <ActionIcon variant="subtle" color="gray" onClick={onClose} size="lg" radius="xl">
                            <IconX size={22} />
                        </ActionIcon>
                    </Group>
                </Box>

                {/* Scrollable Content */}
                <Box className="flex-1 overflow-y-auto">
                    <Stack gap={0}>
                        {/* Premium Avatar Section */}
                        <Box className="relative bg-gradient-to-b from-indigo-600 to-indigo-800 pt-10 pb-16 px-6">
                            <Center>
                                <Stack align="center" gap="md" className="relative z-10">
                                    <Box className="relative group">
                                        <div className="rounded-full p-1 bg-white/20 backdrop-blur-sm">
                                            <Avatar
                                                src={avatarPreview || profile?.avatar}
                                                size={140}
                                                radius="100%"
                                                className="border-4 border-white dark:border-zinc-900 shadow-2xl"
                                            />
                                        </div>
                                        <ActionIcon
                                            component="label"
                                            htmlFor="avatar-input"
                                            variant="filled"
                                            color="dark"
                                            size={42}
                                            radius="xl"
                                            className="absolute bottom-1 right-1 border-4 border-indigo-700 shadow-lg cursor-pointer hover:scale-110 transition-transform"
                                        >
                                            <IconCamera size={20} />
                                        </ActionIcon>
                                        <input
                                            id="avatar-input"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            style={{ display: 'none' }}
                                        />
                                    </Box>

                                    {avatarFile ? (
                                        <Button
                                            size="sm"
                                            variant="white"
                                            color="indigo"
                                            radius="xl"
                                            leftSection={<IconCheck size={16} />}
                                            onClick={handleAvatarUpload}
                                            loading={uploadAvatarMutation.isPending}
                                            className="shadow-lg animate-in fade-in zoom-in duration-300"
                                        >
                                            Lưu Avatar Mới
                                        </Button>
                                    ) : (
                                        <Text size="sm" className="text-white/80 font-medium">
                                            Cham vào icon camera để thay đổi ảnh
                                        </Text>
                                    )}
                                </Stack>
                            </Center>

                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                        </Box>

                        {/* Form Content */}
                        <Stack gap="xl" p="lg" className="-mt-6 relative z-10">

                            {/* Account Block */}
                            <Box className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800">
                                <Group gap="md" mb="md" align="center">
                                    <IconMail size={20} className="text-indigo-500" />
                                    <Text fw={700} className="text-gray-900 dark:text-gray-100">Thông tin đăng nhập</Text>
                                </Group>
                                <Stack gap="xs">
                                    <TextInput
                                        label="Email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        size="md"
                                        radius="md"
                                        classNames={{ input: "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" }}
                                    />
                                    <Group gap={6} className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                                        <Text size="xs" c="red" fw={500} className="leading-snug">
                                            Lưu ý: Email là tên đăng nhập của bạn. Thay đổi email sẽ thay đổi tài khoản đăng nhập.
                                        </Text>
                                    </Group>
                                </Stack>
                            </Box>

                            {/* Personal Info Block */}
                            <Box className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800">
                                <Group gap="md" mb="md" align="center">
                                    <IconUser size={20} className="text-indigo-500" />
                                    <Text fw={700} className="text-gray-900 dark:text-gray-100">Thông tin cá nhân</Text>
                                </Group>
                                <Stack gap="md">
                                    <TextInput
                                        label="Họ và tên"
                                        value={formData.hoTen}
                                        onChange={(e) => handleInputChange('hoTen', e.target.value)}
                                        size="md"
                                        radius="md"
                                        placeholder="Nhập họ tên đầy đủ"
                                        classNames={{ input: "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" }}
                                    />

                                    <SimpleGrid cols={2}>
                                        <Select
                                            label="Giới tính"
                                            value={formData.gioiTinh}
                                            onChange={(value) => value && handleInputChange('gioiTinh', value)}
                                            data={[{ value: 'NAM', label: 'Nam' }, { value: 'NU', label: 'Nữ' }]}
                                            size="md"
                                            radius="md"
                                            classNames={{ input: "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" }}
                                        />
                                        <TextInput
                                            label="Số điện thoại"
                                            value={formData.soDienThoai}
                                            onChange={(e) => handleInputChange('soDienThoai', e.target.value)}
                                            size="md"
                                            radius="md"
                                            placeholder="0123..."
                                            classNames={{ input: "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" }}
                                        />
                                    </SimpleGrid>

                                    {/* Split Date Input */}
                                    <Box>
                                        <Text size="sm" fw={500} mb={4}>Ngày sinh</Text>
                                        <SimpleGrid cols={3} spacing="xs">
                                            <TextInput
                                                placeholder="Ngày"
                                                type="number"
                                                min={1} max={31}
                                                value={formData.dobDay}
                                                onChange={(e) => handleInputChange('dobDay', e.target.value)}
                                                radius="md"
                                                size="md"
                                                className="text-center"
                                                classNames={{ input: "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-center" }}
                                            />
                                            <Select
                                                placeholder="Tháng"
                                                data={MONTHS}
                                                value={formData.dobMonth}
                                                onChange={(val) => val && handleInputChange('dobMonth', val)}
                                                radius="md"
                                                size="md"
                                                searchable
                                                classNames={{ input: "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" }}
                                            />
                                            <TextInput
                                                placeholder="Năm"
                                                type="number"
                                                min={1900} max={2100}
                                                value={formData.dobYear}
                                                onChange={(e) => handleInputChange('dobYear', e.target.value)}
                                                radius="md"
                                                size="md"
                                                classNames={{ input: "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-center" }}
                                            />
                                        </SimpleGrid>
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Address Block */}
                            <Box className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800">
                                <Group gap="md" mb="md" align="center">
                                    <IconMapPin size={20} className="text-indigo-500" />
                                    <Text fw={700} className="text-gray-900 dark:text-gray-100">Địa chỉ liên hệ</Text>
                                </Group>
                                <Stack gap="md">
                                    <Select
                                        label="Tỉnh / Thành phố"
                                        placeholder="Chọn tỉnh thành..."
                                        data={CITIES}
                                        value={formData.addrCity || 'Khác'}
                                        onChange={(val) => val && handleInputChange('addrCity', val)}
                                        size="md"
                                        radius="md"
                                        searchable
                                        checkIconPosition="right"
                                        leftSection={<IconBuildingSkyscraper size={16} />}
                                        classNames={{ input: "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" }}
                                    />

                                    <Textarea
                                        label="Chi tiết (Số nhà, Đường, Phường/Xã, Quận/Huyện)"
                                        value={formData.addrDetail}
                                        onChange={(e) => handleInputChange('addrDetail', e.target.value)}
                                        placeholder="Nhập địa chỉ chi tiết..."
                                        minRows={2}
                                        autosize
                                        radius="md"
                                        size="md"
                                        classNames={{ input: "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" }}
                                    />
                                </Stack>
                            </Box>

                            {/* Additional Info */}
                            {profile?.vaiTro === 'HOC_SINH' && (
                                <Box className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800">
                                    <Group gap="md" mb="md" align="center">
                                        <IconSchool size={20} className="text-indigo-500" />
                                        <Text fw={700} className="text-gray-900 dark:text-gray-100">Thông tin học tập</Text>
                                    </Group>
                                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                        <Select
                                            label="Lớp học"
                                            value={formData.lopHocId?.toString()}
                                            onChange={(value) => handleInputChange('lopHocId', value ? parseInt(value) : undefined)}
                                            placeholder="Chọn lớp"
                                            data={[]}
                                            size="md"
                                            radius="md"
                                            disabled // Usually managed by admin
                                            classNames={{ input: "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" }}
                                        />
                                        <TextInput
                                            label="Sở trường / Năng khiếu"
                                            value={formData.chuyenMon}
                                            onChange={(e) => handleInputChange('chuyenMon', e.target.value)}
                                            size="md"
                                            radius="md"
                                            placeholder="Vẽ, Múa, Toán..."
                                            classNames={{ input: "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700" }}
                                        />
                                    </SimpleGrid>
                                </Box>
                            )}

                            {/* Bottom Spacing */}
                            <Box h={80} />
                        </Stack>
                    </Stack>
                </Box>

                {/* Footer Fixed */}
                <Box className="p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-gray-200 dark:border-zinc-800 sticky bottom-0 z-50">
                    <Group justify="flex-end" gap="sm">
                        <Button
                            variant="subtle"
                            color="gray"
                            size="md"
                            radius="xl"
                            onClick={onClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="gradient"
                            gradient={{ from: 'indigo', to: 'blue' }}
                            size="md"
                            radius="xl"
                            onClick={handleSave}
                            loading={updateProfileMutation.isPending}
                            className="shadow-lg shadow-indigo-500/30"
                            px="xl"
                        >
                            Lưu Thay Đổi
                        </Button>
                    </Group>
                </Box>
            </Stack>
        </Drawer>
    );
}
