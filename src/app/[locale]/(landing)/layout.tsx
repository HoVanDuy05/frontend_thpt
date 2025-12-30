import { LandingHeader } from "@/shared/components/layout/LandingHeader";
import { Box } from "@mantine/core";

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <LandingHeader />
            <Box component="main" className="flex-1">
                {children}
            </Box>
        </Box>
    );
}
