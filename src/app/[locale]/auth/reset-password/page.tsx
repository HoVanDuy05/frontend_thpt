"use client";

import { PasswordInput, Button, Title, Text, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconArrowLeft } from "@tabler/icons-react";

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
                message: "Token không hợp lệ hoặc đã hết hạn.",
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
                        message: "Mật khẩu của bạn đã được cập nhật thành công! Đăng nhập ngay.",
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
                    <PasswordInput
                        label={t("password")}
                        placeholder="••••••••"
                        required
                        variant="filled"
                        size="md"
                        radius="md"
                        styles={{
                            input: { fontSize: '15px' },
                            label: { fontSize: '14px', fontWeight: 600, marginBottom: '6px' }
                        }}
                        {...form.getInputProps("matKhau")}
                    />

                    <PasswordInput
                        label={t("confirm_password")}
                        placeholder="••••••••"
                        required
                        variant="filled"
                        size="md"
                        radius="md"
                        styles={{
                            input: { fontSize: '15px' },
                            label: { fontSize: '14px', fontWeight: 600, marginBottom: '6px' }
                        }}
                        {...form.getInputProps("confirmPassword")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        radius="md"
                        color="blue"
                        loading={resetMutation.isPending}
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
                        Quay lại đăng nhập
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}
