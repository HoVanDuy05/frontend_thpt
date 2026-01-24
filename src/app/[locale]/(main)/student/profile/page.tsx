"use client";

import { Box, Group, Stack, Text, Avatar, Badge, Grid, Button, ThemeIcon, Divider, Title, Paper, Image } from "@mantine/core";
import { IconUser, IconEdit, IconSchool, IconId, IconPhone, IconMapPin, IconCalendar, IconMail, IconLogout, IconSettings, IconChevronRight, IconGitPullRequest } from "@tabler/icons-react";
import { AppQuery } from "@/api/AppQuery";
import { useState } from "react";
import { useAppStore } from "@/providers/store/useAppStore";
import { EditProfileModal } from "@/feauture/social/components/EditProfileModal";
import { dayjs } from "@/shared/utils/date.util";
import { useRouter, Link } from "@/i18n/routing";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { BiometricSettings } from "./components/BiometricSettings";

export default function StudentProfilePage() {
    const t = useTranslations("student.profile_page");
    const { user, logout } = useAppStore();
    const { data: profile } = AppQuery.auth.useProfile();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const router = useRouter();

    const studentInfo = profile?.hoSoHocSinh;

    // QR Code Data: Public info URL
    const qrData = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}/info/${user?.id}` : `https://thpt-portal.edu.vn/info/${user?.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
        notifications.show({
            title: t('logout_success_title'),
            message: t('logout_success_message'),
            color: "blue"
        });
    };

    return (
        <Box className="pb-24">
            {/* Header / Cover */}
            <Box className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden rounded-b-[2rem] shadow-lg mb-16">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

                <Container className="h-full relative z-10 pt-8 px-6 text-white">
                    <Group justify="space-between" align="start">
                        <div>
                            <Text size="lg" fw={500} className="opacity-90">{t('header_title')}</Text>
                            <Title order={2} className="tracking-tight">{t('header_subtitle')}</Title>
                        </div>
                        <Button
                            variant="white"
                            color="indigo"
                            size="xs"
                            radius="xl"
                            leftSection={<IconEdit size={14} />}
                            onClick={() => setIsEditModalOpen(true)}
                            className="shadow-sm"
                        >
                            {t('edit')}
                        </Button>
                    </Group>
                </Container>
            </Box>

            <Container className="-mt-32 relative z-20 px-4">
                <Grid gutter="lg">
                    {/* Left Column: Student Card */}
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <StudentCard
                            user={user}
                            profile={profile}
                            studentInfo={studentInfo}
                            qrUrl={qrUrl}
                            t={t}
                        />
                    </Grid.Col>

                    {/* Right Column: VNeID Style Info & Settings */}
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <Stack gap="lg">
                            {/* Personal Information (VNeID Style) */}
                            <Paper radius="xl" p={0} className="overflow-hidden bg-white dark:bg-zinc-900 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800">
                                <Box className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                                    <Group>
                                        <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                                            <IconUser size={20} />
                                        </ThemeIcon>
                                        <Text fw={700} size="md">{t('identity_section')}</Text>
                                    </Group>
                                </Box>
                                <Stack gap={0}>
                                    <InfoRow icon={IconId} label={t('identity_id')} value={studentInfo?.maSoHs || t('not_updated')} />
                                    <Divider className="border-gray-100 dark:border-zinc-800" />
                                    <InfoRow icon={IconUser} label={t('full_name')} value={profile?.hoTen || studentInfo?.hoTen || user?.taiKhoan || t('not_updated')} highlight />
                                    <Divider className="border-gray-100 dark:border-zinc-800" />
                                    <InfoRow icon={IconCalendar} label={t('dob')} value={profile?.ngaySinh ? dayjs(profile.ngaySinh).format('DD/MM/YYYY') : t('not_updated')} />
                                    <Divider className="border-gray-100 dark:border-zinc-800" />
                                    <InfoRow icon={IconUser} label={t('gender')} value={profile?.gioiTinh === 'NAM' ? t('gender_male') : t('gender_female')} />
                                    <Divider className="border-gray-100 dark:border-zinc-800" />
                                    <InfoRow icon={IconPhone} label={t('phone')} value={profile?.soDienThoai || t('not_updated')} />
                                    <Divider className="border-gray-100 dark:border-zinc-800" />
                                    <InfoRow icon={IconMail} label={t('email')} value={profile?.email || user?.email} />
                                    <Divider className="border-gray-100 dark:border-zinc-800" />
                                    <InfoRow icon={IconMapPin} label={t('address')} value={profile?.diaChi || t('not_updated')} isLast />
                                </Stack>
                            </Paper>

                            {/* Academic Info */}
                            <Paper radius="xl" p={0} className="overflow-hidden bg-white dark:bg-zinc-900 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800">
                                <Box className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                                    <Group>
                                        <ThemeIcon variant="light" color="teal" size="lg" radius="md">
                                            <IconSchool size={20} />
                                        </ThemeIcon>
                                        <Text fw={700} size="md">{t('academic_section')}</Text>
                                    </Group>
                                </Box>
                                <Stack gap={0}>
                                    <InfoRow icon={IconSchool} label={t('current_class')} value={studentInfo?.cacLopNam?.[0]?.lopNam?.lopHoc?.tenLop || studentInfo?.lopHoc?.tenLop || t('not_assigned')} />
                                    <Divider className="border-gray-100 dark:border-zinc-800" />
                                    <InfoRow icon={IconSchool} label={t('course')} value={studentInfo?.cacLopNam?.[0]?.lopNam?.namHoc?.tenNamHoc || "2023 - 2026"} />
                                    <Divider className="border-gray-100 dark:border-zinc-800" />
                                    <InfoRow icon={IconUser} label={t('homeroom_teacher')} value={studentInfo?.cacLopNam?.[0]?.lopNam?.gvChuNhiem?.hoTen || t('not_available')} isLast />
                                </Stack>
                            </Paper>

                            {/* Settings */}
                            <Paper radius="xl" p="md" className="bg-white dark:bg-zinc-900 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800">
                                <Text fw={700} mb="md" size="sm" c="dimmed" tt="uppercase">{t('settings_section')}</Text>
                                <Stack gap="xs">
                                    <Button
                                        component={Link}
                                        href="/student/my-flow"
                                        variant="light"
                                        color="violet"
                                        fullWidth
                                        justify="space-between"
                                        h={50}
                                        radius="lg"
                                        leftSection={<IconGitPullRequest size={20} />}
                                        rightSection={<IconChevronRight size={16} />}
                                        className="bg-violet-50 hover:bg-violet-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-violet-600 dark:text-violet-400"
                                    >
                                        <Text fw={600}>{t('my_flows')}</Text>
                                    </Button>
                                    <Button
                                        variant="light"
                                        color="gray"
                                        fullWidth
                                        justify="space-between"
                                        h={50}
                                        radius="lg"
                                        leftSection={<IconSettings size={20} />}
                                        rightSection={<IconChevronRight size={16} />}
                                        className="bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                                    >
                                        <Text fw={600} c="dark" className="dark:text-white">{t('account_settings')}</Text>
                                    </Button>
                                    <Button
                                        variant="light"
                                        color="red"
                                        fullWidth
                                        justify="space-between"
                                        h={50}
                                        radius="lg"
                                        leftSection={<IconLogout size={20} />}
                                        onClick={handleLogout}
                                        className="bg-red-50 hover:bg-red-100 border-red-100 text-red-600 hover:text-red-700 dark:bg-red-900/10 dark:hover:bg-red-900/20"
                                    >
                                        <Text fw={600}>{t('logout')}</Text>
                                    </Button>
                                    {/* Biometric Settings */}
                                    <BiometricSettings />
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>

            <EditProfileModal
                opened={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={{
                    ...profile,
                    hoTen: profile?.hoTen || studentInfo?.hoTen || '',
                    email: profile?.email || user?.email || '',
                    ngaySinh: studentInfo?.ngaySinh || profile?.ngaySinh,
                    gioiTinh: studentInfo?.gioiTinh || profile?.gioiTinh,
                    soDienThoai: studentInfo?.soDienThoai || profile?.soDienThoai,
                    diaChi: studentInfo?.diaChi || profile?.diaChi,
                    hoSoHocSinh: studentInfo,
                    hoSoGiaoVien: profile?.hoSoGiaoVien
                }}
            />
        </Box>
    );
}

