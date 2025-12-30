"use client";

import { Container, Group, Button, Title, ActionIcon, useMantineColorScheme, Text, Box } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguagePicker } from "../LanguagePicker";
import { useEffect, useState } from "react";

export function LandingHeader() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const t = useTranslations("layout");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Box
            component="header"
            className={`h-20 flex items-center sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm"
                : "bg-transparent"
                }`}
        >
            <Container size="lg" className="w-full">
                <Group justify="space-between">
                    <Link href="/" className="no-underline text-inherit group">
                        <Group gap="xs">
                            <Box className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-700 transition-colors">
                                P
                            </Box>
                            <Title order={3} className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Nguyễn Huệ
                            </Title>
                        </Group>
                    </Link>

                    <Group gap="md">
                        <Group gap="lg" className="mr-8 hidden md:flex">
                            <Link href="#news" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors no-underline">Tin tức</Link>
                            <Link href="#events" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors no-underline">Sự kiện</Link>
                            <Link href="#admissions" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors no-underline">Tuyển sinh</Link>
                            <Link href="#about" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors no-underline">Về chúng tôi</Link>
                        </Group>

                        <ActionIcon
                            variant="subtle"
                            onClick={() => toggleColorScheme()}
                            size="lg"
                            className="text-zinc-600 dark:text-zinc-400"
                        >
                            {colorScheme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
                        </ActionIcon>

                        <LanguagePicker />

                        <Group gap="sm">
                            <Button
                                variant="subtle"
                                component={Link as any}
                                href="/auth/login"
                                className="hidden sm:inline-flex"
                            >
                                {t("sign_in")}
                            </Button>
                            <Button
                                variant="filled"
                                component={Link as any}
                                href="/auth/register"
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Tham gia ngay
                            </Button>
                        </Group>
                    </Group>
                </Group>
            </Container>
        </Box>
    );
}
