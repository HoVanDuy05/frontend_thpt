"use client";

import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { useTranslationError } from "@/shared/common/useTranslationError";
import { IconCheck, IconX } from "@tabler/icons-react";
import { createElement } from "react";

export const useBannerManager = () => {
    const { data: banners, isLoading } = AppQuery.portal.useBanners();
    const mutation = AppMutation();
    const translateError = useTranslationError();

    const createMutation = mutation.portal.useCreateBanner();
    const updateMutation = mutation.portal.useUpdateBanner();
    const deleteMutation = mutation.portal.useDeleteBanner();

    const handleCreate = async (data: any) => {
        try {
            await createMutation.mutateAsync(data);
            notifications.show({
                title: "Thành công",
                message: "Đã tạo banner mới",
                color: "teal",
                icon: <IconCheck size={16} />,
            });
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: translateError(error),
                color: "red",
                icon: <IconX size={16} />,
            });
        }
    };

    const handleUpdate = async (id: number, data: any) => {
        try {
            await updateMutation.mutateAsync({ ...data, id });
            notifications.show({
                title: "Thành công",
                message: "Đã cập nhật banner",
                color: "teal",
                icon: <IconCheck size={16} />,
            });
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: translateError(error),
                color: "red",
                icon: <IconX size={16} />,
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMutation.mutateAsync({ id });
            notifications.show({
                title: "Thành công",
                message: "Đã xóa banner",
                color: "teal",
                icon: <IconCheck size={16} />,
            });
        } catch (error) {
            notifications.show({
                title: "Lỗi",
                message: translateError(error),
                color: "red",
                icon: <IconX size={16} />,
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
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
