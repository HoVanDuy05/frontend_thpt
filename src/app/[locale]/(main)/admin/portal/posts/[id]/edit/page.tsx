"use client";

import { PostForm } from "@/feauture/admin/portal/components/PostForm";
import { usePostManager } from "@/feauture/admin/portal/hooks/usePostManager";
import { useRouter } from "@/i18n/routing";
import { AppQuery } from "@/api/AppQuery";
import { LoadingOverlay, Center, Loader } from "@mantine/core";
import { useParams } from "next/navigation"; // useParams from navigation is fine for client component params

export default function EditPostPage({ params }: { params: { id: string } }) {
    // Note: params.id might be a string, or you can use useParams() hook. 
    // The component prop `params` is standard in Next 13+ page files.
    // However, since we are inside `[id]`, extracting it safely:
    const { id } = useParams();

    // We need to fetch details. We can reuse useDetail hook if available or use raw query here.
    // Added usePostDetail to AppQuery previously.
    const { data: post, isLoading } = AppQuery.portal.usePostDetail(Number(id), {
        enabled: !!id
    });

    const { handleUpdate, isPending } = usePostManager();
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        await handleUpdate(Number(id), data);
        router.back();
    };

    if (isLoading) {
        return <Center h={400}><Loader /></Center>;
    }

    return (
        <PostForm
            title="Chỉnh sửa bài viết"
            initialData={post}
            onSubmit={handleSubmit}
            loading={isPending}
        />
    );
}
