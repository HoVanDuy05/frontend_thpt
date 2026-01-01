"use client";

import { Box, Container, Group, ActionIcon, Title, rem, Stack, useMantineColorScheme, UnstyledButton } from "@mantine/core";
import { IconHome, IconSearch, IconPlus, IconHeart, IconUser, IconChevronLeft, IconLayoutNavbar, IconCompass, IconMessage, IconUsers } from "@tabler/icons-react";
import { useRouter, usePathname, Link } from "@/i18n/routing";
import { withAuth } from "@/shared/hocs/withAuth";
import { UserMenu } from "@/shared/components/UserMenu";
import { useAppStore } from "@/providers/store/useAppStore";

const SocialLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAppStore();

    const myProfileHref = user?.id ? `/social/profile/${user.id}` : '/social/profile';

    const NavIcon = ({ icon: Icon, href, active }: any) => (
        <UnstyledButton
            component={Link}
            href={href}
            className={`group flex items-center justify-center py-3 transition-all duration-200 cursor-pointer rounded-xl ${active
                ? "text-black dark:text-white"
                : "text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
                }`}
        >
            <Icon size={24} stroke={2} />
        </UnstyledButton>
    );

    return (
        <Box className="min-h-screen bg-white dark:bg-black flex flex-col selection:bg-indigo-100 selection:text-indigo-900 font-sans">
            {/* Desktop Navigation (Left Sidebar) */}
            <Box
                visibleFrom="md"
                className="fixed left-0 top-0 bottom-0 w-[76px] flex flex-col items-center pt-6 border-r border-gray-200 dark:border-zinc-800 z-50 bg-white dark:bg-black"
            >
                <Link href="/social" className="mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <span className="text-white text-xl font-bold">NH</span>
                    </div>
                </Link>

                <Stack gap="1" className="w-full px-2 flex-grow">
                    <NavIcon icon={IconHome} href="/social" active={pathname === "/social"} />
                    <NavIcon icon={IconSearch} href="/social/explore" active={pathname === "/social/explore"} />
                    <NavIcon icon={IconPlus} href="/social/create" active={pathname === "/social/create"} />
                    <NavIcon icon={IconMessage} href="/chat" active={pathname.startsWith("/chat")} />
                    <NavIcon icon={IconUsers} href="/social/friends" active={pathname === "/social/friends"} />
                    <NavIcon icon={IconHeart} href="/social/activity" active={pathname === "/social/activity"} />
                    <NavIcon icon={IconUser} href={myProfileHref} active={pathname.startsWith("/social/profile")} />
                </Stack>

                <Box className="pb-4">
                    <ActionIcon
                        variant="transparent"
                        size="lg"
                        radius="xl"
                        onClick={() => router.push("/admin/dashboard")}
                        title="Quay lại Portal"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <IconLayoutNavbar size={20} stroke={2} />
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
                        className="hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-600 dark:text-gray-400"
                    >
                        <IconChevronLeft size={24} stroke={2.5} />
                    </ActionIcon>

                    <Title order={3} className="text-xl font-black tracking-tighter text-gray-900 dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                        NH Social
                    </Title>

                    <UserMenu />
                </Container>
            </Box>

            {/* Main Content Area */}
            <Box className="flex-grow md:ml-[76px]">
                <Container size="sm" className="px-4 sm:px-6 py-4 sm:py-8 min-h-screen">
                    {children}
                </Container>
            </Box>

            {/* Mobile Bottom Tab Bar */}
            <Box
                hiddenFrom="md"
                className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-3xl border-t border-gray-100 dark:border-zinc-900 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]"
            >
                <Container size="sm" className="px-2 py-2">
                    <Group gap={4} grow wrap="nowrap">
                        <NavIcon icon={IconHome} href="/social" active={pathname === "/social"} />
                        <NavIcon icon={IconSearch} href="/social/explore" active={pathname === "/social/explore"} />
                        <NavIcon icon={IconPlus} href="/social/create" active={pathname === "/social/create"} />
                        <NavIcon icon={IconMessage} href="/chat" active={pathname.startsWith("/chat")} />
                        <NavIcon icon={IconUsers} href="/social/friends" active={pathname === "/social/friends"} />
                        <NavIcon icon={IconHeart} href="/social/activity" active={pathname === "/social/activity"} />
                        <NavIcon icon={IconUser} href={myProfileHref} active={pathname.startsWith("/social/profile")} />
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
