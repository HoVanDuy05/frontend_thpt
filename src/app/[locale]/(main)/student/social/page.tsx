"use client";

import { Container, Stack, Title, Text, Card, Group, Button } from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import { Link } from "@/i18n/routing";

export default function SocialPage() {
    return (
        <Container size="lg" className="py-4">
            <Stack gap="lg">
                <div>
                    <Title order={2} className="font-black mb-1">
                        Mạng xã hội
                    </Title>
                    <Text size="sm" c="dimmed">
                        Kết nối với bạn bè và giáo viên
                    </Text>
                </div>

                <Card withBorder radius="lg" padding="xl" className="text-center">
                    <Stack gap="md" align="center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <IconMessageCircle size={40} className="text-white" />
                        </div>
                        <div>
                            <Title order={3} className="mb-2">
                                Tính năng Social Network
                            </Title>
                            <Text size="sm" c="dimmed" className="max-w-md mx-auto">
                                Tính năng mạng xã hội đầy đủ (Newsfeed, Friends, Profile) đã sẵn sàng.
                            </Text>
                        </div>
                        <Group>
                            <Button
                                component={Link}
                                href="/social"
                                variant="gradient"
                                gradient={{ from: "indigo", to: "purple" }}
                                size="md"
                                radius="xl"
                            >
                                Truy cập Social Network
                            </Button>
                            <Button
                                component={Link}
                                href="/chat"
                                variant="light"
                                color="indigo"
                                size="md"
                                radius="xl"
                            >
                                Mở Chat
                            </Button>
                        </Group>
                    </Stack>
                </Card>
            </Stack>
        </Container>
    );
}
