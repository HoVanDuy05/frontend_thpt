"use client";

import { AppQuery } from "@/api/AppQuery";
import { Link } from "@/i18n/routing";
import { ELoaiBaiViet, TBaiViet } from "@/shared/types/portal.type";
import { formatDate } from "@/shared/utils/date.util";
import { Badge, Box, Card, Container, Group, Stack, Text, Title, Skeleton, Button, ThemeIcon } from "@mantine/core";
import { IconArrowLeft, IconBell, IconCalendar } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export default function NotificationListPage() {
    const router = useRouter();
    const t = useTranslations("common"); // Fallback or use specific

    const { data: postsData, isLoading } = AppQuery.portal.usePosts({
        activeOnly: true,
        type: ELoaiBaiViet.THONG_BAO_CHUNG,
    });

    const notifications = postsData || [];

    return (
        <Container size="md" py="xl">
            <Button
                variant="subtle"
                color="gray"
                mb="lg"
                leftSection={<IconArrowLeft size={18} />}
                onClick={() => router.back()}
            >
                {t("actions.back")}
            </Button>

            <Group mb="xl">
                <ThemeIcon size={40} radius="md" color="blue" variant="light">
                    <IconBell size={24} />
                </ThemeIcon>
                <div>
                    <Title order={2}>Thông báo</Title>
                    <Text c="dimmed">Cập nhật tin tức và thông báo mới nhất</Text>
                </div>
            </Group>

            {isLoading ? (
                <Stack>
                    <Skeleton height={100} radius="md" />
                    <Skeleton height={100} radius="md" />
                    <Skeleton height={100} radius="md" />
                </Stack>
            ) : notifications.length > 0 ? (
                <Stack gap="md">
                    {notifications.map((item: TBaiViet) => (
                        <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder component={Link} href={`/notifications/${item.duongDan}`} className="hover:shadow-md transition-shadow">
                            <Group justify="space-between" align="start" mb="xs">
                                <Badge color="blue" variant="light">Thông báo</Badge>
                                <Group gap={6}>
                                    <IconCalendar size={16} className="text-gray-500" />
                                    <Text size="xs" c="dimmed">
                                        {item.ngayTao ? formatDate(item.ngayTao) : ""}
                                    </Text>
                                </Group>
                            </Group>

                            <Title order={4} className="mb-2 text-blue-900 group-hover:text-blue-700">
                                {item.tieuDe}
                            </Title>

                            <Text size="sm" c="dimmed" lineClamp={3}>
                                {item.tomTat || "Xem chi tiết nội dung thông báo..."}
                            </Text>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Card withBorder radius="md" p="xl" className="text-center bg-gray-50">
                    <Text c="dimmed">Chưa có thông báo nào</Text>
                </Card>
            )}
        </Container>
    );
}
