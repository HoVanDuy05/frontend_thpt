"use client";

import { Container, Group, Title, Box } from "@mantine/core";
import { Link } from "@/i18n/routing";
import { LanguagePicker } from "../LanguagePicker";

export function AuthHeader() {
    return (
        <Box component="header" className="h-20 flex items-center bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 absolute top-0 left-0 w-full">
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

                    <LanguagePicker />
                </Group>
            </Container>
        </Box>
    );
}
