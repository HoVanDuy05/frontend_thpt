"use client";

import { TextInput, PasswordInput, Button, Title, Text, Stack, Anchor, Box, Divider, SimpleGrid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconMail, IconLock, IconUser } from "@tabler/icons-react";
import { useValidation } from "@/shared/common/useValidation";
import { useTranslationError } from "@/shared/common/useTranslationError";

export default function RegisterPage() {
    const t = useTranslations("auth.register");
    const router = useRouter();
    const registerMutation = AppMutation().auth.useRegister();
    const validate = useValidation();
    const translateError = useTranslationError();

    const form = useForm({
        initialValues: {
            email: "",
            matKhau: "",
            confirmPassword: "",
        },
        validate: {
            email: validate.email,
            matKhau: validate.password,
            confirmPassword: (value, values) => validate.confirmPassword(values.matKhau)(value),
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        registerMutation.mutate(
            { email: values.email, matKhau: values.matKhau },
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
                    <TextInput
                        label={t("email")}
                        placeholder="student@nguyenhue.edu.vn"
                        required
                        size="md"
                        radius="md"
                        leftSection={<IconMail size={18} className="text-gray-400" />}
                        {...form.getInputProps("email")}
                        classNames={{
                            input: "border-gray-300 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400"
                        }}
                    />

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
                        loading={registerMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 mt-4"
                        fw={600}
                    >
                        {t("submit")}
                    </Button>
                </Stack>
            </form>

            {/* Divider */}
            <Divider label="hoặc" labelPosition="center" className="my-2" />

            {/* Login Link */}
            <Text ta="center" size="sm" c="dimmed">
                {t("have_account")}{" "}
                <Anchor
                    component={Link}
                    href="/auth/login"
                    fw={700}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                    {t("login_link")}
                </Anchor>
            </Text>
        </Stack>
    );
}
