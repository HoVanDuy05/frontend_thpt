"use client";

import { Carousel } from "@mantine/carousel";
import { Paper, Text, Title, Group, Button, Stack, Box, Card, ThemeIcon } from "@mantine/core";
import { IconArrowRight, IconBell, IconClipboardList } from "@tabler/icons-react";
import { TBaiViet } from "@/shared/types/portal.type";
import { Link } from "@/i18n/routing";
import dayjs from "dayjs";
import { useRouter } from "@/i18n/routing";
import '@mantine/carousel/styles.css';
import { TruncateWrapper } from "@/shared/components/TruncateWrapper";

interface NotificationSliderProps {
    notifications: TBaiViet[];
}

export function NotificationSlider({ notifications }: NotificationSliderProps) {
    const router = useRouter();
    // Take only latest 3 notifications
    const latestNotifications = notifications?.slice(0, 3) || [];

    if (latestNotifications.length === 0) {
        return (
            <Card withBorder radius="lg" p="lg" className="h-full bg-blue-50 border-blue-200 flex flex-col justify-center items-center">
                <ThemeIcon size={48} radius="xl" color="blue" variant="light" className="mb-3">
                    <IconBell size={24} />
                </ThemeIcon>
                <Text c="blue.8" fw={600}>No new notifications</Text>
            </Card>
        );
    }

    return (
        <Card
            withBorder
            radius="lg"
            p="lg"
            className="h-full bg-[#f0f4ff] border-blue-200 relative overflow-hidden"
        >
            {/* Header with Title and Custom Indicator Position Anchor */}
            <Group justify="space-between" mb="xs" className="relative z-10">
                <Group gap="xs" className="text-blue-700">
                    <IconBell size={20} className="text-blue-600" />
                    <Text fw={700} size="sm">Notifications</Text>
                </Group>

                {/* Placeholder for indicators - we will position them absolutely in CSS relative to this or the card */}
            </Group>

            <div className="flex-1 relative z-10">
                <Carousel
                    withIndicators
                    withControls={false}
                    height="100%"
                    classNames={{
                        root: 'h-full',
                        viewport: 'h-full',
                        container: 'h-full',
                        indicator: 'bg-transparent border-2 border-indigo-600 data-[active]:bg-indigo-600 w-2 h-2 transition-all',
                        indicators: 'absolute top-[-36px] right-0 bottom-auto justify-end gap-1.5'
                    }}
                >
                    {latestNotifications.map((item) => (
                        <Carousel.Slide key={item.id} onClick={() => router.push('/notifications')} className="cursor-pointer">
                            <Stack justify="space-between" h="100%" gap="xs">
                                <Box className="pr-20"> {/* Padding right to avoid overlap with illustration if any */}
                                    <Title order={4} className="text-blue-800 font-bold leading-tight mb-2 line-clamp-2">
                                        {item.tieuDe}
                                    </Title>
                                    <TruncateWrapper c="blue.7" size="sm" lines={3} className="opacity-90 leading-relaxed font-medium">
                                        {item.tomTat || item.noiDung || "Click to view details..."}
                                    </TruncateWrapper>
                                </Box>

                                <Group mt="auto">
                                    <Text
                                        component={Link}
                                        href="/notifications"
                                        size="sm"
                                        fw={700}
                                        className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 group transition-all"
                                    >
                                        See more
                                        <IconArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Text>
                                </Group>
                            </Stack>
                        </Carousel.Slide>
                    ))}
                </Carousel>
            </div>

            {/* Decorative Illustration (Absolute positioned) */}
            <div className="absolute bottom-4 right-4 z-0 opacity-80 pointer-events-none">
                {/* Simple CSS shape or Icon to mimic the clipboard */}
                <Box className="relative w-24 h-32">
                    <IconClipboardList size={100} className="text-blue-200/50" stroke={1.5} />
                </Box>
            </div>
        </Card>
    );
}
