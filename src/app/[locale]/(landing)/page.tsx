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
            <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden bg-white dark:bg-zinc-950">
                <Box className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/5 -z-10" />

                <Container size="lg">
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={60}>
                        <Stack gap="xl">
                            <Box>
                                <Badge size="lg" variant="filled" color="blue" className="mb-6 h-9 px-4 uppercase tracking-widest font-bold">
                                    Thành tích - Kỷ cương - Tình thương
                                </Badge>
                                <Title className="text-5xl lg:text-7xl font-black leading-[1.1] text-zinc-900 dark:text-white">
                                    Trường THPT <br />
                                    <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Chuyên Nguyễn Huệ</span>
                                </Title>
                                <Stack gap="md" mt="xl">
                                    <Text size="xl" className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                                        Nơi ươm mầm tài năng, rèn luyện nhân cách và kiến tạo tương lai vững chắc cho thế hệ học sinh trong kỷ nguyên số.
                                    </Text>
                                    <Group gap="lg">
                                        <Group gap="xs">
                                            <IconAward size={24} className="text-blue-600" />
                                            <Text fw={600}>Top 10 trường xuất sắc</Text>
                                        </Group>
                                        <Group gap="xs">
                                            <IconFlag size={24} className="text-blue-600" />
                                            <Text fw={600}>Hơn 50 năm truyền thống</Text>
                                        </Group>
                                    </Group>
                                </Stack>
                            </Box>

                            <Group gap="md">
                                <Button
                                    size="xl"
                                    radius="md"
                                    className="bg-blue-600 hover:bg-blue-700 h-16 px-10 shadow-xl shadow-blue-500/20"
                                    component={Link}
                                    href="/auth/register"
                                    rightSection={<IconArrowRight size={20} />}
                                >
                                    Đăng ký tuyển sinh
                                </Button>
                                <Button
                                    size="xl"
                                    radius="md"
                                    variant="outline"
                                    className="border-zinc-300 dark:border-zinc-700 h-16 px-10"
                                    component={Link}
                                    href="/auth/login"
                                >
                                    Cổng thông tin HS
                                </Button>
                            </Group>
                        </Stack>

                        <Box className="relative">
                            <Box className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full scale-110" />
                            <Box className="relative z-10 p-2 bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl border border-zinc-100 dark:border-zinc-800">
                                <Card padding={0} radius="32px" className="overflow-hidden">
                                    <Image
                                        src="https://images.unsplash.com/photo-1523050849901-72439178ad38?q=80&w=1200&auto=format&fit=crop"
                                        alt="School Campus"
                                        className="w-full h-auto"
                                    />
                                    <Overlay color="#000" opacity={0.1} zIndex={1} />
                                </Card>
                            </Box>
                        </Box>
                    </SimpleGrid>
                </Container>
            </section>

            {/* News Section */}
            <section id="news" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
                <Container size="lg">
                    <Group justify="space-between" align="end" mb={60}>
                        <Box>
                            <Badge variant="dot" size="lg" mb="sm">Tin tức & Thông báo</Badge>
                            <Title order={2} className="text-4xl font-black">Cập nhật mới nhất từ nhà trường</Title>
                        </Box>
                        <Button variant="subtle" size="lg" color="blue" rightSection={<IconArrowRight size={18} />}>
                            Xem tất cả tin tức
                        </Button>
                    </Group>

                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                        {news.map((item, index) => (
                            <Card key={index} radius="xl" padding="xl" className="border-none shadow-sm hover:shadow-xl transition-all duration-500 group">
                                <Card.Section>
                                    <AspectRatio ratio={16 / 9} className="overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            className="group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </AspectRatio>
                                </Card.Section>

                                <Stack mt="xl" gap="xs">
                                    <Group justify="space-between">
                                        <Badge variant="light" color="blue">{item.category}</Badge>
                                        <Text size="xs" c="dimmed" fw={600}>{item.date}</Text>
                                    </Group>
                                    <Title order={4} className="leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </Title>
                                    <Text size="sm" c="dimmed" className="line-clamp-3">
                                        {item.description}
                                    </Text>
                                    <Button variant="subtle" p={0} h="auto" mt="sm" justify="start" color="blue" fw={700}>
                                        Đọc tiếp
                                    </Button>
                                </Stack>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Container>
            </section>

            {/* Events & Quick Access */}
            <section id="events" className="py-24">
                <Container size="lg">
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={80}>
                        <div>
                            <Badge variant="dot" size="lg" mb="sm">Sự kiện sắp tới</Badge>
                            <Title order={2} className="text-3xl font-black mb-12">Lịch hoạt động & Sự kiện</Title>

                            <Stack gap="lg">
                                {events.map((event, index) => (
                                    <Group key={index} wrap="nowrap" align="start" className="p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-lg transition-all">
                                        <Box className="bg-blue-600 text-white w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0">
                                            <Text fw={900} size="xl" className="leading-none">{event.date}</Text>
                                            <Text size="xs" fw={700} className="uppercase mt-1">{event.month}</Text>
                                        </Box>
                                        <Stack gap={4}>
                                            <Text fw={700} size="lg" className="line-clamp-1">{event.title}</Text>
                                            <Group gap="xs">
                                                <IconCalendar size={14} className="text-zinc-400" />
                                                <Text size="xs" c="dimmed">{event.time}</Text>
                                                <IconMapPin size={14} className="text-zinc-400 ml-2" />
                                                <Text size="xs" c="dimmed">{event.location}</Text>
                                            </Group>
                                        </Stack>
                                    </Group>
                                ))}
                            </Stack>
                        </div>

                        <div>
                            <Badge variant="dot" size="lg" mb="sm" color="indigo">Dành cho học sinh</Badge>
                            <Title order={2} className="text-3xl font-black mb-12">Truy cập nhanh Nguyễn Huệ</Title>

                            <SimpleGrid cols={2} spacing="md">
                                <Card padding="xl" radius="24px" className="bg-blue-600 text-white border-none group cursor-pointer hover:-translate-y-2 transition-transform">
                                    <IconSchool size={40} stroke={1.5} />
                                    <Text fw={700} mt="lg">Kết quả học tập</Text>
                                    <Text size="xs" mt={4} className="opacity-80">Tra cứu nhanh điểm số</Text>
                                </Card>
                                <Card padding="xl" radius="24px" className="bg-zinc-900 text-white border-none group cursor-pointer hover:-translate-y-2 transition-transform">
                                    <IconNewSection size={40} stroke={1.5} className="text-blue-500" />
                                    <Text fw={700} mt="lg">Thư viện đề thi</Text>
                                    <Text size="xs" mt={4} className="opacity-80">Ôn tập trực tuyến</Text>
                                </Card>
                                <Card padding="xl" radius="24px" className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group cursor-pointer hover:-translate-y-2 transition-transform shadow-sm">
                                    <IconUsers size={40} stroke={1.5} className="text-blue-600" />
                                    <Text fw={700} mt="lg">Câu lạc bộ</Text>
                                    <Text size="xs" mt={4} c="dimmed">Hoạt động ngoại khóa</Text>
                                </Card>
                                <Card padding="xl" radius="24px" className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group cursor-pointer hover:-translate-y-2 transition-transform shadow-sm">
                                    <IconFlag size={40} stroke={1.5} className="text-indigo-600" />
                                    <Text fw={700} mt="lg">Lịch giảng dạy</Text>
                                    <Text size="xs" mt={4} c="dimmed">Theo dõi thời khóa biểu</Text>
                                </Card>
                            </SimpleGrid>
                        </div>
                    </SimpleGrid>
                </Container>
            </section>

            {/* Admissions Banner */}
            <section id="admissions" className="py-24">
                <Container size="lg">
                    <Box className="relative p-12 lg:p-20 rounded-[50px] bg-blue-700 overflow-hidden text-white">
                        <Box className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
                        <Box className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/40 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />

                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} className="relative z-10">
                            <Stack gap="xl">
                                <Title order={2} className="text-4xl lg:text-5xl font-black leading-tight">
                                    Chào mừng các tân học sinh gia nhập mái nhà PMS
                                </Title>
                                <Text size="lg" className="opacity-90 max-w-md">
                                    Hãy trở thành một phần của cộng đồng học sinh năng động, sáng tạo và cùng nhau xây dựng những kỷ niệm đẹp nhất thời áo trắng.
                                </Text>
                                <Group gap="md">
                                    <Button
                                        size="xl"
                                        radius="md"
                                        className="bg-zinc-900 text-white hover:bg-zinc-800 border-none h-16 px-10 shadow-xl"
                                        component={Link}
                                        href="/auth/register"
                                    >
                                        Đăng ký ngay
                                    </Button>
                                    <Button
                                        size="xl"
                                        radius="md"
                                        variant="white"
                                        className="text-blue-700 h-16 px-10"
                                    >
                                        Tìm hiểu thêm
                                    </Button>
                                </Group>
                            </Stack>
                            <Box className="hidden md:block">
                                <Image
                                    src="https://images.unsplash.com/photo-1525921429624-479b6a2ee2b4?q=80&w=800&auto=format&fit=crop"
                                    alt="Students"
                                    className="rounded-3xl shadow-2xl rotate-3"
                                />
                            </Box>
                        </SimpleGrid>
                    </Box>
                </Container>
            </section>

            {/* Footer */}
            <Box component="footer" className="py-20 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <Container size="lg">
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
                        <Stack gap="md">
                            <Group gap="xs">
                                <Box className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</Box>
                                <Title order={3} className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Nguyễn Huệ Academy</Title>
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

                    <Box mt={60} pt={30} className="border-t border-zinc-100 dark:border-zinc-800">
                        <Group justify="space-between">
                            <Text size="xs" c="dimmed">© 2025 Nguyễn Huệ Education Environment. All rights reserved.</Text>
                            <Group gap="xl">
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
