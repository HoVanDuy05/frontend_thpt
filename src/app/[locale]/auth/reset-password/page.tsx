"use client";

import { PasswordInput, Button, Title, Text, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";

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
                        message: "Bạn có thể đăng nhập ngay",
                        color: "green",
                    });
                    router.push("/auth/login");
                },
                onError: (error) => {
                    notifications.show({
                        title: t("error"),
                        message: translateError(error),
                        color: "red",
                    });
                }
            }
        );
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
                    <PasswordInput
                        label={t("password")}
                        placeholder="••••••••"
                        required
                        {...form.getInputProps("matKhau")}
                    />

                    <PasswordInput
                        label={t("confirm_password")}
                        placeholder="••••••••"
                        required
                        {...form.getInputProps("confirmPassword")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        mt="md"
                        loading={resetMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 h-10"
                    >
                        {t("submit")}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}
