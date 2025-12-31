import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

export const useUserManager = (role: string) => { // 'HOC_SINH' | 'GIAO_VIEN' | 'NHAN_VIEN'
    const { data: users, isLoading, refetch } = AppQuery.user.useList({ role });

    const mutation = AppMutation();
    const createStudent = mutation.user.useCreateStudent();
    const createTeacher = mutation.user.useCreateTeacher();
    const createUser = mutation.user.useCreateUser();

    // Fallback or generic update/delete
    const updateMutation = mutation.user.useUpdate(0); // id is passed dynamically usually, hook might need refactor if it static
    // Wait, AppMutation definition for update takes id? 
    // user: { useUpdate: (id: number) => ... }
    // calling mutation.user.useUpdate(0) returns the mutation object.

    // Actually AppMutation definitions:
    // useUpdate: (id: number) => useAppMutation...
    // This is weird design if I can't reuse it for different IDs. 
    // Usually standard React Query useMutation doesn't take params at hook level if params vary.
    // However, looking at AppMutation.ts:
    // useUpdate: (id: number) => useAppMutation<"updateUser">({ url: { baseUrl: "/users/:id", urlParams: { id } }, ... })
    // This means I need to call the hook with an ID. But I don't know the ID yet.
    // This design of AppMutation is problematic for generic tables.
    // BUT, useAppMutation implementation (Step 395) merges payload urlParams!
    // Line 30: merge urlParams from definition AND payload.
    // So if I pass id=0 to hook, but pass { urlParams: { id: 5 } } to mutate(), it might work if useAppMutation logic supports it.
    // Line 32: ...(url as any)?.urlParams
    // Line 33: ...((payload as any)?.urlParams || {})
    // So yes, I can override ID in payload.

    const genericUpdate = mutation.user.useUpdate(0);
    const genericDelete = mutation.user.useDelete(0);

    const handleCreate = async (data: any) => {
        const payload = { ...data, vaiTro: role };
        let activeMutation;

        switch (role) {
            case 'HOC_SINH':
                activeMutation = createStudent;
                break;
            case 'GIAO_VIEN':
                activeMutation = createTeacher;
                break;
            default:
                activeMutation = createUser;
                break;
        }

        return new Promise((resolve, reject) => {
            activeMutation.mutate(payload, {
                onSuccess: () => {
                    notifications.show({ title: 'Thành công', message: 'Tạo tài khoản thành công', color: 'green' });
                    refetch();
                    resolve(true);
                },
                onError: (e: any) => {
                    notifications.show({ title: 'Thất bại', message: e.message || 'Có lỗi xảy ra', color: 'red' });
                    reject(e);
                }
            });
        });
    };

    const handleUpdate = async (id: number, data: any) => {
        return new Promise((resolve, reject) => {
            (genericUpdate.mutate as any)({ ...data, urlParams: { id } }, {
                onSuccess: () => {
                    notifications.show({ title: 'Thành công', message: 'Cập nhật thành công', color: 'green' });
                    refetch();
                    resolve(true);
                },
                onError: (e: any) => {
                    notifications.show({ title: 'Thất bại', message: e.message || 'Có lỗi xảy ra', color: 'red' });
                    reject(e);
                }
            });
        });
    }

    const handleDelete = async (id: number) => {
        (genericDelete.mutate as any)({ urlParams: { id } }, {
            onSuccess: () => {
                notifications.show({ title: 'Thành công', message: 'Xóa tài khoản thành công', color: 'green' });
                refetch();
            }
        });
    }

    return {
        users,
        isLoading,
        handleCreateStudent: handleCreate, // Generic alias
        handleUpdate,
        handleDelete,
        isCreating: createStudent.isPending || createTeacher.isPending || createUser.isPending,
        isUpdating: genericUpdate.isPending
    };
};
