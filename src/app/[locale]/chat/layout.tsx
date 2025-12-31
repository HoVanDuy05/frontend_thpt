"use client";

import { Box, Group, ActionIcon, Title } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "@/i18n/routing";
import { withAuth } from "@/shared/hocs/withAuth";
import { UserMenu } from "@/shared/components/UserMenu";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    return (
        <Box className="h-screen bg-white dark:bg-black flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <Box
                className="bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-b border-gray-100 dark:border-zinc-900 z-50 px-4 py-3"
                h={64}
            >
                <Group justify="space-between" h="100%">
                    <Group>
                        <ActionIcon
                            variant="subtle"
                            radius="xl"
                            size="lg"
                            onClick={() => router.push('/social')}
                            className="hover:bg-gray-100 dark:hover:bg-zinc-900"
                        >
                            <IconChevronLeft size={24} stroke={2.5} />
                        </ActionIcon>
                        <Title order={3} className="text-xl font-black tracking-tight cursor-pointer" onClick={() => router.push('/social')} style={{ fontFamily: 'Georgia, serif' }}>
                            NHers Chat
                        </Title>
                    </Group>
                    <UserMenu />
                </Group>
            </Box>

            {/* Main Content Area */}
            <Box className="flex-1 overflow-hidden relative flex">
                {children}
            </Box>

            <style jsx global>{`
                body {
                    overflow: hidden;
                }
            `}</style>
        </Box>
    );
};

export default withAuth(ChatLayout);
