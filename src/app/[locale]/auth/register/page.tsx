"use client";

import { TextInput, PasswordInput, Button, Title, Text, Stack, Anchor, Group } from "@mantine/core";
import { useForm, matches } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { AppMutation } from "@/api/AppMutation";
import { useAppStore } from "@/providers/store/useAppStore";
import { notifications } from "@mantine/notifications";

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
                        message: "Vui lòng đăng nhập để tiếp tục",
                        color: "green",
                    });
                    router.push("/auth/login");
                },
                onError: (error: any) => {
                    notifications.show({
                        title: t("error"),
                        message: error?.response?.data?.message || "Something went wrong",
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
                    <TextInput
                        label={t("username")}
                        placeholder="johndoe"
                        required
                        {...form.getInputProps("taiKhoan")}
                    />

                    <TextInput
                        label={t("email")}
                        placeholder="your@email.com"
                        type="email"
                        required
                        {...form.getInputProps("email")}
                    />

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
                        loading={registerMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 h-10"
                    >
                        {t("submit")}
                    </Button>

                    <Text ta="center" size="sm" mt="md">
                        {t("have_account")}{" "}
                        <Anchor component={Link} href="/auth/login" fw={500}>
                            {t("login_link")}
                        </Anchor>
                    </Text>
                </Stack>
            </form>
        </Stack>
    );
}
