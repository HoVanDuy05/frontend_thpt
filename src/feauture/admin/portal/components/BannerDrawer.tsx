"use client";

import { Drawer, TextInput, Textarea, NumberInput, Switch, Button, Stack, Group, Paper, Divider, Text, ScrollArea, Box } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { bannerSchema, TBannerSchema } from "../schemas/banner.schema";
import { TBanner } from "@/shared/types/portal.type";
import { useEffect } from "react";
import { FileUpload } from "@/shared/components/FileUpload";
import { IconPhoto, IconDeviceFloppy, IconX } from "@tabler/icons-react";

interface BannerDrawerProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: TBannerSchema) => void;
    initialData?: TBanner | null;
    loading?: boolean;
}

export function BannerDrawer({ opened, onClose, onSubmit, initialData, loading }: BannerDrawerProps) {
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
        <Drawer
            opened={opened}
            onClose={onClose}
            position="right"
            size="md"
            title={
                <Stack gap={0}>
                    <Text fw={800} size="xl" className="tracking-tight">
                        {initialData ? "Chỉnh sửa Banner" : "Thêm Banner mới"}
                    </Text>
                    <Text size="xs" c="dimmed" fw={500}>Cấu hình thông tin hình ảnh trang chủ</Text>
                </Stack>
            }
            padding="xl"
            styles={{
                header: { borderBottom: '1px solid var(--mantine-color-gray-2)', marginBottom: '0', paddingBottom: '16px' },
                body: { padding: 0 }
            }}
            scrollAreaComponent={ScrollArea.Autosize}
        >
            <form onSubmit={form.onSubmit(onSubmit)} className="h-[calc(100vh-80px)] flex flex-col">
                <ScrollArea className="flex-1 px-8 py-8">
                    <Stack gap="xl">
                        {/* Image Selection Section */}
                        <Box>
                            <Group gap="xs" mb="sm">
                                <IconPhoto size={20} className="text-blue-600" />
                                <Text fw={700} size="sm" tt="uppercase" lts="0.5px">Hình ảnh hiển thị</Text>
                            </Group>
                            <Paper withBorder p="md" radius="lg" className="bg-zinc-50/50 dark:bg-zinc-900/50 border-dashed border-2">
                                <FileUpload
                                    label=""
                                    value={form.values.hinhAnh}
                                    onChange={(url) => form.setFieldValue("hinhAnh", url)}
                                />
                                <Text size="xs" c="dimmed" mt="xs" ta="center" fw={500}>
                                    Ưu tiên ảnh ngang (ví dụ: 1920x600px)
                                </Text>
                            </Paper>
                        </Box>

                        <Divider variant="dashed" />

                        {/* Content Section */}
                        <Stack gap="lg">
                            <Text fw={700} size="sm" tt="uppercase" lts="0.5px">Thông tin chi tiết</Text>

                            <TextInput
                                label="Tiêu đề banner"
                                placeholder="Nhập tiêu đề hiển thị trên banner..."
                                required
                                size="md"
                                radius="md"
                                {...form.getInputProps("tieuDe")}
                            />

                            <Textarea
                                label="Mô tả ngắn"
                                placeholder="Nội dung giới thiệu chi tiết cho banner này..."
                                minRows={4}
                                size="md"
                                radius="md"
                                {...form.getInputProps("moTa")}
                            />

                            <TextInput
                                label="Đường dẫn liên kết"
                                placeholder="https://example.com/target-page"
                                size="md"
                                radius="md"
                                {...form.getInputProps("lienKet")}
                            />
                        </Stack>

                        <Divider variant="dashed" />

                        {/* Settings Section */}
                        <Stack gap="lg" mb="xl">
                            <Text fw={700} size="sm" tt="uppercase" lts="0.5px">Cài đặt vận hành</Text>

                            <Group grow align="flex-end">
                                <NumberInput
                                    label="Thứ tự hiển thị"
                                    description="Số nhỏ sẽ được ưu tiên trước"
                                    min={0}
                                    size="md"
                                    radius="md"
                                    {...form.getInputProps("thuTu")}
                                />

                                <Paper withBorder p="md" radius="md" className="h-[54px] flex items-center justify-between border-blue-100 bg-blue-50/20 dark:bg-blue-900/10">
                                    <Text size="sm" fw={700}>Kích hoạt</Text>
                                    <Switch
                                        size="md"
                                        {...form.getInputProps("kichHoat", { type: "checkbox" })}
                                    />
                                </Paper>
                            </Group>
                        </Stack>
                    </Stack>
                </ScrollArea>

                <Box p="xl" className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <Group grow gap="md">
                        <Button
                            variant="light"
                            color="gray"
                            size="lg"
                            radius="xl"
                            onClick={onClose}
                            leftSection={<IconX size={18} />}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            radius="xl"
                            color="blue"
                            loading={loading}
                            leftSection={<IconDeviceFloppy size={18} />}
                            className="shadow-lg shadow-blue-500/20"
                        >
                            {initialData ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </Group>
                </Box>
            </form>
        </Drawer>
    );
}
