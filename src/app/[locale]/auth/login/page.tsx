"use client";

import { TextInput, PasswordInput, Button, Title, Text, Stack, Anchor, Group, Checkbox, Box, Divider, } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { AppMutation } from "@/api/AppMutation";
import { useAppStore } from "@/providers/store/useAppStore";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IconCheck, IconX, IconMail, IconLock, IconBrandGoogle, IconSchool } from "@tabler/icons-react";
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

                    // Remove locale prefix if present to avoid duplication (e.g., /vi/vi/...)
                    // router.push from next-intl automatically adds the current locale
                    targetUrl = targetUrl.replace(/^\/(vi|en)(\/|$)/, '/');

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
        <Stack gap={32} className="py-8">
            {/* Logo & Branding */}
            <Stack align="center" gap="xs">
                <Box p={12} className="bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
                    <IconSchool size={32} color="white" stroke={2} />
                </Box>
                <Text fw={900} size="xl" className="tracking-tighter uppercase text-indigo-600">
                    NGUYEN HUE
                </Text>
            </Stack>

            <Stack gap={8} align="center">
                <Title order={1} className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                    {t("title")}
                </Title>
                <Text size="sm" className="text-zinc-500 font-medium text-center max-w-[280px]">
                    {t("subtitle")}
                </Text>
            </Stack>

            {/* Logical Form */}
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="xl">
                    <Stack gap="md">
                        <TextInput
                            label={t("email")}
                            placeholder="mail@example.com"
                            required
                            size="md"
                            radius="md"
                            {...form.getInputProps("email")}
                            classNames={{
                                label: "font-bold mb-1 text-zinc-700 dark:text-zinc-300",
                                input: "h-[50px] border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 bg-white dark:bg-zinc-900 shadow-sm"
                            }}
                        />

                        <PasswordInput
                            label={t("password")}
                            placeholder="••••••••"
                            required
                            size="md"
                            radius="md"
                            {...form.getInputProps("matKhau")}
                            classNames={{
                                label: "font-bold mb-1 text-zinc-700 dark:text-zinc-300",
                                input: "h-[50px] border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 bg-white dark:bg-zinc-900 shadow-sm"
                            }}
                        />

                        <Group justify="space-between" align="center">
                            <Checkbox
                                label="Ghi nhớ đăng nhập"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.currentTarget.checked)}
                                size="xs"
                                color="indigo"
                                className="font-bold text-zinc-600"
                            />
                            <Anchor
                                component={Link}
                                href="/auth/forgot-password"
                                size="xs"
                                fw={800}
                                className="text-indigo-600 hover:text-indigo-700 uppercase tracking-tighter"
                            >
                                {t("forgot_password")}?
                            </Anchor>
                        </Group>
                    </Stack>

                    <Stack gap="md">
                        <Button
                            type="submit"
                            fullWidth
                            h={54}
                            radius="md"
                            loading={loginMutation.isPending}
                            color="indigo"
                            className="shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-transform"
                            fw={800}
                            size="md"
                        >
                            {t("submit")}
                        </Button>

                        <Divider label={<Text size="xs" fw={700} c="dimmed">Hoặc</Text>} labelPosition="center" />

                        <Button
                            variant="default"
                            fullWidth
                            h={54}
                            radius="md"
                            leftSection={<IconBrandGoogle size={20} />}
                            onClick={handleGoogleLogin}
                            className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-bold transition-all"
                        >
                            Tiếp tục với Google
                        </Button>
                    </Stack>
                </Stack>
            </form>

            {/* Footer Navigation */}
            <Box className="pt-4 text-center">
                <Text size="sm" fw={600} className="text-zinc-500">
                    Chưa có tài khoản?{" "}
                    <Anchor
                        component={Link}
                        href="/auth/register"
                        className="text-indigo-600 font-bold underline underline-offset-4"
                    >
                        {t("register_link")}
                    </Anchor>
                </Text>
            </Box>
        </Stack>



    );
}
