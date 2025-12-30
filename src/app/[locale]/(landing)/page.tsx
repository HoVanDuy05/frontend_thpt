"use client";

import { Container, Title, Text, Button, Group, Stack, Badge, SimpleGrid, Card, Box, Avatar, Overlay, Image, AspectRatio } from "@mantine/core";
import { IconArrowRight, IconCalendar, IconNewSection, IconSchool, IconUsers, IconFlag, IconAward, IconMapPin } from "@tabler/icons-react";
import { Link } from "@/i18n/routing";

export default function LandingPage() {
    const news = [
        {
            image: "https://images.unsplash.com/photo-1541339907198-e08759dfc3f0?q=80&w=800&auto=format&fit=crop",
            date: "30 Th12, 2025",
            category: "Tin nhà trường",
            title: "Lễ kỷ niệm 30 năm ngày thành lập trường và đón nhận Huân chương Lao động hạng Nhì",
            description: "Một chặng đường vẻ vang với những thành tích tự hào trong sự nghiệp trồng người...",
        },
        {
            image: "https://images.unsplash.com/photo-1523050353055-f115352b292c?q=80&w=800&auto=format&fit=crop",
            date: "28 Th12, 2025",
            category: "Học tập",
            title: "Thông báo về kỳ thi thử tốt nghiệp THPT Quốc gia đợt 1 năm học 2024-2025",
            description: "Kỳ thi nhằm giúp học sinh làm quen với cấu trúc đề và rèn luyện kỹ năng làm bài...",
        },
        {
            image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
            date: "25 Th12, 2025",
            category: "Hoạt động",
            title: "Ngày hội Sáng tạo STEM: Thắp sáng niềm đam mê khoa học trong học sinh",
            description: "Các em học sinh đã mang đến những dự án sáng tạo đầy tiềm năng và mang tính ứng dụng cao...",
        }
    ];

    const events = [
        {
            date: "15",
            month: "Tháng 1",
            title: "Hội khỏe Phù Đổng cấp trường 2025",
            time: "07:30 - 17:00",
            location: "Sân vận động trường",
        },
        {
            date: "22",
            month: "Tháng 1",
            title: "Cuộc thi Rung chuông vàng tiếng Anh",
            time: "14:00 - 16:30",
            location: "Hội trường lớn",
        },
        {
            date: "05",
            month: "Tháng 2",
            title: "Tư vấn hướng nghiệp: Chọn nghề cho tương lai",
            time: "08:00 - 11:00",
            location: "Nhà đa năng",
        }
    ];

    return (
        <Box className="overflow-hidden" suppressHydrationWarning>
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-40 lg:pt-48 lg:pb-64 overflow-hidden bg-white dark:bg-zinc-950">
                <Box className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[60px] sm:blur-[100px]" />
                    <div className="absolute bottom-[10%] left-[-10%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-[60px] sm:blur-[100px]" />
                </Box>

                <Box className="absolute top-0 left-0 w-full h-[500px] sm:h-[800px] bg-gradient-to-b from-blue-50/80 to-transparent dark:from-blue-900/10 -z-10" />

                <Container size="lg" className="relative z-10 px-4">
                    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl" verticalSpacing={40}>
                        <Stack gap="xl" className="justify-center">
                            <Box>
                                <Badge
                                    size="lg"
                                    variant="gradient"
                                    gradient={{ from: 'blue', to: 'indigo' }}
                                    className="mb-6 px-4 py-2 uppercase tracking-widest font-bold shadow-lg shadow-blue-500/20"
                                >
                                    Thành tích - Kỷ cương - Tình thương
                                </Badge>
                                <Title className="text-4xl sm:text-6xl lg:text-8xl font-black leading-[1.1] tracking-tight text-zinc-900 dark:text-white mb-6">
                                    Trường THPT <br />
                                    <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                        Chuyên Nguyễn Huệ
                                    </span>
                                </Title>
                                <Text className="text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed max-w-xl text-base sm:text-lg">
                                    Nơi ươm mầm những tài năng trẻ, kiến tạo môi trường giáo dục tiên tiến và rèn luyện nhân cách toàn diện cho thế hệ công dân toàn cầu.
                                </Text>
                            </Box>

                            <Group gap="md">
                                <Button
                                    size="lg"
                                    radius="xl"
                                    className="bg-blue-600 hover:bg-blue-700 h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg shadow-xl shadow-blue-600/30 hover:scale-105 transition-transform duration-200 flex-1 sm:flex-none"
                                    component={Link}
                                    href="/auth/register"
                                    rightSection={<IconArrowRight size={22} />}
                                >
                                    Đăng ký tuyển sinh
                                </Button>
                                <Button
                                    size="lg"
                                    radius="xl"
                                    variant="outline"
                                    className="border-zinc-200 dark:border-zinc-700 h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 flex-1 sm:flex-none"
                                    component={Link}
                                    href="/auth/login"
                                >
                                    Cổng thông tin HS
                                </Button>
                            </Group>

                            <Group gap="xl" mt="lg">
                                <Group gap="xs">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600">
                                        <IconAward size={24} />
                                    </div>
                                    <div>
                                        <Text fw={700} size="xs">Top 10 Toàn Quốc</Text>
                                        <Text size="10px" c="dimmed" tt="uppercase">Thành tích xuất sắc</Text>
                                    </div>
                                </Group>
                                <Group gap="xs">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600">
                                        <IconSchool size={24} />
                                    </div>
                                    <div>
                                        <Text fw={700} size="xs">50+ Năm Lịch Sử</Text>
                                        <Text size="10px" c="dimmed" tt="uppercase">Truyền thống vẻ vang</Text>
                                    </div>
                                </Group>
                            </Group>
                        </Stack>

                        <Box className="relative lg:h-auto hidden lg:block">
                            <Box className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full scale-90 translate-y-20" />
                            <Box className="relative z-10 transform hover:scale-[1.02] transition-transform duration-700 ease-out">
                                <Card padding={0} radius="40px" className="overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 rotate-2">
                                    <Image
                                        src="https://images.unsplash.com/photo-1523050849901-72439178ad38?q=80&w=1200&auto=format&fit=crop"
                                        alt="School Campus"
                                        className="w-full h-auto object-cover aspect-[4/5]"
                                    />
                                    <Overlay color="#000" opacity={0.1} zIndex={1} />

                                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent z-10">
                                        <Text className="text-white font-bold text-xl">Campus Hiện Đại</Text>
                                        <Text className="text-white/80 text-sm">Môi trường học tập tiêu chuẩn quốc tế</Text>
                                    </div>
                                </Card>
                            </Box>
                        </Box>
                    </SimpleGrid>
                </Container>
            </section>

            {/* News Section */}
            <section id="news" className="py-16 sm:py-32 bg-zinc-50/50 dark:bg-zinc-900/50">
                <Container size="lg" className="px-4">
                    <Stack gap="xl" mb={60}>
                        <Group justify="space-between" align="end">
                            <Box>
                                <Badge variant="light" size="lg" mb="sm" color="blue">Tin tức & Thông báo</Badge>
                                <Title order={2} className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                                    Nhịp sống Nguyễn Huệ
                                </Title>
                            </Box>
                            <Button
                                variant="light"
                                size="md"
                                color="blue"
                                radius="xl"
                                rightSection={<IconArrowRight size={18} />}
                                visibleFrom="sm"
                            >
                                Xem tất cả
                            </Button>
                        </Group>
                    </Stack>

                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                        {news.map((item, index) => (
                            <Card key={index} radius="24px" padding="none" withBorder className="bg-white dark:bg-zinc-900 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden">
                                <Card.Section className="aspect-[16/10] overflow-hidden relative">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge color="white" className="text-blue-700 shadow-md font-bold text-xs">{item.category}</Badge>
                                    </div>
                                </Card.Section>

                                <Stack p="xl" gap="sm">
                                    <Text size="xs" c="dimmed" fw={700} tt="uppercase" className="tracking-wider">{item.date}</Text>
                                    <Title order={4} className="leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors text-lg sm:text-xl font-bold">
                                        {item.title}
                                    </Title>
                                    <Text size="sm" c="dimmed" className="line-clamp-3 leading-relaxed">
                                        {item.description}
                                    </Text>
                                    <Group mt="md" className="group/btn">
                                        <Text size="sm" fw={700} className="text-blue-600">Đọc chi tiết</Text>
                                        <IconArrowRight size={16} className="text-blue-600 transform group-hover/btn:translate-x-1 transition-transform" />
                                    </Group>
                                </Stack>
                            </Card>
                        ))}
                    </SimpleGrid>

                    <Button
                        variant="light"
                        size="md"
                        color="blue"
                        radius="xl"
                        fullWidth
                        mt="xl"
                        rightSection={<IconArrowRight size={18} />}
                        hiddenFrom="sm"
                    >
                        Xem tất cả tin tức
                    </Button>
                </Container>
            </section>

            {/* Events & Quick Access */}
            <section id="events" className="py-16 sm:py-32">
                <Container size="lg" className="px-4">
                    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
                        <div>
                            <Badge variant="dot" size="lg" mb="sm">Sự kiện sắp tới</Badge>
                            <Title order={2} className="text-3xl sm:text-4xl font-black mb-8 sm:mb-12 leading-tight">Lịch hoạt động & Sự kiện</Title>

                            <Stack gap="md">
                                {events.map((event, index) => (
                                    <Group key={index} wrap="nowrap" align="center" className="p-4 sm:p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900 transition-all cursor-pointer group">
                                        <Stack align="center" justify="center" gap={2} className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-lg shadow-blue-500/30 shrink-0">
                                            <Text fw={900} size="lg" className="sm:text-xl leading-none">{event.date}</Text>
                                            <Text size="10px" fw={700} className="uppercase opacity-90">{event.month}</Text>
                                        </Stack>
                                        <Stack gap={4} className="flex-1 min-w-0">
                                            <Text fw={700} size="md" className="sm:text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">{event.title}</Text>
                                            <Group gap="md">
                                                <Group gap={4}>
                                                    <IconCalendar size={14} className="text-blue-500" />
                                                    <Text size="xs" fw={500} c="dimmed">{event.time}</Text>
                                                </Group>
                                                <Group gap={4}>
                                                    <IconMapPin size={14} className="text-blue-500" />
                                                    <Text size="xs" fw={500} c="dimmed" className="line-clamp-1">{event.location}</Text>
                                                </Group>
                                            </Group>
                                        </Stack>
                                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <IconArrowRight size={18} />
                                        </div>
                                    </Group>
                                ))}
                            </Stack>
                        </div>

                        <div>
                            <Badge variant="dot" size="lg" mb="sm" color="indigo">Dành cho học sinh</Badge>
                            <Title order={2} className="text-3xl sm:text-4xl font-black mb-8 sm:mb-12 leading-tight">Truy cập nhanh</Title>

                            <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="lg">
                                <Card padding="xl" radius="32px" className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none group cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                                    <Box className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                                        <IconSchool size={28} stroke={1.5} />
                                    </Box>
                                    <Text fw={700} size="lg">Kết quả học tập</Text>
                                    <Text size="sm" mt={4} className="opacity-80">Tra cứu nhanh điểm số</Text>
                                </Card>
                                <Card padding="xl" radius="32px" className="bg-zinc-900 dark:bg-zinc-800 text-white border-none group cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                                    <Box className="w-12 h-12 rounded-2xl bg-zinc-800 dark:bg-zinc-700 flex items-center justify-center mb-6">
                                        <IconNewSection size={28} stroke={1.5} className="text-blue-400" />
                                    </Box>
                                    <Text fw={700} size="lg">Thư viện đề thi</Text>
                                    <Text size="sm" mt={4} className="opacity-80">Ôn tập trực tuyến</Text>
                                </Card>
                                <Card padding="xl" radius="32px" withBorder className="bg-white dark:bg-zinc-900 group cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-900">
                                    <Box className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 text-blue-600">
                                        <IconUsers size={28} stroke={1.5} />
                                    </Box>
                                    <Text fw={700} size="lg">Câu lạc bộ</Text>
                                    <Text size="sm" mt={4} c="dimmed">Hoạt động ngoại khóa</Text>
                                </Card>
                                <Card padding="xl" radius="32px" withBorder className="bg-white dark:bg-zinc-900 group cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-900">
                                    <Box className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6 text-indigo-600">
                                        <IconFlag size={28} stroke={1.5} />
                                    </Box>
                                    <Text fw={700} size="lg">Lịch giảng dạy</Text>
                                    <Text size="sm" mt={4} c="dimmed">Thời khóa biểu</Text>
                                </Card>
                            </SimpleGrid>
                        </div>
                    </SimpleGrid>
                </Container>
            </section>

            {/* Admissions Banner */}
            <section id="admissions" className="py-12 sm:py-24">
                <Container size="lg" className="px-4">
                    <Box className="relative p-8 sm:p-12 lg:p-24 rounded-[32px] sm:rounded-[48px] bg-gradient-to-r from-blue-700 to-indigo-800 overflow-hidden text-white shadow-2xl shadow-blue-900/40">
                        <Box className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-[60px] sm:blur-[100px]" />
                        <Box className="absolute bottom-0 left-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-indigo-500/30 rounded-full translate-y-1/3 -translate-x-1/4 blur-[60px] sm:blur-[100px]" />

                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" className="relative z-10 items-center">
                            <Stack gap="xl">
                                <Badge color="white" variant="white" size="lg" className="self-start text-blue-800 shadow-md">Tuyển sinh 2025</Badge>
                                <Title order={2} className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight text-white">
                                    Chào mừng <br /> Thế hệ tương lai
                                </Title>
                                <Text className="text-blue-100 max-w-md leading-relaxed text-base sm:text-xl">
                                    Gia nhập cộng đồng học sinh năng động, sáng tạo và cùng nhau xây dựng những kỷ niệm đẹp nhất thời áo trắng.
                                </Text>
                                <Group gap="md" mt="md">
                                    <Button
                                        size="lg"
                                        radius="xl"
                                        className="bg-zinc-900 text-white hover:bg-zinc-800 border-none h-14 sm:h-16 px-8 sm:px-10 shadow-xl flex-1 sm:flex-none"
                                        component={Link}
                                        href="/auth/register"
                                    >
                                        Đăng ký ngay
                                    </Button>
                                    <Button
                                        size="lg"
                                        radius="xl"
                                        variant="white"
                                        className="text-blue-800 border-none h-14 sm:h-16 px-8 sm:px-10 shadow-sm hover:shadow-lg transition-shadow flex-1 sm:flex-none"
                                    >
                                        Tìm hiểu thêm
                                    </Button>
                                </Group>
                            </Stack>
                            <Box className="hidden md:block relative">
                                <Box className="absolute inset-0 bg-black/20 blur-xl rounded-full transform translate-y-4" />
                                <Image
                                    src="https://images.unsplash.com/photo-1525921429624-479b6a2ee2b4?q=80&w=800&auto=format&fit=crop"
                                    alt="Students"
                                    className="rounded-3xl shadow-2xl rotate-3 object-cover border-4 border-white/20"
                                />
                            </Box>
                        </SimpleGrid>
                    </Box>
                </Container>
            </section>

            {/* Footer */}
            <Box component="footer" className="py-12 sm:py-20 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <Container size="lg" className="px-4">
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
                        <Stack gap="md">
                            <Group gap="xs">
                                <Box className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl">P</Box>
                                <Title order={3} className="text-xl sm:text-2xl bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Nguyễn Huệ Academy</Title>
                            </Group>
                            <Text size="sm" c="dimmed">
                                Hệ thống quản lý trường học hiện đại, kết nối nhà trường, giáo viên, học sinh và phụ huynh.
                            </Text>
                            <Group gap="md">
                                <Avatar color="blue" radius="xl"><IconSchool size={20} /></Avatar>
                                <Avatar color="blue" radius="xl"><IconUsers size={20} /></Avatar>
                                <Avatar color="blue" radius="xl"><IconFlag size={20} /></Avatar>
                            </Group>
                        </Stack>

                        <Stack gap="md">
                            <Text fw={700} size="lg">Liên kết nhanh</Text>
                            <Stack gap={8}>
                                <Text size="sm" className="cursor-pointer hover:text-blue-600">Trang chủ</Text>
                                <Text size="sm" className="cursor-pointer hover:text-blue-600">Tin tức & Sự kiện</Text>
                                <Text size="sm" className="cursor-pointer hover:text-blue-600">Tuyển sinh</Text>
                                <Text size="sm" className="cursor-pointer hover:text-blue-600">Liên hệ</Text>
                            </Stack>
                        </Stack>

                        <Stack gap="md">
                            <Text fw={700} size="lg">Hỗ trợ</Text>
                            <Stack gap={8}>
                                <Text size="sm" className="cursor-pointer hover:text-blue-600">Cổng thông tin HS</Text>
                                <Text size="sm" className="cursor-pointer hover:text-blue-600">Hướng dẫn sử dụng</Text>
                                <Text size="sm" className="cursor-pointer hover:text-blue-600">Câu hỏi thường gặp</Text>
                                <Text size="sm" className="cursor-pointer hover:text-blue-600">Bảo mật thông tin</Text>
                            </Stack>
                        </Stack>

                        <Stack gap="md">
                            <Text fw={700} size="lg">Liên hệ</Text>
                            <Stack gap={8}>
                                <Text size="sm">📍 123 Đường Giáo Dục, Tp. Hồ Chí Minh</Text>
                                <Text size="sm">📞 (028) 3838 3838</Text>
                                <Text size="sm">✉️ contact@pms-academy.edu.vn</Text>
                            </Stack>
                        </Stack>
                    </SimpleGrid>

                    <Box mt={{ base: 40, sm: 60 }} pt={30} className="border-t border-zinc-100 dark:border-zinc-800">
                        <Group justify="space-between" align="center" gap="md">
                            <Text size="xs" c="dimmed" className="text-center sm:text-left">© 2025 Nguyễn Huệ Education Environment. All rights reserved.</Text>
                            <Group gap="xl" className="justify-center sm:justify-end">
                                <Text size="xs" c="dimmed">Privacy Policy</Text>
                                <Text size="xs" c="dimmed">Terms of Service</Text>
                            </Group>
                        </Group>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
