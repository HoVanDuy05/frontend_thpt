"use client";

import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { ELoaiBaiViet } from "@/shared/types/portal.type";

export const usePostManager = (type?: ELoaiBaiViet) => {
    const { data: posts, isLoading } = AppQuery.portal.usePosts({ type });
    const mutation = AppMutation();

    const createMutation = mutation.portal.useCreatePost();
    const updateMutation = mutation.portal.useUpdatePost();
    const deleteMutation = mutation.portal.useDeletePost();

    const handleCreate = async (data: any) => {
        try {
            await createMutation.mutateAsync(data);
            notifications.show({
                title: "Thành công",
                message: "Đã tạo bài viết mới",
                color: "green",
            });
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể tạo bài viết",
                color: "red",
            });
        }
    };

    const handleUpdate = async (id: number, data: any) => {
        try {
            await updateMutation.mutateAsync({ ...data, id });
            notifications.show({
                title: "Thành công",
                message: "Đã cập nhật bài viết",
                color: "green",
            });
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể cập nhật bài viết",
                color: "red",
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMutation.mutateAsync({ id });
            notifications.show({
                title: "Thành công",
                message: "Đã xóa bài viết",
                color: "green",
            });
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể xóa bài viết",
                color: "red",
            });
        }
    };

    const handleExport = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/portal/posts/export`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("pms_token") || ""}` // Adjust based on how token is stored
                }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "danh-sach-bai-viet.xlsx";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể xuất file Excel",
                color: "red",
            });
        }
    };

    return {
        posts,
        isLoading,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleExport,
        isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    };
};
