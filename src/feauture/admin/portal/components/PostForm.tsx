"use client";

import { TextInput, Textarea, Select, MultiSelect, Switch, Button, Stack, Group, Paper, Title, Text, Grid, Box, ActionIcon, Space, rem } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useTranslations } from "next-intl";
import { postSchema, TPostSchema } from "../schemas/post.schema";
import { TBaiViet, ELoaiBaiViet } from "@/shared/types/portal.type";
import { useEffect } from "react";
import { FileUpload } from "@/shared/components/FileUpload";
import { useUnsavedChanges } from "@/shared/hooks/useUnsavedChanges";
import { useRouter } from "@/i18n/routing";
import { IconDeviceFloppy, IconArrowLeft, IconArticle, IconLink, IconBold, IconItalic, IconH1, IconList, IconCategory, IconRefresh } from "@tabler/icons-react";

interface PostFormProps {
    initialData?: TBaiViet | null;
    onSubmit: (data: TPostSchema) => void;
    loading?: boolean;
    title: string;
}

// Helper function to generate slug from Vietnamese text
function generateSlug(text: string): string {
    // Vietnamese character map
    const vietnameseMap: Record<string, string> = {
        'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
        'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
        'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
        'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
        'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
        'đ': 'd',
        'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
        'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
        'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
        'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
        'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
        'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
        'Đ': 'D'
    };

    let slug = text.toLowerCase();

    // Replace Vietnamese characters
    for (const [key, value] of Object.entries(vietnameseMap)) {
        slug = slug.replace(new RegExp(key, 'g'), value);
    }

    // Replace spaces and special characters with hyphens
    slug = slug
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');

    return slug;
}

