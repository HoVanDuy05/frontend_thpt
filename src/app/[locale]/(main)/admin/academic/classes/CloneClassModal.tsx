"use client";

import { useTranslations } from "next-intl";
import { Modal, Select, Button, Group, Stack, LoadingOverlay, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMemo } from "react";
import { AppMutation } from "@/api/AppMutation";
import { AppQuery } from "@/api/AppQuery";
import { notifications } from "@mantine/notifications";

interface CloneClassModalProps {
    opened: boolean;
    onClose: () => void;
}

export function CloneClassModal({ opened, onClose }: CloneClassModalProps) {
    // Hooks
    const t = useTranslations('admin.academic.classes'); // Assuming translation keys exist
    const { data: years } = AppQuery.academic.useYears();
    const mutation = AppMutation();
    const cloneMutation = mutation.academic.useCloneClasses();

    // Derived State
    const yearOptions = useMemo(() =>
        years?.map((y: any) => ({ value: y.id.toString(), label: y.tenNamHoc })) || [],
        [years]);

    // Form
    const form = useForm({
        initialValues: {
            fromNamHocId: '',
            toNamHocId: ''
        },
        validate: {
            fromNamHocId: (val) => (!val ? 'Vui lòng chọn năm nguồn' : null),
            toNamHocId: (val) => (!val ? 'Vui lòng chọn năm đích' : null),
            // Optional: validate from != to
        }
    });

    const handleSubmit = (values: typeof form.values) => {
        if (values.fromNamHocId === values.toNamHocId) {
            form.setFieldError('toNamHocId', 'Năm đích không được trùng năm nguồn');
            return;
        }

        cloneMutation.mutate({
            fromNamHocId: parseInt(values.fromNamHocId),
            toNamHocId: parseInt(values.toNamHocId)
        }, {
            onSuccess: (data: any) => {
                notifications.show({
                    title: 'Thành công',
                    message: data.count === 0 ? data.message : `Đã sao chép danh sách lớp thành công!`,
                    color: 'green'
                });
                onClose();
                form.reset();
            },
            onError: (err) => {
                notifications.show({ title: 'Thất bại', message: err.message || 'Có lỗi xảy ra', color: 'red' });
            }
        });
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Sao chép cấu trúc lớp học"
            centered
        >
            <LoadingOverlay visible={cloneMutation.isPending} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <Text size="sm" c="dimmed">
                        Tính năng này giúp bạn sao chép toàn bộ danh sách tên lớp từ năm học cũ sang năm học mới.
                        Các lớp trùng tên sẽ bị bỏ qua.
                    </Text>

                    <Select
                        label="Từ năm học (Nguồn)"
                        placeholder="Chọn năm cũ"
                        data={yearOptions}
                        searchable
                        required
                        {...form.getInputProps('fromNamHocId')}
                    />

                    <Select
                        label="Đến năm học (Đích)"
                        placeholder="Chọn năm mới"
                        data={yearOptions}
                        searchable
                        required
                        {...form.getInputProps('toNamHocId')}
                    />

                    <Group justify="end" mt="md">
                        <Button variant="light" color="gray" onClick={onClose}>Hủy</Button>
                        <Button type="submit" loading={cloneMutation.isPending}>Sao chép</Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
