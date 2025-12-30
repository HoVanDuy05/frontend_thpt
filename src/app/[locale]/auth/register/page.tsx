"use client";

import { TextInput, PasswordInput, Button, Title, Text, Stack, Anchor, Group, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { AppMutation } from "@/api/AppMutation";
import { useAppStore } from "@/providers/store/useAppStore";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconLock, IconMail, IconUser } from "@tabler/icons-react";

import { useValidation } from "@/shared/common/useValidation";
import { useTranslationError } from "@/shared/common/useTranslationError";

export default function RegisterPage() {
    const t = useTranslations("auth.register");
    const router = useRouter();
    const { setUser } = useAppStore();
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
                        label={t("username")}
                        placeholder="johndoe"
                        leftSection={<IconUser size={16} className="text-zinc-400" />}
                        required
                        size="md"
                        radius="md"
                        {...form.getInputProps("taiKhoan")}
                    />

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
                        loading={registerMutation.isPending}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/20"
                    >
                        {t("submit")}
                    </Button>

                    <Divider label="hoặc" labelPosition="center" my="sm" />

                    <Text ta="center" size="sm" c="dimmed">
                        {t("have_account")}{" "}
                        <Anchor component={Link} href="/auth/login" fw={700} className="text-blue-600">
                            {t("login_link")}
                        </Anchor>
                    </Text>
                </Stack>
            </form>
        </Stack>
    );
}