// ----------------------------------------------------------------------
// SUB COMPONENTS
// ----------------------------------------------------------------------

function Container({ children, className }: { children: React.ReactNode, className?: string }) {
    return <Box className={`max-w-5xl mx-auto ${className}`}>{children}</Box>;
}

function InfoRow({ icon: Icon, label, value, isLast, highlight }: { icon: any, label: string, value: any, isLast?: boolean, highlight?: boolean }) {
    return (
        <Group p="md" align="center" wrap="nowrap" className={`hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${!isLast ? '' : ''}`}>
            <ThemeIcon variant="light" color="gray" size="md" radius="md" className="bg-gray-100 dark:bg-zinc-800 text-gray-500">
                <Icon size={18} />
            </ThemeIcon>
            <div className="flex-1 overflow-hidden">
                <Text size="xs" c="dimmed" fw={500}>{label}</Text>
                <Text size="sm" fw={highlight ? 700 : 500} className={`truncate ${highlight ? 'text-indigo-600 dark:text-indigo-400 uppercase' : 'text-gray-900 dark:text-gray-100'}`}>
                    {value}
                </Text>
            </div>
        </Group>
    );
}

function StudentCard({ user, profile, studentInfo, qrUrl, t }: { user: any, profile: any, studentInfo: any, qrUrl: string, t: any }) {
    return (
        <Stack>
            <Box className="relative perspective-1000 group">
                <Paper
                    radius="lg"
                    p="xl"
                    className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 text-white min-h-[340px] shadow-2xl transition-transform transform border border-white/10"
                >
                    {/* Background Patterns */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-xl"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                    <Stack h="100%" justify="space-between" className="relative z-10">
                        {/* Header: Logo & School Name */}
                        <Group justify="space-between" align="start">
                            <Group gap="xs">
                                <Box className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                                    <IconSchool size={24} className="text-blue-200" />
                                </Box>
                                <div className="leading-tight">
                                    <Text size="xs" className="uppercase opacity-70 tracking-wider">{t('card_school_label')}</Text>
                                    <Text fw={800} size="sm" className="uppercase font-serif">{t('card_school_name')}</Text>
                                </div>
                            </Group>
                            <Image
                                src="/favicon.png"
                                w={40}
                                className="opacity-90"
                            />
                        </Group>

                        {/* Main Content: Avatar & Info */}
                        <Group align="center" gap="lg" mt="sm">
                            <Box className="relative">
                                <Avatar
                                    src={profile?.avatar}
                                    size={110}
                                    className="border-[3px] border-white/30 shadow-xl rounded-2xl bg-white/10 backdrop-blur-sm"
                                    radius="md"
                                />
                                <Badge
                                    size="sm"
                                    variant="filled"
                                    color="green"
                                    className="absolute -bottom-2 -right-2 border-2 border-blue-900 shadow-sm"
                                >
                                    {t('card_role_student')}
                                </Badge>
                            </Box>
                            <div className="flex-1">
                                <Text size="xs" className="opacity-60 mb-1">{t('full_name')}</Text>
                                <Title order={3} className="text-white uppercase leading-none mb-3 text-shadow-sm">
                                    {profile?.hoTen || studentInfo?.hoTen || user?.username || user?.email?.split('@')[0]}
                                </Title>

                                <Group gap="xl">
                                    <div>
                                        <Text size="xs" className="opacity-60">{t('card_id_label')}</Text>
                                        <Text fw={600} className="font-mono tracking-wide">{studentInfo?.maSoHs || "---"}</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" className="opacity-60">{t('card_class_label')}</Text>
                                        <Text fw={600}>{studentInfo?.cacLopNam?.[0]?.lopNam?.lopHoc?.tenLop || studentInfo?.lopHoc?.tenLop || "---"}</Text>
                                    </div>
                                </Group>
                            </div>
                        </Group>

                        {/* Footer: QR Code & Valid Year */}
                        <Group justify="space-between" align="end" className="mt-4 pt-4 border-t border-white/10">
                            <Group gap={4}>
                                <Text size="xs" className="opacity-50">{t('card_year_label')}</Text>
                                <Text size="xs" fw={600} className="opacity-80">
                                    {studentInfo?.ngayNhapHoc
                                        ? `${new Date(studentInfo.ngayNhapHoc).getFullYear()} - ${new Date(studentInfo.ngayNhapHoc).getFullYear() + 3}`
                                        : "2023 - 2026"}
                                </Text>
                            </Group>

                            <Box className="bg-white p-1 rounded-lg shadow-lg">
                                <Image src={qrUrl} w={50} h={50} radius="sm" />
                            </Box>
                        </Group>
                    </Stack>
                </Paper>
            </Box>

            <Text size="xs" c="dimmed" ta="center" mt="sm">
                {t('scan_qr_hint')}
            </Text>
        </Stack>
    );
}
