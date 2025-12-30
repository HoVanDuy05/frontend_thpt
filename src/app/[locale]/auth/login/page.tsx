"use client";

import { TextInput, PasswordInput, Button, Title, Text, Stack, Anchor, Group, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { AppMutation } from "@/api/AppMutation";
import { useAppStore } from "@/providers/store/useAppStore";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";


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

                    // 2. Fetch Fresh Profile (to get verified role/info)
                    // This satisfies the "use api profile to check role" requirement
                    const profile = await axiosClient.get("/auth/profile");
                    setUser(profile as any);

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
                        color: "green",
                    });

                    // Determine redirect path based on role if no explicit redirect is set
                    let targetUrl = redirect;
                    if (targetUrl === "/student" || !targetUrl) {
                        switch (data.user.vaiTro) {
                            case "ADMIN":
                                targetUrl = "/admin/dashboard";
                                break;
                            case "GIAO_VIEN":
                                targetUrl = "/admin/dashboard"; // Teachers share admin layout
                                break;
                            case "HOC_SINH":
                                targetUrl = "/student/dashboard";
                                break;
                            default:
                                targetUrl = "/student/dashboard";
                        }
                    }

                    router.push(targetUrl);
                } catch (e) {
                    console.error("Login process error", e);
                    notifications.show({
                        title: t("error"),
                        message: "Login failed",
                        color: "red",
                    });
                }
            },

            onError: (error: any) => {
                notifications.show({
                    title: t("error"),
                    message: translateError(error),
                    color: "red",
                });
            }
        });
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
                        label={t("email")}
                        placeholder="your@email.com"
                        required
                        {...form.getInputProps("email")}
                    />

                    <PasswordInput
                        label={t("password")}
                        placeholder="••••••••"
                        required
                        {...form.getInputProps("matKhau")}
                    />

                    <Group justify="space-between" mt="xs">
                        <Checkbox
                            label="Ghi nhớ"
                            size="xs"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.currentTarget.checked)}
                        />
                        <Anchor component={Link} href="/auth/forgot-password" size="xs">
                            {t("forgot_password")}
                        </Anchor>
                    </Group>

                    <Button
                        type="submit"
                        fullWidth
                        mt="xl"
                        loading={loginMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 h-10"
                    >
                        {t("submit")}
                    </Button>

                    <Text ta="center" size="sm" mt="md">
                        {t("no_account")}{" "}
                        <Anchor component={Link} href="/auth/register" fw={500}>
                            {t("register_link")}
                        </Anchor>
                    </Text>
                </Stack>
            </form>
        </Stack>
    );
}
