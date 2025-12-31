import React from 'react';
import { TextInput, NumberInput, Textarea, Select, Button, Stack, Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { TTruongFormQuyTrinh, LoaiTruongForm } from '../types';

interface DynamicApprovalFormProps {
    configs: TTruongFormQuyTrinh[];
    onSubmit: (values: any) => void;
    loading?: boolean;
}

export const DynamicApprovalForm: React.FC<DynamicApprovalFormProps> = ({ configs, onSubmit, loading }) => {
    const initialValues = configs.reduce((acc, curr) => {
        acc[curr.tenTruong] = curr.loai === LoaiTruongForm.NUMBER ? 0 : '';
        return acc;
    }, {} as any);

    const form = useForm({
        initialValues,
        validate: (values) => {
            const errors: any = {};
            configs.forEach(field => {
                if (field.batBuoc && !values[field.tenTruong]) {
                    errors[field.tenTruong] = `${field.nhan} là bắt buộc`;
                }
            });
            return errors;
        },
    });

    const renderField = (field: TTruongFormQuyTrinh) => {
        const commonProps = {
            key: field.id,
            label: field.nhan,
            required: field.batBuoc,
            ...form.getInputProps(field.tenTruong),
        };

        const options = field.tuyChon ? JSON.parse(field.tuyChon) : [];

        switch (field.loai) {
            case LoaiTruongForm.TEXT:
                return <TextInput {...commonProps} />;
            case LoaiTruongForm.NUMBER:
                return <NumberInput {...commonProps} />;
            case LoaiTruongForm.TEXTAREA:
                return <Textarea {...commonProps} />;
            case LoaiTruongForm.SELECT:
                return <Select {...commonProps} data={options} />;
            case LoaiTruongForm.DATE:
            case LoaiTruongForm.DATETIME:
                return <DateInput {...commonProps} />;
            default:
                return null;
        }
    };

    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <Stack gap="md">
                {configs.sort((a, b) => a.thuTu - b.thuTu).map(renderField)}
                <Group justify="flex-end" mt="xl">
                    <Button type="submit" loading={loading}>Gửi yêu cầu phê duyệt</Button>
                </Group>
            </Stack>
        </form>
    );
};
