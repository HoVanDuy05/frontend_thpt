"use client";

import { useAppStore } from "@/providers/store/useAppStore";
import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
  Card,
  Badge,
  ActionIcon,
  useMantineColorScheme
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSun, IconMoon, IconRocket, IconUser } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export default function Home() {
  const { user, setUser } = useAppStore();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const { data: serverStatus, isLoading } = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { status: "Online", version: "1.0.0" };
    },
  });

  const handleNotify = () => {
    notifications.show({
      title: "Hello from Mantine!",
      message: "This notification confirms @mantine/notifications is working. 🚀",
      color: "blue",
    });
  };

  const handleLogin = () => {
    setUser({
      id: 1,
      taiKhoan: "admin",
      email: "admin@pms.com",
      vaiTro: "ADMIN",
      ngayTao: new Date().toISOString()
    } as any);
    notifications.show({
      title: "Success",
      message: "Logged in as Admin (Zustand store working)",
      color: "green",
    });
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <Stack gap={0}>
            <Title order={1}>Nguyễn Huệ Dashboard</Title>
            <Text c="dimmed" suppressHydrationWarning>{dayjs().format("DD MMMM YYYY, HH:mm")}</Text>
          </Stack>
          <ActionIcon
            variant="default"
            onClick={() => toggleColorScheme()}
            size="lg"
            radius="md"
          >
            {colorScheme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ActionIcon>
        </Group>

        <Card withBorder radius="md" p="xl" shadow="sm">
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Project Metadata</Title>
              <Badge color={serverStatus?.status === "Online" ? "green" : "gray"}>
                {isLoading ? "Checking..." : serverStatus?.status}
              </Badge>
            </Group>

            <Text>
              Next.js 15, TanStack Query, Zustand, Mantine, Tailwind CSS, Day.js, and Axios are all configured and ready.
            </Text>

            <Group>
              <Button leftSection={<IconRocket size={18} />} onClick={handleNotify}>
                Test Notification
              </Button>
              {!user ? (
                <Button variant="light" leftSection={<IconUser size={18} />} onClick={handleLogin}>
                  Login (Mock)
                </Button>
              ) : (
                <Text fw={500}>Welcome, {user.taiKhoan}!</Text>
              )}
            </Group>
          </Stack>
        </Card>

        <Group grow>
          <Card withBorder p="md" radius="md">
            <Text size="sm" c="dimmed" fw={500} tt="uppercase">Framework</Text>
            <Text fw={700} size="xl">Next.js 15.1</Text>
          </Card>
          <Card withBorder p="md" radius="md">
            <Text size="sm" c="dimmed" fw={500} tt="uppercase">Design System</Text>
            <Text fw={700} size="xl">Mantine v7</Text>
          </Card>
          <Card withBorder p="md" radius="md">
            <Text size="sm" c="dimmed" fw={500} tt="uppercase">Data Fetching</Text>
            <Text fw={700} size="xl">TanStack Query</Text>
          </Card>
        </Group>
      </Stack>
    </Container>
  );
}
