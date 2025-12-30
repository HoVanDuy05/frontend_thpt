"use client";

import { TextInput, Button, Title, Text, Stack, Anchor } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";

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
                    message: data.resetToken ? `Demo token: ${data.resetToken.slice(0, 20)}...` : undefined,
                    color: "green",
                    autoClose: 8000,
                });
            },
            onError: (error) => {
                notifications.show({
                    title: t("error"),
                    message: translateError(error),
                    color: "red",
                });
            }
        });
    };

    return (
        <Stack gap="xl">
            <div>
                <Title order={2} ta="center" className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {t("title")}
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    {t("subtitle")}
                </Text>
            </div>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <TextInput
                        label={t("email")}
                        placeholder="your@email.com"
                        type="email"
                        required
                        {...form.getInputProps("email")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        mt="md"
                        loading={forgotMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 h-10"
                    >
                        {t("submit")}
                    </Button>

                    <Text ta="center" size="sm" mt="md">
                        <Anchor component={Link} href="/auth/login" fw={500}>
                            {t("back_to_login")}
                        </Anchor>
                    </Text>
                </Stack>
            </form>
        </Stack>
    );
}
