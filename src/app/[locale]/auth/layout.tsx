"use client";

import { Center, Box, Text, Paper, SimpleGrid, Stack, Title, Group } from "@mantine/core";
import { AuthHeader } from "@/shared/components/layout/AuthHeader";
import { IconSchool } from "@tabler/icons-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--mantine-color-gray-0)',
                background: 'linear-gradient(to bottom right, #f8f9fa, #e9ecef)' // Very subtle clean background
            }}
        >
            <AuthHeader />

            <Center style={{ flex: 1, padding: '2rem', marginTop: '4rem' }}>
                <Paper
                    w="100%"
                    maw={1100} // Slightly wider for that FPT "dashboard" feel
                    radius="md" // Standard radius, not too round
                    shadow="sm"
                    withBorder
                    style={{
                        backgroundColor: 'white',
                        overflow: 'hidden',
                        borderColor: 'var(--mantine-color-gray-2)'
                    }}
                >
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0}>

                        {/* LEFT COLUMN: The Form (Like FPT) */}
                        <Box
                            p={{ base: 32, sm: 50 }}
                            bg="white"
                            h="100%"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            {children}
                        </Box>

                        {/* RIGHT COLUMN: Info/Branding (Replacing FPT's SSO side with Branding Info) */}
                        <Box
                            p={{ base: 32, sm: 50 }}
                            style={{
                                background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-indigo-7) 100%)',
                                color: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                position: 'relative'
                            }}
                        >
                            <Box style={{ position: 'relative', zIndex: 2 }}>
                                <Stack gap="xl">
                                    <Box>
                                        <Group gap="xs" mb="md">
                                            <Box p={8} bg="white" style={{ borderRadius: 8 }}>
                                                <IconSchool size={32} color="var(--mantine-color-blue-7)" />
                                            </Box>
                                        </Group>
                                        <Title order={2} fz={36} fw={800} style={{ lineHeight: 1.1 }}>
                                            Hệ thống <br /> Đào tạo Trực tuyến
                                        </Title>
                                        <Text mt="sm" fz="lg" fw={500} style={{ opacity: 0.9 }}>
                                            Nguyễn Huệ Academy Portal
                                        </Text>
                                    </Box>

                                    <Box w="100%" h={1} bg="white" style={{ opacity: 0.2 }} />

                                    <Stack gap="md">
                                        <Text fw={700} tt="uppercase" size="sm" style={{ opacity: 0.8 }}>Hỗ trợ sinh viên</Text>

                                        <Group>
                                            <Box w={40} h={40} bg="white" style={{ borderRadius: '50%', opacity: 0.2 }} />
                                            <Box>
                                                <Text fw={600} size="sm">Phòng Công tác Sinh viên</Text>
                                                <Text size="xs" style={{ opacity: 0.8 }}>024.3333.xxxx</Text>
                                            </Box>
                                        </Group>

                                        <Group>
                                            <Box w={40} h={40} bg="white" style={{ borderRadius: '50%', opacity: 0.2 }} />
                                            <Box>
                                                <Text fw={600} size="sm">Hỗ trợ Kỹ thuật & IT</Text>
                                                <Text size="xs" style={{ opacity: 0.8 }}>support@nguyenhue.edu.vn</Text>
                                            </Box>
                                        </Group>
                                    </Stack>
                                </Stack>
                            </Box>

                            {/* Decorative muted pattern */}
                            <Box style={{
                                position: 'absolute', bottom: -50, right: -50,
                                width: 200, height: 200,
                                border: '20px solid rgba(255,255,255,0.05)',
                                borderRadius: '50%'
                            }} />

                        </Box>
                    </SimpleGrid>
                </Paper>
            </Center>

            <Box py="lg" ta="center" bg="white" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Text size="xs" c="dimmed" fw={600}>
                    &copy; 2025 Học viện Nguyễn Huệ. Được phát triển bởi Advanced Agentic Coding.
                </Text>
            </Box>
        </Box>
    );
}
