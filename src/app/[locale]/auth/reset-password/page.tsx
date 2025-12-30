"use client";

import { PasswordInput, Button, Title, Text, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { IconLock, IconCheck, IconX } from "@tabler/icons-react";

import { useValidation } from "@/shared/common/useValidation";
import { useTranslationError } from "@/shared/common/useTranslationError";

export default function ResetPasswordPage() {
    const t = useTranslations("auth.reset");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";
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
        resetMutation.mutate(
            { token, matKhau: values.matKhau },
            {
                onSuccess: () => {
                    notifications.show({
                        title: t("success"),
                        message: "Mật khẩu của bạn đã được cập nhật thành công!",
                        color: "teal",
                        icon: <IconCheck size={16} />,
                    });
                    router.push("/auth/login");
                },
                onError: (error) => {
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
                    <PasswordInput
                        label={t("password")}
                        placeholder="••••••••"
                        leftSection={<IconLock size={16} className="text-zinc-400" />}
                        required
                        size="md"
                        radius="md"
                        {...form.getInputProps("matKhau")}
                    />

                    <PasswordInput
                        label={t("confirm_password")}
                        placeholder="••••••••"
                        leftSection={<IconLock size={16} className="text-zinc-400" />}
                        required
                        size="md"
                        radius="md"
                        {...form.getInputProps("confirmPassword")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        mt="lg"
                        size="md"
                        radius="md"
                        loading={resetMutation.isPending}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/20"
                    >
                        {t("submit")}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}
