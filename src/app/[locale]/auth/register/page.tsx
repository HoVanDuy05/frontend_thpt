"use client";

import { TextInput, PasswordInput, Button, Title, Text, Stack, Anchor, Box, Divider, SimpleGrid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconLock, IconUser, IconSchool, IconChevronRight, IconMail } from "@tabler/icons-react";
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
                        <Box className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
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

            {/* Register Form */}
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
                            withAsterisk={false}
                            required
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
                                <Text component="span" size="xs" fw={900} className="uppercase tracking-[0.15em] text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                                    {t("password")} <Text component="span" c="red.6" ml={2}>*</Text>
                                </Text>
                            }
                            placeholder="At least 6 characters"
                            withAsterisk={false}
                            required
                            size="md"
                            {...form.getInputProps("matKhau")}
                            leftSection={<IconLock size={18} stroke={2} className="text-zinc-400" />}
                            classNames={{
                                label: "mb-2.5",
                                input: "h-[56px] rounded-2xl border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 bg-white dark:bg-zinc-900/50 shadow-sm text-[15px] font-bold transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 pl-12",
                                innerInput: "h-full"
                            }}
                        />

                        <PasswordInput
                            label={
                                <Text component="span" size="xs" fw={900} className="uppercase tracking-[0.15em] text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                                    {t("confirm_password")} <Text component="span" c="red.6" ml={2}>*</Text>
                                </Text>
                            }
                            placeholder="Repeat your password"
                            withAsterisk={false}
                            required
                            size="md"
                            {...form.getInputProps("confirmPassword")}
                            leftSection={<IconCheck size={18} stroke={2} className="text-zinc-400" />}
                            classNames={{
                                label: "mb-2.5",
                                input: "h-[56px] rounded-2xl border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 bg-white dark:bg-zinc-900/50 shadow-sm text-[15px] font-bold transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 pl-12",
                                innerInput: "h-full"
                            }}
                        />
                    </Stack>

                    <Button
                        type="submit"
                        fullWidth
                        h={60}
                        radius="22px"
                        loading={registerMutation.isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-600/25 border-0 mt-4"
                        rightSection={<IconChevronRight size={18} stroke={3} />}
                    >
                        <Text fw={900} size="md" className="uppercase tracking-widest pl-4">
                            {t("submit")}
                        </Text>
                    </Button>
                </Stack>
            </form>

            {/* Footer Navigation */}
            <Box className="pt-4 text-center border-t border-zinc-100 dark:border-zinc-900 mt-4">
                <Text size="sm" fw={600} className="text-zinc-500">
                    {t("have_account")}{" "}
                    <Anchor
                        component={Link}
                        href="/auth/login"
                        className="text-indigo-600 dark:text-indigo-400 font-black underline underline-offset-8 decoration-2 hover:decoration-indigo-700 transition-all ml-1"
                    >
                        {t("login_link")}
                    </Anchor>
                </Text>
            </Box>
        </Stack>
    );
}
