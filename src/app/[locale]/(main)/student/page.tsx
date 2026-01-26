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
  Progress,
  RingProgress,
  ThemeIcon,
  Tooltip,
  Button,
  Center,
} from "@mantine/core";
import {
  IconBook,
  IconChevronRight,
  IconClock,
  IconCircleCheck,
  IconCalendarEvent,
  IconBell,
  IconMapPin,
  IconUser,
  IconChartBar,
} from "@tabler/icons-react";
import { Link } from "@/i18n/routing";
import { dayjs } from "@/shared/utils/date.util";
import { useTranslations } from "next-intl";
import { AppQuery } from "@/api/AppQuery";
import { ELoaiBaiViet } from "@/shared/types/portal.type";
import { NotificationSlider } from "./components/NotificationSlider";
import { useState, useEffect, useMemo } from "react";

export default function StudentHome() {
  const { user } = useAppStore();
  const t = useTranslations("student.home");
  const [now, setNow] = useState(dayjs());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real schedule data for today
  const { data: scheduleData, isLoading: isLoadingSchedule } = AppQuery.calendar.useMySchedule({
    from: dayjs().startOf('day').format("YYYY-MM-DD"),
    to: dayjs().endOf('day').format("YYYY-MM-DD")
  });

  // Fetch notifications
  const { data: postsData, isLoading: isLoadingNotifications } = AppQuery.portal.usePosts({
    activeOnly: true,
    type: ELoaiBaiViet.THONG_BAO_CHUNG,
  });
  const notifications = postsData || [];

  // Filter today's classes
  const todayClasses = useMemo(() => {
    if (!scheduleData) return [];
    const dow = dayjs().day() === 0 ? 8 : dayjs().day() + 1;
    return scheduleData
      .filter((item: any) => {
        if (item.ngay) return dayjs(item.ngay).isSame(dayjs(), 'day');
        return item.thu === dow;
      })
      .sort((a: any, b: any) => a.tietBatDau - b.tietBatDau);
  }, [scheduleData]);

  // Attendance Fake Data Calculation
  const totalPeriods = todayClasses.length > 0 ? todayClasses.length : 4;
  const attendedPeriods = todayClasses.length > 0 ? todayClasses.length : 4; // Fake all present
  const attendanceProgress = (attendedPeriods / totalPeriods) * 100;

  // Mock assignments
  const assignments = [
    { id: 1, subject: "Toán", title: "Bài tập chương 3", due: "2026-01-28", status: "pending", color: "blue" },
    { id: 2, subject: "Văn", title: "Luận văn học kỳ", due: "2026-01-30", status: "pending", color: "pink" },
  ];

  const getTimeRange = (tietBatDau: number, soTiet: number) => {
    const periods = [
      { start: '07:00', end: '07:45' },
      { start: '07:50', end: '08:35' },
      { start: '08:40', end: '09:25' },
      { start: '09:40', end: '10:25' },
      { start: '10:30', end: '11:15' },
      { start: '13:00', end: '13:45' },
      { start: '13:50', end: '14:35' },
      { start: '14:40', end: '15:25' },
      { start: '15:40', end: '16:25' },
      { start: '16:30', end: '17:15' },
    ];
    const startPeriod = periods[tietBatDau - 1];
    const endPeriod = periods[tietBatDau + (soTiet || 1) - 2];
    if (!startPeriod || !endPeriod) return { start: '--:--', end: '--:--' };
    return { start: startPeriod.start, end: endPeriod.end };
  };

  return (
    <Container size="xl" className="py-6">
      <Stack gap="xl">
        {/* Dashboard Panels */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          {/* Academic Attendance Panel (Integrated Header) */}
          <Card padding="xl" radius="lg" className="bg-gradient-to-br from-indigo-700 to-blue-900 text-white relative overflow-hidden h-full min-h-[350px] shadow-xl">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <Stack gap="xl" className="relative z-10 h-full justify-between">
              <div>
                {/* Integrated User Header & Clock */}
                <Group justify="space-between" align="flex-start" mb="xl">
                  <Group gap="md">
                    <Avatar
                      src={user?.avatar}
                      size={54}
                      radius="xl"
                      className="border-2 border-white/20 shadow-xl"
                    />
                    <div>
                      <Text size="xs" c="indigo.1" fw={700} tt="uppercase" lts={1.2}>
                        {t("greeting")} 👋
                      </Text>
                      <Title order={3} className="text-2xl font-black tracking-tight text-white mb-0">
                        {user?.hoTen || user?.taiKhoan}
                      </Title>
                    </div>
                  </Group>
                  <Box ta="right">
                    <Text fw={900} size="32px" className="tracking-tighter leading-none text-white shadow-sm">
                      {now.format("HH:mm")}
                    </Text>
                    <Text size="11px" c="indigo.1" fw={800} tt="uppercase" lts={0.5} mt={4}>
                      {now.format("dddd, DD/MM")}
                    </Text>
                  </Box>
                </Group>

                <Group gap="xl" className="py-4" align="center">
                  <RingProgress
                    size={140}
                    thickness={12}
                    roundCaps
                    sections={[{ value: attendanceProgress, color: 'white' }]}
                    label={
                      <Center>
                        <Stack gap={0} align="center">
                          <Text fw={900} size="26px" c="white" className="leading-none">{attendedPeriods}/{totalPeriods}</Text>
                          <Text size="10px" c="white/60" tt="uppercase" fw={800}>{t("attended_classes")}</Text>
                        </Stack>
                      </Center>
                    }
                  />
                  <Stack gap="md" flex={1}>
                    <div>
                      <Text size="11px" c="indigo.1" fw={800} tt="uppercase" lts={1} mb={4}>{t("attendance_status")}</Text>
                      <Text fw={900} size="22px" className="tracking-tight text-white">
                        {attendanceProgress === 100 ? t("status_all_present") : t("status_partial", { count: totalPeriods - attendedPeriods })}
                      </Text>
                    </div>
                    <Group gap={6}>
                      {Array.from({ length: totalPeriods }).map((_, i) => (
                        <Tooltip key={i} label={`Tiết ${i + 1}`}>
                          <Box
                            className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${i < attendedPeriods ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'bg-white/10'}`}
                          />
                        </Tooltip>
                      ))}
                    </Group>
                  </Stack>
                </Group>
              </div>

              <Paper p="md" radius="lg" className="bg-white/10 border-0 backdrop-blur-xl group cursor-pointer hover:bg-white/15 transition-all">
                <Group justify="space-between" align="center">
                  <Stack gap={0}>
                    <Text size="10px" c="gray.6" fw={800} tt="uppercase" lts={1}>{t("classes_today")}</Text>
                    <Text fw={800} size="lg" c="dark.9">{totalPeriods} môn học</Text>
                  </Stack>
                  <ActionIcon variant="transparent" color="gray.6" size="lg" component={Link} href="/student/schedule">
                    <IconChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </ActionIcon>
                </Group>
              </Paper>
            </Stack>
          </Card>

          {/* Notifications Panel */}
          <div className="h-full min-h-[320px]">
            {isLoadingNotifications ? (
              <Skeleton height="100%" radius="lg" />
            ) : (
              <NotificationSlider notifications={notifications} />
            )}
          </div>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="xl">
          {/* Today's Schedule */}
          <Card withBorder radius="lg" padding="xl" className="lg:col-span-2 shadow-sm">
            <Group justify="space-between" className="mb-6">
              <Group gap="xs">
                <IconCalendarEvent size={24} className="text-indigo-600" />
                <Title order={4} className="font-extrabold text-xl">
                  {t("today_schedule")}
                </Title>
              </Group>
              <Button
                variant="subtle"
                color="indigo"
                radius="xl"
                component={Link}
                href="/student/schedule"
                rightSection={<IconChevronRight size={16} />}
              >
                {t("view_all")}
              </Button>
            </Group>

            {isLoadingSchedule ? (
              <Stack gap="md">
                <Skeleton height={80} radius="md" />
                <Skeleton height={80} radius="md" />
                <Skeleton height={80} radius="md" />
              </Stack>
            ) : todayClasses.length > 0 ? (
              <Stack gap="md">
                {todayClasses.map((cls: any) => {
                  const time = getTimeRange(cls.tietBatDau, cls.soTiet);
                  return (
                    <Card key={cls.id} padding="md" radius="md" withBorder className="hover:border-indigo-200 transition-colors">
                      <Group justify="space-between">
                        <Group gap="md">
                          <ThemeIcon size={46} radius="md" variant="light" color="indigo" className="bg-indigo-50 dark:bg-indigo-900/30">
                            <IconBook size={24} />
                          </ThemeIcon>
                          <div>
                            <Text fw={800} size="md">
                              {cls.monHoc?.tenMon}
                            </Text>
                            <Group gap="xs">
                              <Group gap={4}>
                                <IconUser size={14} className="text-gray-400" />
                                <Text size="xs" c="dimmed">{cls.gvDay?.hoTen || 'Giao viên tự do'}</Text>
                              </Group>
                              <Text size="xs" c="dimmed">•</Text>
                              <Group gap={4}>
                                <IconMapPin size={14} className="text-gray-400" />
                                <Text size="xs" c="dimmed">{cls.phongHoc || 'Sân trường'}</Text>
                              </Group>
                            </Group>
                          </div>
                        </Group>
                        <Badge variant="dot" color="indigo" className="h-10 px-4 text-xs font-bold bg-indigo-50/50 border-none">
                          Tiết {cls.tietBatDau} • {time.start} - {time.end}
                        </Badge>
                      </Group>
                    </Card>
                  );
                })}
              </Stack>
            ) : (
              <Center className="py-12 border-2 border-dashed border-gray-100 rounded-xl">
                <Stack align="center" gap="xs" className="opacity-40">
                  <IconCalendarEvent size={48} stroke={1.5} />
                  <Text fw={600}>Hôm nay bạn không có lịch học</Text>
                </Stack>
              </Center>
            )}
          </Card>

          {/* Upcoming Assignments */}
          <Card withBorder radius="lg" padding="xl" className="shadow-sm">
            <Group justify="space-between" className="mb-6">
              <Group gap="xs">
                <IconCircleCheck size={24} className="text-orange-500" />
                <Title order={4} className="font-extrabold text-xl">
                  {t("upcoming_assignments")}
                </Title>
              </Group>
            </Group>

            <Stack gap="md">
              {assignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  padding="md"
                  radius="md"
                  className={`bg-${assignment.color}-50/30 dark:bg-${assignment.color}-900/10 border-l-4 border-l-${assignment.color}-500 transition-transform hover:-translate-y-1 cursor-pointer`}
                >
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Badge size="xs" variant="filled" color={assignment.color}>
                        {assignment.subject}
                      </Badge>
                      <Text size="xs" c="dimmed" fw={700}>
                        {dayjs(assignment.due).fromNow()}
                      </Text>
                    </Group>
                    <Text fw={800} size="sm">
                      {assignment.title}
                    </Text>
                    <Group gap={4}>
                      <IconClock size={12} className="text-gray-400" />
                      <Text size="xs" c="dimmed" fw={500}>
                        {t("due_date", { date: dayjs(assignment.due).format("DD/MM/YYYY") })}
                      </Text>
                    </Group>
                  </Stack>
                </Card>
              ))}

              <Button
                fullWidth
                variant="light"
                color="indigo"
                radius="md"
                mt="xs"
                component={Link}
                href="/student/grades"
              >
                Xem tất cả bài tập
              </Button>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
