"use client";

import { Modal, TextInput, Textarea, NumberInput, Switch, Button, Stack, Group, Paper, Divider, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { bannerSchema, TBannerSchema } from "../schemas/banner.schema";
import { TBanner } from "@/shared/types/portal.type";
import { useEffect } from "react";
import { FileUpload } from "@/shared/components/FileUpload";

interface BannerModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: TBannerSchema) => void;
    initialData?: TBanner | null;
    loading?: boolean;
}

export function BannerModal({ opened, onClose, onSubmit, initialData, loading }: BannerModalProps) {
    const form = useForm<TBannerSchema>({
        initialValues: {
            tieuDe: "",
            moTa: "",
            hinhAnh: "",
            lienKet: "",
            thuTu: 0,
            kichHoat: true,
        },
        validate: zodResolver(bannerSchema as any),
    });

    useEffect(() => {
        if (initialData) {
            form.setValues({
                tieuDe: initialData.tieuDe || "",
                moTa: initialData.moTa || "",
                hinhAnh: initialData.hinhAnh,
                lienKet: initialData.lienKet || "",
                thuTu: initialData.thuTu,
                kichHoat: initialData.kichHoat,
            });
        } else {
            form.reset();
        }
    }, [initialData, opened]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Stack gap={0}>
                    <Text fw={700} size="lg">{initialData ? "Chỉnh sửa Banner" : "Thêm Banner mới"}</Text>
                    <Text size="xs" c="dimmed">Cập nhật thông tin và hình ảnh hiển thị trên trang chủ</Text>
                </Stack>
            }
            size="lg"
            centered
            radius="lg"
            padding="xl"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack gap="xl">
                    <Paper withBorder p="md" radius="md" bg="zinc.0">
                        <FileUpload
                            label="Hình ảnh Banner"
                            value={form.values.hinhAnh}
                            onChange={(url) => form.setFieldValue("hinhAnh", url)}
                        />
                        <Text size="xs" c="dimmed" mt="xs" ta="center">
                            Khuyến nghị kích thước 1200x400px để có chất lượng tốt nhất
                        </Text>
                    </Paper>

                    <Stack gap="sm">
                        <Text fw={600} size="sm">Thông tin cơ bản</Text>
                        <TextInput
                            label="Tiêu đề"
                            placeholder="Nhập tiêu đề thu hút sự chú ý"
                            required
                            {...form.getInputProps("tieuDe")}
                        />
                        <Textarea
                            label="Mô tả"
                            placeholder="Nhập nội dung ngắn gọn về banner này"
                            minRows={3}
                            {...form.getInputProps("moTa")}
                        />
                    </Stack>

                    <Divider variant="dashed" />

                    <Stack gap="sm">
                        <Text fw={600} size="sm">Cấu hình hiển thị</Text>
                        <TextInput
                            label="Liên kết (URL)"
                            placeholder="https://truonghoc.edu.vn/tintuc/..."
                            {...form.getInputProps("lienKet")}
                        />
                        <Group grow align="flex-end">
                            <NumberInput
                                label="Thứ tự hiển thị"
                                description="Số nhỏ hơn sẽ hiển thị trước"
                                {...form.getInputProps("thuTu")}
                            />
                            <Paper withBorder p="xs" radius="md" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                <Switch
                                    label="Trạng thái kích hoạt"
                                    fw={500}
                                    {...form.getInputProps("kichHoat", { type: "checkbox" })}
                                />
                            </Paper>
                        </Group>
                    </Stack>

                    <Group justify="flex-end" mt="md">
                        <Button variant="subtle" onClick={onClose} color="gray" radius="md">Hủy bỏ</Button>
                        <Button type="submit" loading={loading} color="blue" radius="md" px="xl">
                            {initialData ? "Lưu thay đổi" : "Tạo Banner"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
