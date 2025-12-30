"use client";

import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";

export const useCommentManager = (postId: number) => {
    const { data: comments, isLoading, refetch } = AppQuery.portal.useComments(postId, {
        enabled: !!postId
    });
    const mutation = AppMutation();

    const createMutation = mutation.portal.useCreateComment();
    const deleteMutation = mutation.portal.useDeleteComment();

    const handleCreate = async (noiDung: string, binhLuanChaId?: number) => {
        try {
            await createMutation.mutateAsync({ baiVietId: postId, noiDung, binhLuanChaId });
            notifications.show({
                title: "Thành công",
                message: "Đã gửi bình luận",
                color: "green",
            });
            refetch();
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể gửi bình luận",
                color: "red",
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMutation.mutateAsync({ id });
            notifications.show({
                title: "Thành công",
                message: "Đã xóa bình luận",
                color: "green",
            });
            refetch();
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể xóa bình luận",
                color: "red",
            });
        }
    };

    return {
        comments,
        isLoading,
        handleCreate,
        handleDelete,
        isPending: createMutation.isPending || deleteMutation.isPending,
    };
};
