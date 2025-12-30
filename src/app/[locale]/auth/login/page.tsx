"use client";

import { TextInput, PasswordInput, Button, Title, Text, Stack, Anchor, Group, Checkbox, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { AppMutation } from "@/api/AppMutation";
import { useAppStore } from "@/providers/store/useAppStore";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IconCheck, IconX, IconLock, IconMail } from "@tabler/icons-react";

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

    // Load saved credentials if remember me was checked
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

                    // 1. Set Token
                    useAppStore.getState().setToken(data.access_token);

                    // 2. Set Basic User (from login response)
                    setUser(data.user);

                    // Handle remember me
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

                    // Determine redirect path
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
                    console.error("Login process error", e);
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
                        label={t("email")}
                        placeholder="your@email.com"
                        leftSection={<IconMail size={16} className="text-zinc-400" />}
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

                    <Group justify="space-between" mt="xs">
                        <Checkbox
                            label="Ghi nhớ đăng nhập"
                            size="sm"
                            fw={500}
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.currentTarget.checked)}
                        />
                        <Anchor component={Link} href="/auth/forgot-password" size="sm" fw={600}>
                            {t("forgot_password")}
                        </Anchor>
                    </Group>

                    <Button
                        type="submit"
                        fullWidth
                        mt="lg"
                        size="md"
                        radius="md"
                        loading={loginMutation.isPending}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/20"
                    >
                        {t("submit")}
                    </Button>

                    <Divider label="hoặc" labelPosition="center" my="sm" />

                    <Text ta="center" size="sm" c="dimmed">
                        {t("no_account")}{" "}
                        <Anchor component={Link} href="/auth/register" fw={700} className="text-blue-600">
                            {t("register_link")}
                        </Anchor>
                    </Text>
                </Stack>
            </form>
        </Stack>
    );
}
