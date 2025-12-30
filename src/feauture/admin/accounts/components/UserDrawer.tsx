"use client";

import { Drawer, Stack, TextInput, Select, Button, Group, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { TUser } from "@/shared/types/user.type";
import { FileUpload } from "@/shared/components/FileUpload";

interface UserDrawerProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: TUser | null;
    role: "HOC_SINH" | "GIAO_VIEN";
    loading?: boolean;
}

export const UserDrawer = ({ opened, onClose, onSubmit, initialData, role, loading }: UserDrawerProps) => {
    const isEdit = !!initialData;

    const form = useForm({
        initialValues: {
            taiKhoan: "",
            matKhau: "", // Only required for create
            email: "",
            hoTen: "",
            maSo: "", // maSoHs or maSoGv
            avatar: "",
            // Additional fields logic can be added here
        },
        validate: {
            taiKhoan: (value) => (value.length < 3 ? "Tài khoản phải có ít nhất 3 ký tự" : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email không hợp lệ"),
            hoTen: (value) => (value.length < 2 ? "Họ tên quá ngắn" : null),
        },
    });

    useEffect(() => {
        if (initialData) {
            const profile = initialData.hoSoGiaoVien || initialData.hoSoHocSinh || ({} as any);
            form.setValues({
                taiKhoan: initialData.taiKhoan,
                matKhau: "", // Don't prefill password
                email: initialData.email || "",
                hoTen: profile.hoTen || "",
                maSo: profile.maSoGv || profile.maSoHs || "",
                avatar: profile.avatar || "",
            });
        } else {
            form.reset();
        }
    }, [initialData, opened]);

    const handleSubmit = (values: typeof form.values) => {
        const payload: any = {
            taiKhoan: values.taiKhoan,
            email: values.email,
            // Map common fields to DTO specific structure
        };

        if (!isEdit) {
            payload.matKhau = values.matKhau;
        }

        if (role === "GIAO_VIEN") {
            payload.hoTen = values.hoTen;
            payload.maSoGv = values.maSo;
            payload.avatar = values.avatar;
        } else {
            payload.hoTen = values.hoTen;
            payload.maSoHs = values.maSo;
            payload.avatar = values.avatar;
        }

        onSubmit(payload);
    };

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            title={isEdit ? "Chỉnh sửa thông tin" : `Thêm ${role === "GIAO_VIEN" ? "Giáo viên" : "Học sinh"} mới`}
            position="right"
            size="md"
        >
            <LoadingOverlay visible={loading || false} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <FileUpload
                        label="Avatar"
                        value={form.values.avatar}
                        onChange={(url) => form.setFieldValue("avatar", url)}
                        type="avatar"
                    />

                    <TextInput
                        label="Tài khoản"
                        required
                        disabled={isEdit}
                        {...form.getInputProps("taiKhoan")}
                    />

                    {!isEdit && (
                        <TextInput
                            label="Mật khẩu"
                            required
                            type="password"
                            {...form.getInputProps("matKhau")}
                        />
                    )}

                    <TextInput
                        label="Email"
                        required
                        {...form.getInputProps("email")}
                    />

                    <TextInput
                        label="Họ và tên"
                        required
                        {...form.getInputProps("hoTen")}
                    />

                    <TextInput
                        label={role === "GIAO_VIEN" ? "Mã Giáo viên" : "Mã Học sinh"}
                        required
                        {...form.getInputProps("maSo")}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={onClose}>Hủy</Button>
                        <Button type="submit" loading={loading}>{isEdit ? "Cập nhật" : "Tạo mới"}</Button>
                    </Group>
                </Stack>
            </form>
        </Drawer>
    );
};
