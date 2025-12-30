import { Center, Box, Stack, Title, Text, Container } from "@mantine/core";
import { AuthHeader } from "@/shared/components/layout/AuthHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

            <AuthHeader />

            <Center className="flex-1 px-4 relative z-10">
                <Box w={440} p={0} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-8 md:p-10">
                        {children}
                    </div>
                </Box>
            </Center>

            <div className="absolute bottom-6 w-full text-center">
                <Text size="xs" c="dimmed">
                    &copy; 2025 Hệ thống Quản lý Trường học. Bản quyền thuộc về Antigravity Team.
                </Text>
            </div>
        </Box>
    );
}
