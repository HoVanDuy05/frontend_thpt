"use client";

import { TextInput, PasswordInput, Button, Title, Text, Stack, Anchor, Group, Checkbox, Box, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { AppMutation } from "@/api/AppMutation";
import { useAppStore } from "@/providers/store/useAppStore";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IconCheck, IconX, IconMail, IconLock, IconBrandGoogle } from "@tabler/icons-react";
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
                        message: t("welcome_back", { name: data.user.hoTen || payload.username }),
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
                        message: t("auth_failed"),
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

    const handleGoogleLogin = () => {
        // Redirect to backend Google OAuth endpoint
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/google`;
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

            {/* Google Login Button */}
            <Button
                variant="default"
                size="md"
                radius="md"
                leftSection={<IconBrandGoogle size={20} />}
                onClick={handleGoogleLogin}
                className="border-2 border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                fw={600}
            >
                Đăng nhập bằng Google
            </Button>

            {/* Divider */}
            <Divider label="hoặc đăng nhập bằng email" labelPosition="center" className="my-2" />

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

                    <Group justify="space-between" mt="xs">
                        <Checkbox
                            label="Ghi nhớ đăng nhập"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.currentTarget.checked)}
                            size="sm"
                            classNames={{
                                label: "text-gray-700 dark:text-gray-300 cursor-pointer"
                            }}
                        />
                        <Anchor
                            component={Link}
                            href="/auth/forgot-password"
                            size="sm"
                            fw={600}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                            {t("forgot_password")}?
                        </Anchor>
                    </Group>

                    <Button
                        type="submit"
                        fullWidth
                        size="md"
                        radius="md"
                        loading={loginMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 mt-4"
                        fw={600}
                    >
                        {t("submit")}
                    </Button>
                </Stack>
            </form>

            {/* Register Link */}
            <Text ta="center" size="sm" c="dimmed">
                Chưa có tài khoản?{" "}
                <Anchor
                    component={Link}
                    href="/auth/register"
                    fw={700}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                    {t("register_link")}
                </Anchor>
            </Text>
        </Stack>
    );
}
