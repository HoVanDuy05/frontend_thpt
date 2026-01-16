"use client";

import { useTranslations } from "next-intl";
import { Drawer, Stack, TextInput, Button, Group, LoadingOverlay, Select, NumberInput, Textarea, Skeleton, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useMemo } from "react";
import { AppMutation } from "@/api/AppMutation";
import { AppQuery } from "@/api/AppQuery";
import { notifications } from "@mantine/notifications";
import { TLopNam } from "@/shared/types/academic.type";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

interface ClassDrawerProps {
    opened: boolean;
    onClose: () => void;
    lopNamModel?: TLopNam | null;
    gradeId?: number; // Context-aware
    yearId?: number;  // Context-aware
}

export function ClassDrawer({ opened, onClose, lopNamModel, gradeId, yearId }: ClassDrawerProps) {
    const t = useTranslations('admin.academic.classes');

    // Mutations - For now, we'll create LopHoc (permanent class definition)
    const mutations = AppMutation();
    const createClassMutation = mutations.academic.useCreateClass();
    const updateClassMutation = mutations.academic.useUpdateClass(0);

    const createClassYearMutation = mutations.academic.useCreateClassYear();
    const updateClassYearMutation = mutations.academic.useUpdateClassYear(0);

    // Queries for Select options
    const { data: years, isLoading: isLoadingYears } = AppQuery.academic.useYears();
    const { data: teachers, isLoading: isLoadingTeachers } = AppQuery.user.useList({ role: 'GIAO_VIEN' });
    const { data: khois, isLoading: isLoadingKhois } = AppQuery.academic.useKhois();

    const yearOptions = useMemo(() =>
        years?.map((y: any) => ({ value: y.id.toString(), label: y.tenNamHoc })) || [],
        [years]);

    const teacherOptions = useMemo(() =>
        teachers?.filter((t: any) => t.hoSoGiaoVien).map((t: any) => ({
            value: t.hoSoGiaoVien.id.toString(),
            label: `${t.hoTen} (${t.maSo})`
        })) || [],
        [teachers]);

    const gradeOptions = useMemo(() =>
        khois?.map(k => ({ value: k.id.toString(), label: k.tenKhoi })) || [],
        [khois]);

    const form = useForm({
        initialValues: {
            tenLop: '',
            khoiId: '',
            moTa: '',
            namHocId: '',
            gvChuNhiemId: null as string | null,
        },
        validate: {
            tenLop: (value) => (value.length < 2 ? t('validation.name_short', { defaultMessage: 'Tên lớp quá ngắn' }) : null),
            khoiId: (value) => (!value ? t('validation.grade_required', { defaultMessage: 'Vui lòng chọn khối' }) : null),
            namHocId: (value) => (!value ? t('validation.year_required', { defaultMessage: 'Vui lòng chọn năm học' }) : null),
        },
    });

    useEffect(() => {
        if (lopNamModel?.lopHoc) {
            form.setValues({
                tenLop: lopNamModel.lopHoc.tenLop,
                khoiId: lopNamModel.lopHoc.khoiId?.toString() || '',
                moTa: lopNamModel.lopHoc.moTa || '',
                namHocId: lopNamModel.namHocId.toString(),
                gvChuNhiemId: lopNamModel.gvChuNhiemId?.toString() || null,
            });
        } else {
            form.reset();
            // Pre-fill from props if creating new
            if (opened) {
                if (gradeId) form.setFieldValue('khoiId', gradeId.toString());
                if (yearId) form.setFieldValue('namHocId', yearId.toString());
            }
        }
    }, [lopNamModel, opened, gradeId, yearId]);

    const handleSubmit = async (values: typeof form.values) => {
        const lopHocPayload = {
            tenLop: values.tenLop,
            khoiId: parseInt(values.khoiId),
            moTa: values.moTa || undefined,
            namHocId: parseInt(values.namHocId),
            gvChuNhiemId: values.gvChuNhiemId ? parseInt(values.gvChuNhiemId) : undefined,
        };

        try {
            if (lopNamModel && lopNamModel.lopHoc) {
                // 1. Update existing LopHoc
                await updateClassMutation.mutateAsync({
                    ...lopHocPayload,
                    urlParams: { id: lopNamModel.lopHoc.id }
                } as any);

                // 2. Update existing LopNam
                await updateClassYearMutation.mutateAsync({
                    namHocId: parseInt(values.namHocId),
                    gvChuNhiemId: values.gvChuNhiemId ? parseInt(values.gvChuNhiemId) : null,
                    urlParams: { id: lopNamModel.id }
                } as any);

                notifications.show({ title: 'Thành công', message: 'Cập nhật lớp học thành công', color: 'green' });
                onClose();
            } else {
                // 1. Create new LopHoc
                const newLopHoc = await createClassMutation.mutateAsync(lopHocPayload as any);

                // 2. Create new LopNam for the year
                await createClassYearMutation.mutateAsync({
                    lopId: (newLopHoc as any).id,
                    namHocId: parseInt(values.namHocId),
                    gvChuNhiemId: values.gvChuNhiemId ? parseInt(values.gvChuNhiemId) : undefined,
                });

                notifications.show({
                    title: 'Thành công',
                    message: 'Tạo lớp học thành công!',
                    color: 'green'
                });
                onClose();
            }
            form.reset();
        } catch (error) {
            notifications.show({ title: 'Thất bại', message: 'Có lỗi xảy ra khi lưu dữ liệu', color: 'red' });
        }
    };

    const isSubmitting = createClassMutation.isPending || updateClassMutation.isPending || createClassYearMutation.isPending || updateClassYearMutation.isPending;
    const isLoadingData = isLoadingYears || isLoadingTeachers || isLoadingKhois;

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            title={lopNamModel ? t('actions.edit', { defaultMessage: 'Chỉnh sửa lớp học' }) : t('actions.create', { defaultMessage: 'Thêm mới lớp học' })}
            position="right"
            size="md"
            padding="lg"
            styles={{
                header: { borderBottom: '1px solid var(--mantine-color-default-border)', marginBottom: '1rem' }
            }}
        >
            <LoadingOverlay
                visible={isSubmitting}
                overlayProps={{ blur: 1 }}
                loaderProps={{ color: 'indigo', type: 'dots' }}
            />

            {isLoadingData ? (
                <SkeletonLoader type="form" count={5} />
            ) : (
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        <TextInput
                            label={t('fields.name', { defaultMessage: 'Tên lớp' })}
                            placeholder={t('placeholders.name', { defaultMessage: 'Nhập tên lớp (VD: 10A1)' })}
                            description="Tên lớp học (ví dụ: 10A1, 11B2)"
                            required
                            {...form.getInputProps('tenLop')}
                        />

                        <Select
                            label={t('fields.grade', { defaultMessage: 'Khối' })}
                            placeholder={t('placeholders.grade', { defaultMessage: 'Chọn khối' })}
                            data={gradeOptions}
                            required
                            disabled={!!gradeId}
                            {...form.getInputProps('khoiId')}
                        />

                        <Select
                            label={t('fields.year', { defaultMessage: 'Năm học' })}
                            placeholder={t('placeholders.year', { defaultMessage: 'Chọn năm học' })}
                            data={yearOptions}
                            required
                            searchable
                            disabled={!!yearId}
                            {...form.getInputProps('namHocId')}
                        />

                        <Select
                            label={t('fields.homeroom_teacher', { defaultMessage: 'Giáo viên chủ nhiệm' })}
                            placeholder={t('placeholders.teacher', { defaultMessage: 'Chọn giáo viên' })}
                            data={teacherOptions}
                            searchable
                            clearable
                            {...form.getInputProps('gvChuNhiemId')}
                        />

                        <Textarea
                            label={t('fields.description', { defaultMessage: 'Mô tả' })}
                            placeholder={t('placeholders.description', { defaultMessage: 'Nhập mô tả (tùy chọn)' })}
                            description="Mô tả thêm về lớp học (tùy chọn)"
                            minRows={3}
                            {...form.getInputProps('moTa')}
                        />

                        <Group justify="end" mt="md">
                            <Button variant="light" color="gray" onClick={onClose}>
                                {t('actions.cancel', { defaultMessage: 'Hủy' })}
                            </Button>
                            <Button type="submit" loading={isSubmitting}>
                                {lopNamModel ? t('actions.update', { defaultMessage: 'Cập nhật' }) : t('actions.create_confirm', { defaultMessage: 'Tạo lớp học' })}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            )}
        </Drawer>
    );
}
