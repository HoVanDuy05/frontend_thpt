"use client";

import { TextInput, Button, Title, Text, Stack, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconArrowLeft, IconMail } from "@tabler/icons-react";
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
                    message: t("success_message"),
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
            {/* Header */}
            <Box>
                <Title order={1} size="h2" fw={900} className="text-gray-900 dark:text-white mb-2">
                    {t("title")}
                </Title>
                <Text c="dimmed" size="sm">
                    {t("subtitle")}
                </Text>
            </Box>

            {/* Form */}
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label={t("email")}
                        placeholder="your@email.com"
                        type="email"
                        required
                        size="md"
                        radius="md"
                        leftSection={<IconMail size={18} className="text-gray-400" />}
                        {...form.getInputProps("email")}
                        classNames={{
                            input: "border-gray-300 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400"
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="md"
                        radius="md"
                        loading={forgotMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 mt-4"
                        fw={600}
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
                        leftSection={<IconArrowLeft size={18} />}
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        fw={600}
                    >
                        {t("back_to_login")}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}
