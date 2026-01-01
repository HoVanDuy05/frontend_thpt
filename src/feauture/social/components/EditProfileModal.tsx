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
    TextInput,
    Textarea,
    Select,
    Divider,
    ActionIcon,
    Modal
} from "@mantine/core";
import {
    IconCamera,
    IconEdit,
    IconX
} from "@tabler/icons-react";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";

interface ProfileFormData {
    hoTen?: string;
    email?: string;
    ngaySinh?: string;
    gioiTinh?: 'NAM' | 'NU';
    soDienThoai?: string;
    diaChi?: string;
    lopHocId?: number;
    chuyenMon?: string;
}

interface EditProfileModalProps {
    opened: boolean;
    onClose: () => void;
    profile: any;
}

export function EditProfileModal({ opened, onClose, profile }: EditProfileModalProps) {
    const updateProfileMutation = AppMutation().auth.useUpdateProfile;
    const uploadAvatarMutation = AppMutation().auth.useUploadAvatar;

    const [formData, setFormData] = useState<ProfileFormData>({
        hoTen: profile?.hoTen || '',
        email: profile?.email || '',
        ngaySinh: profile?.ngaySinh ? new Date(profile.ngaySinh).toISOString().split('T')[0] : '',
        gioiTinh: profile?.gioiTinh || 'NAM',
        soDienThoai: profile?.soDienThoai || '',
        diaChi: profile?.diaChi || '',
        lopHocId: profile?.hoSoHocSinh?.lopHocId || undefined,
        chuyenMon: profile?.hoSoGiaoVien?.chuyenMon || ''
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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
        const mutation = updateProfileMutation();
        try {
            await mutation.mutateAsync(formData);
            notifications.show({
                title: "Thành công",
                message: "Cập nhật thông tin thành công",
                color: "green"
            });
            onClose();
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể cập nhật thông tin",
                color: "red"
            });
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;

        const mutation = uploadAvatarMutation();
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            await mutation.mutateAsync(formData);
            setAvatarFile(null);
            setAvatarPreview(null);
            notifications.show({
                title: "Thành công",
                message: "Cập nhật avatar thành công",
                color: "green"
            });
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể cập nhật avatar",
                color: "red"
            });
        }
    };

    const handleClose = () => {
        // Reset form data when closing
        setFormData({
            hoTen: profile?.hoTen || '',
            email: profile?.email || '',
            ngaySinh: profile?.ngaySinh ? new Date(profile.ngaySinh).toISOString().split('T')[0] : '',
            gioiTinh: profile?.gioiTinh || 'NAM',
            soDienThoai: profile?.soDienThoai || '',
            diaChi: profile?.diaChi || '',
            lopHocId: profile?.hoSoHocSinh?.lopHocId || undefined,
            chuyenMon: profile?.hoSoGiaoVien?.chuyenMon || ''
        });
        setAvatarFile(null);
        setAvatarPreview(null);
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            size="lg"
            title={
                <Group gap="sm">
                    <IconEdit size={20} />
                    <Text fw={600}>Chỉnh sửa thông tin cá nhân</Text>
                </Group>
            }
        >
            <Stack gap="md">
                {/* Avatar Section */}
                <Group justify="center" mb="md">
                    <Box pos="relative">
                        <Avatar
                            src={avatarPreview || profile?.avatar}
                            size={120}
                            radius="xl"
                            className="shadow-xl"
                        />
                        <ActionIcon
                            pos="absolute"
                            bottom={0}
                            right={0}
                            size="md"
                            variant="filled"
                            color="blue"
                            radius="xl"
                            onClick={() => document.getElementById('avatar-input')?.click()}
                        >
                            <IconCamera size={16} />
                        </ActionIcon>
                        <input
                            id="avatar-input"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                    </Box>
                </Group>

                {avatarFile && (
                    <Group justify="center">
                        <Button
                            variant="light"
                            color="green"
                            onClick={handleAvatarUpload}
                            loading={uploadAvatarMutation().isPending}
                        >
                            Cập nhật avatar
                        </Button>
                    </Group>
                )}

                <Divider />

                {/* Basic Information */}
                <Stack gap="md">
                    <Group>
                        <Box w="50%">
                            <Text size="sm" fw={500} mb="xs">Họ và tên</Text>
                            <TextInput
                                value={formData.hoTen}
                                onChange={(e) => handleInputChange('hoTen', e.target.value)}
                                placeholder="Nhập họ và tên"
                            />
                        </Box>
                        <Box w="50%">
                            <Text size="sm" fw={500} mb="xs">Email</Text>
                            <TextInput
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Nhập email"
                            />
                        </Box>
                    </Group>

                    <Group>
                        <Box w="50%">
                            <Text size="sm" fw={500} mb="xs">Ngày sinh</Text>
                            <TextInput
                                type="date"
                                value={formData.ngaySinh}
                                onChange={(e) => handleInputChange('ngaySinh', e.target.value)}
                            />
                        </Box>
                        <Box w="50%">
                            <Text size="sm" fw={500} mb="xs">Giới tính</Text>
                            <Select
                                value={formData.gioiTinh}
                                onChange={(value) => value && handleInputChange('gioiTinh', value)}
                                data={[
                                    { value: 'NAM', label: 'Nam' },
                                    { value: 'NU', label: 'Nữ' }
                                ]}
                            />
                        </Box>
                    </Group>

                    <Text size="sm" fw={500} mb="xs">Số điện thoại</Text>
                    <TextInput
                        value={formData.soDienThoai}
                        onChange={(e) => handleInputChange('soDienThoai', e.target.value)}
                        placeholder="Nhập số điện thoại"
                    />

                    <Text size="sm" fw={500} mb="xs">Địa chỉ</Text>
                    <Textarea
                        value={formData.diaChi}
                        onChange={(e) => handleInputChange('diaChi', e.target.value)}
                        placeholder="Nhập địa chỉ"
                        rows={3}
                    />

                    {/* Role-specific fields */}
                    {profile?.vaiTro === 'HOC_SINH' && (
                        <Group>
                            <Box w="50%">
                                <Text size="sm" fw={500} mb="xs">Lớp học</Text>
                                <Select
                                    value={formData.lopHocId?.toString()}
                                    onChange={(value) => handleInputChange('lopHocId', value ? parseInt(value) : undefined)}
                                    placeholder="Chọn lớp học"
                                    data={[]}
                                />
                            </Box>
                            <Box w="50%">
                                <Text size="sm" fw={500} mb="xs">Chuyên môn</Text>
                                <TextInput
                                    value={formData.chuyenMon}
                                    onChange={(e) => handleInputChange('chuyenMon', e.target.value)}
                                    placeholder="Nhập chuyên môn"
                                />
                            </Box>
                        </Group>
                    )}

                    {profile?.vaiTro === 'GIAO_VIEN' && (
                        <Box>
                            <Text size="sm" fw={500} mb="xs">Chuyên môn</Text>
                            <TextInput
                                value={formData.chuyenMon}
                                onChange={(e) => handleInputChange('chuyenMon', e.target.value)}
                                placeholder="Nhập chuyên môn"
                            />
                        </Box>
                    )}
                </Stack>

                {/* Actions */}
                <Group justify="flex-end" gap="sm" mt="md">
                    <Button
                        variant="light"
                        color="gray"
                        onClick={handleClose}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="filled"
                        color="blue"
                        onClick={handleSave}
                        loading={updateProfileMutation().isPending}
                    >
                        Lưu thay đổi
                    </Button>
                </Group>
            </Stack>
        </Modal >
    );
}
