'use client';

import { useState, useEffect } from 'react';

import { ActionIcon, Anchor, AspectRatio, Avatar, Badge, Box, Button, Card, Center, Container, Divider, Group, Image, Overlay, SimpleGrid, Stack, Text, Title, Transition, Affix, rem, Skeleton } from "@mantine/core";
import { IconArrowRight, IconCalendar, IconNewSection, IconSchool, IconUsers, IconFlag, IconAward, IconMapPin, IconDeviceMobile, IconLayoutDashboard, IconLogin, IconDownload, IconChevronUp, IconCheck, IconStar, IconEye } from "@tabler/icons-react";
import { Link } from "@/i18n/routing";
import { useLandingAuth } from "@/shared/hooks/useLandingAuth";
import { usePWA } from "@/providers/PWAProvider";
import { useWindowScroll } from "@mantine/hooks";
import { LandingHeader } from "@/shared/components/layout/LandingHeader";
import { AppQuery } from "@/api/AppQuery";
import { ELoaiBaiViet, TBaiViet, TBanner } from "@/shared/types/portal.type";
import dayjs from "dayjs";
import 'dayjs/locale/vi';

export default function LandingPage() {
    const { isLoggedIn, handleAccessPortal } = useLandingAuth();
    const { isInstallable, installApp, isInstalled } = usePWA();
    const [scrollPos, handleScrollTo] = useWindowScroll();
    const { data: bannersResponse, isLoading: isLoadingBanners } = AppQuery.portal.useBanners(true);
    const { data: postsResponse, isLoading: isLoadingPosts } = AppQuery.portal.usePosts({ activeOnly: true, type: ELoaiBaiViet.TIN_TUC });
    const { data: eventsResponse, isLoading: isLoadingEvents } = AppQuery.portal.usePosts({ activeOnly: true, type: ELoaiBaiViet.SU_KIEN });
    const { data: stats } = AppQuery.status.useStats();

    const [activeSlide, setActiveSlide] = useState(0);
    const banners = bannersResponse || [];

    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setActiveSlide((current) => (current + 1) % banners.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [banners.length]);

    const news: TBaiViet[] = postsResponse || [];
    const events: TBaiViet[] = eventsResponse || [];

    const activeBanner = banners[0];


    return (
        <Box className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <LandingHeader />
            <Box component="main" className="flex-1">
                <Box className="overflow-hidden bg-white dark:bg-zinc-950">
                    {/* Hero Section */}
                    <section className="relative pt-24 pb-8 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                        {/* Advanced Background Ornaments */}
                        <Box className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                            <div className="absolute top-[-10%] right-[-10%] w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[80px] sm:blur-[160px] animate-[pulse_8s_infinite]" />
                            <div className="absolute bottom-[20%] left-[-10%] w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[80px] sm:blur-[160px] animate-[pulse_12s_infinite]" />
                        </Box>

                        <Box className="absolute top-0 left-0 w-full h-[500px] sm:h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent)] dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05),transparent)] -z-20" />

                        {/* Subtle Grid Pattern */}
                        <Box className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none -z-10"
                            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                        />

                        <Container size="xl" className="relative z-10 px-4">
                            <Stack gap={40}>
                                <Box className="relative w-full max-w-5xl mx-auto h-[350px] sm:h-[500px] lg:h-[600px]">
                                    {/* Slider Implementation */}
                                    {isLoadingBanners ? (
                                        <Skeleton height="100%" radius="60px" />
                                    ) : (
                                        banners.map((banner, index) => (
                                            <Transition
                                                key={banner.id}
                                                mounted={activeSlide === index}
                                                transition="fade"
                                                duration={1000}
                                                timingFunction="ease"
                                            >
                                                {(styles) => (
                                                    <Box
                                                        style={styles}
                                                        className="absolute inset-0 w-full h-full"
                                                    >
                                                        <Card
                                                            padding={0}
                                                            radius="24px"
                                                            className="w-full h-full overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 group bg-zinc-100 dark:bg-zinc-800"
                                                        >
                                                            <Box className="relative w-full h-full">
                                                                <Image
                                                                    src={banner.hinhAnh || "https://images.unsplash.com/photo-1523050849901-72439178ad38?q=80&w=1200&auto=format&fit=crop"}
                                                                    fallbackSrc="https://placehold.co/1200x1500?text=Nguyễn+Huệ"
                                                                    alt={banner.tieuDe || "School Campus"}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4000ms]"
                                                                />
                                                                <Overlay
                                                                    gradient="linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)"
                                                                    opacity={1}
                                                                    zIndex={1}
                                                                />

                                                                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 z-10">
                                                                    <Box className="mb-2">
                                                                        <Badge variant="filled" color="blue" size="sm" radius="xs" className="font-bold">HIGHLIGHT</Badge>
                                                                    </Box>
                                                                    <Title className="text-white font-black text-2xl sm:text-4xl lg:text-5xl mb-2 leading-tight">
                                                                        {banner.tieuDe || "Campus Chuyên nghiệp"}
                                                                    </Title>
                                                                    <Text className="text-white/90 text-sm sm:text-lg font-medium max-w-2xl opacity-80">
                                                                        {banner.moTa || "Môi trường học tập chuẩn quốc tế với đầy đủ trang thiết bị hiện đại nhất."}
                                                                    </Text>
                                                                </div>
                                                            </Box>
                                                        </Card>
                                                    </Box>
                                                )}
                                            </Transition>
                                        ))
                                    )}

                                    {/* Slider Controls */}
                                    <Group className="absolute bottom-8 right-8 z-20" gap="xs">
                                        {banners.map((_, i) => (
                                            <Box
                                                key={i}
                                                onClick={() => setActiveSlide(i)}
                                                className={`h-2 rounded-full transition-all cursor-pointer ${activeSlide === i ? 'w-12 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                                            />
                                        ))}
                                    </Group>

                                    {/* Floating element */}
                                    <Box className="absolute -bottom-6 -right-6 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 z-30 flex flex-col items-center gap-1 animate-[bounce_4s_infinite] hidden sm:flex">
                                        <IconAward size={32} className="text-yellow-500" stroke={2.5} />
                                        <Text fw={900} size="xs" className="text-center">TOP ACADEMY</Text>
                                    </Box>
                                </Box>

                                <Box className="text-center max-w-4xl mx-auto">
                                    <Group gap="xs" mb="lg" justify="center">
                                        <Badge
                                            size="lg"
                                            variant="filled"
                                            className="bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-200 px-5 py-2 uppercase tracking-[0.2em] font-black border-none rounded-full h-auto text-[10px] sm:text-xs"
                                        >
                                            Elite Education
                                        </Badge>
                                        <Badge
                                            size="lg"
                                            variant="outline"
                                            color="indigo"
                                            className="px-5 py-2 uppercase tracking-[0.2em] font-black rounded-full h-auto text-[10px] sm:text-xs border-blue-500/20"
                                        >
                                            since 1975
                                        </Badge>
                                    </Group>

                                    <Title className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-zinc-900 dark:text-white mb-6 sm:mb-8 text-balance">
                                        Kiến Tạo <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent italic">Tương Lai</span> Vững Bước.
                                    </Title>

                                    <Text className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto text-base sm:text-xl mb-10">
                                        Nơi hội tụ tri thức, bản lĩnh và lòng nhân ái. Chúng tôi xây dựng môi trường giáo dục khai phóng để mỗi cá nhân tỏa sáng.
                                    </Text>

                                    <Group gap="md" justify="center">
                                        {!isLoggedIn ? (
                                            <>
                                                <Button
                                                    size="lg"
                                                    radius="xl"
                                                    className="bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:scale-[1.02] active:scale-95 h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold shadow-xl transition-all duration-300 flex-1 sm:flex-none border-none"
                                                    component={Link}
                                                    href="/auth/register"
                                                    rightSection={<IconArrowRight size={22} stroke={2.5} />}
                                                >
                                                    Gia nhập ngay
                                                </Button>
                                                <Button
                                                    size="lg"
                                                    radius="xl"
                                                    variant="white"
                                                    className="border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 flex-1 sm:flex-none shadow-sm"
                                                    component={Link}
                                                    href="/auth/login"
                                                    leftSection={<IconLogin size={20} stroke={2} />}
                                                >
                                                    Đăng nhập
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                size="lg"
                                                radius="xl"
                                                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-[1.02] active:scale-95 h-14 sm:h-16 px-10 sm:px-12 text-base sm:text-lg font-bold shadow-xl shadow-blue-600/20 transition-all duration-300 flex-1 sm:flex-none border-none"
                                                onClick={handleAccessPortal}
                                                leftSection={<IconLayoutDashboard size={24} stroke={2.5} />}
                                                rightSection={<IconArrowRight size={20} stroke={2.5} />}
                                            >
                                                Truy cập Hệ thống
                                            </Button>
                                        )}
                                    </Group>
                                </Box>

                                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" className="max-w-xl mx-auto">
                                    <Box className="p-6 rounded-[2rem] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white dark:border-zinc-800 shadow-xl group hover:-translate-y-1 transition-all">
                                        <Group gap="md" wrap="nowrap" align="center">
                                            <Box className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                                <IconUsers size={24} stroke={2.5} />
                                            </Box>
                                            <Stack gap={0}>
                                                <Text fw={1000} size="xl" className="leading-tight">{stats?.totalStudents || 1200}+</Text>
                                                <Text size="xs" fw={800} c="dimmed" tt="uppercase" className="tracking-widest">Học sinh</Text>
                                            </Stack>
                                        </Group>
                                    </Box>
                                    <Box className="p-6 rounded-[2rem] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white dark:border-zinc-800 shadow-xl group hover:-translate-y-1 transition-all">
                                        <Group gap="md" wrap="nowrap" align="center">
                                            <Box className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                                                <IconSchool size={24} stroke={2.5} />
                                            </Box>
                                            <Stack gap={0}>
                                                <Text fw={1000} size="xl" className="leading-tight">{stats?.totalTeachers || 80}+</Text>
                                                <Text size="xs" fw={800} c="dimmed" tt="uppercase" className="tracking-widest">Giáo viên</Text>
                                            </Stack>
                                        </Group>
                                    </Box>
                                </SimpleGrid>
                            </Stack>
                        </Container>
                    </section>

                    {/* News & Events Section */}
                    <section id="news" className="relative py-16 sm:py-24 overflow-hidden bg-zinc-50 dark:bg-zinc-900/30">
                        {/* Decorative Patterns */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full blur-[100px] -z-10" />

                        <Container size="lg" className="px-4">
                            <Box className="mb-12 sm:mb-16">
                                <Group justify="space-between" align="flex-end" mb="xl">
                                    <Box>
                                        <Badge variant="light" color="blue" radius="xs" size="md" className="mb-3 px-3 py-0.5 h-auto font-bold tracking-widest uppercase">PORTAL NEWS</Badge>
                                        <Title className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                                            Tin tức & <span className="text-blue-600">Sự kiện</span>
                                        </Title>
                                    </Box>
                                    <Button
                                        variant="subtle"
                                        color="zinc"
                                        size="lg"
                                        radius="xl"
                                        className="font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                        rightSection={<IconArrowRight size={20} stroke={2.5} />}
                                    >
                                        Tất cả bài viết
                                    </Button>
                                </Group>
                            </Box>

                            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="xl">
                                {isLoadingPosts ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <Card key={i} radius="32px" padding="xl" className="bg-white dark:bg-zinc-900 border-none">
                                            <Skeleton height={240} radius="24px" mb="xl" />
                                            <Skeleton height={24} width="60%" mb="md" />
                                            <Skeleton height={16} mb="xs" />
                                            <Skeleton height={16} width="80%" />
                                        </Card>
                                    ))
                                ) : (
                                    news.map((post) => (
                                        <Card
                                            key={post.id}
                                            radius="16px"
                                            padding={0}
                                            className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                                        >
                                            <Box className="relative aspect-[16/10] overflow-hidden">
                                                <Image
                                                    src={post.anhBia || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop"}
                                                    alt={post.tieuDe}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute top-6 right-6">
                                                    <Badge
                                                        className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-white border-none shadow-lg px-4 py-1 h-auto font-black text-[10px]"
                                                        radius="sm"
                                                    >
                                                        {post.loai === ELoaiBaiViet.TIN_TUC ? "NEWS" : "EVENT"}
                                                    </Badge>
                                                </div>
                                                <Overlay
                                                    gradient="linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)"
                                                    zIndex={1}
                                                />
                                            </Box>

                                            <Stack gap="xs" p="lg" className="flex-1">
                                                <Group gap="xs" className="text-zinc-400 dark:text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                                                    <IconCalendar size={12} />
                                                    {dayjs(post.ngayTao).format("DD/MM/YYYY")}
                                                </Group>

                                                <Title order={3} className="text-lg font-bold leading-snug text-zinc-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {post.tieuDe}
                                                </Title>

                                                <Text className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium line-clamp-2 leading-relaxed">
                                                    {post.tomTat || "Nhấn để xem chi tiết bài viết này..."}
                                                </Text>

                                                <Group justify="space-between" mt="md" pt="md" className="border-t border-zinc-50 dark:border-zinc-800">
                                                    <Button
                                                        variant="subtle"
                                                        color="blue"
                                                        radius="xl"
                                                        size="xs"
                                                        className="px-0 font-bold text-blue-600 hover:bg-transparent"
                                                        rightSection={<IconArrowRight size={14} stroke={2.5} />}
                                                    >
                                                        Xem thêm
                                                    </Button>
                                                    <Group gap={8}>
                                                        <IconEye size={16} className="text-zinc-400" />
                                                        <Text size="xs" fw={800} c="dimmed">{post.luotXem || 0}</Text>
                                                    </Group>
                                                </Group>
                                            </Stack>
                                        </Card>
                                    ))
                                )}
                            </SimpleGrid>
                        </Container>
                    </section>

                    {/* Featured Events / Activity Timeline */}
                    <section id="events" className="relative py-16 sm:py-24 bg-white dark:bg-zinc-950 overflow-hidden">
                        {/* Subtle geometric pattern */}
                        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none -z-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '100px 100px' }} />

                        <Container size="lg" className="px-4">
                            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={100}>
                                <Box className="relative">
                                    <Badge variant="light" color="blue" size="md" radius="xs" className="mb-4 font-bold uppercase tracking-wider">UPCOMING EVENTS</Badge>
                                    <Title className="text-3xl sm:text-4xl font-black tracking-tight mb-6 leading-tight">
                                        Hoạt động <span className="text-blue-600">Nổi bật</span>
                                    </Title>
                                    <Text className="text-base sm:text-lg font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
                                        Nguyễn Huệ không chỉ có học tập, đây là nơi rèn luyện kỹ năng và trải nghiệm cuộc sống qua hàng loạt sự kiện quy mô.
                                    </Text>

                                    <Group gap="md">
                                        <Box className="p-5 rounded-2xl bg-zinc-900 text-white shadow-xl flex-1 transform hover:-translate-y-1 transition-transform">
                                            <IconAward size={32} className="text-yellow-500 mb-3" stroke={2} />
                                            <Text fw={800} size="md" mb={4}>Academic Elite</Text>
                                            <Text size="xs" fw={500} opacity={0.7}>Top 1 về học sinh giỏi quốc gia.</Text>
                                        </Box>
                                        <Box className="p-5 rounded-2xl bg-blue-600 text-white shadow-xl flex-1 transform hover:-translate-y-1 transition-transform">
                                            <IconStar size={32} className="text-white mb-3" stroke={2} />
                                            <Text fw={800} size="md" mb={4}>Global Citizens</Text>
                                            <Text size="xs" fw={500} className="text-blue-100">Chuẩn đầu ra ngoại ngữ ưu việt.</Text>
                                        </Box>
                                    </Group>
                                </Box>

                                <Box className="mt-16 sm:mt-0">
                                    <Stack gap="xl">
                                        {isLoadingEvents ? (
                                            Array(4).fill(0).map((_, i) => (
                                                <Skeleton key={i} height={120} radius="2.5rem" />
                                            ))
                                        ) : (
                                            events.map((ev, i) => (
                                                <Box
                                                    key={i}
                                                    className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-zinc-100 dark:border-zinc-700 shadow-sm hover:shadow-lg cursor-pointer"
                                                >
                                                    <Group wrap="nowrap" gap="md">
                                                        <Box className="w-16 h-16 rounded-2xl bg-zinc-900 text-white flex flex-col items-center justify-center p-1">
                                                            <Text fw={900} size="md" className="leading-tight">{dayjs(ev.ngayTao).format("DD")}</Text>
                                                            <Text size="10px" fw={700} tt="uppercase" opacity={0.7}>Th{dayjs(ev.ngayTao).format("MM")}</Text>
                                                        </Box>
                                                        <Box className="flex-1">
                                                            <Badge variant="light" color="blue" mb={4} radius="xs" className="font-bold text-[9px]">EVENT</Badge>
                                                            <Title order={4} className="text-base sm:text-lg font-bold group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-1">{ev.tieuDe}</Title>
                                                            <Text size="xs" c="dimmed" fw={500} className="line-clamp-1">{ev.tomTat || "Click to view event details"}</Text>
                                                        </Box>
                                                        <Box className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all overflow-hidden relative">
                                                            <IconArrowRight size={20} stroke={3} className="group-hover:translate-x-12 transition-transform duration-300 absolute" />
                                                            <IconArrowRight size={20} stroke={3} className="-translate-x-12 group-hover:translate-x-0 transition-transform duration-300 absolute" />
                                                        </Box>
                                                    </Group>
                                                </Box>
                                            ))
                                        )}
                                    </Stack>
                                </Box>
                            </SimpleGrid>
                        </Container>
                    </section>

                    {/* Service Portal (Utilities) */}
                    <section id="services" className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-900/20">
                        <Container size="lg" className="px-4">
                            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={100}>
                                <Stack gap="lg">
                                    <Box>
                                        <Badge variant="light" color="indigo" size="md" radius="xs" mb="sm" className="font-bold uppercase tracking-wider">SMART ECOSYSTEM</Badge>
                                        <Title className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
                                            Cổng Dịch vụ <br /> <span className="text-blue-600">Trực tuyến</span>
                                        </Title>
                                        <Text className="text-zinc-500 dark:text-zinc-400 font-medium text-base sm:text-lg leading-relaxed mb-6">
                                            Mọi nhu cầu học vụ và kết nối được thu gọn trong một nền tảng duy nhất. Nhanh chóng, minh bạch và hiệu quả.
                                        </Text>
                                    </Box>

                                    <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xl">
                                        {[
                                            { icon: <IconSchool size={36} />, title: "Kết quả học tập", desc: "Tra cứu điểm số & rèn luyện", color: "blue", href: "/student/grades" },
                                            { icon: <IconCalendar size={36} />, title: "Thời khóa biểu", desc: "Lịch học & Sự kiện lớp", color: "indigo", href: "/student/schedule" },
                                            { icon: <IconUsers size={36} />, title: "Mạng xã hội", desc: "Kết nối & Chia sẻ khoảnh khắc", color: "blue", href: "/social" },
                                            { icon: <IconNewSection size={36} />, title: "Gửi yêu cầu", desc: "Xin nghỉ phép, Xác nhận...", color: "zinc", href: "/student/my-flow" },
                                        ].map((item, i) => (
                                            <Card
                                                key={i}
                                                padding="lg"
                                                radius="20px"
                                                component={Link}
                                                href={item.href}
                                                className={`${item.color === 'zinc' ? 'bg-zinc-900 border-none hover:bg-zinc-800' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-blue-500/30'} shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 group cursor-pointer border no-underline text-inherit`}
                                            >
                                                <Box className={`w-12 h-12 rounded-xl ${item.color === 'zinc' ? 'bg-zinc-800' : (item.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600')} flex items-center justify-center mb-6 transition-all group-hover:scale-110`}>
                                                    {item.icon && <Box className="scale-75">{item.icon}</Box>}
                                                </Box>
                                                <Text fw={800} size="lg" className={item.color === 'zinc' ? 'text-white' : 'text-zinc-900 dark:text-white'}>{item.title}</Text>
                                                <Text size="xs" mt={2} fw={600} className={item.color === 'zinc' ? 'text-white/60' : 'text-zinc-500'}>{item.desc}</Text>
                                            </Card>
                                        ))}
                                    </SimpleGrid>
                                </Stack>

                                <Box className="relative hidden lg:flex items-center justify-center">
                                    <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full" />
                                    <Box className="relative p-12 bg-white dark:bg-zinc-900 rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-zinc-100 dark:border-zinc-800 transform rotate-2">
                                        <Image
                                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop"
                                            alt="Ecosystem"
                                            className="rounded-[40px] w-[500px] aspect-[4/3] object-cover"
                                        />
                                        <Box className="absolute -top-10 -left-10 p-8 bg-zinc-900 text-white rounded-[3rem] shadow-2xl animate-bounce">
                                            <IconCheck size={40} stroke={4} />
                                        </Box>
                                    </Box>
                                </Box>
                            </SimpleGrid>
                        </Container>
                    </section>
                </Box>
            </Box>

            {/* Admissions Banner */}
            <section id="admissions" className="py-12 sm:py-20">
                <Container size="lg" className="px-4">
                    <Box className="relative p-8 sm:p-14 lg:p-16 rounded-[40px] bg-gradient-to-br from-blue-700 via-indigo-800 to-indigo-950 overflow-hidden text-white shadow-2xl">
                        <Box className="absolute top-0 right-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-[100px] sm:blur-[150px]" />
                        <Box className="absolute bottom-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-500/20 rounded-full translate-y-1/3 -translate-x-1/4 blur-[100px] sm:blur-[150px]" />

                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={60} className="relative z-10 items-center">
                            <Stack gap="lg">
                                <Badge color="white" variant="white" size="lg" className="self-start text-blue-900 shadow-lg font-bold h-8 px-5 uppercase border-none">Tuyển sinh 2025</Badge>
                                <Title order={2} className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white tracking-tight">
                                    Cánh cửa <br /> <span className="italic opacity-80 font-medium">Tương lai</span>
                                </Title>
                                <Text className="text-blue-100 max-w-lg leading-relaxed text-base sm:text-xl font-medium opacity-90">
                                    Đồng hành cùng chúng tôi trên hành trình chinh phục tri thức và khẳng định bản thân.
                                </Text>
                                <Group gap="md" mt="xl">
                                    <Button
                                        size="lg"
                                        radius="xl"
                                        className="bg-white text-blue-900 hover:bg-zinc-50 border-none h-14 sm:h-16 px-8 sm:px-10 shadow-xl font-bold text-lg flex-1 sm:flex-none uppercase"
                                        component={Link}
                                        href="/auth/register"
                                        leftSection={<IconArrowRight size={22} stroke={3} />}
                                    >
                                        Đăng ký ngay
                                    </Button>
                                    <Button
                                        size="lg"
                                        radius="xl"
                                        variant="outline"
                                        className="text-white border-white/30 h-14 sm:h-16 px-8 sm:px-10 shadow-sm hover:bg-white/10 transition-all font-bold text-lg flex-1 sm:flex-none uppercase"
                                        leftSection={<IconDownload size={20} stroke={2.5} />}
                                        component={Link}
                                        href="/download"
                                        style={{ display: isInstallable && !isInstalled ? 'flex' : 'none' }}
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
            <Box component="footer" className="py-12 sm:py-20 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <Container size="lg" className="px-4">
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={60}>
                        <Stack gap="xl">
                            <Group gap="xs">
                                <Box className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center p-2 shadow-lg border border-zinc-100 dark:border-zinc-800">
                                    <Image src="/favicon.png" alt="Logo" className="w-full h-full object-contain" />
                                </Box>
                                <Stack gap={0}>
                                    <Text fw={900} size="xl" className="leading-tight tracking-tighter text-zinc-900 dark:text-white uppercase">
                                        Nguyễn Huệ
                                    </Text>
                                    <Text size="xs" fw={800} className="text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] leading-none opacity-80">
                                        Academy
                                    </Text>
                                </Stack>
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

                    <Divider mt={60} mb={30} className="border-zinc-100 dark:border-zinc-800" />

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
                <Transition transition="slide-up" mounted={scrollPos.y > 200}>
                    {(transitionStyles) => (
                        <Group gap="xs" style={transitionStyles}>
                            {isInstallable && !isInstalled && (
                                <Button
                                    leftSection={<IconDeviceMobile size={22} stroke={3} />}
                                    size="lg"
                                    radius="xl"
                                    className="bg-indigo-600 dark:bg-zinc-200 text-white dark:text-zinc-900 border-none px-6 font-black shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] active:scale-95 transition-all h-14"
                                    component={Link}
                                    href="/download"
                                >
                                    Cài đặt App
                                </Button>
                            )}
                            <ActionIcon
                                size="56px"
                                radius="xl"
                                color="blue"
                                variant="filled"
                                className="shadow-2xl shadow-blue-500/50"
                                onClick={() => handleScrollTo({ y: 0 })}
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