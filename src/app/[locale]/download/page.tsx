"use client";

import { Container, Title, Text, Button, Stack, Group, Box, Card, Image, List, ThemeIcon, Badge, Center, Divider, SimpleGrid } from "@mantine/core";
import { IconDownload, IconShare, IconPlus, IconDeviceMobile, IconCheck, IconBrandAndroid, IconBrandApple, IconInfoCircle, IconArrowRight, IconBell, IconBellRinging, IconAlertCircle, IconLoader2 } from "@tabler/icons-react";
import { usePWA } from "@/providers/PWAProvider";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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
    const t = useTranslations("pwa.download");

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
                                {t('title')}
                            </Title>
                            <Text size="sm" fw={800} className="text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
                                {t('subtitle')}
                            </Text>
                        </Stack>
                        <Badge variant="light" color="green" size="lg" className="h-8 px-4 font-bold border-none">
                            {t('version')}
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
                            <Title order={2} className="font-black italic">{t('installed_title')}</Title>
                            <Text c="dimmed" fw={600}>{t('installed_subtitle')}</Text>
                            <Button
                                component={Link}
                                href="/"
                                size="xl"
                                radius="xl"
                                fullWidth
                                className="bg-indigo-600 h-16 text-lg font-black shadow-lg"
                            >
                                {t('access_now')}
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
                                        {t('device_detection', { os: isIOS ? 'iOS (iPhone/iPad)' : 'Android' })}
                                    </Text>
                                </Group>
                                <Title order={2} className="text-3xl font-black leading-tight italic">
                                    {t('transform_title')}
                                </Title>
                                <Text className="text-indigo-100 font-bold opacity-90">
                                    {t('transform_subtitle')}
                                </Text>
                            </Stack>
                        </Card>

                        {/* Installation Steps based on OS */}
                        {isIOS ? (
                            <Stack gap="xl">
                                <Title order={3} className="text-2xl font-black italic flex items-center gap-2">
                                    <IconInfoCircle className="text-blue-500" /> {t('ios_guide_title')}
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
                                        <span dangerouslySetInnerHTML={{ __html: t('ios_step_1') }} />
                                    </List.Item>
                                    <List.Item>
                                        <span dangerouslySetInnerHTML={{ __html: t('ios_step_2') }} />
                                    </List.Item>
                                    <List.Item>
                                        <span dangerouslySetInnerHTML={{ __html: t('ios_step_3') }} />
                                    </List.Item>
                                </List>
                                <Box className="bg-slate-200 dark:bg-zinc-800 rounded-3xl p-4 aspect-[4/3] flex items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-700 shadow-inner">
                                    <Text c="dimmed" fw={800} tt="uppercase" size="xs">{t('ios_illustration_alt')}</Text>
                                </Box>
                            </Stack>
                        ) : (
                            <Stack gap="xl">
                                <Title order={3} className="text-2xl font-black italic">{t('android_guide_title')}</Title>
                                <Card radius="24px" withBorder className="bg-white dark:bg-zinc-900 shadow-lg p-8 text-center">
                                    {isInstallable ? (
                                        <Stack gap="xl">
                                            <Box className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
                                                <IconDownload size={32} stroke={2.5} />
                                            </Box>
                                            <Stack gap={4}>
                                                <Text size="xl" fw={900}>{t('android_ready_title')}</Text>
                                                <Text c="dimmed" size="sm" fw={600}>{t('android_ready_subtitle')}</Text>
                                            </Stack>
                                            <Button
                                                size="xl"
                                                radius="xl"
                                                className="bg-blue-600 h-18 text-xl font-black shadow-xl shadow-blue-500/30 animate-pulse hover:scale-105 transition-all"
                                                onClick={installApp}
                                                leftSection={<IconDownload size={24} stroke={3} />}
                                            >
                                                {t('android_install_btn')}
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Stack gap="md">
                                            <Box className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
                                                <IconInfoCircle size={32} stroke={2.5} />
                                            </Box>
                                            <Text fw={800} c="orange">{t('android_manual_title')}</Text>
                                            <Text size="sm" c="dimmed" fw={600}>
                                                {t('android_manual_subtitle')}
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
                                            <IconBellRinging className="text-indigo-600" /> {t('push_title')}
                                        </Title>
                                        <Text size="sm" c="dimmed" fw={600}>{t('push_subtitle')}</Text>
                                    </Stack>
                                    <Badge color={notificationPermission === 'granted' ? 'green' : 'gray'} variant="light" size="lg">
                                        {notificationPermission === 'granted' ? t('push_status_on') : t('push_status_off')}
                                    </Badge>
                                </Group>

                                <Divider variant="dashed" />

                                {notificationPermission !== 'granted' ? (
                                    <Stack gap="md">
                                        <Box className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800">
                                            <Group gap="xs" wrap="nowrap" align="flex-start">
                                                <IconAlertCircle className="text-amber-600 shrink-0" size={20} />
                                                <Text size="sm" fw={600} className="text-amber-900 dark:text-amber-200">
                                                    {t('push_permission_warning')}
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
                                            {t('push_permission_btn')}
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Stack gap="md">
                                        <Text size="sm" fw={600} c="dimmed">
                                            {t('push_sync_tip')}
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
                                                    alert(t('push_success'));
                                                } else {
                                                    alert(t('push_error'));
                                                }
                                            }}
                                            leftSection={<IconBellRinging size={20} />}
                                        >
                                            {t('push_subscribe_btn')}
                                        </Button>
                                    </Stack>
                                )}
                            </Stack>
                        </Card>

                        <Divider variant="dashed" label={<Text fw={900} className="uppercase tracking-widest text-[10px] opacity-40">{t('features_title')}</Text>} labelPosition="center" />

                        <SimpleGrid cols={2} spacing="md">
                            <Card radius="24px" p="lg" withBorder className="bg-white dark:bg-zinc-900 border-none shadow-sm">
                                <Stack gap="xs">
                                    <Text fw={900} size="sm" color="blue">{t('feature_clean_title')}</Text>
                                    <Text size="xs" c="dimmed" fw={600}>{t('feature_clean_desc')}</Text>
                                </Stack>
                            </Card>
                            <Card radius="24px" p="lg" withBorder className="bg-white dark:bg-zinc-900 border-none shadow-sm">
                                <Stack gap="xs">
                                    <Text fw={900} size="sm" color="indigo">{t('feature_push_title')}</Text>
                                    <Text size="xs" c="dimmed" fw={600}>{t('feature_push_desc')}</Text>
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
                            {t('continue_web')}
                        </Button>
                    </Stack>
                )}
            </Container>

            {/* Support Section */}
            <Box className="py-12 bg-slate-100 dark:bg-zinc-900/50">
                <Container size="sm" className="text-center">
                    <Text size="xs" fw={900} c="dimmed" className="uppercase tracking-[0.2em] mb-4">{t('support_title')}</Text>
                    <Text size="sm" fw={700} c="dimmed">
                        {t('support_desc')} <br />
                        <span className="text-blue-600">0987.xxx.xxx</span>
                    </Text>
                </Container>
            </Box>
        </Box>
    );
}
