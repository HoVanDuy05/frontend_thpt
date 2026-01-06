"use client";

import { Container, Group, Button, Title, ActionIcon, useMantineColorScheme, Box, Burger, Text, Drawer, Stack, Divider, rem, Image, Avatar, UnstyledButton } from "@mantine/core";
import { IconSun, IconMoon, IconDeviceMobile, IconLogin, IconLayoutDashboard, IconHome, IconNews, IconCalendarEvent, IconSchool, IconInfoCircle, IconX, IconUsers, IconMessageCircle } from "@tabler/icons-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguagePicker } from "../LanguagePicker";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLandingAuth } from "@/shared/hooks/useLandingAuth";
import { usePWA } from "@/providers/PWAProvider";

export function LandingHeader() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const t = useTranslations("layout");
    const [scrolled, setScrolled] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    const { isInstallable, installApp, isInstalled } = usePWA();
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
        // social
        { href: "/social", label: "Mạng xã hội", icon: <IconUsers size={20} /> },
        { href: "/chat", label: "Tin nhắn", icon: <IconMessageCircle size={20} /> },
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
                                <Box className="w-9 h-9 sm:w-11 sm:h-11 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center p-2 group-hover:shadow-blue-500/30 group-hover:scale-105 transition-all shadow-lg border border-zinc-100 dark:border-zinc-800">
                                    <Image src="/favicon.png" alt="Logo" className="w-full h-full object-contain" />
                                </Box>
                                <Stack gap={0}>
                                    <Title order={3} className="text-zinc-900 dark:text-white tracking-tighter text-lg sm:text-2xl font-black uppercase leading-none">
                                        Nguyễn Huệ
                                    </Title>
                                    <Text size="10px" fw={800} className="text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] leading-none opacity-80" visibleFrom="xs">
                                        Academy
                                    </Text>
                                </Stack>
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
                                    {isInstallable && !isInstalled && (
                                        <Button
                                            variant="subtle"
                                            color="blue"
                                            leftSection={<IconDeviceMobile size={18} stroke={2.5} />}
                                            size="sm"
                                            radius="xl"
                                            onClick={installApp}
                                            className="font-bold hidden xl:flex"
                                        >
                                            Tải App
                                        </Button>
                                    )}

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
                        <Box className="w-9 h-9 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-zinc-100 dark:border-zinc-800">
                            <Image src="/favicon.png" alt="Logo" className="w-full h-full object-contain" />
                        </Box>
                        <Stack gap={0}>
                            <Text fw={900} size="lg" className="leading-tight tracking-tighter text-zinc-900 dark:text-white uppercase">
                                Nguyễn Huệ
                            </Text>
                            <Text size="10px" fw={800} className="text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] leading-none opacity-80">
                                Academy
                            </Text>
                        </Stack>
                    </Group>
                }
                zIndex={200}
                styles={{
                    header: {
                        borderBottom: `${rem(1)} solid var(--mantine-color-default-border)`,
                        padding: '1rem 1.5rem',
                        minHeight: rem(70)
                    },
                    content: {
                        backgroundColor: colorScheme === 'dark' ? 'rgba(9, 9, 11, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                    },
                    body: {
                        padding: '1.5rem'
                    }
                }}
            >
                <Stack gap="xl" mt="md">
                    {isLoggedIn && (
                        <Box className="px-4 py-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
                            <Group gap="md">
                                <Avatar
                                    src={user?.avatar}
                                    name={user?.hoTen}
                                    size="lg"
                                    radius="xl"
                                    className="border-2 border-white dark:border-zinc-800 shadow-md"
                                />
                                <Stack gap={0}>
                                    <Text fw={800} size="sm" c="dimmed" tt="uppercase" className="tracking-widest">Chào mừng bạn,</Text>
                                    <Text fw={900} size="xl" className="text-zinc-900 dark:text-white">{user?.hoTen}</Text>
                                </Stack>
                            </Group>
                        </Box>
                    )}

                    <Box>
                        <Text size="xs" fw={800} c="dimmed" tt="uppercase" className="px-4 mb-4 tracking-[0.2em] opacity-50">Menu chính</Text>
                        <Stack gap="xs">
                            {navLinks.map((link) => (
                                <UnstyledButton
                                    key={link.href}
                                    component={Link as any}
                                    href={link.href}
                                    onClick={close}
                                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 active:scale-[0.98] transition-all group"
                                >
                                    <Box className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {link.icon}
                                    </Box>
                                    <Text fw={800} size="md" className="text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 transition-colors">
                                        {link.label}
                                    </Text>
                                </UnstyledButton>
                            ))}
                        </Stack>
                    </Box>

                    <Divider variant="dashed" />

                    <Box>
                        <Text size="xs" fw={800} c="dimmed" tt="uppercase" className="px-4 mb-4 tracking-[0.2em] opacity-50">Hành động</Text>
                        <Stack gap="md" className="mt-4">
                            {!isLoggedIn ? (
                                <Button
                                    variant="filled"
                                    color="blue"
                                    size="xl"
                                    radius="2xl"
                                    component={Link as any}
                                    href="/auth/login"
                                    onClick={close}
                                    leftSection={<IconLogin size={22} stroke={2.5} />}
                                    className="font-black shadow-lg shadow-blue-500/20 h-16 text-lg"
                                >
                                    {t("sign_in")}
                                </Button>
                            ) : (
                                <Button
                                    variant="gradient"
                                    gradient={{ from: 'blue', to: 'indigo' }}
                                    size="xl"
                                    radius="2xl"
                                    onClick={() => { handleAccessPortal(); close(); }}
                                    leftSection={<IconLayoutDashboard size={22} stroke={2.5} />}
                                    className="font-black shadow-lg shadow-blue-500/25 h-16 text-lg"
                                >
                                    Truy cập Hệ thống
                                </Button>
                            )}

                            {isInstallable && !isInstalled && (
                                <Box
                                    className="relative p-6 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
                                    onClick={() => { installApp(); close(); }}
                                >
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200/50 dark:bg-indigo-800/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                    <Group justify="space-between" align="center" wrap="nowrap" className="relative z-10">
                                        <Stack gap={4}>
                                            <Text fw={900} size="lg" className="text-indigo-900 dark:text-indigo-100 leading-tight">Trải nghiệm app</Text>
                                            <Text size="xs" fw={700} className="text-indigo-600/80 dark:text-indigo-400/80">Cài đặt để dùng mượt hơn</Text>
                                        </Stack>
                                        <ActionIcon size={44} radius="xl" color="indigo" variant="filled" className="shadow-lg shadow-indigo-500/30">
                                            <IconDeviceMobile size={22} stroke={3} />
                                        </ActionIcon>
                                    </Group>
                                </Box>
                            )}
                        </Stack>
                    </Box>

                    <Divider variant="dashed" />

                    <Box>
                        <Text size="xs" fw={800} c="dimmed" tt="uppercase" className="px-4 mb-4 tracking-[0.2em] opacity-50">Cài đặt ứng dụng</Text>
                        <Stack gap="sm">
                            <UnstyledButton
                                onClick={() => toggleColorScheme()}
                                className="flex items-center justify-between px-4 py-4 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 active:scale-[0.98] transition-all"
                            >
                                <Group gap="md">
                                    <Box className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                                        {colorScheme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
                                    </Box>
                                    <Text fw={800} size="md" className="text-zinc-700 dark:text-zinc-300">Giao diện {colorScheme === 'dark' ? 'Sáng' : 'Tối'}</Text>
                                </Group>
                            </UnstyledButton>

                            <Box className="px-4 py-2">
                                <Text size="sm" fw={800} className="text-zinc-400 mb-3 ml-1">Ngôn ngữ</Text>
                                <LanguagePicker />
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </Drawer>
        </>
    );
}
