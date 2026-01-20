"use client";

import { Box, Button, Card, Container, Group, Stack, Text, Title, Badge, ActionIcon, SimpleGrid, TextInput, LoadingOverlay, Avatar, Divider, Select, Breadcrumbs, Anchor, Paper, Modal } from "@mantine/core";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { useRBAC } from "@/shared/hooks/useRBAC";
import { IconUsers, IconTrash, IconPlus, IconSearch, IconChevronLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { EVaiTroToChuc, ELoaiToChuc } from "@/shared/types/organization.type";
import { Link, useRouter } from "@/i18n/routing";
import { PMS_PATH } from "@/config/path";
import { DataTable } from "@/shared/components/DataTable/DataTable";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

export default function OrganizationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id as string);
    const { isAdmin } = useRBAC();
    const mutation = AppMutation();
    const { data: org, isLoading } = AppQuery.organization.useOrganization(id, { enabled: !!id });
    const [search, setSearch] = useState("");
    const { data: users } = AppQuery.user.useList();
    const [opened, { open, close }] = useDisclosure(false);
    const isMobile = useMediaQuery("(max-width: 768px)");

    const queryClient = useQueryClient();
    const addMemberMutation = mutation.organization.useAddMember(id);
    const removeMemberMutation = mutation.organization.useRemoveMember(id, 0);
    const updateRoleMutation = mutation.organization.useUpdateMemberRole(id, 0);

    const handleAddMember = (userId: number) => {
        addMemberMutation.mutate({
            userId: userId,
            vaiTroTrongToChuc: EVaiTroToChuc.THANH_VIEN
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["/organizations", id] });
                setSearch("");
                close();
            }
        });
    };

    const handleRemoveMember = (userId: number) => {
        if (window.confirm("Xóa thành viên này khỏi tổ chức?")) {
            removeMemberMutation.mutate({ urlParams: { id, userId } }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/organizations", id] });
                }
            });
        }
    };

    const handleUpdateRole = (userId: number, role: EVaiTroToChuc) => {
        updateRoleMutation.mutate({ vaiTro: role, urlParams: { userId } } as any, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["/organizations", id] });
            }
        });
    };

    const filteredUsers = users?.filter(u =>
        (u.hoTen?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) &&
        !org?.thanhViens?.some(m => m.nguoiDungId === u.id)
    ).slice(0, 5);

    if (isLoading) return <LoadingOverlay visible overlayProps={{ blur: 2 }} />;

    return (
        <Container size="xl" py="md">
            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <Stack gap={0}>
                        <Group gap="xs" mb="xs">
                            <ActionIcon variant="subtle" onClick={() => router.back()} color="gray">
                                <IconChevronLeft size={20} />
                            </ActionIcon>
                            <Breadcrumbs>
                                <Anchor component={Link} href={PMS_PATH.ORGANIZATIONS.ROOT} size="sm" c="dimmed" underline="hover">Tổ chức</Anchor>
                                <Text size="sm" c="dimmed" fw={500}>{org?.ten}</Text>
                            </Breadcrumbs>
                        </Group>
                        <Title order={2} fw={700}>{org?.ten}</Title>
                        <Text c="dimmed" size="sm">Quản lý thành viên và cấu hình tổ chức</Text>
                    </Stack>
                    <Group>
                        <Badge size="lg" variant="dot" color={
                            org?.loaiToChuc === ELoaiToChuc.CHUYEN_MON ? "indigo" :
                                org?.loaiToChuc === ELoaiToChuc.DOAN_THE ? "orange" : "gray"
                        }>
                            {org?.loaiToChuc}
                        </Badge>
                        {isAdmin && (
                            <Button leftSection={<IconPlus size={18} />} radius="md" color="indigo" onClick={open}>
                                Thêm thành viên
                            </Button>
                        )}
                    </Group>
                </Group>

                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                    <Box style={{ gridColumn: 'span 2' }}>
                        <Card withBorder radius="md" p={0}>
                            <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                                <Title order={4}>Danh sách thành viên ({org?.thanhViens?.length || 0})</Title>
                            </Box>

                            <DataTable
                                minWidth={400}
                                data={org?.thanhViens || []}
                                columns={[
                                    {
                                        key: 'nguoiDung',
                                        header: 'Người dùng',
                                        render: (member) => (
                                            <Group gap="sm">
                                                <Avatar src={member.nguoiDung?.avatar} radius="xl" size="sm" />
                                                <Box>
                                                    <Text size="sm" fw={600} lineClamp={1}>{member.nguoiDung?.hoTen}</Text>
                                                    <Text size="xs" c="dimmed" lineClamp={1}>{member.nguoiDung?.email}</Text>
                                                </Box>
                                            </Group>
                                        )
                                    },
                                    {
                                        key: 'vaiTro',
                                        header: 'Vai trò',
                                        render: (member) => (
                                            <Select
                                                size="sm"
                                                variant="filled"
                                                radius="md"
                                                value={member.vaiTroTrongToChuc}
                                                data={[
                                                    { value: EVaiTroToChuc.TRUONG, label: "Trưởng" },
                                                    { value: EVaiTroToChuc.PHO, label: "Phó" },
                                                    { value: EVaiTroToChuc.THANH_VIEN, label: "Thành viên" },
                                                    { value: EVaiTroToChuc.THU_KY, label: "Thư ký" },
                                                ]}
                                                disabled={!isAdmin}
                                                onChange={(val) => handleUpdateRole(member.nguoiDungId, val as EVaiTroToChuc)}
                                                style={{ width: 140 }}
                                            />
                                        )
                                    },
                                    {
                                        key: 'actions',
                                        header: '',
                                        align: 'right',
                                        render: (member) => isAdmin && (
                                            <ActionIcon color="red" variant="subtle" radius="md" onClick={() => handleRemoveMember(member.nguoiDungId)}>
                                                <IconTrash size={18} />
                                            </ActionIcon>
                                        )
                                    }
                                ]}
                                emptyMessage="Chưa có thành viên nào trong tổ chức này"
                            />
                        </Card>
                    </Box>

                    <Stack>
                        <Card withBorder radius="md" p="xl" style={{ position: 'sticky', top: 20 }}>
                            <Title order={4} mb="md">Thông tin tổ chức</Title>
                            <Divider mb="xl" />
                            <Stack gap="md">
                                <Box>
                                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">Mã tổ chức</Text>
                                    <Text fw={600}>{org?.ma}</Text>
                                </Box>
                                <Box>
                                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">Loại tổ chức</Text>
                                    <Text size="sm" fw={500}>{org?.loaiToChuc}</Text>
                                </Box>
                                <Box>
                                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">Mô tả</Text>
                                    <Text size="sm">{org?.moTa || "Không có mô tả"}</Text>
                                </Box>
                            </Stack>
                        </Card>
                    </Stack>
                </SimpleGrid>
            </Stack>

            <Modal
                opened={opened}
                onClose={close}
                title="Thêm thành viên vào tổ chức"
                size="md"
                radius="md"
                fullScreen={isMobile}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <Stack gap="md">
                    <TextInput
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        leftSection={<IconSearch size={16} />}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        radius="md"
                        autoFocus
                    />

                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">Kết quả tìm kiếm</Text>

                    <Stack gap="sm">
                        {search && filteredUsers?.map(user => (
                            <Paper key={user.id} withBorder p="xs" radius="md" style={{ cursor: 'pointer' }}
                                onClick={() => handleAddMember(user.id)}
                                className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <Group justify="space-between">
                                    <Group gap="sm">
                                        <Avatar src={user.avatar} radius="xl" size="sm" />
                                        <Box style={{ flex: 1 }}>
                                            <Text size="xs" fw={600} lineClamp={1}>{user.hoTen}</Text>
                                            <Text size="calc(10px)" c="dimmed" lineClamp={1}>{user.email}</Text>
                                        </Box>
                                    </Group>
                                    <ActionIcon variant="light" color="indigo" size="sm" radius="md">
                                        <IconPlus size={14} />
                                    </ActionIcon>
                                </Group>
                            </Paper>
                        ))}
                        {search && (!filteredUsers || filteredUsers.length === 0) && (
                            <Text size="sm" c="dimmed" ta="center" py="xl">Không tìm thấy người dùng phù hợp</Text>
                        )}
                        {!search && (
                            <Text size="sm" c="dimmed" ta="center" py="xl">Nhập tên hoặc email để tìm kiếm thành viên</Text>
                        )}
                    </Stack>
                </Stack>
            </Modal>

            <LoadingOverlay visible={addMemberMutation.isPending || removeMemberMutation.isPending || updateRoleMutation.isPending} />
        </Container>
    );
}
