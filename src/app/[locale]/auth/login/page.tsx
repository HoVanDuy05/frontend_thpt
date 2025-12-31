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
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}`;
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
                size="lg"
                radius="xl"
                leftSection={<IconBrandGoogle size={22} />}
                onClick={handleGoogleLogin}
                className="border-[1.5px] border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900/50 shadow-sm transition-all active:scale-[0.98]"
                fw={700}
                h={54}
            >
                Đăng nhập bằng Google
            </Button>

            {/* Divider */}
            <Divider label={<Text size="xs" fw={600} c="dimmed">hoặc đăng nhập bằng email</Text>} labelPosition="center" className="my-2" />

            {/* Form */}
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="lg">
                    <TextInput
                        label={t("email")}
                        placeholder="student@nguyenhue.edu.vn"
                        required
                        size="md"
                        radius="md"
                        leftSection={<IconMail size={18} className="text-gray-400" />}
                        {...form.getInputProps("email")}
                        classNames={{
                            input: "border-gray-200 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-400 h-[50px] transition-all bg-gray-50/50 dark:bg-zinc-900/30"
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
                            input: "border-gray-200 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-400 h-[50px] transition-all bg-gray-50/50 dark:bg-zinc-900/30"
                        }}
                    />

                    <Group justify="space-between" mt="xs">
                        <Checkbox
                            label="Ghi nhớ đăng nhập"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.currentTarget.checked)}
                            size="sm"
                            color="indigo"
                            classNames={{
                                label: "text-gray-600 dark:text-gray-400 font-medium cursor-pointer"
                            }}
                        />
                        <Anchor
                            component={Link}
                            href="/auth/forgot-password"
                            size="sm"
                            fw={700}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                        >
                            {t("forgot_password")}?
                        </Anchor>
                    </Group>

                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        radius="xl"
                        loading={loginMutation.isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 mt-6 shadow-md shadow-indigo-500/20 active:scale-[0.99] transition-all"
                        fw={700}
                        h={54}
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
