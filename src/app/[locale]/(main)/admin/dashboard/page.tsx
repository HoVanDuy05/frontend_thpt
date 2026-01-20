import { Container, Stack, Title, Text, Group, Button, SimpleGrid, Card, ThemeIcon, Badge, Avatar, rem, Progress } from "@mantine/core";
import { IconUsers, IconBooks, IconAlertCircle, IconCheck, IconActivity, IconSettings, IconChartBar, IconBell } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function AdminDashboard() {
    const t = useTranslations("dashboard");
    const tCommon = useTranslations("common");

    const stats = [
        { title: t("stats.total_students"), value: "1,234", icon: IconUsers, color: "blue", trend: "+12%" },
        { title: t("stats.active_courses"), value: "45", icon: IconBooks, color: "green", trend: "+5%" },
        { title: t("stats.pending_requests"), value: "12", icon: IconAlertCircle, color: "orange", trend: "-2%" },
        { title: t("stats.total_teachers"), value: "89", icon: IconCheck, color: "teal", trend: "+18%" },
    ];

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Stack gap={4}>
                        <Title order={1} fw={800} size="h2">
                            {t("title")}
                        </Title>
                        <Text c="dimmed" size="sm">
                            {t("subtitle")}
                        </Text>
                    </Stack>
                    <Group gap="sm">
                        <Button variant="light" leftSection={<IconActivity size={18} />} visibleFrom="sm">
                            Hệ thống
                        </Button>
                        <Button leftSection={<IconSettings size={18} />}>
                            {tCommon("actions.save")}
                        </Button>
                    </Group>
                </header>

                <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="lg">
                    {stats.map((stat) => (
                        <Card key={stat.title} radius="md" p="lg" withBorder>
                            <Group justify="space-between" mb="xs">
                                <ThemeIcon
                                    size="lg"
                                    radius="md"
                                    variant="light"
                                    color={stat.color}
                                >
                                    <stat.icon size={20} stroke={2} />
                                </ThemeIcon>
                                <Badge color={stat.color} variant="filled" size="sm" radius="sm">
                                    {stat.trend}
                                </Badge>
                            </Group>

                            <Stack gap={0}>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={1}>
                                    {stat.title}
                                </Text>
                                <Text fw={900} size="xl" style={{ fontSize: rem(24) }}>
                                    {stat.value}
                                </Text>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, md: 5 }} spacing="lg">
                    <Card style={{ gridColumn: 'span 1 / span 3' }} radius="md" p="xl">
                        <Group justify="space-between" mb="xl">
                            <Stack gap={0}>
                                <Title order={4} fw={700}>{t("health.title")}</Title>
                                <Text size="sm" c="dimmed">{t("health.subtitle")}</Text>
                            </Stack>
                            <ThemeIcon size="xl" radius="xl" variant="filled" color="indigo">
                                <IconChartBar size={24} />
                            </ThemeIcon>
                        </Group>

                        <SimpleGrid cols={3} spacing="xl" mt="md">
                            <Stack gap={4}>
                                <Text size="xs" c="dimmed" fw={600}>DATABASE</Text>
                                <Text fw={700}>99.9%</Text>
                                <Progress value={99.9} size="xs" color="green" />
                            </Stack>
                            <Stack gap={4}>
                                <Text size="xs" c="dimmed" fw={600}>STORAGE</Text>
                                <Text fw={700}>45%</Text>
                                <Progress value={45} size="xs" color="blue" />
                            </Stack>
                            <Stack gap={4}>
                                <Text size="xs" c="dimmed" fw={600}>API LATENCY</Text>
                                <Text fw={700}>120ms</Text>
                                <Progress value={20} size="xs" color="indigo" />
                            </Stack>
                        </SimpleGrid>

                        <Text size="sm" mt="xl" c="dimmed">
                            {t("health.normal")}
                        </Text>

                        <Button variant="outline" mt="xl" fullWidth radius="md">
                            {t("health.detailed_report")}
                        </Button>
                    </Card>

                    <Card style={{ gridColumn: 'span 1 / span 2' }} radius="md" p="xl">
                        <Group justify="space-between" mb="xl">
                            <Title order={4} fw={700}>{t("recent_activity.title")}</Title>
                            <IconBell size={20} className="text-[var(--mantine-color-dimmed)]" />
                        </Group>

                        <Stack gap="lg">
                            {[
                                { user: "GV. Nguyễn Văn A", action: "đã tạo khóa học mới 'React nâng cao'", time: "2 phút trước" },
                                { user: "HS. Trần Thị B", action: "đã đăng ký vào lớp 'Toán học 10'", time: "15 phút trước" },
                                { user: "Hệ thống", action: "đã hoàn tất sao lưu dữ liệu tự động", time: "1 giờ trước" },
                                { user: "GV. Lê Văn C", action: "đã đăng bài viết mới trên cổng thông tin", time: "3 giờ trước" },
                            ].map((item, i) => (
                                <Group key={i} gap="sm" wrap="nowrap" align="flex-start">
                                    <Avatar size="sm" radius="xl" color="indigo" variant="light">
                                        {item.user.charAt(0)}
                                    </Avatar>
                                    <div style={{ flex: 1 }}>
                                        <Text size="sm" fw={600} className="leading-tight">
                                            {item.user}
                                        </Text>
                                        <Text size="xs" c="dimmed" className="leading-tight mt-0.5">
                                            {item.action}
                                        </Text>
                                        <Text size="xs" c="indigo" fw={500} mt={4}>
                                            {item.time}
                                        </Text>
                                    </div>
                                </Group>
                            ))}
                        </Stack>
                    </Card>
                </SimpleGrid>
            </Stack>
        </Container>
    );
}