export function PostForm({ initialData, onSubmit, loading, title }: PostFormProps) {
    const router = useRouter();
    const t = useTranslations("portal.posts.form");
    const tCommon = useTranslations("common");

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
                doiTuong: initialData.doiTuong || [],
            });
            form.resetDirty(initialData as any);
        }
    }, [initialData]);

    // Auto-generate slug when title changes (only if slug is empty or matches previous title's slug)
    useEffect(() => {
        if (form.values.tieuDe && !initialData) {
            const newSlug = generateSlug(form.values.tieuDe);
            form.setFieldValue("duongDan", newSlug);
        }
    }, [form.values.tieuDe]);

    const handleGenerateSlug = () => {
        if (form.values.tieuDe) {
            const newSlug = generateSlug(form.values.tieuDe);
            form.setFieldValue("duongDan", newSlug);
        }
    };

    const handleCancel = () => {
        checkUnsavedChanges(() => router.back());
    };

    return (
        <Stack gap="lg" w="100%" className="max-w-full">
            {/* Header Actions */}
            <Group justify="space-between" align="center" wrap="wrap" gap="sm" px={{ base: "md", sm: 0 }}>
                <Button
                    variant="subtle"
                    color="gray"
                    leftSection={<IconArrowLeft size={18} />}
                    onClick={handleCancel}
                    size="sm"
                >
                    {tCommon("actions.back")}
                </Button>

                <Group gap="sm">
                    <Button variant="default" onClick={handleCancel} size="sm">
                        {tCommon("actions.cancel")}
                    </Button>
                    <Button
                        leftSection={<IconDeviceFloppy size={18} />}
                        loading={loading}
                        onClick={() => form.onSubmit(onSubmit)()}
                        color="blue"
                        size="sm"
                    >
                        {tCommon("actions.save")}
                    </Button>
                </Group>
            </Group>

            <form onSubmit={form.onSubmit(onSubmit)}>
                <Grid gutter={{ base: "md", lg: "xl" }}>
                    {/* Main Content - Left Column */}
                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        <Stack gap="lg">
                            <Paper p={{ base: "md", sm: "xl" }} radius="md" withBorder shadow="sm">
                                <Stack gap="md">
                                    <Title order={3} className="text-lg sm:text-xl">{title}</Title>
                                    <TextInput
                                        label={t("title_label")}
                                        placeholder={t("title_placeholder")}
                                        size="md"
                                        fw={500}
                                        variant="filled"
                                        required
                                        leftSection={<IconArticle size={20} className="text-[var(--mantine-color-dimmed)]" />}
                                        {...form.getInputProps("tieuDe")}
                                    />
                                    <TextInput
                                        label={t("slug_label")}
                                        description={t("slug_description")}
                                        placeholder="duong-dan-bai-viet"
                                        variant="filled"
                                        leftSection={<IconLink size={18} className="text-[var(--mantine-color-dimmed)]" />}
                                        rightSection={
                                            <ActionIcon
                                                variant="subtle"
                                                color="blue"
                                                onClick={handleGenerateSlug}
                                                title="Tạo lại slug từ tiêu đề"
                                            >
                                                <IconRefresh size={16} />
                                            </ActionIcon>
                                        }
                                        {...form.getInputProps("duongDan")}
                                    />
                                    <Textarea
                                        label={t("excerpt_label")}
                                        description={t("excerpt_description")}
                                        placeholder="Tóm tắt nội dung chính..."
                                        minRows={3}
                                        autosize
                                        variant="filled"
                                        {...form.getInputProps("tomTat")}
                                    />
                                </Stack>
                            </Paper>

                            <Paper radius="md" withBorder shadow="sm" className="overflow-hidden">
                                <Box
                                    style={{
                                        borderBottom: `${rem(1)} solid var(--mantine-color-default-border)`,
                                        background: 'var(--mantine-color-default-hover)'
                                    }}
                                    className="p-2 flex gap-1 items-center flex-wrap"
                                >
                                    <Text size="sm" fw={600} mr="xs" px={{ base: "xs", sm: "md" }}>{t("content_label")}</Text>
                                    {/* Mock Toolbar for Markdown */}
                                    <Group gap={4} visibleFrom="sm">
                                        <ActionIcon variant="subtle" color="gray" title="Bold"><IconBold size={16} /></ActionIcon>
                                        <ActionIcon variant="subtle" color="gray" title="Italic"><IconItalic size={16} /></ActionIcon>
                                        <ActionIcon variant="subtle" color="gray" title="Heading"><IconH1 size={16} /></ActionIcon>
                                        <div className="w-[1px] h-4 bg-[var(--mantine-color-default-border)] mx-1" />
                                        <ActionIcon variant="subtle" color="gray" title="List"><IconList size={16} /></ActionIcon>
                                        <ActionIcon variant="subtle" color="gray" title="Link"><IconLink size={16} /></ActionIcon>
                                    </Group>
                                    <Space flex={1} />
                                    <Button size="xs" variant="subtle" hiddenFrom="sm">HN</Button>
                                    <Button size="xs" variant="subtle" visibleFrom="sm">Markdown Guide</Button>
                                </Box>
                                <Textarea
                                    placeholder={t("content_placeholder")}
                                    required
                                    minRows={15}
                                    autosize
                                    variant="unstyled"
                                    className="p-4"
                                    styles={{ input: { fontFamily: 'monospace', fontSize: '14px' } }}
                                    {...form.getInputProps("noiDung")}
                                />
                            </Paper>
                        </Stack>
                    </Grid.Col>

                    {/* Sidebar - Right Column */}
                    <Grid.Col span={{ base: 12, lg: 4 }}>
                        <Stack gap="lg">
                            {/* Publishing Status */}
                            <Paper p="md" radius="md" withBorder shadow="sm">
                                <Stack gap="xs">
                                    <Title order={5} mb="xs">{t("status_label")}</Title>
                                    <Box
                                        style={{
                                            background: 'var(--mantine-color-default-hover)',
                                            border: `${rem(1)} solid var(--mantine-color-default-border)`
                                        }}
                                        className="p-3 rounded-md"
                                    >
                                        <Group justify="space-between" wrap="nowrap">
                                            <Stack gap={0} className="flex-1 min-w-0">
                                                <Text size="sm" fw={600}>{t("publish_label")}</Text>
                                                <Text size="xs" c="dimmed">{t("publish_description")}</Text>
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
                                    <Title order={5}>{t("category_label")}</Title>
                                    <Select
                                        label={t("category_label")}
                                        placeholder={tCommon("actions.filter")}
                                        data={[
                                            { value: ELoaiBaiViet.TIN_TUC, label: "Tin tức" },
                                            { value: ELoaiBaiViet.SU_KIEN, label: "Sự kiện" },
                                            { value: ELoaiBaiViet.THONG_BAO_CHUNG, label: "Thông báo" },
                                        ]}
                                        allowDeselect={false}
                                        leftSection={<IconCategory size={18} />}
                                        {...form.getInputProps("loai")}
                                    />

                                    {form.values.loai === ELoaiBaiViet.THONG_BAO_CHUNG && (
                                        <MultiSelect
                                            label={t("target_audience_label") || "Đối tượng nhận"}
                                            placeholder="Chọn đối tượng (Để trống = Tất cả)"
                                            data={[
                                                { value: "HOC_SINH", label: "Học sinh" },
                                                { value: "GIAO_VIEN", label: "Giáo viên" },
                                                { value: "NHAN_VIEN", label: "Nhân viên" },
                                                { value: "PHU_HUYNH", label: "Phụ huynh" },
                                            ]}
                                            clearable
                                            searchable
                                            hidePickedOptions
                                            {...form.getInputProps("doiTuong")}
                                        />
                                    )}
                                </Stack>
                            </Paper>

                            {/* Thumbnail */}
                            <Paper p="md" radius="md" withBorder shadow="sm">
                                <Stack gap="md">
                                    <Title order={5}>{t("thumbnail_label")}</Title>
                                    <FileUpload
                                        value={form.values.anhBia || ""}
                                        onChange={(url) => form.setFieldValue("anhBia", url)}
                                        aspectRatio={16 / 9}
                                    />
                                    <Text size="xs" c="dimmed">{t("thumbnail_description")}</Text>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </form>
        </Stack >
    );
}
