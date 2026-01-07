"use client";

import { Container, Title, Text, Button, Stack, Group, Box, Card, Image, List, ThemeIcon, Badge, Center, Divider, SimpleGrid } from "@mantine/core";
import { IconDownload, IconShare, IconPlus, IconDeviceMobile, IconCheck, IconBrandAndroid, IconBrandApple, IconInfoCircle, IconArrowRight, IconBell, IconBellRinging, IconAlertCircle, IconLoader2 } from "@tabler/icons-react";
import { usePWA } from "@/providers/PWAProvider";
import { Link } from "@/i18n/routing";

export default function DownloadPage() {
    const {
        isInstallable,
        installApp,
        isInstalled,
        isIOS,
        notificationPermission,
        requestNotificationPermission,
        subscribeToPush
    } = usePWA();

    return (
        <Box className="min-h-screen bg-slate-50 dark:bg-zinc-950">
            {/* Header / Brand Section */}
            <Box className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 pt-16 pb-12 shadow-sm">
                <Container size="sm">
                    <Stack align="center" gap="md">
                        <Box className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl p-4 border border-slate-100">
                            <Image src="/favicon.png" alt="Logo" className="w-full h-full object-contain" />
                        </Box>
                        <Stack gap={0} align="center">
                            <Title className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                                NHers Academy
                            </Title>
                            <Text size="sm" fw={800} className="text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
                                Smart School App
                            </Text>
                        </Stack>
                        <Badge variant="light" color="green" size="lg" className="h-8 px-4 font-bold border-none">
                            Phiên bản chính thức 2.5
                        </Badge>
                    </Stack>
                </Container>
            </Box>

            <Container size="sm" py={40}>
                {isInstalled ? (
                    <Card radius="32px" padding="xl" withBorder className="text-center shadow-xl">
                        <Stack align="center" gap="lg">
                            <Box className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                <IconCheck size={40} stroke={3} />
                            </Box>
                            <Title order={2} className="font-black italic">Ứng dụng đã được cài đặt!</Title>
                            <Text c="dimmed" fw={600}>Bạn có thể mở NHers từ màn hình chính điện thoại để bắt đầu trải nghiệm chuyên nghiệp nhất.</Text>
                            <Button
                                component={Link}
                                href="/"
                                size="xl"
                                radius="xl"
                                fullWidth
                                className="bg-indigo-600 h-16 text-lg font-black shadow-lg"
                            >
                                Truy cập ngay
                            </Button>
                        </Stack>
                    </Card>
                ) : (
                    <Stack gap={32}>
                        {/* Device Detection Alert */}
                        <Card radius="24px" p="xl" className="bg-indigo-600 text-white shadow-2xl overflow-hidden relative border-none">
                            <Box className="absolute top-0 right-0 p-4 opacity-10">
                                <IconDeviceMobile size={120} stroke={1} />
                            </Box>
                            <Stack gap="md" className="relative z-10">
                                <Group gap="xs">
                                    {isIOS ? <IconBrandApple size={28} stroke={2.5} /> : <IconBrandAndroid size={28} stroke={2.5} />}
                                    <Text fw={900} size="lg" className="uppercase tracking-widest">
                                        Phát hiện thiết bị: {isIOS ? 'iOS (iPhone/iPad)' : 'Android'}
                                    </Text>
                                </Group>
                                <Title order={2} className="text-3xl font-black leading-tight italic">
                                    Trang web đã sẵn sàng để "Biến hình" thành App.
                                </Title>
                                <Text className="text-indigo-100 font-bold opacity-90">
                                    Cài đặt NHers Academy sẽ giúp bạn bỏ qua thanh địa chỉ trình duyệt, hoạt động mượt mà và nhận thông báo tức thì.
                                </Text>
                            </Stack>
                        </Card>

                        {/* Installation Steps based on OS */}
                        {isIOS ? (
                            <Stack gap="xl">
                                <Title order={3} className="text-2xl font-black italic flex items-center gap-2">
                                    <IconInfoCircle className="text-blue-500" /> Hướng dẫn cài đặt trên iOS
                                </Title>
                                <List
                                    spacing="lg"
                                    size="md"
                                    center
                                    icon={
                                        <ThemeIcon color="blue" size={32} radius="xl">
                                            <IconCheck size={18} stroke={3} />
                                        </ThemeIcon>
                                    }
                                    className="font-bold"
                                >
                                    <List.Item>
                                        Nhấn vào nút <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1">Chia sẻ <IconShare size={16} /></span> ở thanh công cụ Safari.
                                    </List.Item>
                                    <List.Item>
                                        Kéo xuống dưới và chọn <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1">Thêm vào MH chính <IconPlus size={16} /></span>.
                                    </List.Item>
                                    <List.Item>
                                        Nhấn <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">Thêm</span> ở góc phải màn hình để hoàn tất.
                                    </List.Item>
                                </List>
                                <Box className="bg-slate-200 dark:bg-zinc-800 rounded-3xl p-4 aspect-[4/3] flex items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-700 shadow-inner">
                                    <Text c="dimmed" fw={800} tt="uppercase" size="xs">Ảnh minh họa hướng dẫn sẽ hiển thị ở đây</Text>
                                </Box>
                            </Stack>
                        ) : (
                            <Stack gap="xl">
                                <Title order={3} className="text-2xl font-black italic">Hướng dẫn cài đặt trên Android</Title>
                                <Card radius="24px" withBorder className="bg-white dark:bg-zinc-900 shadow-lg p-8 text-center">
                                    {isInstallable ? (
                                        <Stack gap="xl">
                                            <Box className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
                                                <IconDownload size={32} stroke={2.5} />
                                            </Box>
                                            <Stack gap={4}>
                                                <Text size="xl" fw={900}>Sẵn sàng cài đặt!</Text>
                                                <Text c="dimmed" size="sm" fw={600}>Nhấn nút bên dưới để tải App NHers về điện thoại của bạn ngay lập tức.</Text>
                                            </Stack>
                                            <Button
                                                size="xl"
                                                radius="xl"
                                                className="bg-blue-600 h-18 text-xl font-black shadow-xl shadow-blue-500/30 animate-pulse hover:scale-105 transition-all"
                                                onClick={installApp}
                                                leftSection={<IconDownload size={24} stroke={3} />}
                                            >
                                                CÀI ĐẶT APP NGAY
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Stack gap="md">
                                            <Text fw={800} c="orange">App đã sẵn sàng trong menu trình duyệt!</Text>
                                            <Text size="sm" c="dimmed" fw={600}>
                                                Nhấn vào dấu 3 chấm <span className="font-black text-slate-800 dark:text-white">⋮</span> ở góc trên trình duyệt Chrome và chọn <span className="font-black italic text-blue-600">"Cài đặt ứng dụng"</span>.
                                            </Text>
                                        </Stack>
                                    )}
                                </Card>
                            </Stack>
                        )}

                        {/* Push Notification Configuration */}
                        <Card radius="32px" p="xl" withBorder className="bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
                            <Stack gap="xl">
                                <Group justify="space-between">
                                    <Stack gap={0}>
                                        <Title order={3} className="text-2xl font-black italic flex items-center gap-2">
                                            <IconBellRinging className="text-indigo-600" /> Thông báo Đẩy
                                        </Title>
                                        <Text size="sm" c="dimmed" fw={600}>Nhận tin nhắn và thông báo ngay cả khi đóng ứng dụng.</Text>
                                    </Stack>
                                    <Badge color={notificationPermission === 'granted' ? 'green' : 'gray'} variant="light" size="lg">
                                        {notificationPermission === 'granted' ? 'Đã bật' : 'Chưa bật'}
                                    </Badge>
                                </Group>

                                <Divider variant="dashed" />

                                {notificationPermission !== 'granted' ? (
                                    <Stack gap="md">
                                        <Box className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800">
                                            <Group gap="xs" wrap="nowrap" align="flex-start">
                                                <IconAlertCircle className="text-amber-600 shrink-0" size={20} />
                                                <Text size="sm" fw={600} className="text-amber-900 dark:text-amber-200">
                                                    Bạn cần cho phép thông báo trên trình duyệt trước khi đăng ký nhận tin nhắn.
                                                </Text>
                                            </Group>
                                        </Box>
                                        <Button
                                            size="lg"
                                            radius="xl"
                                            variant="filled"
                                            color="indigo"
                                            fullWidth
                                            className="h-14 font-black shadow-lg"
                                            onClick={requestNotificationPermission}
                                            leftSection={<IconBell size={20} />}
                                        >
                                            CHO PHÉP THÔNG BÁO
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Stack gap="md">
                                        <Text size="sm" fw={600} c="dimmed">
                                            Sau khi cài đặt App, hãy nhấn nút bên dưới để đồng bộ hóa thiết bị này với hệ thống thông báo của trường.
                                        </Text>
                                        <Button
                                            size="lg"
                                            radius="xl"
                                            variant="light"
                                            color="indigo"
                                            fullWidth
                                            className="h-14 font-black border-none"
                                            onClick={async () => {
                                                const success = await subscribeToPush();
                                                if (success) {
                                                    alert("Đăng ký thông báo thành công!");
                                                } else {
                                                    alert("Đăng ký không thành công. Hãy đảm bảo bạn sử dụng trình duyệt hỗ trợ (Chrome/Safari) và đã cài đặt ứng dụng.");
                                                }
                                            }}
                                            leftSection={<IconBellRinging size={20} />}
                                        >
                                            ĐĂNG KÝ NHẬN THÔNG BÁO ĐẨY
                                        </Button>
                                    </Stack>
                                )}
                            </Stack>
                        </Card>

                        <Divider variant="dashed" label={<Text fw={900} className="uppercase tracking-widest text-[10px] opacity-40">Tại sao nên dùng bản App?</Text>} labelPosition="center" />

                        <SimpleGrid cols={2} spacing="md">
                            <Card radius="24px" p="lg" withBorder className="bg-white dark:bg-zinc-900 border-none shadow-sm">
                                <Stack gap="xs">
                                    <Text fw={900} size="sm" color="blue">Sạch sẽ & Gọn gàng</Text>
                                    <Text size="xs" c="dimmed" fw={600}>Loại bỏ hoàn toàn các thanh công cụ thừa từ trình duyệt.</Text>
                                </Stack>
                            </Card>
                            <Card radius="24px" p="lg" withBorder className="bg-white dark:bg-zinc-900 border-none shadow-sm">
                                <Stack gap="xs">
                                    <Text fw={900} size="sm" color="indigo">Thông báo tức thì</Text>
                                    <Text size="xs" c="dimmed" fw={600}>Nhận tin nhắn, lịch học ngay khi app đang đóng.</Text>
                                </Stack>
                            </Card>
                        </SimpleGrid>

                        <Button
                            component={Link}
                            href="/"
                            variant="subtle"
                            color="gray"
                            size="md"
                            radius="xl"
                            className="font-black"
                            rightSection={<IconArrowRight size={18} />}
                        >
                            Tiếp tục dùng bản Web
                        </Button>
                    </Stack>
                )}
            </Container>

            {/* Support Section */}
            <Box className="py-12 bg-slate-100 dark:bg-zinc-900/50">
                <Container size="sm" className="text-center">
                    <Text size="xs" fw={900} c="dimmed" className="uppercase tracking-[0.2em] mb-4">Hỗ trợ kỹ thuật</Text>
                    <Text size="sm" fw={700} c="dimmed">
                        Gặp khó khăn khi cài đặt? Liên hệ Ban CNTT trường qua Zalo hoặc Hotline: <br />
                        <span className="text-blue-600">0987.xxx.xxx</span>
                    </Text>
                </Container>
            </Box>
        </Box>
    );
}
