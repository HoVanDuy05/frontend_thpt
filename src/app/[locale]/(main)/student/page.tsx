"use client";

import { useAppStore } from "@/providers/store/useAppStore";
import {
  Container,
  Stack,
  Text,
  Title,
  Card,
  Badge,
  Group,
  Avatar,
  SimpleGrid,
  ActionIcon,
  Skeleton,
  Box,
  Paper,
} from "@mantine/core";
import {
  IconBook,
  IconChevronRight,
  IconClock,
  IconCircleCheck,
} from "@tabler/icons-react";
import { Link } from "@/i18n/routing";
import { dayjs } from "@/shared/utils/date.util";
import { useTranslations } from "next-intl";
import { AppQuery } from "@/api/AppQuery";
import { ELoaiBaiViet } from "@/shared/types/portal.type";
import { NotificationSlider } from "./components/NotificationSlider";

export default function StudentHome() {
  const { user } = useAppStore();
  const t = useTranslations("student.home");

  const { data: postsData, isLoading: isLoadingNotifications } = AppQuery.portal.usePosts({
    activeOnly: true,
    type: ELoaiBaiViet.THONG_BAO_CHUNG,
  });
  const notifications = postsData || [];

  // Mock data - replace with real API calls
  const upcomingClasses = [
    { id: 1, subject: "Toán học", time: "08:00", room: "A101", teacher: "Nguyễn Văn A" },
    { id: 2, subject: "Văn học", time: "09:45", room: "B203", teacher: "Trần Thị B" },
    { id: 3, subject: "Tiếng Anh", time: "13:30", room: "C105", teacher: "Lê Văn C" },
  ];

  const assignments = [
    { id: 1, subject: "Toán", title: "Bài tập chương 3", due: "2026-01-05", status: "pending" },
    { id: 2, subject: "Văn", title: "Luận văn học", due: "2026-01-08", status: "pending" },
  ];

  return (
    <Container size="xl" className="py-4">
      <Stack gap="lg">
        {/* Welcome Section */}
        <Box>
          <Group gap="sm" className="mb-2">
            <Avatar
              src={user?.avatar}
              size="lg"
              radius="xl"
              className="border-2 border-indigo-600"
            />
            <div>
              <Text size="sm" c="dimmed" fw={500}>
                {t("greeting")} 👋
              </Text>
              <Title order={3} className="font-black">
                {user?.hoTen || user?.taiKhoan}
              </Title>
            </div>
          </Group>
          <Text size="sm" c="dimmed">
            {dayjs().format("dddd, DD MMMM YYYY")}
          </Text>
        </Box>

        {/* Dashboard Panels */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {/* Check in/out Panel */}
          <Card padding="lg" radius="lg" className="bg-blue-900 text-white relative overflow-hidden h-full min-h-[300px]">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <Stack gap="xl" className="relative z-10 h-full justify-between">
              <div>
                <Group justify="space-between" mb="lg">
                  <Group gap="xs">
                    <IconClock size={24} className="text-blue-200" />
                    <Text fw={700} size="xl">Thời gian điểm danh</Text>
                  </Group>
                  <Badge variant="filled" color="blue" size="lg" className="bg-blue-800">Hôm nay</Badge>
                </Group>

                <Group gap="xl" justify="center" className="py-6">
                  <Paper p="md" radius="md" className="bg-white/10 backdrop-blur-sm border border-white/20 flex-1 text-center">
                    <Text size="sm" c="blue.1" fw={600} mb={4} tt="uppercase">Giờ vào</Text>
                    <Text fw={800} size="xl" className="text-3xl">07:30</Text>
                  </Paper>
                  <div className="h-[2px] w-8 bg-white/20" />
                  <Paper p="md" radius="md" className="bg-white/10 backdrop-blur-sm border border-white/20 flex-1 text-center">
                    <Text size="sm" c="blue.1" fw={600} mb={4} tt="uppercase">Giờ ra</Text>
                    <Text fw={800} size="xl" className="text-3xl">17:00</Text>
                  </Paper>
                </Group>
              </div>

              <Paper p="md" radius="md" className="bg-black/20 border border-white/10">
                <Group justify="space-between" align="center">
                  <Stack gap={2}>
                    <Text size="xs" c="blue.1" fw={600} tt="uppercase">Tổng giờ làm việc</Text>
                    <Text fw={700} size="xl">8.5 giờ</Text>
                  </Stack>
                  <div className="w-[1px] h-8 bg-white/20" />
                  <Stack gap={2}>
                    <Text size="xs" c="blue.1" fw={600} tt="uppercase">Trạng thái</Text>
                    <Text fw={700} size="xl" c="green.3">Đúng giờ</Text>
                  </Stack>
                </Group>
              </Paper>
            </Stack>
          </Card>

          {/* Notifications Panel */}
          <div className="h-[300px]">
            {isLoadingNotifications ? (
              <Skeleton height="100%" radius="lg" />
            ) : (
              <NotificationSlider notifications={notifications} />
            )}
          </div>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {/* Today's Schedule - Span 2 cols */}
          <Card withBorder radius="lg" padding="lg" className="md:col-span-2">
            <Group justify="space-between" className="mb-3">
              <Title order={4} className="font-bold">
                {t("today_schedule")}
              </Title>
              <Link href="/student/schedule" className="no-underline">
                <ActionIcon variant="subtle" color="indigo">
                  <IconChevronRight size={18} />
                </ActionIcon>
              </Link>
            </Group>

            <Stack gap="xs">
              {upcomingClasses.map((cls) => (
                <Card key={cls.id} padding="sm" radius="md" className="bg-gray-50 dark:bg-zinc-900">
                  <Group justify="space-between">
                    <Group gap="sm">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <IconBook size={20} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <Text fw={600} size="sm">
                          {cls.subject}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {cls.teacher} • {cls.room}
                        </Text>
                      </div>
                    </Group>
                    <Badge variant="light" color="indigo" leftSection={<IconClock size={12} />}>
                      {cls.time}
                    </Badge>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Card>

          {/* Assignments */}
          <Card withBorder radius="lg" padding="lg">
            <Group justify="space-between" className="mb-3">
              <Title order={4} className="font-bold">
                {t("upcoming_assignments")}
              </Title>
              <Link href="/student/grades" className="no-underline">
                <ActionIcon variant="subtle" color="indigo">
                  <IconChevronRight size={18} />
                </ActionIcon>
              </Link>
            </Group>

            <Stack gap="xs">
              {assignments.map((assignment) => (
                <Card key={assignment.id} padding="sm" radius="md" className="bg-gray-50 dark:bg-zinc-900">
                  <Group justify="space-between">
                    <div className="flex-1">
                      <Group gap="xs" className="mb-1">
                        <Badge size="xs" variant="dot" color="orange">
                          {assignment.subject}
                        </Badge>
                      </Group>
                      <Text fw={600} size="sm">
                        {assignment.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {t("due_date", { date: dayjs(assignment.due).format("DD/MM/YYYY") })}
                      </Text>
                    </div>
                    <ActionIcon variant="light" color="orange" size="lg" radius="xl">
                      <IconCircleCheck size={20} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
