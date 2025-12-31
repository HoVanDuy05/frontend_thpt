"use client";

import { Drawer, Stack, TextInput, PasswordInput, Group, Button, Select, Divider, Text, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState, useMemo } from 'react';
import { TUser } from '@/shared/types/user.type';
import { DateInput } from '@mantine/dates';
import { AppQuery } from '@/api/AppQuery';

interface UserDrawerProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    initialData?: TUser | null;
    role: string;
    loading?: boolean;
}

export function UserDrawer({ opened, onClose, onSubmit, initialData, role, loading }: UserDrawerProps) {
    // Queries
    const { data: years } = AppQuery.academic.useYears();
    const { data: classes } = AppQuery.academic.useClasses();

    const [selectedYear, setSelectedYear] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            email: '',
            matKhau: '',
            hoTen: '',
            maSo: '',
            ngaySinh: null as Date | null,
            gioiTinh: 'NAM',
            // Student specific
            namHocId: '',
            lopId: '',
        },
        validate: {
            email: (val) => {
                if (!val) return 'Email không được để trống';
                if (!/^\S+@\S+$/.test(val)) return 'Email không hợp lệ';
                return null;
            },
            maSo: (val) => (val.length < 1 ? 'Mã số không được để trống' : null),
            hoTen: (val) => (val.length < 1 ? 'Họ tên không được để trống' : null),
            matKhau: (val) => (!initialData && val.length < 6 ? 'Mật khẩu phải ít nhất 6 ký tự' : null),
            lopId: (val) => (role === 'HOC_SINH' && !val ? 'Vui lòng chọn lớp học' : null),
        },
    });

    useEffect(() => {
        if (initialData) {
            form.setValues({
                email: initialData.email || '',
                matKhau: '', // Do not fill password on edit
                hoTen: initialData.hoTen,
                maSo: initialData.maSo || '',
                ngaySinh: initialData.ngaySinh ? new Date(initialData.ngaySinh) : null,
                gioiTinh: initialData.gioiTinh || 'NAM',
                namHocId: '', // Todo: populate if editing student
                lopId: '', // Todo: populate if editing student
            });
            // Try to extract student class info if available
            if (initialData.hoSoHocSinh?.lopHoc) {
                form.setFieldValue('lopId', initialData.hoSoHocSinh.lopHoc.id.toString());
                if (initialData.hoSoHocSinh.lopHoc.namHocId) {
                    setSelectedYear(initialData.hoSoHocSinh.lopHoc.namHocId.toString());
                }
            }

        } else {
            form.reset();
        }
    }, [initialData, opened]);

    // Derived Data
    const yearOptions = useMemo(() => years?.map(y => ({ value: y.id.toString(), label: y.tenNamHoc })) || [], [years]);

    // Filter classes by selected Year
    const classOptions = useMemo(() => {
        if (!classes) return [];
        let filtered = classes;
        if (selectedYear) {
            filtered = classes.filter(c => c.namHocId === Number(selectedYear));
        }
        return filtered.map(c => ({ value: c.id.toString(), label: c.tenLop }));
    }, [classes, selectedYear]);


    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            title={<Text fw={700} size="lg">{initialData ? 'Cập nhật' : 'Thêm mới'} {role === 'HOC_SINH' ? 'Học sinh' : role === 'GIAO_VIEN' ? 'Giáo viên' : 'Người dùng'}</Text>}
            position="right"
            size="md"
        >
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <Stack gap="md">
                    <Stack gap="xs">
                        <Text fw={600} size="sm" c="dimmed">THÔNG TIN ĐĂNG NHẬP</Text>
                        <TextInput
                            label="Email"
                            placeholder="example@school.edu"
                            type="email"
                            required
                            {...form.getInputProps('email')}
                            disabled={!!initialData}
                            description="Email sẽ được dùng để đăng nhập"
                        />
                        {!initialData && (
                            <PasswordInput
                                label="Mật khẩu"
                                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                                required
                                {...form.getInputProps('matKhau')}
                            />
                        )}
                    </Stack>

                    <Divider />

                    <Stack gap="xs">
                        <Text fw={600} size="sm" c="dimmed">THÔNG TIN CÁ NHÂN</Text>
                        <TextInput
                            label="Mã số (ID)"
                            placeholder={role === 'HOC_SINH' ? "Mã học sinh" : "Mã giáo viên"}
                            required
                            {...form.getInputProps('maSo')}
                        />
                        <TextInput
                            label="Họ và tên"
                            placeholder="Nhập họ và tên"
                            required
                            {...form.getInputProps('hoTen')}
                        />
                        <Group grow>
                            <Select
                                label="Giới tính"
                                data={[{ value: 'NAM', label: 'Nam' }, { value: 'NU', label: 'Nữ' }]}
                                {...form.getInputProps('gioiTinh')}
                            />
                            <DateInput
                                label="Ngày sinh"
                                placeholder="Chọn ngày sinh"
                                valueFormat="DD/MM/YYYY"
                                {...form.getInputProps('ngaySinh')}
                            />
                        </Group>
                    </Stack>

                    {role === 'HOC_SINH' && (
                        <>
                            <Divider />
                            <Stack gap="xs">
                                <Text fw={600} size="sm" c="dimmed">THÔNG TIN LỚP HỌC</Text>
                                <Select
                                    label="Năm học"
                                    placeholder="Chọn năm học"
                                    data={yearOptions}
                                    value={selectedYear}
                                    onChange={setSelectedYear}
                                    searchable
                                    clearable
                                />
                                <Select
                                    label="Lớp học"
                                    placeholder="Chọn lớp học"
                                    data={classOptions}
                                    {...form.getInputProps('lopId')}
                                    required
                                    searchable
                                    disabled={!selectedYear}
                                    nothingFoundMessage={!selectedYear ? "Vui lòng chọn năm học trước" : "Không có lớp học nào"}
                                />
                            </Stack>
                        </>
                    )}

                    <Button type="submit" loading={loading} fullWidth mt="md">
                        {initialData ? 'Lưu thay đổi' : 'Tạo mới'}
                    </Button>
                </Stack>
            </form>
        </Drawer>
    );
}
