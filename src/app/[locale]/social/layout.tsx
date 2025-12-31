"use client";

import { Box, Container, Group, ActionIcon, Title, rem, Stack, useMantineColorScheme, UnstyledButton } from "@mantine/core";
import { IconHome, IconSearch, IconPlus, IconHeart, IconUser, IconChevronLeft, IconLayoutNavbar, IconCompass, IconMessage, IconUsers } from "@tabler/icons-react";
import { useRouter, usePathname, Link } from "@/i18n/routing";
import { withAuth } from "@/shared/hocs/withAuth";
import { UserMenu } from "@/shared/components/UserMenu";

const SocialLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();

    const NavIcon = ({ icon: Icon, href, active }: any) => (
        <UnstyledButton
            component={Link}
            href={href}
            className={`flex flex-1 items-center justify-center py-4 transition-all duration-300 cursor-pointer rounded-2xl mx-1 ${active
                ? "text-black dark:text-white bg-gray-50 dark:bg-zinc-900/80 scale-105"
                : "text-gray-300 dark:text-zinc-700 hover:text-gray-500 dark:hover:text-zinc-400"
                }`}
        >
            <Icon size={28} stroke={active ? 2.5 : 2} />
        </UnstyledButton>
    );

    return (
        <Box className="min-h-screen bg-white dark:bg-black flex flex-col selection:bg-indigo-100 selection:text-indigo-900 font-sans">
            {/* Desktop Navigation (Left Sidebar) */}
            <Box
                visibleFrom="md"
                className="fixed left-0 top-0 bottom-0 w-[100px] flex flex-col items-center py-10 border-r border-gray-100 dark:border-zinc-900 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-xl"
            >
                <Link href="/social" className="hover:rotate-12 transition-transform duration-500">
                    <Title order={1} className="text-4xl font-black mb-16 tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>NHers Social</Title>
                </Link>

                <Stack gap="xl" className="w-full px-4">
                    <NavIcon icon={IconHome} href="/social" active={pathname === "/social"} />
                    <NavIcon icon={IconSearch} href="/social/explore" active={pathname === "/social/explore"} />
                    <NavIcon icon={IconPlus} href="/social/create" active={pathname === "/social/create"} />
                    <NavIcon icon={IconMessage} href="/chat" active={pathname.startsWith("/chat")} />
                    <NavIcon icon={IconUsers} href="/social/friends" active={pathname === "/social/friends"} />
                    <NavIcon icon={IconHeart} href="/social/activity" active={pathname === "/social/activity"} />
                    <NavIcon icon={IconUser} href="/social/profile" active={pathname.startsWith("/social/profile")} />
                </Stack>

                <Box className="mt-auto pb-6">
                    <ActionIcon
                        variant="subtle"
                        size="xl"
                        radius="xl"
                        onClick={() => router.push("/admin/dashboard")}
                        title="Quay lại Portal"
                        className="hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                        <IconLayoutNavbar size={26} stroke={1.5} className="text-zinc-400" />
                    </ActionIcon>
                </Box>
            </Box>

            {/* Mobile Header */}
            <Box
                hiddenFrom="md"
                className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-b border-gray-100 dark:border-zinc-900"
                h={64}
            >
                <Container size="sm" h="100%" className="flex items-center justify-between px-6">
                    <ActionIcon
                        variant="subtle"
                        radius="xl"
                        size="lg"
                        onClick={() => router.back()}
                        className="hover:bg-gray-100 dark:hover:bg-zinc-900"
                    >
                        <IconChevronLeft size={24} stroke={2.5} />
                    </ActionIcon>

                    <Title order={3} className="text-2xl font-black tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
                        NHers Social
                    </Title>

                    <UserMenu />
                </Container>
            </Box>

            {/* Main Content Area */}
            <Box className="flex-grow md:ml-[100px]">
                <Container size="sm" className="px-4 sm:px-6 py-4 sm:py-10 min-h-screen">
                    {children}
                </Container>
            </Box>

            {/* Mobile Bottom Tab Bar */}
            <Box
                hiddenFrom="md"
                className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-3xl border-t border-gray-100 dark:border-zinc-900 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]"
            >
                <Container size="sm" className="px-2 py-2">
                    <Group gap={4} grow wrap="nowrap">
                        <NavIcon icon={IconHome} href="/social" active={pathname === "/social"} />
                        <NavIcon icon={IconSearch} href="/social/explore" active={pathname === "/social/explore"} />
                        <NavIcon icon={IconPlus} href="/social/create" active={pathname === "/social/create"} />
                        <NavIcon icon={IconMessage} href="/chat" active={pathname.startsWith("/chat")} />
                        <NavIcon icon={IconUsers} href="/social/friends" active={pathname === "/social/friends"} />
                        <NavIcon icon={IconHeart} href="/social/activity" active={pathname === "/social/activity"} />
                        <NavIcon icon={IconUser} href="/social/profile" active={pathname.startsWith("/social/profile")} />
                    </Group>
                </Container>
            </Box>

            <style jsx global>{`
                .pb-safe {
                    padding-bottom: env(safe-area-inset-bottom);
                }
                body {
                    overflow-x: hidden;
                }
                * {
                    transition: background-color 0.3s ease, border-color 0.3s ease;
                }
            `}</style>
        </Box>
    );
};

export default withAuth(SocialLayout);
