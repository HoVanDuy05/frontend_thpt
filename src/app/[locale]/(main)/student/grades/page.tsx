"use client";

import { Container, Stack, Title, Card, Text, Badge, Group, Progress, SimpleGrid, RingProgress } from "@mantine/core";
import { IconTrophy, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";

export default function GradesPage() {
    const subjects = [
        { name: "Toán học", grade: 9.0, trend: "up", progress: 90, color: "blue" },
        { name: "Văn học", grade: 8.5, trend: "up", progress: 85, color: "green" },
        { name: "Tiếng Anh", grade: 8.8, trend: "stable", progress: 88, color: "cyan" },
        { name: "Vật lý", grade: 7.5, trend: "down", progress: 75, color: "orange" },
        { name: "Hóa học", grade: 8.0, trend: "up", progress: 80, color: "purple" },
        { name: "Sinh học", grade: 8.2, trend: "up", progress: 82, color: "teal" },
        { name: "Lịch sử", grade: 9.2, trend: "up", progress: 92, color: "indigo" },
        { name: "Địa lý", grade: 8.7, trend: "stable", progress: 87, color: "lime" },
    ];

    const gpa = 8.5;
    const rank = 5;
    const totalStudents = 45;

    return (
        <Container size="lg" className="py-4">
            <Stack gap="lg">
                <div>
                    <Title order={2} className="font-black mb-1">
                        Kết quả học tập
                    </Title>
                    <Text size="sm" c="dimmed">
                        Học kỳ I - Năm học 2025-2026
                    </Text>
                </div>

                {/* GPA Overview */}
                <Card withBorder radius="lg" padding="lg" className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                    <Group justify="space-between" align="center">
                        <div className="flex-1">
                            <Text size="sm" fw={600} c="dimmed" className="mb-1">
                                Điểm trung bình
                            </Text>
                            <Group gap="xs" align="baseline">
                                <Text size="3rem" fw={900} className="text-indigo-600 dark:text-indigo-400 leading-none">
                                    {gpa}
                                </Text>
                                <Text size="xl" c="dimmed">/10</Text>
                            </Group>
                            <Group gap="xs" className="mt-2">
                                <Badge size="lg" variant="light" color="indigo" leftSection={<IconTrophy size={14} />}>
                                    Hạng {rank}/{totalStudents}
                                </Badge>
                            </Group>
                        </div>
                        <RingProgress
                            size={120}
                            thickness={12}
                            roundCaps
                            sections={[{ value: gpa * 10, color: "indigo" }]}
                            label={
                                <div className="text-center">
                                    <IconTrophy size={24} className="text-indigo-600 dark:text-indigo-400 mx-auto" />
                                </div>
                            }
                        />
                    </Group>
                </Card>

                {/* Subjects */}
                <div>
                    <Title order={4} className="font-bold mb-3">
                        Điểm các môn học
                    </Title>
                    <Stack gap="xs">
                        {subjects.map((subject) => (
                            <Card key={subject.name} padding="md" radius="lg" withBorder>
                                <Group justify="space-between" className="mb-2">
                                    <Group gap="sm">
                                        <div
                                            className={`w-10 h-10 rounded-lg bg-${subject.color}-100 dark:bg-${subject.color}-900 flex items-center justify-center`}
                                        >
                                            <Text fw={900} size="sm" className={`text-${subject.color}-600 dark:text-${subject.color}-400`}>
                                                {subject.name.charAt(0)}
                                            </Text>
                                        </div>
                                        <div>
                                            <Text fw={700} size="sm">
                                                {subject.name}
                                            </Text>
                                            <Group gap={4}>
                                                {subject.trend === "up" && (
                                                    <IconTrendingUp size={14} className="text-green-500" />
                                                )}
                                                {subject.trend === "down" && (
                                                    <IconTrendingDown size={14} className="text-red-500" />
                                                )}
                                                <Text size="xs" c="dimmed">
                                                    {subject.trend === "up" ? "Tăng" : subject.trend === "down" ? "Giảm" : "Ổn định"}
                                                </Text>
                                            </Group>
                                        </div>
                                    </Group>
                                    <Text size="xl" fw={900} className="text-indigo-600 dark:text-indigo-400">
                                        {subject.grade}
                                    </Text>
                                </Group>
                                <Progress
                                    value={subject.progress}
                                    color={subject.color}
                                    size="sm"
                                    radius="xl"
                                />
                            </Card>
                        ))}
                    </Stack>
                </div>
            </Stack>
        </Container>
    );
}
