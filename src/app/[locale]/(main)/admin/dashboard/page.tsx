import { Container, Stack, Title, Text, Group, Button, SimpleGrid, Card, ThemeIcon, Badge, Avatar, rem, Progress, Box, Divider } from "@mantine/core";
import { IconUsers, IconBooks, IconAlertCircle, IconCheck, IconActivity, IconSettings, IconChartBar, IconBell, IconBuildingSkyscraper, IconNews, IconClipboardCheck, IconArrowRight, IconCalendarStats, IconFingerprint, IconChevronRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { AppQuery } from "@/api/AppQuery";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { Link } from "@/i18n/routing";
import { PMS_PATH } from "@/config/path";

export default function AdminDashboard() {
    const t = useTranslations("dashboard");
    const tCommon = useTranslations("common");
    const { data: statsData, isLoading } = AppQuery.status.useStats();

    const stats = [
        { title: "Học sinh", value: statsData?.totalStudents || 0, icon: IconUsers, color: "blue", trend: "+2.5%", description: "Tổng số học sinh hiện tại" },
        { title: "Giáo viên", value: statsData?.totalTeachers || 0, icon: IconClipboardCheck, color: "teal", trend: "+1.2%", description: "Đội ngũ cán bộ giảng dạy" },
        { title: "Tổ chức", value: statsData?.totalOrgs || 0, icon: IconBuildingSkyscraper, color: "indigo", trend: "+0.5%", description: "Phòng ban & Tổ chuyên môn" },
        { title: "Bài viết", value: statsData?.totalPosts || 0, icon: IconNews, color: "orange", trend: "+15%", description: "Tin tức & Thông báo mới" },
    ];

    if (isLoading) return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <SkeletonLoader type="cards" count={4} />
                <SimpleGrid cols={{ base: 1, md: 5 }} spacing="lg">
                    <Box style={{ gridColumn: 'span 1 / span 3' }}><SkeletonLoader type="table" /></Box>
                    <Box style={{ gridColumn: 'span 1 / span 2' }}><SkeletonLoader type="list" /></Box>
                </SimpleGrid>
            </Stack>
        </Container>
    );

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Stack gap={2}>
                        <Title order={1} fw={900} size="h2" className="tracking-tight">
                            Tổng quan Hệ thống
                        </Title>
                        <Text c="dimmed" size="sm" fw={500}>
                            Chào mừng bạn trở lại, đây là tình hình hoạt động của nhà trường hôm nay.
                        </Text>
                    </Stack>
                    <Group gap="sm">
                        <Button
                            variant="light"
                            color="indigo"
                            radius="xl"
                            leftSection={<IconCalendarStats size={18} />}
                            visibleFrom="sm"
                        >
                            Lịch học
                        </Button>
                        <Button
                            radius="xl"
                            className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100"
                            leftSection={<IconFingerprint size={18} />}
                        >
                            Bảo mật
                        </Button>
                    </Group>
                </header>

                <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="lg">
                    {stats.map((stat) => (
                        <Card key={stat.title} radius="24px" p="xl" withBorder className="border-zinc-100 hover:shadow-lg transition-all group overflow-hidden relative">
                            <Box className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform`} />

                            <Group justify="space-between" mb="lg">
                                <ThemeIcon
                                    size={48}
                                    radius="xl"
                                    variant="light"
                                    color={stat.color}
                                    className="shadow-sm"
                                >
                                    <stat.icon size={24} stroke={2} />
                                </ThemeIcon>
                                <Badge color={stat.color} variant="outline" size="sm" radius="xl" className="border-none bg-zinc-50 font-bold">
                                    {stat.trend}
                                </Badge>
                            </Group>

                            <Stack gap={2}>
                                <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={1}>
                                    {stat.title}
                                </Text>
                                <Text fw={900} size="xl" className="text-3xl tracking-tighter">
                                    {stat.value.toLocaleString()}
                                </Text>
                                <Text size="xs" c="dimmed" mt={4}>{stat.description}</Text>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, md: 5 }} spacing="lg">
                    <Card style={{ gridColumn: 'span 1 / span 3' }} radius="24px" p="xl" withBorder className="border-zinc-100">
                        <Group justify="space-between" mb="xl">
                            <Stack gap={4}>
                                <Title order={4} fw={800} size="h3">Tình trạng Phê duyệt</Title>
                                <Text size="sm" c="dimmed" fw={500}>Có {statsData?.pendingApprovals || 0} yêu cầu đang chờ xử lý</Text>
                            </Stack>
                            <ThemeIcon size={50} radius="xl" variant="filled" className="bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-200">
                                <IconChartBar size={24} />
                            </ThemeIcon>
                        </Group>

                        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt="md">
                            <Box className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                <Text size="xs" c="dimmed" fw={700} mb={8}>DỮ LIỆU</Text>
                                <Group justify="space-between" mb={4}>
                                    <Text fw={900} size="lg">99.9%</Text>
                                    <IconCheck size={16} color="green" />
                                </Group>
                                <Progress value={99.9} size="xs" color="green" radius="xl" />
                            </Box>
                            <Box className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                <Text size="xs" c="dimmed" fw={700} mb={8}>LƯU TRỮ</Text>
                                <Group justify="space-between" mb={4}>
                                    <Text fw={900} size="lg">45%</Text>
                                    <Text size="xs" c="dimmed">1.2TB</Text>
                                </Group>
                                <Progress value={45} size="xs" color="blue" radius="xl" />
                            </Box>
                            <Box className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                <Text size="xs" c="dimmed" fw={700} mb={8}>PHẢN HỒI API</Text>
                                <Group justify="space-between" mb={4}>
                                    <Text fw={900} size="lg">120ms</Text>
                                    <IconActivity size={16} color="indigo" />
                                </Group>
                                <Progress value={20} size="xs" color="indigo" radius="xl" />
                            </Box>
                        </SimpleGrid>

                        <Divider my="xl" className="border-zinc-100" />

                        <Group justify="space-between">
                            <Text size="sm" c="dimmed" fw={500}>
                                Hệ thống đang hoạt động trong ngưỡng an toàn.
                            </Text>
                            <Button
                                variant="light"
                                color="indigo"
                                radius="xl"
                                rightSection={<IconArrowRight size={14} />}
                                component={Link}
                                href={PMS_PATH.APPROVALS}
                            >
                                Xử lý phê duyệt
                            </Button>
                        </Group>
                    </Card>

                    <Card style={{ gridColumn: 'span 1 / span 2' }} radius="24px" p="xl" withBorder className="border-zinc-100">
                        <Group justify="space-between" mb="xl">
                            <Stack gap={4}>
                                <Title order={4} fw={800} size="h3">Thao tác nhanh</Title>
                                <Text size="sm" c="dimmed" fw={500}>Các tính năng thường dùng</Text>
                            </Stack>
                            <ThemeIcon size={40} radius="xl" variant="light" color="zinc">
                                <IconSettings size={20} />
                            </ThemeIcon>
                        </Group>

                        <Stack gap="sm">
                            <Button
                                justify="space-between"
                                fullWidth
                                radius="xl"
                                size="lg"
                                variant="light"
                                color="blue"
                                rightSection={<IconChevronRight size={18} />}
                                component={Link}
                                href={PMS_PATH.ACADEMIC.ROOT}
                                className="h-16 px-6"
                            >
                                <Group gap="md">
                                    <ThemeIcon radius="xl" color="blue"><IconBooks size={20} /></ThemeIcon>
                                    <Stack gap={0} align="flex-start">
                                        <Text size="sm" fw={700}>Quản lý Học vụ</Text>
                                        <Text size="xs" fw={500}>Năm học, lớp học & điểm số</Text>
                                    </Stack>
                                </Group>
                            </Button>

                            <Button
                                justify="space-between"
                                fullWidth
                                radius="xl"
                                size="lg"
                                variant="light"
                                color="indigo"
                                rightSection={<IconChevronRight size={18} />}
                                component={Link}
                                href={PMS_PATH.ORGANIZATIONS.ROOT}
                                className="h-16 px-6"
                            >
                                <Group gap="md">
                                    <ThemeIcon radius="xl" color="indigo"><IconBuildingSkyscraper size={20} /></ThemeIcon>
                                    <Stack gap={0} align="flex-start">
                                        <Text size="sm" fw={700}>Cơ cấu Tổ chức</Text>
                                        <Text size="xs" fw={500}>Phòng ban & nhân sự</Text>
                                    </Stack>
                                </Group>
                            </Button>

                            <Button
                                justify="space-between"
                                fullWidth
                                radius="xl"
                                size="lg"
                                variant="light"
                                color="orange"
                                rightSection={<IconChevronRight size={18} />}
                                component={Link}
                                href={PMS_PATH.PORTAL.POSTS}
                                className="h-16 px-6"
                            >
                                <Group gap="md">
                                    <ThemeIcon radius="xl" color="orange"><IconNews size={20} /></ThemeIcon>
                                    <Stack gap={0} align="flex-start">
                                        <Text size="sm" fw={700}>Cổng thông tin</Text>
                                        <Text size="xs" fw={500}>Tin tức, sự kiện & bài viết</Text>
                                    </Stack>
                                </Group>
                            </Button>
                        </Stack>
                    </Card>
                </SimpleGrid>
            </Stack>
        </Container>
    );
}


