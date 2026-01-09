"use client";

import { TextInput, Button, Title, Text, Stack, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconArrowLeft, IconMail } from "@tabler/icons-react";
import { useValidation } from "@/shared/common/useValidation";
import { useTranslationError } from "@/shared/common/useTranslationError";

export default function ForgotPasswordPage() {
    const t = useTranslations("auth.forgot");
    const forgotMutation = AppMutation().auth.useForgotPassword();
    const validate = useValidation();
    const translateError = useTranslationError();

    const form = useForm({
        initialValues: {
            email: "",
        },
        validate: {
            email: validate.email,
        },
    });

    const locale = useLocale();

    const handleSubmit = (values: typeof form.values) => {
        forgotMutation.mutate({ ...values, locale }, {
            onSuccess: () => {
                notifications.show({
                    title: t("success"),
                    message: t("success_message"),
                    color: "teal",
                    icon: <IconCheck size={16} />,
                    autoClose: 8000,
                });
            },
            onError: (error) => {
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
            {/* Header */}
            <Box>
                <Title order={1} className="text-[28px] sm:text-[38px] font-[900] tracking-tight text-zinc-900 dark:text-white leading-[1.2] mb-2">
                    {t("title")}
                </Title>
                <Text c="dimmed" size="sm">
                    {t("subtitle")}
                </Text>
            </Box>

            {/* Form */}
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label={
                            <Text component="span" size="xs" fw={900} className="uppercase tracking-[0.15em] text-zinc-700 dark:text-zinc-300 whitespace-nowrap mb-1 inline-block">
                                {t("email")}
                            </Text>
                        }
                        placeholder="your@email.com"
                        type="email"
                        required
                        size="md"
                        leftSection={<IconMail size={18} stroke={2} className="text-zinc-400" />}
                        {...form.getInputProps("email")}
                        classNames={{
                            input: "h-[54px] rounded-[18px] border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 bg-white dark:bg-zinc-900/50 shadow-sm text-[15px] font-bold transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 pl-12"
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        h={56}
                        radius="18px"
                        loading={forgotMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 mt-4"
                        fw={600}
                    >
                        {t("submit")}
                    </Button>

                    <Button
                        component={Link}
                        href="/auth/login"
                        variant="subtle"
                        color="gray"
                        h={54}
                        radius="18px"
                        fullWidth
                        leftSection={<IconArrowLeft size={18} />}
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        fw={600}
                    >
                        {t("back_to_login")}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}
