"use client";

import { TextInput, Button, Title, Text, Stack, Anchor, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

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
            taiKhoan: "",
            email: "",
            matKhau: "",
            confirmPassword: "",
        },
        validate: {
            taiKhoan: validate.username,
            email: validate.email,
            matKhau: validate.password,
            confirmPassword: (value, values) => validate.confirmPassword(values.matKhau)(value),
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        registerMutation.mutate(
            { taiKhoan: values.taiKhoan, email: values.email, matKhau: values.matKhau },
            {
                onSuccess: () => {
                    notifications.show({
                        title: t("success"),
                        message: "Tài khoản của bạn đã được tạo thành công! Hãy đăng nhập ngay.",
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
        <Stack gap="lg">
            <Box>
                <Title order={1} fz={28} fw={700} c="dark.9" mb={4}>
                    {t("title")}
                </Title>
                <Text c="dimmed">
                    {t("subtitle")}
                </Text>
            </Box>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label={t("username")}
                        placeholder="johndoe"
                        required
                        size="md"
                        radius="sm"
                        {...form.getInputProps("taiKhoan")}
                    />

                    <TextInput
                        label={t("email")}
                        placeholder="example@student.edu.vn"
                        required
                        size="md"
                        radius="sm"
                        {...form.getInputProps("email")}
                    />

                    <TextInput
                        type="password"
                        label={t("password")}
                        placeholder="••••••••"
                        required
                        size="md"
                        radius="sm"
                        {...form.getInputProps("matKhau")}
                    />

                    <TextInput
                        type="password"
                        label={t("confirm_password")}
                        placeholder="••••••••"
                        required
                        size="md"
                        radius="sm"
                        {...form.getInputProps("confirmPassword")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="md"
                        radius="sm"
                        color="blue"
                        loading={registerMutation.isPending}
                        fw={600}
                    >
                        {t("submit")}
                    </Button>

                    <Text ta="center" size="sm" c="dimmed">
                        {t("have_account")}{" "}
                        <Anchor component={Link} href="/auth/login" fw={600} c="blue.6">
                            {t("login_link")}
                        </Anchor>
                    </Text>
                </Stack>
            </form>
        </Stack>
    );
}
