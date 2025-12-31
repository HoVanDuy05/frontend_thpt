"use client";

import { Container, Group, Button, Title, ActionIcon, useMantineColorScheme, Box, Burger, Text, Drawer, Stack, Divider, rem } from "@mantine/core";
import { IconSun, IconMoon, IconDeviceMobile, IconLogin, IconLayoutDashboard, IconHome, IconNews, IconCalendarEvent, IconSchool, IconInfoCircle, IconX, IconUsers, IconMessageCircle } from "@tabler/icons-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguagePicker } from "../LanguagePicker";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLandingAuth } from "@/shared/hooks/useLandingAuth";
import { usePWA } from "@/shared/hooks/usePWA";

export function LandingHeader() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const t = useTranslations("layout");
    const [scrolled, setScrolled] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const { isLoggedIn, handleAccessPortal, user } = useLandingAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "#news", label: "Tin tức", icon: <IconNews size={20} /> },
        { href: "#events", label: "Sự kiện", icon: <IconCalendarEvent size={20} /> },
        { href: "#admissions", label: "Tuyển sinh", icon: <IconSchool size={20} /> },
        { href: "#about", label: "Về chúng tôi", icon: <IconInfoCircle size={20} /> },
    ];

    return (
        <>
            <Box
                component="header"
                className={`h-16 sm:h-20 flex items-center sticky top-0 z-[100] w-full transition-all duration-300 ${scrolled
                    ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm"
                    : "bg-transparent"
                    }`}
            >
                <Container size="lg" className="w-full h-full px-4">
                    <Group justify="space-between" h="100%" wrap="nowrap">
                        <Link href="/" className="no-underline text-inherit group shrink-0">
                            <Group gap="xs">
                                <Box className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:shadow-blue-500/30 group-hover:scale-105 transition-all shadow-lg">
                                    P
                                </Box>
                                <Title order={3} className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter text-lg sm:text-2xl font-black">
                                    Nguyễn Huệ
                                </Title>
                            </Group>
                        </Link>

                        <Group gap="md">
                            {/* Desktop Navigation */}
                            <Group gap={30} visibleFrom="lg">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-[15px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all no-underline"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </Group>

                            <Group gap="xs" wrap="nowrap">
                                <ActionIcon
                                    variant="subtle"
                                    onClick={() => toggleColorScheme()}
                                    size="lg"
                                    radius="xl"
                                    className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    visibleFrom="xs"
                                >
                                    {colorScheme === "dark" ? <IconSun size={22} /> : <IconMoon size={22} />}
                                </ActionIcon>

                                <Box visibleFrom="sm" className="ml-2">
                                    <LanguagePicker />
                                </Box>

                                <Group visibleFrom="md" gap="sm" className="items-center border-l border-zinc-200 dark:border-zinc-800 pl-4 ml-2">
                                    <Button
                                        variant="subtle"
                                        color="gray"
                                        leftSection={<IconDeviceMobile size={18} stroke={2.5} />}
                                        size="sm"
                                        radius="xl"
                                        className="font-bold hidden xl:flex text-zinc-600 dark:text-zinc-400"
                                    >
                                        Tải App
                                    </Button>

                                    {!isLoggedIn ? (
                                        <Button
                                            variant="filled"
                                            color="blue"
                                            radius="xl"
                                            component={Link as any}
                                            href="/auth/login"
                                            leftSection={<IconLogin size={18} stroke={2.5} />}
                                            className="shadow-md shadow-blue-500/20 px-8 font-bold"
                                            size="sm"
                                        >
                                            {t("sign_in")}
                                        </Button>
                                    ) : (
                                        <Group gap="xs">
                                            <ActionIcon
                                                variant="light"
                                                color="blue"
                                                size="lg"
                                                radius="xl"
                                                component={Link as any}
                                                href="/social"
                                                className="hidden md:flex"
                                                title="Mạng xã hội"
                                            >
                                                <IconUsers size={20} />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="light"
                                                color="indigo"
                                                size="lg"
                                                radius="xl"
                                                component={Link as any}
                                                href="/chat"
                                                className="hidden md:flex mr-2"
                                                title="Tin nhắn"
                                            >
                                                <IconMessageCircle size={20} />
                                            </ActionIcon>
                                            <Button
                                                variant="gradient"
                                                gradient={{ from: 'blue', to: 'indigo' }}
                                                radius="xl"
                                                onClick={handleAccessPortal}
                                                leftSection={<IconLayoutDashboard size={18} stroke={2.5} />}
                                                className="shadow-lg shadow-blue-500/25 px-8 font-bold h-9"
                                                size="sm"
                                            >
                                                Hệ thống
                                            </Button>
                                        </Group>
                                    )}
                                </Group>

                                <Burger opened={opened} onClick={open} hiddenFrom="md" size="sm" />
                            </Group>
                        </Group>
                    </Group>
                </Container>
            </Box>

            <Drawer
                opened={opened}
                onClose={close}
                size="100%"
                padding="xl"
                title={
                    <Group gap="xs">
                        <Box className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</Box>
                        <Text fw={900} size="xl">Portal</Text>
                    </Group>
                }
                zIndex={200}
                styles={{
                    header: {
                        borderBottom: `${rem(1)} solid var(--mantine-color-default-border)`,
                        padding: '1.25rem 1.5rem',
                        minHeight: rem(80)
                    },
                    content: {
                        backgroundColor: colorScheme === 'dark' ? 'rgba(9, 9, 11, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                    },
                    body: {
                        padding: '1.5rem'
                    }
                }}
            >
                <Stack gap="lg" mt="xl">
                    <Stack gap="xs">
                        {navLinks.map((link) => (
                            <Button
                                key={link.href}
                                variant="subtle"
                                color="gray"
                                size="lg"
                                radius="md"
                                component={Link as any}
                                href={link.href}
                                onClick={close}
                                leftSection={link.icon}
                                justify="flex-start"
                                className="text-zinc-700 dark:text-zinc-300 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all duration-200"
                            >
                                {link.label}
                            </Button>
                        ))}
                    </Stack>

                    <Divider variant="dashed" />

                    <Stack gap="md">
                        <Text size="xs" fw={700} c="dimmed" tt="uppercase" className="px-4">Tài khoản</Text>
                        {!isLoggedIn ? (
                            <Button
                                variant="filled"
                                color="blue"
                                size="lg"
                                radius="xl"
                                component={Link as any}
                                href="/auth/login"
                                onClick={close}
                                leftSection={<IconLogin size={22} stroke={2.5} />}
                                className="font-bold shadow-xl shadow-blue-500/20"
                            >
                                {t("sign_in")}
                            </Button>
                        ) : (
                            <Button
                                variant="gradient"
                                gradient={{ from: 'blue', to: 'indigo' }}
                                size="lg"
                                radius="xl"
                                onClick={() => { handleAccessPortal(); close(); }}
                                leftSection={<IconLayoutDashboard size={22} stroke={2.5} />}
                                className="font-bold shadow-xl shadow-blue-500/25"
                            >
                                Truy cập Hệ thống
                            </Button>
                        )}
                        <Button
                            variant="subtle"
                            color="gray"
                            size="lg"
                            radius="xl"
                            leftSection={<IconDeviceMobile size={22} stroke={2.5} />}
                            className="font-bold"
                        >
                            Tải Ứng dụng
                        </Button>
                    </Stack>

                    <Divider variant="dashed" />

                    <Group justify="space-between" align="center" px="md">
                        <Text size="sm" fw={600}>Chế độ giao diện</Text>
                        <ActionIcon
                            variant="default"
                            onClick={() => toggleColorScheme()}
                            size="lg"
                            radius="md"
                        >
                            {colorScheme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
                        </ActionIcon>
                    </Group>

                    <Box px="md">
                        <Text size="sm" fw={600} mb="xs">Ngôn ngữ</Text>
                        <LanguagePicker />
                    </Box>
                </Stack>
            </Drawer>
        </>
    );
}
