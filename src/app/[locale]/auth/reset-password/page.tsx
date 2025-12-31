"use client";

import { PasswordInput, Button, Title, Text, Stack, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconArrowLeft, IconLock } from "@tabler/icons-react";
import { useValidation } from "@/shared/common/useValidation";
import { useTranslationError } from "@/shared/common/useTranslationError";

export default function ResetPasswordPage() {
    const t = useTranslations("auth.reset");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const resetMutation = AppMutation().auth.useResetPassword();
    const validate = useValidation();
    const translateError = useTranslationError();

    const form = useForm({
        initialValues: {
            matKhau: "",
            confirmPassword: "",
        },
        validate: {
            matKhau: validate.password,
            confirmPassword: (value, values) => validate.confirmPassword(values.matKhau)(value),
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        if (!token) {
            notifications.show({
                title: t("error"),
                message: t("invalid_token"),
                color: "red",
                icon: <IconX size={16} />,
            });
            return;
        }

        resetMutation.mutate(
            { token, matKhau: values.matKhau },
            {
                onSuccess: () => {
                    notifications.show({
                        title: t("success"),
                        message: t("success_message"),
                        color: "teal",
                        icon: <IconCheck size={16} />,
                    });
                    router.push("/auth/login");
                },
                onError: (error: any) => {
                    notifications.show({
                        title: t("error"),
                        message: translateError(error),
                        color: "red",
                        icon: <IconX size={16} />,
                    });
                }
            }
        );
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
                    <PasswordInput
                        label={t("password")}
                        placeholder="••••••••"
                        required
                        size="md"
                        radius="md"
                        leftSection={<IconLock size={18} className="text-gray-400" />}
                        {...form.getInputProps("matKhau")}
                        classNames={{
                            input: "border-gray-300 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400"
                        }}
                    />

                    <PasswordInput
                        label={t("confirm_password")}
                        placeholder="••••••••"
                        required
                        size="md"
                        radius="md"
                        leftSection={<IconLock size={18} className="text-gray-400" />}
                        {...form.getInputProps("confirmPassword")}
                        classNames={{
                            input: "border-gray-300 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400"
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="md"
                        radius="md"
                        loading={resetMutation.isPending}
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
                        Quay lại đăng nhập
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}
