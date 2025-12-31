"use client";

import { Box, Title, Stack, Text, ActionIcon, Container } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "@/i18n/routing";
import { CreateThread } from "@/feauture/social/components/CreateThread";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";

export default function CreateThreadPage() {
    const router = useRouter();
    const createThread = AppMutation().social.useCreateThread();

    const handlePost = (content: string, image?: string) => {
        createThread.mutate({ noiDung: content, hinhAnh: image }, {
            onSuccess: () => {
                notifications.show({
                    title: "Thành công",
                    message: "Bài viết của bạn đã được đăng tải",
                    color: "teal",
                });
                router.push("/social");
            },
            onError: () => {
                notifications.show({
                    title: "Lỗi",
                    message: "Không thể đăng bài viết. Vui lòng thử lại.",
                    color: "red",
                });
            }
        });
    };

    return (
        <Stack gap="xl">
            <Box className="flex items-center gap-4">
                <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => router.back()}
                    className="hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                    <IconChevronLeft size={24} />
                </ActionIcon>
                <Title order={2} className="text-2xl font-black tracking-tight">New thread</Title>
            </Box>

            <Box className="border border-gray-100 dark:border-zinc-800 rounded-3xl p-2 bg-gray-50/30 dark:bg-zinc-900/10">
                <CreateThread onPost={handlePost} loading={createThread.isPending} />
            </Box>
        </Stack>
    );
}
