"use client";

import { FriendRequests } from "@/feauture/social/components/FriendRequests";
import { Box } from "@mantine/core";

export default function FriendRequestsPage() {
    return (
        <Box className="w-full">
            <FriendRequests />
        </Box>
    );
}
