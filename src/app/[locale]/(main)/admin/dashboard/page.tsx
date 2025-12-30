"use client";

import { Title, Text, SimpleGrid, Card, Group, Stack, Badge, Button } from "@mantine/core";
import { IconUsers, IconBooks, IconAlertCircle, IconCheck } from "@tabler/icons-react";

const stats = [
    { title: "Total Students", value: "1,234", icon: IconUsers, color: "blue" },
    { title: "Active Courses", value: "45", icon: IconBooks, color: "green" },
    { title: "Pending Requests", value: "12", icon: IconAlertCircle, color: "orange" },
    { title: "Completed Tasks", value: "890", icon: IconCheck, color: "teal" },
];

export default function AdminDashboard() {
    return (
        <Stack gap="xl">
            <div>
                <Title order={2}>Admin Dashboard</Title>
                <Text c="dimmed">Overview of the system performance and entity management.</Text>
            </div>

            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
                {stats.map((stat) => (
                    <Card key={stat.title} withBorder radius="md" p="md">
                        <Group justify="space-between">
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                                {stat.title}
                            </Text>
                            <stat.icon size={22} color={`var(--mantine-color-${stat.color}-6)`} stroke={1.5} />
                        </Group>

                        <Group align="flex-end" gap="xs" mt="md">
                            <Text fw={700} size="xl">
                                {stat.value}
                            </Text>
                            <Badge color={stat.color} variant="light">
                                +12% this month
                            </Badge>
                        </Group>
                    </Card>
                ))}
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                <Card withBorder radius="md" p="xl">
                    <Title order={4} mb="md">System Health</Title>
                    <Text size="sm">All systems are operational. No critical issues detected in the last 24 hours.</Text>
                    <Button variant="outline" mt="md" fullWidth>
                        View Full Report
                    </Button>
                </Card>

                <Card withBorder radius="md" p="xl">
                    <Title order={4} mb="md">Recent Activity</Title>
                    <Stack gap="xs">
                        <Text size="sm">• New course "Advanced React" created by Teacher A.</Text>
                        <Text size="sm">• 5 new students enrolled in "Introduction to SQL".</Text>
                        <Text size="sm">• Server maintenance completed successfully.</Text>
                    </Stack>
                </Card>
            </SimpleGrid>
        </Stack>
    );
}
