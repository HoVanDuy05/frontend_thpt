"use client";

import { TextInput, Textarea, Select, Switch, Button, Stack, Group, Paper, Title, Text, Grid, Box, ActionIcon, Space } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { postSchema, TPostSchema } from "../schemas/post.schema";
import { TBaiViet, ELoaiBaiViet } from "@/shared/types/portal.type";
import { useEffect } from "react";
import { FileUpload } from "@/shared/components/FileUpload";
import { useUnsavedChanges } from "@/shared/hooks/useUnsavedChanges";
import { useRouter } from "@/i18n/routing";
import { IconDeviceFloppy, IconArrowLeft, IconArticle, IconLink, IconBold, IconItalic, IconH1, IconList, IconCategory } from "@tabler/icons-react";

interface PostFormProps {
    initialData?: TBaiViet | null;
    onSubmit: (data: TPostSchema) => void;
    loading?: boolean;
    title: string;
}

export function PostForm({ initialData, onSubmit, loading, title }: PostFormProps) {
    const router = useRouter();

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
        validate: zodResolver(postSchema),
    });

    const { checkUnsavedChanges } = useUnsavedChanges(form.isDirty());

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
            form.resetDirty(initialData as any);
        }
    }, [initialData]);

    const handleCancel = () => {
        checkUnsavedChanges(() => router.back());
    };

    return (
        <Stack gap="xl" w="100%">
            {/* Header Actions */}
            <Group justify="space-between" align="center">
                <Button
                    variant="subtle"
                    color="gray"
                    leftSection={<IconArrowLeft size={18} />}
                    onClick={handleCancel}
                >
                    Quay lại
                </Button>

                <Group>
                    <Button variant="default" onClick={handleCancel}>
                        Hủy bỏ
                    </Button>
                    <Button
                        leftSection={<IconDeviceFloppy size={18} />}
                        loading={loading}
                        onClick={() => form.onSubmit(onSubmit)()}
                        color="blue"
                    >
                        Lưu bài viết
                    </Button>
                </Group>
            </Group>

            <form onSubmit={form.onSubmit(onSubmit)}>
                <Grid gutter="xl">
                    {/* Main Content - Left Column (8/12) */}
                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        <Stack gap="lg">
                            <Paper p="xl" radius="md" withBorder shadow="sm" className="relative overflow-hidden">
                                <Stack gap="md">
                                    <Title order={3}>{title}</Title>
                                    <TextInput
                                        label="Tiêu đề bài viết"
                                        placeholder="Nhập tiêu đề hấp dẫn..."
                                        size="lg"
                                        fw={500}
                                        variant="filled"
                                        required
                                        leftSection={<IconArticle size={20} className="text-gray-500" />}
                                        {...form.getInputProps("tieuDe")}
                                    />
                                    <TextInput
                                        label="Đường dẫn tĩnh (Slug)"
                                        description="Chuỗi định danh URL (SEO friendly)"
                                        placeholder="duong-dan-bai-viet"
                                        variant="filled"
                                        leftSection={<IconLink size={18} className="text-gray-500" />}
                                        {...form.getInputProps("duongDan")}
                                    />
                                    <Textarea
                                        label="Tóm tắt (Excerpt)"
                                        description="Đoạn văn ngắn hiển thị dưới tiêu đề trong danh sách"
                                        placeholder="Tóm tắt nội dung chính..."
                                        minRows={3}
                                        autosize
                                        variant="filled"
                                        {...form.getInputProps("tomTat")}
                                    />
                                </Stack>
                            </Paper>

                            <Paper radius="md" withBorder shadow="sm" className="overflow-hidden flex flex-col">
                                <Box className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 p-2 flex gap-1 items-center">
                                    <Text size="sm" fw={600} mr="xs" px="md">Nội dung</Text>
                                    {/* Mock Toolbar for Markdown */}
                                    <ActionIcon variant="subtle" color="gray" title="Bold"><IconBold size={16} /></ActionIcon>
                                    <ActionIcon variant="subtle" color="gray" title="Italic"><IconItalic size={16} /></ActionIcon>
                                    <ActionIcon variant="subtle" color="gray" title="Heading"><IconH1 size={16} /></ActionIcon>
                                    <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                                    <ActionIcon variant="subtle" color="gray" title="List"><IconList size={16} /></ActionIcon>
                                    <ActionIcon variant="subtle" color="gray" title="Link"><IconLink size={16} /></ActionIcon>
                                    <Space flex={1} />
                                    <Button size="xs" variant="subtle">Markdown Guide</Button>
                                </Box>
                                <Textarea
                                    placeholder="Viết nội dung bài viết ở đây (Hỗ trợ Markdown)..."
                                    required
                                    minRows={20}
                                    autosize
                                    variant="unstyled"
                                    className="p-4"
                                    styles={{ input: { fontFamily: 'monospace', fontSize: '15px' } }}
                                    {...form.getInputProps("noiDung")}
                                />
                            </Paper>
                        </Stack>
                    </Grid.Col>

                    {/* Sidebar - Right Column (4/12) */}
                    <Grid.Col span={{ base: 12, lg: 4 }}>
                        <Stack gap="lg">
                            {/* Publishing Status */}
                            <Paper p="md" radius="md" withBorder shadow="sm">
                                <Stack gap="xs">
                                    <Title order={5} mb="xs">Trạng thái</Title>
                                    <Box className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-md border border-gray-200 dark:border-gray-800">
                                        <Group justify="space-between">
                                            <Stack gap={0}>
                                                <Text size="sm" fw={600}>Hiển thị công khai</Text>
                                                <Text size="xs" c="dimmed">Bài viết sẽ hiển thị trên web</Text>
                                            </Stack>
                                            <Switch
                                                size="lg"
                                                {...form.getInputProps("daXuatBan", { type: "checkbox" })}
                                            />
                                        </Group>
                                    </Box>
                                </Stack>
                            </Paper>

                            {/* Organization */}
                            <Paper p="md" radius="md" withBorder shadow="sm">
                                <Stack gap="md">
                                    <Title order={5}>Phân loại</Title>
                                    <Select
                                        label="Chuyên mục"
                                        placeholder="Chọn chuyên mục"
                                        data={[
                                            { value: ELoaiBaiViet.TIN_TUC, label: "Tin tức" },
                                            { value: ELoaiBaiViet.SU_KIEN, label: "Sự kiện" },
                                            { value: ELoaiBaiViet.THONG_BAO_CHUNG, label: "Thông báo" },
                                        ]}
                                        allowDeselect={false}
                                        leftSection={<IconCategory size={18} />}
                                        {...form.getInputProps("loai")}
                                    />
                                </Stack>
                            </Paper>

                            {/* Thumbnail */}
                            <Paper p="md" radius="md" withBorder shadow="sm">
                                <Stack gap="md">
                                    <Title order={5}>Ảnh bìa</Title>
                                    <FileUpload
                                        value={form.values.anhBia || ""}
                                        onChange={(url) => form.setFieldValue("anhBia", url)}
                                        aspectRatio={16 / 9}
                                    />
                                    <Text size="xs" c="dimmed">Tỉ lệ khuyến nghị 16:9. Dung lượng tối đa 5MB.</Text>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </form>
        </Stack>
    );
}
