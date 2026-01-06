"use client";

import { TextInput, PasswordInput, Button, Title, Text, Stack, Anchor, Group, Checkbox, Box, Divider, Center } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { AppMutation } from "@/api/AppMutation";
import { useAppStore } from "@/providers/store/useAppStore";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IconCheck, IconX, IconLock, IconBrandGoogle, IconSchool, IconChevronRight, IconUser, IconMail, IconDeviceMobile } from "@tabler/icons-react";
import { useValidation } from "@/shared/common/useValidation";
import { useTranslationError } from "@/shared/common/useTranslationError";
import { usePWA } from "@/providers/PWAProvider";

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
    const { isInstallable, installApp } = usePWA();

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
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}`;
    };

    return (
        <Stack gap={24} className="w-full max-w-[400px] mx-auto pb-10">
            {/* Branding Header */}
            <Stack align="center" gap="md" className="mb-2">
                <Box className="relative">
                    <Box
                        p={20}
                        className="bg-indigo-600 rounded-[32px] shadow-2xl shadow-indigo-600/40 relative overflow-hidden group cursor-default"
                    >
                        <Box className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <IconSchool size={48} color="white" stroke={1.5} />
                    </Box>
                    <Box className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-50 dark:border-zinc-950">
                        <Box className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                    </Box>
                </Box>

                <Stack gap={6} align="center">
                    <Text fw={900} size="xs" className="tracking-[0.4em] uppercase text-indigo-600 dark:text-indigo-400 opacity-80 pl-2">
                        Nguyen Hue
                    </Text>
                    <Title order={1} className="text-[38px] font-[900] tracking-tight text-zinc-900 dark:text-white leading-[1.1] text-center">
                        {t("title")}
                    </Title>
                    <Text size="sm" fw={600} className="text-zinc-400 dark:text-zinc-600">
                        {t("subtitle")}
                    </Text>
                </Stack>
            </Stack>

            {/* Login Form */}
            <form onSubmit={form.onSubmit(handleSubmit)} className="w-full">
                <Stack gap="xl">
                    <Stack gap="lg">
                        <TextInput
                            label={
                                <Text component="span" size="xs" fw={900} className="uppercase tracking-[0.15em] text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                                    {t("email")} <Text component="span" c="red.6" ml={2}>*</Text>
                                </Text>
                            }
                            placeholder="mail@example.com"
                            required
                            withAsterisk={false}
                            size="md"
                            {...form.getInputProps("email")}
                            leftSection={<IconMail size={18} stroke={2} className="text-zinc-400" />}
                            classNames={{
                                label: "mb-2.5",
                                input: "h-[56px] rounded-2xl border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 bg-white dark:bg-zinc-900/50 shadow-sm text-[15px] font-bold transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 pl-12"
                            }}
                        />

                        <PasswordInput
                            label={
                                <Group justify="space-between" align="center" w="100%" wrap="nowrap">
                                    <Text component="span" size="xs" fw={900} className="uppercase tracking-[0.15em] text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                                        {t("password")} <Text component="span" c="red.6" ml={2}>*</Text>
                                    </Text>
                                    <Anchor
                                        component={Link}
                                        href="/auth/forgot-password"
                                        size="xs"
                                        fw={800}
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors whitespace-nowrap tracking-tight"
                                    >
                                        {t("forgot_password")}?
                                    </Anchor>
                                </Group>
                            }
                            placeholder="Your password"
                            required
                            withAsterisk={false}
                            size="md"
                            {...form.getInputProps("matKhau")}
                            leftSection={<IconLock size={18} stroke={2} className="text-zinc-400" />}
                            classNames={{
                                label: "w-full mb-2.5 leading-none",
                                input: "h-[56px] rounded-2xl border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 bg-white dark:bg-zinc-900/50 shadow-sm text-[15px] font-bold transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 pl-12",
                                innerInput: "h-full"
                            }}
                        />

                        <Group justify="space-between" align="center" px={4}>
                            <Checkbox
                                label={t("remember_me")}
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.currentTarget.checked)}
                                size="xs"
                                color="indigo"
                                className="cursor-pointer"
                                classNames={{
                                    label: "pl-2.5 font-bold text-zinc-500 dark:text-zinc-400 cursor-pointer",
                                    input: "rounded-md border-zinc-200 dark:border-zinc-800 cursor-pointer"
                                }}
                            />
                        </Group>
                    </Stack>

                    <Stack gap="md" className="pt-2">
                        <Button
                            type="submit"
                            fullWidth
                            h={60}
                            radius="22px"
                            loading={loginMutation.isPending}
                            className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-600/25 border-0"
                            rightSection={<IconChevronRight size={18} stroke={3} />}
                        >
                            <Text fw={900} size="md" className="uppercase tracking-widest pl-4">
                                {t("submit")}
                            </Text>
                        </Button>

                        <Divider
                            label={<Text size="xs" fw={800} className="text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-4">{t("instant_login")}</Text>}
                            labelPosition="center"
                            className="my-3 opacity-60"
                        />

                        <Button
                            variant="default"
                            fullWidth
                            h={58}
                            radius="22px"
                            leftSection={<IconBrandGoogle size={22} />}
                            onClick={handleGoogleLogin}
                            className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all font-bold text-zinc-700 dark:text-zinc-300 shadow-sm"
                        >
                            {t("google_account")}
                        </Button>

                        {isInstallable && (
                            <Button
                                variant="light"
                                color="indigo"
                                fullWidth
                                h={58}
                                radius="22px"
                                leftSection={<IconDeviceMobile size={22} />}
                                onClick={installApp}
                                className="font-bold shadow-sm animate-pulse"
                            >
                                {t("download_app")}
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </form>

            {/* Footer Navigation */}
            <Box className="pt-4 text-center border-t border-zinc-100 dark:border-zinc-900 mt-4">
                <Text size="sm" fw={600} className="text-zinc-500">
                    {t("no_account")}{" "}
                    <Anchor
                        component={Link}
                        href="/auth/register"
                        className="text-indigo-600 dark:text-indigo-400 font-black underline underline-offset-8 decoration-2 hover:decoration-indigo-700 transition-all ml-1"
                    >
                        {t("register_link")}
                    </Anchor>
                </Text>
            </Box>
        </Stack>
    );
}
