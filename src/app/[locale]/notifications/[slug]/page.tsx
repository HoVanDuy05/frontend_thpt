"use client";

import { AppQuery } from "@/api/AppQuery";
import { Link } from "@/i18n/routing";
import { dayjs } from "@/shared/utils/date.util";
import {
    Anchor,
    Avatar,
    Badge,
    Box,
    Breadcrumbs,
    Button,
    Card,
    Container,
    Divider,
    Group,
    Image,
    Skeleton,
    Stack,
    Text,
    Title,
    TypographyStylesProvider,
    Center,
} from "@mantine/core";
import { IconArrowLeft, IconCalendar, IconEye, IconShare, IconUser } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { LandingHeader } from "@/shared/components/layout/LandingHeader";

export default function NotificationDetailPage() {
    const { slug } = useParams();
    const t = useTranslations("common");
    const { data: post, isLoading } = AppQuery.portal.usePostDetail(slug as string);

    if (isLoading) {
        return (
            <Box className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <LandingHeader />
                <Container size="md" py="xl" pt={100}>
                    <Stack gap="xl">
                        <Skeleton height={400} radius="xl" />
                        <Skeleton height={40} width="70%" />
                        <Group>
                            <Skeleton height={20} width={100} />
                            <Skeleton height={20} width={100} />
                        </Group>
                        <Skeleton height={200} />
                    </Stack>
                </Container>
            </Box>
        );
    }

    if (!post) {
        return (
            <Box className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <LandingHeader />
                <Container size="md" py="xl" pt={100}>
                    <Text size="xl" fw={700} ta="center">Không tìm thấy thông báo</Text>
                    <Center mt="md">
                        <Button component={Link} href="/" variant="subtle">Trở về trang chủ</Button>
                    </Center>
                </Container>
            </Box>
        );
    }

    return (
        <Box className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
            <LandingHeader />
            <Box component="main" className="flex-1 pt-24 pb-16">
                {/* Hero / Header Image */}
                {post.anhBia && (
                    <Box className="w-full h-[300px] md:h-[400px] mb-8 md:mb-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent z-10" />
                        <Image
                            src={post.anhBia}
                            alt={post.tieuDe}
                            className="w-full h-full object-cover"
                        />
                        <Container size="md" className="relative z-20 h-full flex flex-col justify-end pb-8 md:pb-12 text-white">
                            <Badge size="lg" color="blue" mb="sm">{post.loai}</Badge>
                            <Title className="text-3xl md:text-5xl font-black leading-tight drop-shadow-lg max-w-4xl">
                                {post.tieuDe}
                            </Title>
                        </Container>
                    </Box>
                )}

                <Container size="md" className={!post.anhBia ? "pt-8" : ""}>
                    {!post.anhBia && (
                        <Stack gap="md" mb="xl">
                            <Badge size="lg" color="blue" mb="xs">{post.loai}</Badge>
                            <Title className="text-3xl md:text-5xl font-black leading-tight text-zinc-900 dark:text-white">
                                {post.tieuDe}
                            </Title>
                        </Stack>
                    )}

                    <Group justify="space-between" mb="xl" className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
                        <Group gap="lg">
                            <Group gap="xs">
                                <Avatar src={post.nguoiTao?.avatar} radius="xl" size="sm" />
                                <Text size="sm" fw={600} className="text-zinc-700 dark:text-zinc-300">
                                    {post.nguoiTao?.hoSoGiaoVien?.hoTen || post.nguoiTao?.taiKhoan || "Admin"}
                                </Text>
                            </Group>
                            <Divider orientation="vertical" />
                            <Group gap="xs" c="dimmed">
                                <IconCalendar size={16} />
                                <Text size="sm" fw={500}>
                                    {dayjs(post.ngayTao).format("DD/MM/YYYY HH:mm")}
                                </Text>
                            </Group>
                            <Divider orientation="vertical" />
                            <Group gap="xs" c="dimmed">
                                <IconEye size={16} />
                                <Text size="sm" fw={500}>{post.luotXem} lượt xem</Text>
                            </Group>
                        </Group>

                        <Button variant="light" color="blue" radius="xl" size="xs" leftSection={<IconShare size={14} />}>
                            Chia sẻ
                        </Button>
                    </Group>

                    {/* Content */}
                    <Card padding="xl" radius="xl" className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 min-h-[400px]">
                        <TypographyStylesProvider className="prose dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: post.noiDung }} />
                        </TypographyStylesProvider>
                    </Card>

                    {/* Footer Actions */}
                    <Group mt="xl" justify="center">
                        <Button
                            component={Link}
                            href="/"
                            variant="subtle"
                            color="gray"
                            leftSection={<IconArrowLeft size={18} />}
                            radius="xl"
                        >
                            Trở về trang chủ
                        </Button>
                    </Group>
                </Container>
            </Box>
        </Box>
    );
}
