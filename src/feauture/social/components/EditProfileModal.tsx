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
    Center,
    Divider,
    Grid,
    GridCol
} from "@mantine/core";
import { useTranslations } from "next-intl";
import {
    IconCamera,
    IconX,
    IconCalendar,
    IconMapPin,
    IconUser,
    IconPhone,
    IconMail,
    IconEdit,
    IconBuildingSkyscraper,
    IconSchool,
    IconCheck,
    IconArrowLeft
} from "@tabler/icons-react";
import { useAppStore } from "@/providers/store/useAppStore";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";
import { dayjs } from "@/shared/utils/date.util";
import { SocialButton } from "./SocialButton";

interface ProfileFormData {
    hoTen?: string;
    email?: string;
    // Date parts (Social Display DOB)
    dobDay: string;
    dobMonth: string;
    dobYear: string;

    gioiTinh?: 'NAM' | 'NU';
    soDienThoai?: string;

    // Address parts (Social Display Address)
    addrCity: string;
    addrDetail: string;

    // REMOVED: lopHocId
    // CHANGED: tieuSu (Bio) - standardized
    tieuSu?: string;
    soThich?: string;
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

    const t = useTranslations('social');
    const { user } = useAppStore();

    const initializeForm = () => {
        const social = profile?.hoSoXaHoi || {};

        // Priority: Social Display -> User Profile
        const addr = splitAddress(social.diaChiHienThi || profile?.diaChi);
        const date = splitDate(social.ngaySinhHienThi || profile?.ngaySinh);

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

            // Map Bio to 'tieuSu' field
            tieuSu: social.tieuSu || '',
            soThich: social.soThich || ''
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
            <Stack h="100%" gap={0} className="bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-50 transition-colors">
                {/* Header */}
                <Box className="relative px-4 py-3 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={onClose}
                            size="lg"
                            radius="full"
                            className="bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 -ml-2"
                        >
                            <IconArrowLeft size={24} className="text-gray-900 dark:text-white" />
                        </ActionIcon>

                        <Title order={4} fw={700} className="text-gray-900 dark:text-white text-[17px] text-center">
                            {t('profile.edit')}
                        </Title>

                        <Group justify="flex-end">
                            <SocialButton
                                variantType="primary"
                                size="sm"
                                onClick={handleSave}
                                loading={updateProfileMutation.isPending}
                                className="px-5"
                            >
                                {t('profile.save')}
                            </SocialButton>
                        </Group>
                    </div>
                </Box>

                {/* Scrollable Content */}
                <Box className="flex-1 overflow-y-auto">
                    <Stack gap={0} align="stretch">

                        {/* Avatar Section - Centered & Minimal */}
                        <Center py="xl" className="bg-white dark:bg-zinc-950">
                            <Stack align="center" gap="sm">
                                <Box className="relative">
                                    <Avatar
                                        src={avatarPreview || profile?.avatar}
                                        size={100}
                                        radius="full"
                                        className="border border-gray-200 dark:border-zinc-800"
                                    />
                                    {uploadAvatarMutation.isPending && (
                                        <Box className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                                            {/* Loader could go here */}
                                        </Box>
                                    )}
                                </Box>
                                <Button
                                    component="label"
                                    htmlFor="avatar-input"
                                    variant="transparent"
                                    size="sm"
                                    className="text-blue-500 font-semibold hover:no-underline p-0 h-auto hover:bg-transparent"
                                >
                                    Chỉnh sửa ảnh
                                </Button>
                                <input
                                    id="avatar-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    style={{ display: 'none' }}
                                />
                                {avatarFile && (
                                    <Button
                                        size="xs"
                                        variant="light"
                                        color="blue"
                                        radius="xl"
                                        onClick={handleAvatarUpload}
                                        loading={uploadAvatarMutation.isPending}
                                    >
                                        Lưu ảnh mới
                                    </Button>
                                )}
                            </Stack>
                        </Center>

                        <Divider color="gray.1" className="dark:border-zinc-800" />

                        {/* Fields Section - List Style */}
                        <Stack gap={0} className="px-6">
                            {/* Name */}
                            <Box py="md" className="border-b border-gray-100 dark:border-zinc-800">
                                <Grid gutter="md" align="center">
                                    <Grid.Col span={3}>
                                        <Text fw={600} className="text-gray-900 dark:text-white">Tên</Text>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        <TextInput
                                            value={formData.hoTen}
                                            onChange={(e) => handleInputChange('hoTen', e.target.value)}
                                            variant="unstyled"
                                            placeholder="Tên của bạn"
                                            classNames={{ input: "text-gray-900 dark:text-white p-0 font-normal text-base placeholder:text-gray-400" }}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Box>

                            {/* Gender */}
                            {/* Gender */}
                            <Box py="md" className="border-b border-gray-100 dark:border-zinc-800">
                                <Grid gutter="md" align="center">
                                    <Grid.Col span={3}>
                                        <Text fw={600} className="text-gray-900 dark:text-white">Giới tính</Text>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        <Select
                                            value={formData.gioiTinh}
                                            onChange={(value) => value && handleInputChange('gioiTinh', value)}
                                            data={[{ value: 'NAM', label: 'Nam' }, { value: 'NU', label: 'Nữ' }]}
                                            variant="unstyled"
                                            classNames={{ input: "text-gray-900 dark:text-white p-0 font-normal text-base" }}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Box>

                            {/* Bio / Major */}
                            <Box py="md" className="border-b border-gray-100 dark:border-zinc-800">
                                <Grid gutter="md" align="center">
                                    <Grid.Col span={3}>
                                        <Text fw={600} className="text-gray-900 dark:text-white">Tiểu sử</Text>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        <Textarea
                                            value={formData.tieuSu}
                                            onChange={(e) => handleInputChange('tieuSu', e.target.value)}
                                            variant="unstyled"
                                            autosize
                                            minRows={1}
                                            placeholder="Giới thiệu nhanh về bản thân..."
                                            classNames={{ input: "text-gray-900 dark:text-white p-0 font-normal text-base placeholder:text-gray-400" }}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Box>

                            {/* Private Info Divider */}
                            <Box pt={32} pb="md">
                                <Text fw={700} size="xs" className="uppercase tracking-widest text-gray-500 dark:text-gray-400 px-1">
                                    Thông tin riêng tư
                                </Text>
                            </Box>

                            {/* Email */}
                            <Box py="md" className="border-b border-gray-100 dark:border-zinc-800">
                                <Grid gutter="md" align="center">
                                    <Grid.Col span={3}>
                                        <Text fw={600} className="text-gray-900 dark:text-white">Email</Text>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        <TextInput
                                            value={formData.email}
                                            readOnly
                                            disabled
                                            variant="unstyled"
                                            classNames={{ input: "text-gray-500 dark:text-gray-500 p-0 font-normal text-base cursor-not-allowed opacity-70" }}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Box>

                            {/* Phone */}
                            <Box py="md" className="border-b border-gray-100 dark:border-zinc-800">
                                <Grid gutter="md" align="center">
                                    <Grid.Col span={3}>
                                        <Text fw={600} className="text-gray-900 dark:text-white">SĐT</Text>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        <TextInput
                                            value={formData.soDienThoai}
                                            onChange={(e) => handleInputChange('soDienThoai', e.target.value)}
                                            variant="unstyled"
                                            placeholder="+84..."
                                            classNames={{ input: "text-gray-900 dark:text-white p-0 font-normal text-base" }}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Box>

                            {/* Address (City) */}
                            <Box py="md" className="border-b border-gray-100 dark:border-zinc-800">
                                <Grid gutter="md" align="center">
                                    <Grid.Col span={3}>
                                        <Text fw={600} className="text-gray-900 dark:text-white">Địa chỉ</Text>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        <Select
                                            data={CITIES}
                                            value={formData.addrCity || 'Khác'}
                                            onChange={(val) => val && handleInputChange('addrCity', val)}
                                            variant="unstyled"
                                            searchable
                                            classNames={{ input: "text-gray-900 dark:text-white p-0 font-normal text-base" }}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Box>

                            {/* DOB */}
                            <Box py="md" className="">
                                <Grid gutter="md" align="center">
                                    <Grid.Col span={3}>
                                        <Text fw={600} className="text-gray-900 dark:text-white">Ngày sinh</Text>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        <Group gap="xs">
                                            <TextInput
                                                placeholder="Ngày"
                                                value={formData.dobDay}
                                                onChange={(e) => handleInputChange('dobDay', e.target.value)}
                                                variant="unstyled"
                                                className="w-12 text-center border-b border-gray-200 dark:border-zinc-800 pb-1"
                                                classNames={{ input: "text-gray-900 dark:text-white p-0 text-center" }}
                                            />
                                            <Select
                                                placeholder="Tháng"
                                                data={MONTHS}
                                                value={formData.dobMonth}
                                                onChange={(val) => val && handleInputChange('dobMonth', val)}
                                                variant="unstyled"
                                                className="w-24 border-b border-gray-200 dark:border-zinc-800 pb-1"
                                                classNames={{ input: "text-gray-900 dark:text-white p-0" }}
                                            />
                                            <TextInput
                                                placeholder="Năm"
                                                value={formData.dobYear}
                                                onChange={(e) => handleInputChange('dobYear', e.target.value)}
                                                variant="unstyled"
                                                className="w-16 text-center border-b border-gray-200 dark:border-zinc-800 pb-1"
                                                classNames={{ input: "text-gray-900 dark:text-white p-0 text-center" }}
                                            />
                                        </Group>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Drawer>
    );
}
