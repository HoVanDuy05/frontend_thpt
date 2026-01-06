"use client";

import { Box } from "@mantine/core";
import { withAuth } from "@/shared/hocs/withAuth";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box className="h-screen bg-white dark:bg-black flex flex-col font-sans overflow-hidden">
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
