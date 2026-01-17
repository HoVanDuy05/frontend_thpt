'use client';

import React from 'react';
import { Title, Text, Paper, Group, Stack, Breadcrumbs, Anchor, Skeleton, Avatar, Badge, Card, Grid, Tabs, Timeline, ThemeIcon, SimpleGrid, Divider, Button, Container, ActionIcon } from '@mantine/core';
import { IconUser, IconSchool, IconCalendar, IconPhone, IconMail, IconMapPin, IconUsers, IconChevronRight, IconArrowLeft } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { AppQuery } from '@/api/AppQuery';
import { useParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import { useMemo } from 'react';
import { SkeletonLoader } from '@/shared/components/SkeletonLoader';

export default function StudentDetailPage() {
    const t = useTranslations('students');
    const common = useTranslations('common');
    const params = useParams();
    const router = useRouter();
    const studentId = parseInt(params.id as string);

    const { data: user, isLoading } = AppQuery.user.useDetail(studentId);

    const studentProfile = user?.hoSoHocSinh;
    const currentYear = useMemo(() =>
        studentProfile?.cacLopNam?.find(ln => ln.lopNam?.namHoc?.dangKichHoat),
        [studentProfile]
    );

    if (isLoading) return <StudentDetailSkeleton />;
    if (!user || !studentProfile) return <Text>{t('not_found')}</Text>;

    const breadcrumbs = [
        { title: t('breadcrumb_title'), href: '/admin/students' },
        { title: studentProfile.hoTen, href: '#' },
    ].map((item, index) => (
        <Anchor component={Link} href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    return (
        <>
            {/* Sticky Header */}
            <Container
                fluid
                p="md"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e9ecef'
                }}
            >
                <Group>
                    <ActionIcon
                        variant="subtle"
                        size="lg"
                        onClick={() => router.back()}
                    >
                        <IconArrowLeft size={20} />
                    </ActionIcon>
                    <Title order={3}>
                        {user.vaiTro === 'HOC_SINH' ? 'HS' : user.vaiTro} - {studentProfile.hoTen}
                    </Title>
                </Group>
            </Container>

            <Stack gap="md" p="md">
                <Breadcrumbs>{breadcrumbs}</Breadcrumbs>

                {/* Student Header */}
                <Paper withBorder radius="md" p="xl">
                    <Group>
                        <Avatar src={user.avatar} size={100} radius="md" />
                        <Stack gap="xs">
                            <Title order={2}>{studentProfile.hoTen}</Title>
                            <Group gap="md">
                                <Badge size="lg" variant="light">{studentProfile.maSoHs}</Badge>
                                <Badge size="lg" color="blue" variant="light">
                                    {currentYear?.lopNam?.lopHoc?.tenLop || t('no_current_class')}
                                </Badge>
                                <Badge
                                    size="lg"
                                    color={studentProfile.trangThai === 'DANG_HOC' ? 'green' : 'gray'}
                                >
                                    {studentProfile.trangThai}
                                </Badge>
                            </Group>
                            {currentYear && (
                                <Text size="sm" c="dimmed">
                                    <IconSchool size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                    {currentYear.lopNam?.namHoc?.tenNamHoc} - {currentYear.lopNam?.lopHoc?.khoi?.tenKhoi}
                                </Text>
                            )}
                        </Stack>
                    </Group>
                </Paper>

                <Tabs defaultValue="overview">
                    <Tabs.List>
                        <Tabs.Tab value="overview" leftSection={<IconUser size={16} />}>
                            {t('tabs.overview')}
                        </Tabs.Tab>
                        <Tabs.Tab value="history" leftSection={<IconCalendar size={16} />}>
                            {t('tabs.academic_history')}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="overview" pt="md">
                        <Grid>
                            {/* Personal Information */}
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Card withBorder radius="md" p="md">
                                    <Title order={4} mb="md">{t('personal_info')}</Title>
                                    <Stack gap="sm">
                                        <Group justify="space-between">
                                            <Text size="sm" c="dimmed">{t('fields.gender')}:</Text>
                                            <Text size="sm" fw={500}>{studentProfile.gioiTinh || t('no_info')}</Text>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text size="sm" c="dimmed">{t('fields.date_of_birth')}:</Text>
                                            <Text size="sm" fw={500}>
                                                {studentProfile.ngaySinh ? new Date(studentProfile.ngaySinh).toLocaleDateString('vi-VN') : t('no_info')}
                                            </Text>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text size="sm" c="dimmed">{t('fields.place_of_birth')}:</Text>
                                            <Text size="sm" fw={500}>{studentProfile.noiSinh || t('no_info')}</Text>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text size="sm" c="dimmed">{t('fields.ethnicity')}:</Text>
                                            <Text size="sm" fw={500}>{studentProfile.danToc || t('no_info')}</Text>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text size="sm" c="dimmed">{t('fields.religion')}:</Text>
                                            <Text size="sm" fw={500}>{studentProfile.tonGiao || t('no_info')}</Text>
                                        </Group>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            {/* Contact Information */}
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Card withBorder radius="md" p="md">
                                    <Title order={4} mb="md">{t('contact_info')}</Title>
                                    <Stack gap="sm">
                                        <Group gap="xs">
                                            <IconPhone size={16} />
                                            <Text size="sm">{studentProfile.soDienThoai || t('no_info')}</Text>
                                        </Group>
                                        <Group gap="xs">
                                            <IconMail size={16} />
                                            <Text size="sm">{user.email || t('no_info')}</Text>
                                        </Group>
                                        <Divider />
                                        <Group gap="xs" align="flex-start">
                                            <IconMapPin size={16} style={{ marginTop: 2 }} />
                                            <Stack gap={4}>
                                                <Text size="sm" fw={500}>{t('fields.permanent_address')}:</Text>
                                                <Text size="sm" c="dimmed">{studentProfile.diaChiThuongTru || t('no_info')}</Text>
                                            </Stack>
                                        </Group>
                                        {studentProfile.diaChiTamTru && (
                                            <Group gap="xs" align="flex-start">
                                                <IconMapPin size={16} style={{ marginTop: 2 }} />
                                                <Stack gap={4}>
                                                    <Text size="sm" fw={500}>{t('fields.temporary_address')}:</Text>
                                                    <Text size="sm" c="dimmed">{studentProfile.diaChiTamTru}</Text>
                                                </Stack>
                                            </Group>
                                        )}
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            {/* Parent/Guardian Information */}
                            <Grid.Col span={12}>
                                <Card withBorder radius="md" p="md">
                                    <Title order={4} mb="md">{t('parent_guardian_info')}</Title>
                                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                                        <Stack gap="sm">
                                            <Text size="sm" fw={600}>{t('fields.father')}</Text>
                                            {studentProfile.hoTenCha && (
                                                <Group justify="space-between">
                                                    <Text size="sm" c="dimmed">{t('fields.name')}:</Text>
                                                    <Text size="sm" fw={500}>{studentProfile.hoTenCha}</Text>
                                                </Group>
                                            )}
                                            {studentProfile.ngheNghiepCha && (
                                                <Group justify="space-between">
                                                    <Text size="sm" c="dimmed">{t('fields.occupation')}:</Text>
                                                    <Text size="sm" fw={500}>{studentProfile.ngheNghiepCha}</Text>
                                                </Group>
                                            )}
                                            {studentProfile.sdtCha && (
                                                <Group justify="space-between">
                                                    <Text size="sm" c="dimmed">{t('fields.phone')}:</Text>
                                                    <Text size="sm" fw={500}>{studentProfile.sdtCha}</Text>
                                                </Group>
                                            )}
                                            {!studentProfile.hoTenCha && !studentProfile.ngheNghiepCha && !studentProfile.sdtCha && (
                                                <Text size="sm" c="dimmed">{t('no_father_info')}</Text>
                                            )}
                                        </Stack>
                                        <Stack gap="sm">
                                            <Text size="sm" fw={600}>{t('fields.mother')}</Text>
                                            {studentProfile.hoTenMe && (
                                                <Group justify="space-between">
                                                    <Text size="sm" c="dimmed">{t('fields.name')}:</Text>
                                                    <Text size="sm" fw={500}>{studentProfile.hoTenMe}</Text>
                                                </Group>
                                            )}
                                            {studentProfile.ngheNghiepMe && (
                                                <Group justify="space-between">
                                                    <Text size="sm" c="dimmed">{t('fields.occupation')}:</Text>
                                                    <Text size="sm" fw={500}>{studentProfile.ngheNghiepMe}</Text>
                                                </Group>
                                            )}
                                            {studentProfile.sdtMe && (
                                                <Group justify="space-between">
                                                    <Text size="sm" c="dimmed">{t('fields.phone')}:</Text>
                                                    <Text size="sm" fw={500}>{studentProfile.sdtMe}</Text>
                                                </Group>
                                            )}
                                            {!studentProfile.hoTenMe && !studentProfile.ngheNghiepMe && !studentProfile.sdtMe && (
                                                <Text size="sm" c="dimmed">{t('no_mother_info')}</Text>
                                            )}
                                        </Stack>
                                    </SimpleGrid>
                                </Card>
                            </Grid.Col>
                        </Grid>
                    </Tabs.Panel>

                    <Tabs.Panel value="history" pt="md">
                        <Card withBorder radius="md" p="md">
                            <Title order={4} mb="md">{t('tabs.academic_history')}</Title>
                            {studentProfile.cacLopNam && studentProfile.cacLopNam.length > 0 ? (
                                <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                                    {studentProfile.cacLopNam.map((hsln: any) => (
                                        <Card
                                            key={hsln.id}
                                            withBorder
                                            radius="md"
                                            p="md"
                                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                            onClick={() => router.push(`/admin/students/${studentId}/years/${hsln.lopNam.namHocId}`)}
                                            className="hover:shadow-md"
                                        >
                                            <Stack gap="sm">
                                                <Group justify="space-between">
                                                    <Text fw={600}>{hsln.lopNam?.namHoc?.tenNamHoc}</Text>
                                                    {hsln.lopNam?.namHoc?.dangKichHoat && (
                                                        <Badge size="sm" color="green">{t('current')}</Badge>
                                                    )}
                                                </Group>
                                                <Group gap="xs">
                                                    <IconSchool size={16} />
                                                    <Text size="sm">{hsln.lopNam?.lopHoc?.tenLop}</Text>
                                                </Group>
                                                <Group gap="xs">
                                                    <IconUsers size={16} />
                                                    <Text size="sm" c="dimmed">
                                                        {hsln.lopNam?.lopHoc?.khoi?.tenKhoi}
                                                    </Text>
                                                </Group>
                                                <Badge
                                                    variant="light"
                                                    color={hsln.trangThai === 'DANG_HOC' ? 'green' : 'gray'}
                                                >
                                                    {hsln.trangThai}
                                                </Badge>
                                                <Group justify="flex-end">
                                                    <IconChevronRight size={16} />
                                                </Group>
                                            </Stack>
                                        </Card>
                                    ))}
                                </SimpleGrid>
                            ) : (
                                <Text c="dimmed" ta="center" py="xl">{t('no_academic_history')}</Text>
                            )}
                        </Card>
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        </>
    );
}


function StudentDetailSkeleton() {
    return (
        <Stack gap="md" p="md">
            <Skeleton height={32} width={200} />

            <Paper withBorder radius="md" p="xl">
                <Group>
                    <Skeleton height={100} width={100} radius="md" />
                    <Stack gap="xs" style={{ flex: 1 }}>
                        <Skeleton height={32} width="60%" />
                        <Group gap="md">
                            <Skeleton height={24} width={120} />
                            <Skeleton height={24} width={100} />
                            <Skeleton height={24} width={80} />
                        </Group>
                        <Skeleton height={16} width="40%" />
                    </Stack>
                </Group>
            </Paper>

            <Tabs defaultValue="overview">
                <Tabs.List>
                    <Tabs.Tab value="overview">Overview</Tabs.Tab>
                    <Tabs.Tab value="history">History</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="overview" pt="md">
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card withBorder radius="md" p="md">
                                <Skeleton height={24} width={150} mb="md" />
                                <Stack gap="sm">
                                    {[...Array(5)].map((_, i) => (
                                        <Group key={i} justify="space-between">
                                            <Skeleton height={16} width={100} />
                                            <Skeleton height={16} width={120} />
                                        </Group>
                                    ))}
                                </Stack>
                            </Card>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card withBorder radius="md" p="md">
                                <Skeleton height={24} width={150} mb="md" />
                                <Stack gap="sm">
                                    <Group gap="xs">
                                        <Skeleton height={16} width={16} />
                                        <Skeleton height={16} width={140} />
                                    </Group>
                                    <Group gap="xs">
                                        <Skeleton height={16} width={16} />
                                        <Skeleton height={16} width={180} />
                                    </Group>
                                    <Divider />
                                    <Group gap="xs" align="flex-start">
                                        <Skeleton height={16} width={16} style={{ marginTop: 2 }} />
                                        <Stack gap={4}>
                                            <Skeleton height={14} width={120} />
                                            <Skeleton height={14} width="100%" />
                                        </Stack>
                                    </Group>
                                </Stack>
                            </Card>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Card withBorder radius="md" p="md">
                                <Skeleton height={24} width={200} mb="md" />
                                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                                    {[...Array(2)].map((_, i) => (
                                        <Stack key={i} gap="sm">
                                            <Skeleton height={16} width={60} />
                                            {[...Array(3)].map((_, j) => (
                                                <Group key={j} justify="space-between">
                                                    <Skeleton height={14} width={80} />
                                                    <Skeleton height={14} width={100} />
                                                </Group>
                                            ))}
                                        </Stack>
                                    ))}
                                </SimpleGrid>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Tabs.Panel>

                <Tabs.Panel value="history" pt="md">
                    <Card withBorder radius="md" p="md">
                        <Skeleton height={24} width={180} mb="md" />
                        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i} withBorder radius="md" p="md">
                                    <Stack gap="sm">
                                        <Group justify="space-between">
                                            <Skeleton height={20} width={120} />
                                            <Skeleton height={20} width={60} />
                                        </Group>
                                        <Group gap="xs">
                                            <Skeleton height={16} width={16} />
                                            <Skeleton height={14} width={80} />
                                        </Group>
                                        <Group gap="xs">
                                            <Skeleton height={16} width={16} />
                                            <Skeleton height={14} width={60} />
                                        </Group>
                                        <Skeleton height={20} width={80} />
                                        <Group justify="flex-end">
                                            <Skeleton height={16} width={16} />
                                        </Group>
                                    </Stack>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </Card>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}
