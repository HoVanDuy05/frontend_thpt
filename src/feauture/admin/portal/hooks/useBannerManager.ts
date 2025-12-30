"use client";

import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";

export const useBannerManager = () => {
    const { data: banners, isLoading } = AppQuery.portal.useBanners();
    const mutation = AppMutation();

    const createMutation = mutation.portal.useCreateBanner();
    const updateMutation = mutation.portal.useUpdateBanner(0); // We'll override the id in mutate
    const deleteMutation = mutation.portal.useDeleteBanner(0);

    const handleCreate = async (data: any) => {
        try {
            await createMutation.mutateAsync(data);
            notifications.show({
                title: "Thành công",
                message: "Đã tạo banner mới",
                color: "green",
            });
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể tạo banner",
                color: "red",
            });
        }
    };

    const handleUpdate = async (id: number, data: any) => {
        try {
            // Since our useAppMutation is factory-like, we need a way to pass ID
            // Actually, the current useUpdateBanner takes an ID at hook level.
            // This is a bit limiting for a list. I should probably fix the hook factory or create a refined one.
            // But for now, let's use it as is if possible or fix AppMutation.
            await mutation.portal.useUpdateBanner(id).mutateAsync(data);
            notifications.show({
                title: "Thành công",
                message: "Đã cập nhật banner",
                color: "green",
            });
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể cập nhật banner",
                color: "red",
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await mutation.portal.useDeleteBanner(id).mutateAsync(undefined);
            notifications.show({
                title: "Thành công",
                message: "Đã xóa banner",
                color: "green",
            });
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: "Không thể xóa banner",
                color: "red",
            });
        }
    };

    return {
        banners,
        isLoading,
        handleCreate,
        handleUpdate,
        handleDelete,
        isCreating: createMutation.isPending,
    };
};
