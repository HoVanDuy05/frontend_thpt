"use client";

import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { UserRole } from "@/shared/types/user.type";
import { useSearchParams } from "next/navigation";

export const useUserManager = (role?: UserRole) => {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    // Query parameters
    const params = {
        page,
        limit,
        filters: role ? { vaiTro: role, content: search } : { content: search },
    };

    const { data: users, isLoading, refetch } = AppQuery.user.useList(params);
    const mutation = AppMutation();

    const createStudentMutation = mutation.user.useCreateStudent();
    const createTeacherMutation = mutation.user.useCreateTeacher();
    const updateUserMutation = mutation.user.useUpdate;
    const deleteUserMutation = mutation.user.useDelete;

    const handleCreateStudent = async (data: any) => {
        try {
            await createStudentMutation.mutateAsync(data);
            notifications.show({ title: "Thành công", message: "Đã tạo học sinh mới", color: "green" });
            refetch();
        } catch (error) {
            notifications.show({ title: "Lỗi", message: "Không thể tạo học sinh", color: "red" });
        }
    };

    const handleCreateTeacher = async (data: any) => {
        try {
            await createTeacherMutation.mutateAsync(data);
            notifications.show({ title: "Thành công", message: "Đã tạo giáo viên mới", color: "green" });
            refetch();
        } catch (error) {
            notifications.show({ title: "Lỗi", message: "Không thể tạo giáo viên", color: "red" });
        }
    };

    const handleUpdate = async (id: number, data: any) => {
        if (!id) return;
        try {
            await updateUserMutation(id).mutateAsync(data);
            notifications.show({ title: "Thành công", message: "Đã cập nhật thông tin", color: "green" });
            refetch();
        } catch (error) {
            notifications.show({ title: "Lỗi", message: "Không thể cập nhật", color: "red" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteUserMutation(id).mutateAsync(undefined);
            notifications.show({ title: "Thành công", message: "Đã xóa người dùng", color: "green" });
            refetch();
        } catch (error) {
            notifications.show({ title: "Lỗi", message: "Không thể xóa người dùng", color: "red" });
        }
    };

    return {
        users,
        isLoading,
        handleCreateStudent,
        handleCreateTeacher,
        handleUpdate,
        handleDelete,
        refetch,
        isCreating: createStudentMutation.isPending || createTeacherMutation.isPending,
    };
};
