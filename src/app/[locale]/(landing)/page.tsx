"use client";

import { Container, Title, Text, Button, Group, Stack, Badge, SimpleGrid, Card, Box, Avatar, Overlay, Image, AspectRatio, Affix, Transition, ActionIcon, rem } from "@mantine/core";
import { IconArrowRight, IconCalendar, IconNewSection, IconSchool, IconUsers, IconFlag, IconAward, IconMapPin, IconDeviceMobile, IconLayoutDashboard, IconLogin, IconDownload, IconChevronUp } from "@tabler/icons-react";
import { Link } from "@/i18n/routing";
import { useLandingAuth } from "@/shared/hooks/useLandingAuth";
import { usePWA } from "@/shared/hooks/usePWA";
import { useWindowScroll } from "@mantine/hooks";
import { Divider } from "@mantine/core";

export default function LandingPage() {
    const { isLoggedIn, handleAccessPortal } = useLandingAuth();
    const { isStandalone, handleInstall } = usePWA();
    const [scroll, scrollTo] = useWindowScroll();

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
        <Box className="overflow-hidden bg-white dark:bg-zinc-950">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 sm:pt-32 sm:pb-40 lg:pt-48 lg:pb-64 overflow-hidden">
                <Box className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-5%] right-[-5%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[60px] sm:blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[10%] left-[-5%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-[60px] sm:blur-[120px]" />
                </Box>

                <Box className="absolute top-0 left-0 w-full h-[500px] sm:h-[800px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/5 -z-10" />

                <Container size="lg" className="relative z-10 px-4">
                    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={80} verticalSpacing={100}>
                        <Stack gap="xl" className="justify-center">
                            <Box>
                                <Badge
                                    size="lg"
                                    variant="gradient"
                                    gradient={{ from: 'blue', to: 'indigo' }}
                                    className="mb-8 px-6 py-2 uppercase tracking-[0.2em] font-black shadow-xl shadow-blue-500/20 border-none h-9"
                                >
                                    Thành tích - Kỷ cương - Tình thương
                                </Badge>
                                <Title className="text-5xl sm:text-7xl lg:text-8xl font-[900] leading-[1.05] tracking-tight text-zinc-900 dark:text-white mb-8">
                                    Trường THPT <br />
                                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent italic">
                                        Nguyễn Huệ
                                    </span>
                                </Title>
                                <Text className="text-zinc-600 dark:text-zinc-400 font-bold leading-relaxed max-w-xl text-lg sm:text-xl mb-4">
                                    Kiến tạo môi trường giáo dục hạnh phúc, nơi ươm mầm tinh hoa và bản lĩnh sáng tạo.
                                </Text>
                            </Box>

                            <Group gap="md">
                                {!isLoggedIn ? (
                                    <>
                                        <Button
                                            size="xl"
                                            radius="xl"
                                            className="bg-blue-600 hover:bg-blue-700 h-16 sm:h-20 px-10 sm:px-14 text-lg sm:text-xl font-black shadow-2xl shadow-blue-600/30 hover:scale-105 transition-all duration-300 flex-1 sm:flex-none border-none outline-none"
                                            component={Link}
                                            href="/auth/register"
                                            rightSection={<IconArrowRight size={26} stroke={3} />}
                                        >
                                            Đăng ký ngay
                                        </Button>
                                        <Button
                                            size="xl"
                                            radius="xl"
                                            variant="outline"
                                            className="border-zinc-200 dark:border-zinc-800 h-16 sm:h-20 px-10 sm:px-14 text-lg sm:text-xl font-bold hover:bg-zinc-50 dark:hover:bg-white/5 flex-1 sm:flex-none"
                                            component={Link}
                                            href="/auth/login"
                                            leftSection={<IconLogin size={24} stroke={2.5} />}
                                        >
                                            Đăng nhập
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        size="xl"
                                        radius="xl"
                                        variant="gradient"
                                        gradient={{ from: 'blue', to: 'indigo' }}
                                        className="h-16 sm:h-20 px-12 sm:px-20 text-lg sm:text-xl font-black shadow-2xl shadow-blue-600/40 hover:scale-105 transition-all duration-300 flex-1 sm:flex-none border-none"
                                        onClick={handleAccessPortal}
                                        leftSection={<IconLayoutDashboard size={28} stroke={3} />}
                                        rightSection={<IconArrowRight size={24} stroke={3} />}
                                    >
                                        Vào Hệ thống
                                    </Button>
                                )}
                            </Group>

                            <SimpleGrid cols={2} spacing="xl" mt="xl" className="max-w-md">
                                <Group gap="md" wrap="nowrap">
                                    <Box className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-2xl text-blue-600 shadow-sm border border-blue-100 dark:border-blue-800">
                                        <IconAward size={32} stroke={2.5} />
                                    </Box>
                                    <div>
                                        <Text fw={900} size="sm">Top 10 Toàn Quốc</Text>
                                        <Text size="xs" c="dimmed" tt="uppercase" className="font-bold">Chất lượng đào tạo</Text>
                                    </div>
                                </Group>
                                <Group gap="md" wrap="nowrap">
                                    <Box className="p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl text-indigo-600 shadow-sm border border-indigo-100 dark:border-indigo-800">
                                        <IconSchool size={32} stroke={2.5} />
                                    </Box>
                                    <div>
                                        <Text fw={900} size="sm">50+ Năm Lịch Sử</Text>
                                        <Text size="xs" c="dimmed" tt="uppercase" className="font-bold">Truyền thống vẻ vang</Text>
                                    </div>
                                </Group>
                            </SimpleGrid>
                        </Stack>

                        <Box visibleFrom="lg" className="relative lg:h-auto items-center">
                            <Box className="absolute inset-0 bg-blue-600/10 blur-[150px] rounded-full scale-110" />
                            <Box className="relative z-10 transform hover:rotate-0 transition-all duration-700 ease-in-out -rotate-3 cursor-pointer">
                                <Card padding={0} radius="48px" className="overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-8 border-white dark:border-zinc-800 group">
                                    <Image
                                        src="https://images.unsplash.com/photo-1523050849901-72439178ad38?q=80&w=1200&auto=format&fit=crop"
                                        fallbackSrc="https://placehold.co/1200x1500?text=Nguyễn+Huệ"
                                        alt="School Campus"
                                        className="w-full h-auto object-cover aspect-[4/5] group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <Overlay color="#000" opacity={0} zIndex={1} className="group-hover:opacity-20 transition-opacity" />

                                    <div className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <Text className="text-white font-black text-2xl mb-1">Campus Chuyên nghiệp</Text>
                                        <Text className="text-white/70 text-base font-bold">Chuẩn mực sư phạm hiện đại</Text>
                                    </div>
                                </Card>
                            </Box>
                        </Box>
                    </SimpleGrid>
                </Container>
            </section>

            {/* News Section */}
            <section id="news" className="py-20 sm:py-32 bg-zinc-50/50 dark:bg-zinc-900/30">
                <Container size="lg" className="px-4">
                    <Stack gap="xl" mb={80}>
                        <Group justify="space-between" align="end">
                            <Box>
                                <Badge variant="outline" size="xl" mb="md" color="blue" className="font-black border-2 border-blue-500/30">Tin tức & Sự kiện</Badge>
                                <Title order={2} className="text-4xl sm:text-6xl font-[900] tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                                    Nhịp sống <br /> Học đường
                                </Title>
                            </Box>
                            <Button
                                variant="light"
                                size="lg"
                                color="blue"
                                radius="xl"
                                rightSection={<IconArrowRight size={20} stroke={2.5} />}
                                visibleFrom="sm"
                                className="font-black h-14 px-8"
                            >
                                Xem tất cả
                            </Button>
                        </Group>
                    </Stack>

                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={40}>
                        {news.map((item, index) => (
                            <Card key={index} radius="32px" padding="none" withBorder className="bg-white dark:bg-zinc-900 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group overflow-hidden border-zinc-100 dark:border-zinc-800">
                                <Card.Section className="aspect-[16/10] overflow-hidden relative">
                                    <Image
                                        src={item.image}
                                        fallbackSrc="https://placehold.co/800x500?text=Tin+tức+Nguyễn+Huệ"
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <Badge color="white" className="text-blue-700 shadow-xl font-black text-xs h-8 px-4 border-none">{item.category}</Badge>
                                    </div>
                                </Card.Section>

                                <Stack p="xl" gap="md">
                                    <Text size="xs" c="dimmed" fw={800} tt="uppercase" className="tracking-widest">{item.date}</Text>
                                    <Title order={3} className="leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors text-xl font-black italic">
                                        {item.title}
                                    </Title>
                                    <Text size="md" c="dimmed" className="line-clamp-3 leading-relaxed font-medium">
                                        {item.description}
                                    </Text>
                                    <Divider variant="dashed" mt="sm" />
                                    <Group justify="space-between" align="center" mt="xs" className="group/btn cursor-pointer">
                                        <Text size="sm" fw={900} className="text-blue-600 uppercase tracking-tighter shadow-blue-500/10">Khám phá ngay</Text>
                                        <IconArrowRight size={20} className="text-blue-600 transform group-hover/btn:translate-x-2 transition-transform" />
                                    </Group>
                                </Stack>
                            </Card>
                        ))}
                    </SimpleGrid>

                    <Button
                        variant="light"
                        size="xl"
                        color="blue"
                        radius="xl"
                        fullWidth
                        mt={40}
                        rightSection={<IconArrowRight size={22} />}
                        hiddenFrom="sm"
                        className="font-black h-16"
                    >
                        Tất cả bài viết
                    </Button>
                </Container>
            </section>

            {/* Events Section */}
            <section id="events" className="py-20 sm:py-40">
                <Container size="lg" className="px-4">
                    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={80}>
                        <div>
                            <Badge variant="dot" size="xl" mb="md" className="font-black">Lịch sử kiện</Badge>
                            <Title order={2} className="text-4xl sm:text-5xl font-[900] mb-12 leading-tight">Hoạt động tiêu biểu</Title>

                            <Stack gap="lg">
                                {events.map((event, index) => (
                                    <Group key={index} wrap="nowrap" align="center" className="p-6 sm:p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:shadow-2xl hover:border-blue-500/20 transition-all cursor-pointer group">
                                        <Stack align="center" justify="center" gap={2} className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] shadow-xl shadow-blue-500/30 shrink-0 transform group-hover:scale-110 transition-transform">
                                            <Text fw={900} size="xl" className="sm:text-3xl leading-none">{event.date}</Text>
                                            <Text size="xs" fw={900} className="uppercase opacity-80 tracking-widest">{event.month}</Text>
                                        </Stack>
                                        <Stack gap={6} className="flex-1 min-w-0 px-2 sm:px-4">
                                            <Text fw={900} size="lg" className="sm:text-2xl line-clamp-1 group-hover:text-blue-600 transition-colors italic leading-none mb-1">{event.title}</Text>
                                            <Group gap="xl">
                                                <Group gap={6}>
                                                    <IconCalendar size={18} stroke={2.5} className="text-blue-500" />
                                                    <Text size="sm" fw={700} c="dimmed">{event.time}</Text>
                                                </Group>
                                                <Group gap={6}>
                                                    <IconMapPin size={18} stroke={2.5} className="text-blue-500" />
                                                    <Text size="sm" fw={700} c="dimmed" className="line-clamp-1">{event.location}</Text>
                                                </Group>
                                            </Group>
                                        </Stack>
                                        <Box className="hidden sm:flex w-14 h-14 rounded-full bg-zinc-50 dark:bg-zinc-800 items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all">
                                            <IconArrowRight size={24} stroke={3} />
                                        </Box>
                                    </Group>
                                ))}
                            </Stack>
                        </div>

                        <Stack gap="xl">
                            <Box>
                                <Badge variant="dot" size="xl" mb="md" color="indigo" className="font-black">Tiện ích</Badge>
                                <Title order={2} className="text-4xl sm:text-5xl font-[900] mb-12 leading-tight">Cổng dịch vụ</Title>
                            </Box>

                            <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xl">
                                {[
                                    { icon: <IconSchool size={36} />, title: "Điểm số", desc: "Tra cứu kết quả", color: "blue" },
                                    { icon: <IconNewSection size={36} />, title: "Thư viện", desc: "Đề thi & Tài liệu", color: "zinc" },
                                    { icon: <IconUsers size={36} />, title: "Câu lạc bộ", desc: "Hoạt động Đội Nhóm", color: "blue" },
                                    { icon: <IconCalendar size={36} />, title: "Lịch học", desc: "Thời khóa biểu", color: "indigo" },
                                ].map((item, i) => (
                                    <Card
                                        key={i}
                                        padding="xl"
                                        radius="40px"
                                        className={`${item.color === 'zinc' ? 'bg-zinc-900 border-none' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'} shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 group cursor-pointer border`}
                                    >
                                        <Box className={`w-16 h-16 rounded-3xl ${item.color === 'zinc' ? 'bg-zinc-800' : (item.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600')} flex items-center justify-center mb-8`}>
                                            {item.icon}
                                        </Box>
                                        <Text fw={900} size="xl" className={item.color === 'zinc' ? 'text-white' : ''}>{item.title}</Text>
                                        <Text size="sm" mt={4} className={item.color === 'zinc' ? 'text-white/60' : 'text-zinc-500'}>{item.desc}</Text>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        </Stack>
                    </SimpleGrid>
                </Container>
            </section>

            {/* Admissions Banner */}
            <section id="admissions" className="py-20 sm:py-32">
                <Container size="lg" className="px-4">
                    <Box className="relative p-10 sm:p-20 lg:p-24 rounded-[60px] bg-gradient-to-br from-blue-700 via-indigo-800 to-indigo-950 overflow-hidden text-white shadow-[0_50px_100px_-20px_rgba(30,58,138,0.5)]">
                        <Box className="absolute top-0 right-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-[100px] sm:blur-[150px]" />
                        <Box className="absolute bottom-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-500/20 rounded-full translate-y-1/3 -translate-x-1/4 blur-[100px] sm:blur-[150px]" />

                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={60} className="relative z-10 items-center">
                            <Stack gap="xl">
                                <Badge color="white" variant="white" size="xl" className="self-start text-blue-900 shadow-xl font-black h-9 px-6 uppercase border-none">Tuyển sinh 2025</Badge>
                                <Title order={2} className="text-5xl sm:text-7xl lg:text-8xl font-[900] leading-[1.05] text-white tracking-tighter shadow-sm">
                                    Cánh cửa <br /> <span className="italic opacity-80">Tương lai</span>
                                </Title>
                                <Text className="text-blue-100 max-w-lg leading-relaxed text-lg sm:text-2xl font-bold opacity-90">
                                    Đồng hành cùng chúng tôi trên hành trình chinh phục tri thức và khẳng định bản thân.
                                </Text>
                                <Group gap="md" mt="xl">
                                    <Button
                                        size="xl"
                                        radius="xl"
                                        className="bg-white text-blue-900 hover:bg-zinc-50 border-none h-18 sm:h-20 px-10 sm:px-14 shadow-2xl font-black text-xl flex-1 sm:flex-none uppercase"
                                        component={Link}
                                        href="/auth/register"
                                        leftSection={<IconArrowRight size={24} stroke={4} />}
                                    >
                                        Đăng ký ngay
                                    </Button>
                                    <Button
                                        size="xl"
                                        radius="xl"
                                        variant="outline"
                                        className="text-white border-white/30 h-18 sm:h-20 px-10 sm:px-14 shadow-sm hover:bg-white/10 transition-all font-black text-xl flex-1 sm:flex-none uppercase"
                                        leftSection={<IconDownload size={24} stroke={3} />}
                                    >
                                        Tải Apps
                                    </Button>
                                </Group>
                            </Stack>
                            <Box className="hidden md:block relative">
                                <Box className="absolute inset-0 bg-blue-900/40 blur-[100px] rounded-full transform translate-y-10 scale-90" />
                                <Image
                                    src="https://images.unsplash.com/photo-1525921429624-479b6a2ee2b4?q=80&w=800&auto=format&fit=crop"
                                    fallbackSrc="https://placehold.co/800x800?text=Sinh+viên+Nguyễn+Huệ"
                                    alt="Students"
                                    className="rounded-[40px] shadow-2xl rotate-6 object-cover border-8 border-white/10 aspect-square"
                                />
                            </Box>
                        </SimpleGrid>
                    </Box>
                </Container>
            </section>

            {/* Footer */}
            <Box component="footer" className="py-20 sm:py-32 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <Container size="lg" className="px-4">
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={60}>
                        <Stack gap="xl">
                            <Group gap="xs">
                                <Box className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">P</Box>
                                <Title order={3} className="text-2xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent italic tracking-tighter">Nguyễn Huệ</Title>
                            </Group>
                            <Text size="md" c="dimmed" className="font-bold leading-relaxed">
                                Hệ thống quản lí giáo dục thông minh. <br /> Kết nối sức mạnh cộng đồng Nguyễn Huệ.
                            </Text>
                            <Group gap="md">
                                {[IconSchool, IconUsers, IconFlag].map((Icon, i) => (
                                    <ActionIcon key={i} variant="light" size="xl" radius="xl" color="blue"><Icon size={24} stroke={2.5} /></ActionIcon>
                                ))}
                            </Group>
                        </Stack>

                        {[
                            { title: "Khám phá", links: ["Trang chủ", "Tin tức", "Tuyển sinh", "Cựu học sinh"] },
                            { title: "Liên hệ", links: ["Văn phòng trường", "Đoàn thanh niên", "Ban phụ huynh", "Hỗ trợ kĩ thuật"] },
                            { title: "Pháp lí", links: ["Điều khoản", "Bảo mật", "Bản quyền", "Nội quy"] }
                        ].map((sect, i) => (
                            <Stack key={i} gap="xl">
                                <Text fw={900} size="xl" className="uppercase tracking-widest">{sect.title}</Text>
                                <Stack gap="md">
                                    {sect.links.map((link, j) => (
                                        <Text key={j} size="md" className="cursor-pointer hover:text-blue-600 font-bold transition-colors opacity-70 hover:opacity-100">{link}</Text>
                                    ))}
                                </Stack>
                            </Stack>
                        ))}
                    </SimpleGrid>

                    <Divider mt={80} mb={40} className="border-zinc-100 dark:border-zinc-800" />

                    <Group justify="space-between" align="center" gap="xl">
                        <Text size="sm" c="dimmed" className="font-black">© 2025 THPT CHUYÊN NGUYỄN HUỆ ACADEMY. GIỮ MỌI BẢN QUYỀN.</Text>
                        <Group gap="xl">
                            <Text size="sm" fw={900} className="text-blue-600 cursor-pointer">VIETNAMESE</Text>
                            <Text size="sm" fw={900} className="opacity-40 cursor-pointer transition-opacity hover:opacity-100">ENGLISH</Text>
                        </Group>
                    </Group>
                </Container>
            </Box>

            {/* Senior Level FAB (Floating Action Button) */}
            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Group gap="xs" style={transitionStyles}>
                            {!isStandalone && (
                                <Button
                                    leftSection={<IconDeviceMobile size={22} stroke={3} />}
                                    size="lg"
                                    radius="xl"
                                    className="bg-blue-600 dark:bg-zinc-200 text-white dark:text-zinc-900 border-none px-6 font-black shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] active:scale-95 transition-all h-14"
                                    onClick={handleInstall}
                                >
                                    Tải Ứng Dụng
                                </Button>
                            )}
                            <ActionIcon
                                size="56px"
                                radius="xl"
                                color="blue"
                                variant="filled"
                                className="shadow-2xl shadow-blue-500/50"
                                onClick={() => scrollTo({ y: 0 })}
                            >
                                <IconChevronUp size={28} stroke={3} />
                            </ActionIcon>
                        </Group>
                    )}
                </Transition>
            </Affix>
        </Box>
    );
}
