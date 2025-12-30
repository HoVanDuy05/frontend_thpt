"use client";

import { Container, Group, Button, Title, ActionIcon, useMantineColorScheme, Text as MantineText } from "@mantine/core";
import { IconSun, IconMoon, IconLogout, IconLanguage } from "@tabler/icons-react";
import { useAppStore } from "@/providers/store/useAppStore";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguagePicker } from "../LanguagePicker";

export function StudentHeader() {
    const { user, logout } = useAppStore();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const t = useTranslations();

    return (
        <header className="h-16 border-b flex items-center bg-white dark:bg-zinc-950 sticky top-0 z-50">
            <Container size="lg" className="w-full">
                <Group justify="space-between">
                    <Link href="/student" className="no-underline text-inherit">
                        <Title order={3} className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            PMS Student
                        </Title>
                    </Link>

                    <Group gap="md">
                        <ActionIcon
                            variant="default"
                            onClick={() => toggleColorScheme()}
                            size="lg"
                            radius="md"
                        >
                            {colorScheme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
                        </ActionIcon>

                        <LanguagePicker />

                        {user ? (
                            <Group gap="sm">
                                <MantineText size="sm" fw={500} className="hidden sm:block">
                                    {user.taiKhoan}
                                </MantineText>

                                <Button variant="light" component={Link as any} href="/student">
                                    {t("layout.admin_panel")}
                                </Button>

                                <Button
                                    variant="subtle"
                                    color="red"
                                    leftSection={<IconLogout size={16} />}
                                    onClick={logout}
                                >
                                    {t("layout.logout")}
                                </Button>
                            </Group>
                        ) : (
                            <Button variant="filled" component={Link as any} href="/auth/login">
                                {t("layout.sign_in")}
                            </Button>
                        )}
                    </Group>
                </Group>
            </Container>
        </header>
    );
}

