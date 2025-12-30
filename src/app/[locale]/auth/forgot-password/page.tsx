"use client";

import { TextInput, Button, Title, Text, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconArrowLeft } from "@tabler/icons-react";

import { useValidation } from "@/shared/common/useValidation";
import { useTranslationError } from "@/shared/common/useTranslationError";

export default function ForgotPasswordPage() {
    const t = useTranslations("auth.forgot");
    const forgotMutation = AppMutation().auth.useForgotPassword();
    const validate = useValidation();
    const translateError = useTranslationError();

    const form = useForm({
        initialValues: {
            email: "",
        },
        validate: {
            email: validate.email,
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        forgotMutation.mutate(values, {
            onSuccess: () => {
                notifications.show({
                    title: t("success"),
                    message: "Vui lòng kiểm tra email của bạn để nhận hướng dẫn khôi phục mật khẩu.",
                    color: "teal",
                    icon: <IconCheck size={16} />,
                    autoClose: 8000,
                });
            },
            onError: (error) => {
                notifications.show({
                    title: t("error"),
                    message: translateError(error),
                    color: "red",
                    icon: <IconX size={16} />,
                });
            }
        });
    };

    return (
        <Stack gap="xl" justify="center" h="100%">
            <Stack gap={4} mb="xs">
                <Title order={1} fz={26} fw={800} c="dark.8">
                    {t("title")}
                </Title>
                <Text c="dimmed" fz="sm">
                    {t("subtitle")}
                </Text>
            </Stack>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label={t("email")}
                        placeholder="your@email.com"
                        type="email"
                        required
                        variant="filled"
                        size="md"
                        radius="md"
                        styles={{
                            input: { fontSize: '15px' },
                            label: { fontSize: '14px', fontWeight: 600, marginBottom: '6px' }
                        }}
                        {...form.getInputProps("email")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        radius="md"
                        color="blue"
                        loading={forgotMutation.isPending}
                        style={{
                            fontSize: '16px',
                            fontWeight: 600,
                        }}
                    >
                        {t("submit")}
                    </Button>

                    <Button
                        component={Link}
                        href="/auth/login"
                        variant="subtle"
                        color="gray"
                        size="md"
                        radius="md"
                        fullWidth
                        leftSection={<IconArrowLeft size={18} stroke={2.5} />}
                        style={{ fontWeight: 600 }}
                    >
                        {t("back_to_login")}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}
