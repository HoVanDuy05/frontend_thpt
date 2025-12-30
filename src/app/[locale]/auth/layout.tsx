import { Center, Box, Stack } from "@mantine/core";
import { AuthHeader } from "@/shared/components/layout/AuthHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 relative">
            <AuthHeader />
            <Center className="flex-1 pt-20">
                <Box w={400} p="xl" bg="white" className="dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl">
                    {children}
                </Box>
            </Center>
        </Box>
    );
}
