import { Button, Group, Modal, Stack, TextInput, NumberInput, Textarea, Text, ThemeIcon } from "@mantine/core";
import { IconSchool, IconHash, IconNotes, IconExclamationCircle } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { AppButton } from "@/shared/components/AppButton";
import { TKhoi } from "@/shared/types/academic.type";

interface GradeModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: TKhoi | null;
    loading?: boolean;
}

export const GradeModal = ({ opened, onClose, onSubmit, initialData, loading }: GradeModalProps) => {
    const t = useTranslations("academic.grades");
    const tCommon = useTranslations("common");

    const form = useForm({
        initialValues: {
            tenKhoi: "",
            maKhoi: 0,
            moTa: "",
        },
        validate: {
            tenKhoi: (value) => (value ? null : t("validation.name_required")),
            maKhoi: (value) => (value > 0 ? null : t("validation.code_required")),
        },
    });

    useEffect(() => {
        if (initialData) {
            form.setValues({
                tenKhoi: initialData.tenKhoi,
                maKhoi: initialData.maKhoi,
                moTa: initialData.moTa || "",
            });
        } else {
            form.reset();
        }
    }, [initialData, opened]);

    const handleSubmit = (values: typeof form.values) => {
        onSubmit(values);
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group gap="sm">
                    <ThemeIcon color="blue" variant="light" size="lg">
                        <IconSchool size={20} />
                    </ThemeIcon>
                    <Text fw={700} size="lg">
                        {initialData ? t("edit_title") : t("create_title")}
                    </Text>
                </Group>
            }
            centered
            radius="md"
            size="md"
            transitionProps={{ transition: 'fade', duration: 200 }}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label={t("fields.name")}
                        placeholder={t("placeholders.name")}
                        leftSection={<IconSchool size={18} color="var(--mantine-color-blue-6)" />}
                        {...form.getInputProps("tenKhoi")}
                        data-autofocus
                        required
                        size="sm"
                    />
                    <NumberInput
                        label={t("fields.code")}
                        placeholder={t("placeholders.code")}
                        leftSection={<IconHash size={18} color="var(--mantine-color-blue-6)" />}
                        {...form.getInputProps("maKhoi")}
                        required
                        min={1}
                        size="sm"
                        description="Ví dụ: 10, 11, 12"
                    />
                    <Textarea
                        label={t("fields.description")}
                        placeholder={t("placeholders.description")}
                        leftSection={<IconNotes size={18} color="var(--mantine-color-blue-6)" />}
                        leftSectionProps={{ style: { alignItems: 'flex-start', paddingTop: '8px' } }}
                        {...form.getInputProps("moTa")}
                        minRows={3}
                        size="sm"
                    />

                    <Group justify="flex-end" mt="xl">
                        <Button variant="subtle" color="gray" onClick={onClose}>
                            {tCommon("cancel")}
                        </Button>
                        <AppButton type="submit" loading={loading} px="xl">
                            {initialData ? tCommon("save") : tCommon("save")}
                        </AppButton>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};
