"use client";

import { TextInput, PasswordInput, Button, Title, Text, Stack, Anchor, Group, Divider, Alert, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { AppMutation } from "@/api/AppMutation";
import { useAppStore } from "@/providers/store/useAppStore";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IconCheck, IconX, IconInfoCircle } from "@tabler/icons-react";

import { useValidation } from "@/shared/common/useValidation";
import { useTranslationError } from "@/shared/common/useTranslationError";

export default function LoginPage() {
    const t = useTranslations("auth.login");
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/student";
    const { setUser } = useAppStore();
    const loginMutation = AppMutation().auth.useLogin();
    const [rememberMe, setRememberMe] = useState(false);
    const validate = useValidation();
    const translateError = useTranslationError();

    const form = useForm({
        initialValues: {
            email: "",
            matKhau: "",
        },
        validate: {
            email: validate.email,
            matKhau: validate.password,
        },
    });

    useEffect(() => {
        const saved = localStorage.getItem("school_remember");
        if (saved) {
            try {
                const { email, rememberChecked } = JSON.parse(saved);
                if (rememberChecked) {
                    form.setValues({ email, matKhau: "" });
                    setRememberMe(true);
                }
            } catch (e) { }
        }
    }, []);

    const handleSubmit = (values: typeof form.values) => {
        loginMutation.mutate(values, {
            onSuccess: async (data) => {
                try {
                    const payload = JSON.parse(atob(data.access_token.split('.')[1]));
                    useAppStore.getState().setToken(data.access_token);
                    setUser(data.user);

                    if (rememberMe) {
                        localStorage.setItem("school_remember", JSON.stringify({
                            email: values.email,
                            rememberChecked: true
                        }));
                    } else {
                        localStorage.removeItem("school_remember");
                    }

                    notifications.show({
                        title: t("success"),
                        message: `Welcome back, ${payload.username}!`,
                        color: "teal",
                        icon: <IconCheck size={16} />,
                    });

                    let targetUrl = redirect;
                    if (targetUrl === "/student" || !targetUrl) {
                        switch (data.user.vaiTro) {
                            case "ADMIN": targetUrl = "/admin/dashboard"; break;
                            case "GIAO_VIEN": targetUrl = "/admin/dashboard"; break;
                            case "HOC_SINH": targetUrl = "/student"; break;
                            default: targetUrl = "/student";
                        }
                    }

                    router.push(targetUrl);
                } catch (e) {
                    notifications.show({
                        title: t("error"),
                        message: "Authentication failed",
                        color: "red",
                        icon: <IconX size={16} />,
                    });
                }
            },
            onError: (error: any) => {
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
        <Stack gap="lg">
            <Box>
                <Title order={1} fz={28} fw={700} c="dark.9" mb={4}>
                    {t("title")}
                </Title>
                <Text c="dimmed">
                    {t("subtitle")}
                </Text>
            </Box>

            {/* FPT-style Info Alert for context */}
            <Alert variant="light" color="blue" title="Lưu ý" icon={<IconInfoCircle size={16} />}>
                Sử dụng tài khoản nhà trường cấp để đăng nhập.
            </Alert>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label={t("email")}
                        placeholder="example@student.edu.vn"
                        required
                        size="md"
                        // FPT style is boxy, default mantine input is perfect for this.
                        // Removing 'variant="filled"' to keep it standard border.
                        radius="sm"
                        {...form.getInputProps("email")}
                    />

                    <PasswordInput
                        label={t("password")}
                        placeholder="••••••••"
                        required
                        size="md"
                        radius="sm"
                        {...form.getInputProps("matKhau")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="md" // Standard button size
                        radius="sm" // Boxy button
                        color="blue"
                        loading={loginMutation.isPending}
                        fw={600}
                    >
                        {t("submit")}
                    </Button>

                    <Group justify="space-between" mt={4}>
                        <Anchor component={Link} href="/auth/forgot-password" fz="sm" fw={500} c="blue">
                            {t("forgot_password")}?
                        </Anchor>

                        <Anchor component={Link} href="/auth/register" fz="sm" fw={600} c="blue">
                            {t("register_link")}
                        </Anchor>
                    </Group>
                </Stack>
            </form>
        </Stack>
    );
}
