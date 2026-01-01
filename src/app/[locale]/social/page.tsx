"use client";

import { ThreadFeed } from "@/feauture/social/components/ThreadFeed";
import { Box } from "@mantine/core";

export default function SocialPage() {
    return (
        <Box className="w-full">
            <ThreadFeed
                showCreatePost={true}
                createPostPlaceholder="Chia sẻ suy nghĩ của bạn..."
            />
        </Box>
    );
}
