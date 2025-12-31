"use client";

import { TextInput, PasswordInput, Button, Title, Text, Stack, Anchor, Box, Divider, SimpleGrid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconMail, IconLock, IconUser } from "@tabler/icons-react";
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
            email: "",
            matKhau: "",
            confirmPassword: "",
        },
        validate: {
            email: validate.email,
            matKhau: validate.password,
            confirmPassword: (value, values) => validate.confirmPassword(values.matKhau)(value),
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        registerMutation.mutate(
            { email: values.email, matKhau: values.matKhau },
            {
                onSuccess: () => {
                    notifications.show({
                        title: t("success"),
                        message: t("success_message"),
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
        <Stack gap={50}>
            {/* Context Header */}
            <Stack gap={10}>
                <Title order={1} className="text-5xl font-extrabold tracking-tight leading-[1.1] text-black dark:text-white">
                    {t("title")}
                </Title>
                <Text size="lg" className="text-zinc-400 dark:text-zinc-500 font-medium">
                    {t("subtitle")}
                </Text>
            </Stack>

            {/* Logical Form */}
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap={32}>
                    <Stack gap={20}>
                        <TextInput
                            label={t("email")}
                            placeholder="mail@example.com"
                            required
                            size="md"
                            {...form.getInputProps("email")}
                            classNames={{
                                label: "text-[11px] uppercase tracking-[0.2em] font-black text-zinc-400 dark:text-zinc-600 mb-2 px-1",
                                input: "h-[60px] bg-transparent border-0 border-b-2 border-zinc-100 dark:border-zinc-800 focus:border-black dark:focus:border-white rounded-none px-1 text-lg font-semibold transition-all duration-300 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                            }}
                        />

                        <PasswordInput
                            label={t("password")}
                            placeholder="••••••••"
                            required
                            size="md"
                            {...form.getInputProps("matKhau")}
                            classNames={{
                                label: "text-[11px] uppercase tracking-[0.2em] font-black text-zinc-400 dark:text-zinc-600 mb-2 px-1",
                                input: "h-[60px] bg-transparent border-0 border-b-2 border-zinc-100 dark:border-zinc-800 focus:border-black dark:focus:border-white rounded-none px-1 text-lg font-semibold transition-all duration-300 placeholder:text-zinc-300 dark:placeholder:text-zinc-700",
                                innerInput: "h-full"
                            }}
                        />

                        <PasswordInput
                            label={t("confirm_password")}
                            placeholder="••••••••"
                            required
                            size="md"
                            {...form.getInputProps("confirmPassword")}
                            classNames={{
                                label: "text-[11px] uppercase tracking-[0.2em] font-black text-zinc-400 dark:text-zinc-600 mb-2 px-1",
                                input: "h-[60px] bg-transparent border-0 border-b-2 border-zinc-100 dark:border-zinc-800 focus:border-black dark:focus:border-white rounded-none px-1 text-lg font-semibold transition-all duration-300 placeholder:text-zinc-300 dark:placeholder:text-zinc-700",
                                innerInput: "h-full"
                            }}
                        />
                    </Stack>

                    <Button
                        type="submit"
                        fullWidth
                        h={64}
                        radius="xl"
                        loading={registerMutation.isPending}
                        className="bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-black text-white text-base tracking-widest font-black uppercase transition-all duration-500 active:scale-[0.97] shadow-2xl shadow-black/10 dark:shadow-white/5"
                    >
                        {t("submit")}
                    </Button>
                </Stack>
            </form>

            {/* Footer Navigation */}
            <Box className="pt-10 border-t border-zinc-50 dark:border-zinc-900/50 text-center">
                <Text size="sm" fw={600} className="text-zinc-400 dark:text-zinc-600">
                    {t("have_account")}{" "}
                    <Anchor
                        component={Link}
                        href="/auth/login"
                        className="text-black dark:text-white font-black underline underline-offset-8 hover:underline-offset-4 transition-all"
                    >
                        {t("login_link")}
                    </Anchor>
                </Text>
            </Box>
        </Stack>

    );
}
