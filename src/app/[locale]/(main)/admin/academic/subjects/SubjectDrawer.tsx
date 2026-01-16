"use client";

import { useTranslations } from "next-intl";
import { Drawer, Stack, TextInput, Textarea, Button, Group, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";

interface SubjectDrawerProps {
    opened: boolean;
    onClose: () => void;
    subject?: {
        id: number;
        tenMon: string;
        moTa?: string;
    } | null;
}

export function SubjectDrawer({ opened, onClose, subject }: SubjectDrawerProps) {
    const t = useTranslations('admin.academic.subjects');

    // Mutations
    const mutations = AppMutation();
    const createMutation = mutations.academic.useCreateSubject();
    const updateMutation = mutations.academic.useUpdateSubject(subject?.id || 0);

    const form = useForm({
        initialValues: {
            tenMon: '',
            moTa: ''
        },
        validate: {
            tenMon: (value) => (value.length < 2 ? t('validation.name_short', { defaultMessage: 'Tên môn học quá ngắn' }) : null),
        },
    });

    useEffect(() => {
        if (subject) {
            form.setValues({
                tenMon: subject.tenMon,
                moTa: subject.moTa || ''
            });
        } else {
            form.reset();
        }
    }, [subject, opened]); // Reset when opening/closing or subject changes

    const handleSubmit = (values: typeof form.values) => {
        const payload = {
            ...values,
            // Assuming simplified payload for now, adjust if backend expects more
        };

        if (subject) {
            updateMutation.mutate(payload as any, {
                onSuccess: () => {
                    notifications.show({ title: 'Thành công', message: 'Cập nhật môn học thành công', color: 'green' });
                    onClose();
                    form.reset();
                },
                onError: () => {
                    notifications.show({ title: 'Thất bại', message: 'Có lỗi xảy ra', color: 'red' });
                }
            });
        } else {
            createMutation.mutate(payload as any, {
                onSuccess: () => {
                    notifications.show({ title: 'Thành công', message: 'Tạo môn học thành công', color: 'green' });
                    onClose();
                    form.reset();
                },
                onError: () => {
                    notifications.show({ title: 'Thất bại', message: 'Có lỗi xảy ra', color: 'red' });
                }
            });
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            title={subject ? t('actions.edit', { defaultMessage: 'Chỉnh sửa môn học' }) : t('actions.create', { defaultMessage: 'Thêm mới môn học' })}
            position="right"
            size="md"
            padding="lg"
        >
            <LoadingOverlay visible={isSubmitting} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label={t('fields.name', { defaultMessage: 'Tên môn học' })}
                        placeholder={t('fields.name_placeholder', { defaultMessage: 'Ví dụ: Toán học, Ngữ văn' })}
                        required
                        {...form.getInputProps('tenMon')}
                    />

                    <Textarea
                        label={t('fields.description', { defaultMessage: 'Mô tả' })}
                        placeholder={t('fields.description_placeholder', { defaultMessage: 'Mô tả ngắn về môn học...' })}
                        minRows={4}
                        {...form.getInputProps('moTa')}
                    />

                    <Group justify="end" mt="md">
                        <Button variant="light" color="gray" onClick={onClose}>
                            {t('actions.cancel', { defaultMessage: 'Hủy' })}
                        </Button>
                        <Button type="submit" loading={isSubmitting}>
                            {subject ? t('actions.update', { defaultMessage: 'Cập nhật' }) : t('actions.create_confirm', { defaultMessage: 'Tạo môn học' })}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Drawer>
    );
}
