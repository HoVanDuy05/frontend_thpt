
import { Box, Group, Skeleton, Stack } from "@mantine/core";

export const ChatListSkeleton = () => {
    return (
        <Stack gap={2}>
            {Array.from({ length: 6 }).map((_, i) => (
                <Box key={i} className="px-2 py-3">
                    <Group wrap="nowrap" gap="md">
                        <Skeleton height={56} width={56} circle radius="xl" />
                        <div style={{ flex: 1 }}>
                            <Skeleton height={16} width="60%" mb={6} radius="xl" />
                            <Skeleton height={12} width="40%" radius="xl" />
                        </div>
                    </Group>
                </Box>
            ))}
        </Stack>
    );
};
