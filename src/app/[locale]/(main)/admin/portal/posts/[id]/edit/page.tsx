"use client";

import { PostForm } from "@/feauture/admin/portal/components/PostForm";
import { usePostManager } from "@/feauture/admin/portal/hooks/usePostManager";
import { useRouter } from "@/i18n/routing";
import { AppQuery } from "@/api/AppQuery";
import { LoadingOverlay, Center, Loader, Container } from "@mantine/core";
import { useParams } from "next/navigation";

export default function EditPostPage({ params }: { params: { id: string } }) {
    const { id } = useParams();

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
        <Container size="xl" p={{ base: "sm", sm: "md" }} className="max-w-full">
            <PostForm
                title="Chỉnh sửa bài viết"
                initialData={post}
                onSubmit={handleSubmit}
                loading={isPending}
            />
        </Container>
    );
}
