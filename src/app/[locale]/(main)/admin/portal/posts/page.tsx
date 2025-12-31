"use client";

import { Box, Button, Group, Title, Paper, Skeleton, Stack, Text, Tabs, ScrollArea, rem } from "@mantine/core";
import { usePostManager } from "@/feauture/admin/portal/hooks/usePostManager";
import { PostTable } from "@/feauture/admin/portal/components/PostTable";
import { useState } from "react";
import { TBaiViet, ELoaiBaiViet } from "@/shared/types/portal.type";
import { IconPlus, IconNews, IconAlertCircle, IconFileExport, IconCalendarEvent, IconBell } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { LayoutList } from "@/shared/components/LayoutList";
import { AppButton } from "@/shared/components/AppButton";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function PostPage() {
    const t = useTranslations("portal.posts");
    const tCommon = useTranslations("common");
    const [activeTab, setActiveTab] = useState<string | null>(ELoaiBaiViet.TIN_TUC);
    const { posts, isLoading, handleDelete, handleExport } = usePostManager(activeTab as ELoaiBaiViet);
    const router = useRouter();

    const handleCreate = () => {
        router.push("/admin/portal/posts/create");
    };

    const handleEdit = (post: TBaiViet) => {
        router.push(`/admin/portal/posts/${post.id}/edit`);
    };

    const confirmDelete = (id: number) => {
        modals.openConfirmModal({
            title: tCommon("delete_title"),
            centered: true,
            children: (
                <Text size="sm">
                    {tCommon("confirm_delete")}
                </Text>
            ),
            labels: { confirm: tCommon("actions.delete"), cancel: tCommon("actions.cancel") },
            confirmProps: { color: "red" },
            onConfirm: () => handleDelete(id),
        });
    };

    const PageActions = (
        <Group gap="sm" wrap="wrap">
            <AppButton
                variant="light"
                color="teal"
                leftSection={<IconFileExport size={18} />}
                onClick={handleExport}
                size="sm"
                visibleFrom="sm"
            >
                {t("export")}
            </AppButton>
            <AppButton
                leftSection={<IconPlus size={18} />}
                onClick={handleCreate}
                size="sm"
            >
                <span className="hidden sm:inline">{t("create")}</span>
                <span className="sm:hidden">{tCommon("actions.create")}</span>
            </AppButton>
        </Group>
    );

    return (
        <LayoutList
            title={t("title")}
            description={t("subtitle")}
            actions={PageActions}
        >
            <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
                <ScrollArea scrollbars="x" offsetScrollbars>
                    <Tabs.List
                        style={{
                            background: 'var(--mantine-color-default-hover)',
                            border: `${rem(1)} solid var(--mantine-color-default-border)`,
                        }}
                        className="p-1 rounded-lg inline-flex mb-4"
                    >
                        <Tabs.Tab
                            value={ELoaiBaiViet.TIN_TUC}
                            leftSection={<IconNews size={16} />}
                            px={{ base: "md", sm: "xl" }}
                        >
                            <span className="hidden sm:inline">{t("tabs.news")}</span>
                            <span className="sm:hidden">{t("tabs.news").substring(0, 3)}</span>
                        </Tabs.Tab>
                        <Tabs.Tab
                            value={ELoaiBaiViet.SU_KIEN}
                            leftSection={<IconCalendarEvent size={16} />}
                            px={{ base: "md", sm: "xl" }}
                        >
                            <span className="hidden sm:inline">{t("tabs.events")}</span>
                            <span className="sm:hidden">{t("tabs.events").substring(0, 2)}</span>
                        </Tabs.Tab>
                        <Tabs.Tab
                            value={ELoaiBaiViet.THONG_BAO_CHUNG}
                            leftSection={<IconBell size={16} />}
                            px={{ base: "md", sm: "xl" }}
                        >
                            <span className="hidden sm:inline">{t("tabs.notices")}</span>
                            <span className="sm:hidden">{t("tabs.notices").substring(0, 2)}</span>
                        </Tabs.Tab>
                    </Tabs.List>
                </ScrollArea>

                <Box>
                    {isLoading ? (
                        <Stack gap="md">
                            <Skeleton h={50} radius="md" />
                            <Skeleton h={50} radius="md" />
                            <Skeleton h={200} radius="md" />
                        </Stack>
                    ) : (posts && posts.length > 0) ? (
                        <PostTable
                            posts={posts}
                            onEdit={handleEdit}
                            onDelete={confirmDelete}
                        />
                    ) : (
                        <Stack align="center" py={100} gap="md">
                            <Box
                                style={{ background: 'var(--mantine-color-default-hover)' }}
                                className="p-8 rounded-full"
                            >
                                <IconAlertCircle size={48} className="text-[var(--mantine-color-dimmed)]" />
                            </Box>
                            <Text fw={500} c="dimmed">{t("no_data")}</Text>
                        </Stack>
                    )}
                </Box>
            </Tabs>
        </LayoutList>
    );
}
