"use client";

import { TextInput, Button, Title, Text, Stack, Anchor, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { IconMail, IconArrowLeft, IconCheck, IconX } from "@tabler/icons-react";

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
            onSuccess: (data) => {
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
        <Stack gap="xl">
            <Stack gap={4} align="center">
                <Title order={1} ta="center" className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent" fz={28} fw={800}>
                    {t("title")}
                </Title>
                <Text c="dimmed" size="sm" ta="center" fw={500}>
                    {t("subtitle")}
                </Text>
            </Stack>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label={t("email")}
                        placeholder="your@email.com"
                        leftSection={<IconMail size={16} className="text-zinc-400" />}
                        type="email"
                        required
                        size="md"
                        radius="md"
                        {...form.getInputProps("email")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        mt="lg"
                        size="md"
                        radius="md"
                        loading={forgotMutation.isPending}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/20"
                    >
                        {t("submit")}
                    </Button>

                    <Anchor component={Link} href="/auth/login" size="sm" ta="center" fw={600} className="flex items-center justify-center gap-2">
                        <IconArrowLeft size={16} />
                        {t("back_to_login")}
                    </Anchor>
                </Stack>
            </form>
        </Stack>
    );
}
