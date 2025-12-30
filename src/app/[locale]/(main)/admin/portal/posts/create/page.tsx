"use client";

import { PostForm } from "@/feauture/admin/portal/components/PostForm";
import { usePostManager } from "@/feauture/admin/portal/hooks/usePostManager";
import { useRouter } from "@/i18n/routing";

export default function CreatePostPage() {
    const { handleCreate, isPending } = usePostManager();
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        await handleCreate(data);
        router.back();
    };

    return (
        <PostForm
            title="Tạo bài viết mới"
            onSubmit={handleSubmit}
            loading={isPending}
        />
    );
}
