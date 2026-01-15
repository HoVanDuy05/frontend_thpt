import { Button, Group, Modal, Stack, TextInput, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { AppButton } from "@/shared/components/AppButton";
import { TNamHoc } from "@/shared/types/academic.type";
import { DateInput } from "@mantine/dates";

interface YearModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: TNamHoc | null;
    loading?: boolean;
}

export const YearModal = ({ opened, onClose, onSubmit, initialData, loading }: YearModalProps) => {
    const t = useTranslations("academic.years");
    const tCommon = useTranslations("common");

    const form = useForm({
        initialValues: {
            tenNamHoc: "",
            ngayBatDau: null,
            ngayKetThuc: null,
            dangKichHoat: false,
        },
        validate: {
            tenNamHoc: (value) => (value ? null : t("errors.required")),
        },
    });

    useEffect(() => {
        if (initialData) {
            form.setValues({
                tenNamHoc: initialData.tenNamHoc,
                ngayBatDau: initialData.ngayBatDau ? new Date(initialData.ngayBatDau) : null,
                ngayKetThuc: initialData.ngayKetThuc ? new Date(initialData.ngayKetThuc) : null,
                dangKichHoat: initialData.dangKichHoat || false,
            } as any);
        } else {
            form.reset();
        }
    }, [initialData, opened]);

    const handleSubmit = (values: typeof form.values) => {
        const payload = {
            ...values,
            ngayBatDau: values.ngayBatDau ? new Date(values.ngayBatDau).toISOString() : undefined,
            ngayKetThuc: values.ngayKetThuc ? new Date(values.ngayKetThuc).toISOString() : undefined,
        };
        onSubmit(payload);
    };

    return (
        <Modal opened={opened} onClose={onClose} title={initialData ? t("edit_title") : t("create_title")} centered>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label={t("fields.name")}
                        placeholder={t("placeholders.name")}
                        {...form.getInputProps("tenNamHoc")}
                        data-autofocus
                    />
                    <Group grow>
                        <DateInput
                            label={t("fields.start_date")}
                            placeholder={t("placeholders.date")}
                            valueFormat="DD/MM/YYYY"
                            {...form.getInputProps("ngayBatDau")}
                        />
                        <DateInput
                            label={t("fields.end_date")}
                            placeholder={t("placeholders.date")}
                            valueFormat="DD/MM/YYYY"
                            {...form.getInputProps("ngayKetThuc")}
                        />
                    </Group>

                    <Checkbox
                        label={t("fields.active")}
                        description={t("fields.active_desc")}
                        {...form.getInputProps("dangKichHoat", { type: 'checkbox' })}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="light" onClick={onClose}>
                            {tCommon("actions.cancel")}
                        </Button>
                        <AppButton type="submit" loading={loading}>
                            {initialData ? tCommon("actions.save") : tCommon("actions.create")}
                        </AppButton>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};
