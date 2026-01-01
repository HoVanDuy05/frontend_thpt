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
  Progress,
  SimpleGrid,
  Box,
  ActionIcon,
} from "@mantine/core";
import {
  IconCalendar,
  IconTrophy,
  IconBell,
  IconBook,
  IconChevronRight,
  IconClock,
  IconCircleCheck,
} from "@tabler/icons-react";
import { Link } from "@/i18n/routing";
import { dayjs } from "@/shared/utils/date.util";
import { useTranslations } from "next-intl";

export default function StudentHome() {
  const { user } = useAppStore();
  const t = useTranslations("student.home");

  // Mock data - replace with real API calls
  const stats = {
    attendance: 95,
    gpa: 8.5,
    assignments: 3,
    notifications: 5,
  };

  const upcomingClasses = [
    { id: 1, subject: "Toán học", time: "08:00", room: "A101", teacher: "Nguyễn Văn A" },
    { id: 2, subject: "Văn học", time: "09:45", room: "B203", teacher: "Trần Thị B" },
    { id: 3, subject: "Tiếng Anh", time: "13:30", room: "C105", teacher: "Lê Văn C" },
  ];

  const recentAnnouncements = [
    { id: 1, title: "Thông báo nghỉ lễ 30/4", time: "2 giờ trước", type: "important" },
    { id: 2, title: "Lịch thi giữa kỳ", time: "5 giờ trước", type: "exam" },
    { id: 3, title: "Hoạt động ngoại khóa", time: "1 ngày trước", type: "event" },
  ];

  const assignments = [
    { id: 1, subject: "Toán", title: "Bài tập chương 3", due: "2026-01-05", status: "pending" },
    { id: 2, subject: "Văn", title: "Luận văn học", due: "2026-01-08", status: "pending" },
  ];

  return (
    <Container size="lg" className="py-4">
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

        {/* Quick Stats */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs">
          <Card padding="md" radius="lg" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <Stack gap="xs">
              <IconCalendar size={24} />
              <div>
                <Text size="xl" fw={900}>
                  {stats.attendance}%
                </Text>
                <Text size="xs" opacity={0.9}>
                  {t("attendance")}
                </Text>
              </div>
            </Stack>
          </Card>

          <Card padding="md" radius="lg" className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <Stack gap="xs">
              <IconTrophy size={24} />
              <div>
                <Text size="xl" fw={900}>
                  {stats.gpa}
                </Text>
                <Text size="xs" opacity={0.9}>
                  {t("gpa")}
                </Text>
              </div>
            </Stack>
          </Card>

          <Card padding="md" radius="lg" className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <Stack gap="xs">
              <IconBook size={24} />
              <div>
                <Text size="xl" fw={900}>
                  {stats.assignments}
                </Text>
                <Text size="xs" opacity={0.9}>
                  {t("assignments")}
                </Text>
              </div>
            </Stack>
          </Card>

          <Card padding="md" radius="lg" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <Stack gap="xs">
              <IconBell size={24} />
              <div>
                <Text size="xl" fw={900}>
                  {stats.notifications}
                </Text>
                <Text size="xs" opacity={0.9}>
                  {t("notifications")}
                </Text>
              </div>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Today's Schedule */}
        <Card withBorder radius="lg" padding="lg">
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

        {/* Recent Announcements */}
        <Card withBorder radius="lg" padding="lg">
          <Title order={4} className="font-bold mb-3">
            {t("new_announcements")}
          </Title>

          <Stack gap="xs">
            {recentAnnouncements.map((announcement) => (
              <Card key={announcement.id} padding="sm" radius="md" className="bg-gray-50 dark:bg-zinc-900">
                <Group justify="space-between">
                  <div className="flex-1">
                    <Text fw={600} size="sm">
                      {announcement.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {announcement.time}
                    </Text>
                  </div>
                  <Badge
                    size="sm"
                    variant="light"
                    color={
                      announcement.type === "important"
                        ? "red"
                        : announcement.type === "exam"
                          ? "orange"
                          : "blue"
                    }
                  >
                    {announcement.type === "important"
                      ? t("important")
                      : announcement.type === "exam"
                        ? t("exam")
                        : t("event")}
                  </Badge>
                </Group>
              </Card>
            ))}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
