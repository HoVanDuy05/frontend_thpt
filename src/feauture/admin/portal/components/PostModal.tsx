"use client";

import { Modal, TextInput, Textarea, Select, Switch, Button, Stack, Group, Checkbox } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { postSchema, TPostSchema } from "../schemas/post.schema";
import { TBaiViet, ELoaiBaiViet } from "@/shared/types/portal.type";
import { useEffect } from "react";
import { FileUpload } from "@/shared/components/FileUpload";

interface PostModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: TPostSchema) => void;
    initialData?: TBaiViet | null;
    loading?: boolean;
}

export function PostModal({ opened, onClose, onSubmit, initialData, loading }: PostModalProps) {
    const form = useForm<TPostSchema>({
        initialValues: {
            tieuDe: "",
            duongDan: "",
            noiDung: "",
            tomTat: "",
            anhBia: "",
            loai: ELoaiBaiViet.TIN_TUC,
            daXuatBan: true,
        },
        validate: zodResolver(postSchema as any),
    });

    useEffect(() => {
        if (initialData) {
            form.setValues({
                tieuDe: initialData.tieuDe,
                duongDan: initialData.duongDan,
                noiDung: initialData.noiDung,
                tomTat: initialData.tomTat || "",
                anhBia: initialData.anhBia || "",
                loai: initialData.loai,
                daXuatBan: initialData.daXuatBan,
            });
        } else {
            form.reset();
        }
    }, [initialData, opened]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={initialData ? "Chỉnh sửa Bài viết" : "Tạo Bài viết mới"}
            size="xl"
            centered
            radius="md"
        >
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack gap="md">
                    <Group grow>
                        <TextInput
                            label="Tiêu đề"
                            placeholder="Nhập tiêu đề bài viết"
                            required
                            {...form.getInputProps("tieuDe")}
                        />
                        <Select
                            label="Loại bài viết"
                            data={[
                                { value: ELoaiBaiViet.TIN_TUC, label: "Tin tức" },
                                { value: ELoaiBaiViet.SU_KIEN, label: "Sự kiện" },
                                { value: ELoaiBaiViet.THONG_BAO_CHUNG, label: "Thông báo" },
                            ]}
                            {...form.getInputProps("loai")}
                        />
                    </Group>

                    <TextInput
                        label="Đường dẫn (Slug)"
                        placeholder="để trống để tự động tạo"
                        {...form.getInputProps("duongDan")}
                    />

                    <FileUpload
                        label="Hình ảnh bài viết"
                        value={form.values.anhBia || ""}
                        onChange={(url) => form.setFieldValue("anhBia", url)}
                    />

                    <Textarea
                        label="Tóm tắt"
                        placeholder="Mô tả ngắn gọn"
                        rows={2}
                        {...form.getInputProps("tomTat")}
                    />

                    <Textarea
                        label="Nội dung"
                        placeholder="Nội dung chi tiết bài viết..."
                        required
                        minRows={10}
                        {...form.getInputProps("noiDung")}
                    />

                    <Group gap="xl">
                        <Switch
                            label="Xuất bản ngay"
                            {...form.getInputProps("daXuatBan", { type: "checkbox" })}
                        />
                    </Group>

                    <Group justify="flex-end" mt="xl">
                        <Button variant="subtle" onClick={onClose} color="gray">Hủy</Button>
                        <Button type="submit" loading={loading} color="blue">
                            {initialData ? "Cập nhật" : "Tạo bài viết"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
