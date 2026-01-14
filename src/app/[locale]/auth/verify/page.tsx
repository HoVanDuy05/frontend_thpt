"use client";

import { useState, useEffect } from "react";
import {
    Stack,
    TextInput,
    Button,
    Text,
    Container,
    Paper,
    Title,
    Box,
    Group,
    ActionIcon,
    PinInput,
    Center,
    Loader
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/routing";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconChevronLeft, IconSend, IconReload } from "@tabler/icons-react";

export default function VerifyPage() {
    const t = useTranslations("auth.verify");
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const [resendTimer, setResendTimer] = useState(0);

    const mutations = AppMutation();
    const verifyMutation = mutations.auth.useVerifyCode();
    const resendMutation = mutations.auth.useResendCode();

    const form = useForm({
        initialValues: {
            code: "",
        },
        validate: {
            code: (value) => (value.length < 6 ? t("error") : null),
        },
    });

    useEffect(() => {
        if (!email) {
            router.push("/auth/login");
        }
    }, [email, router]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleVerify = (values: typeof form.values) => {
        verifyMutation.mutate(
            { email, code: values.code },
            {
                onSuccess: () => {
                    notifications.show({
                        title: t("success"),
                        message: t("success"),
                        color: "teal",
                        icon: <IconCheck size={16} />,
                    });
                    router.push("/auth/login");
                },
                onError: (error: any) => {
                    notifications.show({
                        title: t("error"),
                        message: error?.response?.data?.message || t("error"),
                        color: "red",
                        icon: <IconX size={16} />,
                    });
                },
            }
        );
    };

    const handleResend = () => {
        if (resendTimer > 0) return;

        resendMutation.mutate(
            { email },
            {
                onSuccess: () => {
                    notifications.show({
                        title: "Success",
                        message: "Verification code has been resent to your email.",
                        color: "teal",
                        icon: <IconCheck size={16} />,
                    });
                    setResendTimer(60);
                },
            }
        );
    };

    return (
        <Container size="lg">
            <Link href="/auth/login">
                <Group gap={4} mb={30} className="cursor-pointer group">
                    <IconChevronLeft size={16} className="text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                    <Text size="sm" fw={600} className="text-zinc-400 group-hover:text-indigo-500 transition-colors">
                        Back to login
                    </Text>
                </Group>
            </Link>

            <Paper radius="20px" p={{ base: 16, xs: 12, sm: 20 }} withBorder className="shadow-xl dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                <Stack align="center" gap="xs" mb={30}>
                    <Box className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4">
                        <IconSend size={32} className="text-indigo-600 dark:text-indigo-400" />
                    </Box>
                    <Title order={2} fw={900} className="text-zinc-900 dark:text-white tracking-tight text-center">
                        {t("title")}
                    </Title>
                    <Text c="dimmed" size="sm" ta="center" className="max-w-[280px]">
                        {t("subtitle", { email })}
                    </Text>
                </Stack>

                <form onSubmit={form.onSubmit(handleVerify)}>
                    <Stack gap="lg">
                        <Center>
                            <PinInput
                                length={6}
                                type="number"
                                autoFocus
                                gap={6}
                                placeholder=""
                                {...form.getInputProps("code")}
                                classNames={{
                                    input: "h-[46px] w-[38px] xs:h-[50px] xs:w-[42px] sm:h-[64px] sm:w-[54px] rounded-[6px] sm:rounded-[10px] border-2 border-zinc-100 dark:border-zinc-800 focus:border-indigo-500 font-bold text-lg sm:text-xl transition-all"
                                }}
                            />
                        </Center>

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            radius="xl"
                            loading={verifyMutation.isPending}
                            className="h-[54px] bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 text-[15px] font-bold"
                        >
                            {t("submit")}
                        </Button>

                        <Group justify="center" gap={6}>
                            <Text size="sm" c="dimmed">
                                {t("resend_text")}
                            </Text>
                            <Button
                                variant="transparent"
                                size="sm"
                                p={0}
                                fw={700}
                                onClick={handleResend}
                                disabled={resendTimer > 0 || resendMutation.isPending}
                                className="text-indigo-600 hover:text-indigo-700 disabled:text-zinc-400"
                                leftSection={resendMutation.isPending ? <Loader size={12} /> : null}
                            >
                                {resendTimer > 0
                                    ? `${t("resend_link")} (${resendTimer}s)`
                                    : t("resend_link")}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
