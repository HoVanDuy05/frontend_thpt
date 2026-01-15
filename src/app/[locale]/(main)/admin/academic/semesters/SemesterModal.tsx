import { Button, Group, Modal, Stack, TextInput, Checkbox, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { AppButton } from "@/shared/components/AppButton";
import { THocKy, TNamHoc } from "@/shared/types/academic.type";
import { DateInput } from "@mantine/dates";
import { AppQuery } from "@/api/AppQuery";

interface SemesterModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: THocKy | null;
    loading?: boolean;
}

export const SemesterModal = ({ opened, onClose, onSubmit, initialData, loading }: SemesterModalProps) => {
    const t = useTranslations("academic.semesters");
    const tCommon = useTranslations("common");
    const { data: namHocs } = AppQuery.academic.useYears();

    const yearOptions = useMemo(() => {
        return namHocs?.map((year: TNamHoc) => ({
            value: year.id.toString(),
            label: year.tenNamHoc
        })) || [];
    }, [namHocs]);

    const form = useForm({
        initialValues: {
            tenHocKy: "",
            namHocId: "",
            ngayBatDau: null,
            ngayKetThuc: null,
            dangKichHoat: false,
        },
        validate: {
            tenHocKy: (value) => (value ? null : t("errors.required")),
            namHocId: (value) => (value ? null : t("errors.required")),
        },
    });

    useEffect(() => {
        if (initialData) {
            form.setValues({
                tenHocKy: initialData.tenHocKy,
                namHocId: initialData.namHocId.toString(),
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
            namHocId: parseInt(values.namHocId),
            ngayBatDau: values.ngayBatDau ? (values.ngayBatDau as Date).toISOString() : undefined,
            ngayKetThuc: values.ngayKetThuc ? (values.ngayKetThuc as Date).toISOString() : undefined,
        };
        onSubmit(payload);
    };

    return (
        <Modal opened={opened} onClose={onClose} title={initialData ? t("edit_title") : t("create_title")} centered>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <Select
                        label={t("fields.year")}
                        placeholder={t("placeholders.year")}
                        data={yearOptions}
                        {...form.getInputProps("namHocId")}
                        searchable
                    />

                    <TextInput
                        label={t("fields.name")}
                        placeholder={t("placeholders.name")}
                        {...form.getInputProps("tenHocKy")}
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
