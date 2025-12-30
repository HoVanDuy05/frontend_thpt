"use client";

import { PostForm } from "@/feauture/admin/portal/components/PostForm";
import { usePostManager } from "@/feauture/admin/portal/hooks/usePostManager";
import { useRouter } from "@/i18n/routing";
import { Container } from "@mantine/core";

export default function CreatePostPage() {
    const { handleCreate, isPending } = usePostManager();
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        await handleCreate(data);
        router.back();
    };

    return (
        <Container size="xl" p={{ base: "sm", sm: "md" }} className="max-w-full">
            <PostForm
                title="Tạo bài viết mới"
                onSubmit={handleSubmit}
                loading={isPending}
            />
        </Container>
    );
}
