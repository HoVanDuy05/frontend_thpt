import { Button, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { TTruongFormQuyTrinh, LoaiTruongForm } from '../types';
import { CheckTypeInput } from './CheckTypeInput';

interface DynamicApprovalFormProps {
    configs: TTruongFormQuyTrinh[];
    onSubmit: (values: any) => void;
    loading?: boolean;
}

export const DynamicApprovalForm: React.FC<DynamicApprovalFormProps> = ({ configs, onSubmit, loading }) => {
    const initialValues = configs.reduce((acc, curr) => {
        if (curr.loai === LoaiTruongForm.CHECKBOX) {
            acc[curr.tenTruong] = [];
        } else {
            acc[curr.tenTruong] = curr.loai === LoaiTruongForm.NUMBER ? 0 : '';
        }
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
        const inputProps = form.getInputProps(field.tenTruong);

        return (
            <CheckTypeInput
                key={field.id}
                field={field}
                value={inputProps.value}
                onChange={inputProps.onChange}
                error={inputProps.error}
            />
        );
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
