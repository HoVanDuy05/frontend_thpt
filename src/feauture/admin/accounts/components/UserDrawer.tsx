"use client";

import { Drawer, Stack, TextInput, PasswordInput, Group, Button, Select, Divider, Text, LoadingOverlay, Tabs, SegmentedControl, SimpleGrid, rem, Box, Title, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState, useMemo } from 'react';
import { TUser } from '@/shared/types/user.type';
import { DateInput } from '@mantine/dates';
import { AppQuery } from '@/api/AppQuery';
import { IconUser, IconAddressBook, IconSchool, IconUsersGroup, IconMail, IconLock, IconId, IconPhone, IconHome, IconCalendar, IconCertificate, IconUsers, IconUserCircle, IconMapPin, IconBriefcase, IconStethoscope, IconFingerprint, IconGenderIntergender } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface UserDrawerProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    initialData?: TUser | null;
    role: string; // 'HOC_SINH' | 'GIAO_VIEN' | 'NHAN_VIEN'
    loading?: boolean;
}

export function UserDrawer({ opened, onClose, onSubmit, initialData, role, loading }: UserDrawerProps) {
    const t = useTranslations('accounts.drawer');
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [accountMode, setAccountMode] = useState<'new' | 'existing'>('new');

    // Queries
    const { data: years } = AppQuery.academic.useYears();
    const { data: classYears } = AppQuery.academic.useClassYears({ namHocId: selectedYear ? Number(selectedYear) : undefined });

    const activeTab = searchParams.get('tab') || 'account';

    const setActiveTab = (val: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (val) {
            params.set('tab', val);
        } else {
            params.delete('tab');
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('tab');
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        onClose();
    };

    const iconStyle = { width: rem(14), height: rem(14) };

    const form = useForm({
        initialValues: {
            isNewAccount: true,
            email: '',
            matKhau: '',
            hoTen: '',
            // Shared profile fields
            ngaySinh: null as Date | null,
            gioiTinh: 'NAM',
            diaChi: '',
            soDienThoai: '',
            cccd: '',
            ngayCapCccd: null as Date | null,
            noiCapCccd: '',

            // Student specific
            maSoHs: '',
            noiSinh: '',
            danToc: 'Kinh',
            tonGiao: 'Không',
            diaChiThuongTru: '',
            diaChiTamTru: '',
            hoTenCha: '',
            ngheNghiepCha: '',
            sdtCha: '',
            hoTenMe: '',
            ngheNghiepMe: '',
            sdtMe: '',
            ngayNhapHoc: null as Date | null,
            trangThai: 'DANG_HOC',
            lopId: '',

            // Teacher specific
            maSoGv: '',
            emailLienHe: '',
            trinhDo: 'DAI_HOC',
            chuyenMon: '',
            ngayVaoLam: null as Date | null,

            // Staff specific
            maSo: '',
        },
        validate: {
            email: (val) => {
                if (!val) return 'Email không được để trống';
                if (!/^\S+@\S+$/.test(val)) return 'Email không hợp lệ';
                return null;
            },
            hoTen: (val) => (val.length < 1 ? 'Họ tên không được để trống' : null),
            matKhau: (val, values) => (accountMode === 'new' && !initialData && val.length < 6 ? 'Mật khẩu phải ít nhất 6 ký tự' : null),

            lopId: (val, values) => null, // Allow empty for "Đang xếp lớp"
        },
    });

    useEffect(() => {
        if (initialData) {
            setAccountMode('existing');
            form.setValues({
                isNewAccount: false,
                email: initialData.email || '',
                matKhau: '',
                hoTen: initialData.hoTen || '',
                gioiTinh: initialData.gioiTinh || 'NAM',
                ngaySinh: initialData.ngaySinh ? new Date(initialData.ngaySinh) : null,
                diaChi: initialData.diaChi || '',
                soDienThoai: initialData.soDienThoai || '',
            });

            if (role === 'HOC_SINH' && initialData.hoSoHocSinh) {
                const hs = initialData.hoSoHocSinh;
                form.setValues({
                    hoTen: hs.hoTen || initialData.hoTen || '',
                    gioiTinh: hs.gioiTinh || initialData.gioiTinh || 'NAM',
                    ngaySinh: hs.ngaySinh ? new Date(hs.ngaySinh) : (initialData.ngaySinh ? new Date(initialData.ngaySinh) : null),
                    diaChi: hs.diaChi || initialData.diaChi || '',
                    soDienThoai: hs.soDienThoai || initialData.soDienThoai || '',
                    maSoHs: hs.maSoHs || '',
                    noiSinh: hs.noiSinh || '',
                    danToc: hs.danToc || 'Kinh',
                    tonGiao: hs.tonGiao || 'Không',
                    diaChiThuongTru: hs.diaChiThuongTru || '',
                    diaChiTamTru: hs.diaChiTamTru || '',
                    hoTenCha: hs.hoTenCha || '',
                    ngheNghiepCha: hs.ngheNghiepCha || '',
                    sdtCha: hs.sdtCha || '',
                    hoTenMe: hs.hoTenMe || '',
                    ngheNghiepMe: hs.ngheNghiepMe || '',
                    sdtMe: hs.sdtMe || '',
                    ngayNhapHoc: hs.ngayNhapHoc ? new Date(hs.ngayNhapHoc) : null,
                    trangThai: hs.trangThai || 'DANG_HOC',
                    lopId: hs.cacLopNam?.[0]?.lopNamId?.toString() || '',
                    cccd: hs.cccd || '',
                    ngayCapCccd: hs.ngayCapCccd ? new Date(hs.ngayCapCccd) : null,
                    noiCapCccd: hs.noiCapCccd || '',
                });
                if (hs.cacLopNam?.[0]?.lopNam?.namHocId) {
                    setSelectedYear(hs.cacLopNam[0].lopNam.namHocId.toString());
                }
            } else if (role === 'GIAO_VIEN' && initialData.hoSoGiaoVien) {
                const gv = initialData.hoSoGiaoVien;
                form.setValues({
                    hoTen: gv.hoTen || initialData.hoTen || '',
                    gioiTinh: gv.gioiTinh || initialData.gioiTinh || 'NAM',
                    ngaySinh: gv.ngaySinh ? new Date(gv.ngaySinh) : (initialData.ngaySinh ? new Date(initialData.ngaySinh) : null),
                    diaChi: gv.diaChi || initialData.diaChi || '',
                    soDienThoai: gv.soDienThoai || initialData.soDienThoai || '',
                    maSoGv: gv.maSoGv || '',
                    emailLienHe: gv.emailLienHe || '',
                    trinhDo: gv.trinhDo || 'DAI_HOC',
                    chuyenMon: gv.chuyenMon || '',
                    ngayVaoLam: gv.ngayVaoLam ? new Date(gv.ngayVaoLam) : null,
                    cccd: gv.cccd || '',
                    ngayCapCccd: gv.ngayCapCccd ? new Date(gv.ngayCapCccd) : null,
                    noiCapCccd: gv.noiCapCccd || '',
                });
            } else if (role === 'NHAN_VIEN' && initialData.hoSoNhanVien) {
                const nv = initialData.hoSoNhanVien;
                form.setValues({
                    hoTen: nv.hoTen || initialData.hoTen || '',
                    gioiTinh: nv.gioiTinh || initialData.gioiTinh || 'NAM',
                    ngaySinh: nv.ngaySinh ? new Date(nv.ngaySinh) : (initialData.ngaySinh ? new Date(initialData.ngaySinh) : null),
                    diaChi: nv.diaChi || initialData.diaChi || '',
                    soDienThoai: nv.soDienThoai || initialData.soDienThoai || '',
                    maSo: nv.maSo || '',
                    emailLienHe: nv.emailLienHe || '',
                    cccd: nv.cccd || '',
                });
            }
        } else {
            form.reset();
            setAccountMode('new');
        }
    }, [initialData, opened, role]);

    // Derived Data
    const yearOptions = useMemo(() => years?.map(y => ({ value: y.id.toString(), label: y.tenNamHoc })) || [], [years]);

    const classOptions = useMemo(() => {
        return classYears?.map(cy => ({ value: cy.id.toString(), label: cy.lopHoc?.tenLop || 'N/A' })) || [];
    }, [classYears]);

    const handleFormSubmit = (values: any) => {
        // Base account and profile fields
        const {
            email, matKhau, isNewAccount, hoTen, ngaySinh, gioiTinh,
            diaChi, soDienThoai, cccd, ngayCapCccd, noiCapCccd
        } = values;

        let submission: any = {
            email,
            matKhau,
            isNewAccount: accountMode === 'new',
            hoTen,
            ngaySinh,
            gioiTinh,
            diaChi,
            soDienThoai,
            cccd,
            ngayCapCccd,
            noiCapCccd
        };

        // Role specific fields
        if (role === 'HOC_SINH') {
            submission = {
                ...submission,
                maSoHs: values.maSoHs,
                noiSinh: values.noiSinh,
                danToc: values.danToc,
                tonGiao: values.tonGiao,
                diaChiThuongTru: values.diaChiThuongTru,
                diaChiTamTru: values.diaChiTamTru,
                hoTenCha: values.hoTenCha,
                ngheNghiepCha: values.ngheNghiepCha,
                sdtCha: values.sdtCha,
                hoTenMe: values.hoTenMe,
                ngheNghiepMe: values.ngheNghiepMe,
                sdtMe: values.sdtMe,
                ngayNhapHoc: values.ngayNhapHoc,
                trangThai: values.trangThai,
                lopId: values.lopId ? Number(values.lopId) : undefined,
            };
        } else if (role === 'GIAO_VIEN') {
            submission = {
                ...submission,
                maSoGv: values.maSoGv,
                emailLienHe: values.emailLienHe,
                trinhDo: values.trinhDo,
                chuyenMon: values.chuyenMon,
                ngayVaoLam: values.ngayVaoLam,
            };
        } else if (role === 'NHAN_VIEN') {
            submission = {
                ...submission,
                maSo: values.maSo,
                emailLienHe: values.emailLienHe,
            };
        }

        onSubmit(submission);
    };

    const roleTitle = role === 'HOC_SINH' ? 'Học sinh' : role === 'GIAO_VIEN' ? 'Giáo viên' : 'Nhân viên';

    return (
        <Drawer
            opened={opened}
            onClose={handleClose}
            title={
                <Stack gap={2}>
                    <Title order={4} fw={700} c="brand.7">
                        {initialData
                            ? t('title_edit', { role: roleTitle.toLowerCase() })
                            : t('title_create', { role: roleTitle.toLowerCase() })}
                    </Title>
                    <Text size="xs" c="dimmed" fw={500}>{t('subtitle')}</Text>
                </Stack>
            }
            position="right"
            size="xl"
            styles={{
                header: {
                    borderBottom: '1px solid var(--mantine-color-gray-2)',
                    padding: '16px 20px',
                    margin: 0,
                    minHeight: 70
                },
                body: {
                    padding: 0,
                    height: 'calc(100vh - 70px)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        >
            <Box pos="relative" h="100%" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <LoadingOverlay visible={!!loading} overlayProps={{ blur: 2 }} />

                <form
                    onSubmit={form.onSubmit(handleFormSubmit)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        height: '100%',
                        overflow: 'hidden'
                    }}
                >
                    <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="xl" styles={{
                        root: {
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            overflow: 'hidden'
                        },
                        list: {
                            padding: '12px 20px',
                            background: 'white',
                            borderBottom: '1px solid var(--mantine-color-gray-2)',
                            gap: 10,
                            position: 'sticky',
                            top: 0,
                            zIndex: 100
                        },
                        tab: {
                            fontWeight: 600,
                            fontSize: rem(13),
                            '&[data-active]': {
                                backgroundColor: 'var(--mantine-color-brand-6)',
                                color: 'white'
                            }
                        },
                        panel: {
                            flex: 1,
                            overflowY: 'auto'
                        }
                    }}>
                        <Tabs.List>
                            <Tabs.Tab value="account" leftSection={<IconLock style={iconStyle} />}>{t('tabs.account')}</Tabs.Tab>
                            <Tabs.Tab value="profile" leftSection={<IconUserCircle style={iconStyle} />}>{t('tabs.profile')}</Tabs.Tab>
                            {role === 'HOC_SINH' && (
                                <Tabs.Tab value="family" leftSection={<IconUsersGroup style={iconStyle} />}>{t('tabs.family')}</Tabs.Tab>
                            )}
                        </Tabs.List>

                        <Box style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
                            <Tabs.Panel value="account">
                                <Stack gap="lg" p="md">
                                    {!initialData && (
                                        <Paper withBorder p="md" radius="md" bg="var(--mantine-color-brand-0)" style={{ borderColor: 'var(--mantine-color-brand-2)' }}>
                                            <Stack gap="xs">
                                                <Group gap="xs">
                                                    <IconUser size={18} color="var(--mantine-color-brand-6)" />
                                                    <Text size="sm" fw={700} c="brand.9">{t('account_mode.label')}</Text>
                                                </Group>
                                                <SegmentedControl
                                                    fullWidth
                                                    value={accountMode}
                                                    onChange={(val: any) => setAccountMode(val)}
                                                    radius="md"
                                                    data={[
                                                        { label: t('account_mode.new'), value: 'new' },
                                                        { label: t('account_mode.existing'), value: 'existing' },
                                                    ]}
                                                />
                                                <Text size="xs" c="dimmed" fw={500}>
                                                    {accountMode === 'new'
                                                        ? t('account_mode.tip_new')
                                                        : t('account_mode.tip_existing')}
                                                </Text>
                                            </Stack>
                                        </Paper>
                                    )}

                                    <Paper withBorder p="md" radius="md">
                                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                                            <TextInput
                                                label={t('fields.email')}
                                                placeholder="example@school.edu"
                                                required
                                                radius="md"
                                                leftSection={<IconMail size={16} color="var(--mantine-color-brand-6)" />}
                                                {...form.getInputProps('email')}
                                                disabled={!!initialData}
                                            />

                                            {accountMode === 'new' && !initialData && (
                                                <PasswordInput
                                                    label={t('fields.password')}
                                                    placeholder={t('fields.password_placeholder')}
                                                    radius="md"
                                                    leftSection={<IconLock size={16} color="var(--mantine-color-brand-6)" />}
                                                    {...form.getInputProps('matKhau')}
                                                />
                                            )}
                                        </SimpleGrid>
                                    </Paper>
                                </Stack>
                            </Tabs.Panel>

                            <Tabs.Panel value="profile">
                                <Stack gap="lg" p="md">
                                    <Paper withBorder p="md" radius="md">
                                        <Text size="sm" fw={700} mb="md" c="brand.7" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <IconAddressBook size={18} /> Thông tin cơ bản
                                        </Text>
                                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                            {initialData && (
                                                <TextInput
                                                    label={t('fields.id')}
                                                    disabled
                                                    radius="md"
                                                    leftSection={<IconId size={16} color="var(--mantine-color-brand-6)" />}
                                                    {...form.getInputProps(role === 'HOC_SINH' ? 'maSoHs' : role === 'GIAO_VIEN' ? 'maSoGv' : 'maSo')}
                                                />
                                            )}
                                            <TextInput
                                                label={t('fields.fullname')}
                                                placeholder="Nhập họ và tên đầy đủ"
                                                required
                                                radius="md"
                                                leftSection={<IconUser size={16} color="var(--mantine-color-brand-6)" />}
                                                {...form.getInputProps('hoTen')}
                                            />
                                            <Select
                                                label={t('fields.gender')}
                                                data={[{ value: 'NAM', label: 'Nam' }, { value: 'NU', label: 'Nữ' }]}
                                                radius="md"
                                                leftSection={<IconGenderIntergender size={16} color="var(--mantine-color-brand-6)" />}
                                                {...form.getInputProps('gioiTinh')}
                                            />
                                            <DateInput
                                                label={t('fields.dob')}
                                                placeholder="DD/MM/YYYY"
                                                valueFormat="DD/MM/YYYY"
                                                leftSection={<IconCalendar size={16} color="var(--mantine-color-brand-6)" />}
                                                radius="md"
                                                {...form.getInputProps('ngaySinh')}
                                            />
                                            <TextInput
                                                label={t('fields.phone')}
                                                placeholder="09xx xxx xxx"
                                                leftSection={<IconPhone size={16} color="var(--mantine-color-brand-6)" />}
                                                radius="md"
                                                {...form.getInputProps('soDienThoai')}
                                            />
                                            <TextInput
                                                label={t('fields.cccd')}
                                                placeholder="12 chữ số"
                                                radius="md"
                                                leftSection={<IconFingerprint size={16} color="var(--mantine-color-brand-6)" />}
                                                {...form.getInputProps('cccd')}
                                            />
                                        </SimpleGrid>
                                    </Paper>

                                    {role === 'HOC_SINH' && (
                                        <Paper withBorder p="md" radius="md" bg="var(--mantine-color-gray-0)">
                                            <Text size="sm" fw={700} mb="md" c="brand.7" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <IconSchool size={18} /> Thông tin học tập
                                            </Text>
                                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                                <Select
                                                    label={t('fields.year')}
                                                    placeholder="Chọn năm học"
                                                    data={yearOptions}
                                                    value={selectedYear}
                                                    onChange={setSelectedYear}
                                                    searchable
                                                    radius="md"
                                                />
                                                <Select
                                                    label={t('fields.class')}
                                                    placeholder="Đang xếp lớp"
                                                    data={classOptions}
                                                    searchable
                                                    clearable
                                                    disabled={!selectedYear}
                                                    radius="md"
                                                    {...form.getInputProps('lopId')}
                                                />
                                                <DateInput
                                                    label={t('fields.admission_date')}
                                                    placeholder="DD/MM/YYYY"
                                                    valueFormat="DD/MM/YYYY"
                                                    radius="md"
                                                    {...form.getInputProps('ngayNhapHoc')}
                                                />
                                                <Select
                                                    label={t('fields.academic_status')}
                                                    radius="md"
                                                    data={[
                                                        { value: 'DANG_HOC', label: 'Đang học' },
                                                        { value: 'DA_TOT_NGHIEP', label: 'Đã tốt nghiệp' },
                                                        { value: 'THOI_HOC', label: 'Thôi học' },
                                                        { value: 'BAO_LUU', label: 'Bảo lưu' },
                                                    ]}
                                                    {...form.getInputProps('trangThai')}
                                                />
                                            </SimpleGrid>
                                        </Paper>
                                    )}

                                    {(role === 'GIAO_VIEN' || role === 'NHAN_VIEN') && (
                                        <Paper withBorder p="md" radius="md" bg="var(--mantine-color-gray-0)">
                                            <Text size="sm" fw={700} mb="md" c="brand.7" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <IconBriefcase size={18} /> Thông tin công tác
                                            </Text>
                                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                                <TextInput
                                                    label={t('fields.specialization')}
                                                    placeholder="Vd: Toán học, Vật lý..."
                                                    leftSection={<IconStethoscope size={16} color="var(--mantine-color-brand-6)" />}
                                                    radius="md"
                                                    {...form.getInputProps('chuyenMon')}
                                                />
                                                <Select
                                                    label={t('fields.degree')}
                                                    radius="md"
                                                    data={[
                                                        { value: 'DAI_HOC', label: 'Cử nhân/Đại học' },
                                                        { value: 'THAC_SI', label: 'Thạc sĩ' },
                                                        { value: 'TIEN_SI', label: 'Tiến sĩ' },
                                                        { value: 'CAO_DANG', label: 'Cao đẳng' },
                                                    ]}
                                                    {...form.getInputProps('trinhDo')}
                                                />
                                                <DateInput
                                                    label={t('fields.join_date')}
                                                    placeholder="DD/MM/YYYY"
                                                    valueFormat="DD/MM/YYYY"
                                                    radius="md"
                                                    {...form.getInputProps('ngayVaoLam')}
                                                />
                                                <TextInput
                                                    label={t('fields.work_email')}
                                                    placeholder="Vd: contact@school.edu"
                                                    radius="md"
                                                    {...form.getInputProps('emailLienHe')}
                                                />
                                            </SimpleGrid>
                                        </Paper>
                                    )}

                                    <Paper withBorder p="md" radius="md">
                                        <Text size="sm" fw={700} mb="md" c="brand.7" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <IconMapPin size={18} /> Địa chỉ & Khác
                                        </Text>
                                        <Stack gap="md">
                                            <TextInput
                                                label={t('fields.address')}
                                                placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                                                leftSection={<IconHome size={16} color="var(--mantine-color-brand-6)" />}
                                                radius="md"
                                                {...form.getInputProps('diaChi')}
                                            />

                                            {role === 'HOC_SINH' && (
                                                <>
                                                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                                                        <TextInput label={t('fields.ethnicity')} radius="md" {...form.getInputProps('danToc')} />
                                                        <TextInput label={t('fields.religion')} radius="md" {...form.getInputProps('tonGiao')} />
                                                        <TextInput label={t('fields.native_place')} radius="md" {...form.getInputProps('noiSinh')} />
                                                    </SimpleGrid>
                                                    <TextInput label={t('fields.permanent_address')} radius="md" {...form.getInputProps('diaChiThuongTru')} />
                                                    <TextInput label={t('fields.temporary_address')} radius="md" {...form.getInputProps('diaChiTamTru')} />
                                                </>
                                            )}
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </Tabs.Panel>

                            {role === 'HOC_SINH' && (
                                <Tabs.Panel value="family">
                                    <Stack gap="lg" p="md">
                                        <Paper withBorder p="md" radius="md">
                                            <Divider
                                                label={
                                                    <Group gap="xs">
                                                        <IconUsers size={16} />
                                                        <Text fw={700} size="xs">{t('fields.father_name').toUpperCase()}</Text>
                                                    </Group>
                                                }
                                                labelPosition="left"
                                                mb="md"
                                            />
                                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                                <TextInput label={t('fields.father_name')} placeholder={t('fields.father_name_placeholder')} radius="md" {...form.getInputProps('hoTenCha')} />
                                                <TextInput label={t('fields.father_phone')} placeholder={t('fields.father_phone_placeholder')} radius="md" {...form.getInputProps('sdtCha')} />
                                                <TextInput label={t('fields.father_job')} placeholder={t('fields.father_job_placeholder')} radius="md" {...form.getInputProps('ngheNghiepCha')} />
                                            </SimpleGrid>
                                        </Paper>

                                        <Paper withBorder p="md" radius="md">
                                            <Divider
                                                label={
                                                    <Group gap="xs">
                                                        <IconUsers size={16} />
                                                        <Text fw={700} size="xs">{t('fields.mother_name').toUpperCase()}</Text>
                                                    </Group>
                                                }
                                                labelPosition="left"
                                                mb="md"
                                            />
                                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                                <TextInput label={t('fields.mother_name')} placeholder={t('fields.mother_name_placeholder')} radius="md" {...form.getInputProps('hoTenMe')} />
                                                <TextInput label={t('fields.mother_phone')} placeholder={t('fields.mother_phone_placeholder')} radius="md" {...form.getInputProps('sdtMe')} />
                                                <TextInput label={t('fields.mother_job')} placeholder={t('fields.mother_job_placeholder')} radius="md" {...form.getInputProps('ngheNghiepMe')} />
                                            </SimpleGrid>
                                        </Paper>
                                    </Stack>
                                </Tabs.Panel>
                            )}
                        </Box>

                        <Divider px="md" />

                        <Group justify="flex-end" px="xl" py="lg" style={{
                            background: 'white',
                            borderTop: '1px solid var(--mantine-color-gray-2)',
                            position: 'sticky',
                            bottom: 0,
                            zIndex: 10
                        }}>
                            <Button variant="subtle" color="gray" onClick={handleClose} radius="md">{t('actions.cancel')}</Button>
                            <Button type="submit" loading={loading} px={40} radius="md" fw={700}
                                style={{ boxShadow: '0 4px 12px var(--mantine-color-brand-light-color)' }}
                            >
                                {initialData ? t('actions.submit_edit') : t('actions.submit_create')}
                            </Button>
                        </Group>
                    </Tabs>
                </form>
            </Box>
        </Drawer>
    );
}
