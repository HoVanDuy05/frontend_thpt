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
            className={`h-20 flex items-center sticky top-0 z-[100] w-full transition-all duration-300 ${scrolled
                ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm"
                : "bg-transparent"
                }`}
        >
            <Container size="lg" className="w-full h-full">
                <Group justify="space-between" h="100%" wrap="nowrap">
                    <Link href="/" className="no-underline text-inherit group shrink-0">
                        <Group gap="xs">
                            <Box className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                                P
                            </Box>
                            <Title order={3} className="hidden sm:block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                                Nguyễn Huệ
                            </Title>
                        </Group>
                    </Link>

                    <Group gap="md">
                        {/* Desktop Navigation */}
                        <Group gap={32} className="mr-8 hidden lg:flex">
                            <Link href="#news" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">Tin tức</Link>
                            <Link href="#events" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">Sự kiện</Link>
                            <Link href="#admissions" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">Tuyển sinh</Link>
                            <Link href="#about" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">Về chúng tôi</Link>
                        </Group>

                        <Group gap="sm" wrap="nowrap">
                            <ActionIcon
                                variant="default"
                                onClick={() => toggleColorScheme()}
                                size="lg"
                                radius="md"
                                className="border-transparent bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            >
                                {colorScheme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
                            </ActionIcon>

                            <LanguagePicker />

                            <div className="hidden sm:flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-3 ml-1">
                                <Button
                                    variant="subtle"
                                    color="gray"
                                    component={Link as any}
                                    href="/auth/login"
                                >
                                    {t("sign_in")}
                                </Button>
                                <Button
                                    variant="filled"
                                    color="blue"
                                    radius="md"
                                    component={Link as any}
                                    href="/auth/register"
                                    className="shadow-md shadow-blue-500/20"
                                >
                                    Tham gia
                                </Button>
                            </div>
                        </Group>
                    </Group>
                </Group>
            </Container>
        </Box>
    );
}
