"use client";

import { Box, Button, Card, Container, Group, Stack, Text, Title, Badge, ActionIcon, SimpleGrid, Menu, Modal, TextInput, Textarea, Select, LoadingOverlay, Drawer, Avatar, Divider, ActionIcon as MantineActionIcon, ScrollArea, Table } from "@mantine/core";
import { AppQuery, useCreateOrganization, useDeleteOrganization, useAddOrgMember, useRemoveOrgMember, useUpdateOrgMemberRole } from "@/api/AppQuery";
import { IconPlus, IconSettings, IconUsers, IconTrash, IconEdit, IconCheck, IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { ELoaiToChuc, EVaiTroToChuc } from "@/shared/types/organization.type";
import { notifications } from "@mantine/notifications";

export default function OrganizationManagementPage() {
    const { data: organizations, isLoading } = AppQuery.organization.useOrganizations();
    const [opened, { open, close }] = useDisclosure(false);
    const [memberDrawerOpened, { open: openMemberDrawer, close: closeMemberDrawer }] = useDisclosure(false);
    const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

    const createMutation = useCreateOrganization();
    const deleteMutation = useDeleteOrganization();

    const form = useForm({
        initialValues: {
            ten: "",
            ma: "",
            loaiToChuc: ELoaiToChuc.CHUYEN_MON,
            moTa: "",
        },
    });

    const handleCreate = (values: typeof form.values) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                close();
                form.reset();
            },
        });
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tổ chức này?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleManageMembers = (id: number) => {
        setSelectedOrgId(id);
        openMemberDrawer();
    };

    return (
        <Container size="xl" py="md">
            <Stack gap="xl">
                <Group justify="space-between">
                    <Stack gap={0}>
                        <Title order={2}>Quản lý Tổ chức & Phòng ban</Title>
                        <Text c="dimmed">Quản lý cơ cấu tổ chức, các tổ chuyên môn và đoàn thể trong nhà trường</Text>
                    </Stack>
                    <Button leftSection={<IconPlus size={18} />} onClick={open} radius="md">
                        Thêm tổ chức
                    </Button>
                </Group>

                <Box style={{ position: 'relative', minHeight: 200 }}>
                    <LoadingOverlay visible={isLoading} />
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                        {organizations?.map((org) => (
                            <Card key={org.id} shadow="sm" padding="lg" radius="md" withBorder>
                                <Card.Section withBorder inheritPadding py="xs">
                                    <Group justify="space-between">
                                        <Text fw={500}>{org.ten}</Text>
                                        <Badge variant="light" color={
                                            org.loaiToChuc === ELoaiToChuc.CHUYEN_MON ? "blue" :
                                                org.loaiToChuc === ELoaiToChuc.DOAN_THE ? "orange" : "gray"
                                        }>
                                            {org.loaiToChuc}
                                        </Badge>
                                    </Group>
                                </Card.Section>

                                <Stack mt="md" gap="xs">
                                    <Text size="sm" c="dimmed" lineClamp={2}>
                                        {org.moTa || "Không có mô tả"}
                                    </Text>
                                    <Group gap="xs">
                                        <IconUsers size={16} color="gray" />
                                        <Text size="sm">{org._count?.thanhViens || 0} thành viên</Text>
                                    </Group>
                                    <Text size="xs" c="dimmed">Mã: {org.ma}</Text>
                                </Stack>

                                <Group mt="xl" grow>
                                    <Button
                                        variant="light"
                                        leftSection={<IconUsers size={16} />}
                                        radius="md"
                                        onClick={() => handleManageMembers(org.id)}
                                    >
                                        Thành viên
                                    </Button>
                                    <Menu position="bottom-end" shadow="md">
                                        <Menu.Target>
                                            <ActionIcon variant="light" size="lg" radius="md">
                                                <IconSettings size={18} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item leftSection={<IconEdit size={16} />}>Sửa</Menu.Item>
                                            <Menu.Item
                                                leftSection={<IconTrash size={16} />}
                                                color="red"
                                                onClick={() => handleDelete(org.id)}
                                            >
                                                Xóa
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>
            </Stack>

            <Modal opened={opened} onClose={close} title="Thêm tổ chức mới" centered radius="md">
                <form onSubmit={form.onSubmit(handleCreate)}>
                    <Stack>
                        <TextInput
                            label="Tên tổ chức"
                            placeholder="Tổ Toán, Đoàn thanh niên..."
                            required
                            {...form.getInputProps("ten")}
                        />
                        <TextInput
                            label="Mã tổ chức"
                            placeholder="TO_TOAN, DOAN_TN..."
                            required
                            {...form.getInputProps("ma")}
                        />
                        <Select
                            label="Loại tổ chức"
                            data={[
                                { value: ELoaiToChuc.CHUYEN_MON, label: "Tổ chuyên môn" },
                                { value: ELoaiToChuc.HANH_CHINH, label: "Phòng ban hành chính" },
                                { value: ELoaiToChuc.DOAN_THE, label: "Đoàn thể" },
                            ]}
                            {...form.getInputProps("loaiToChuc")}
                        />
                        <Textarea
                            label="Mô tả"
                            placeholder="Nhập mô tả chi tiết về chức năng, nhiệm vụ..."
                            {...form.getInputProps("moTa")}
                        />
                        <Button type="submit" loading={createMutation.isPending} fullWidth mt="md" radius="md">
                            Tạo mới
                        </Button>
                    </Stack>
                </form>
            </Modal>

            <MemberManagementDrawer
                orgId={selectedOrgId}
                opened={memberDrawerOpened}
                onClose={closeMemberDrawer}
            />
        </Container>
    );
}

function MemberManagementDrawer({ orgId, opened, onClose }: { orgId: number | null, opened: boolean, onClose: () => void }) {
    const { data: org, isLoading } = AppQuery.organization.useOrganization(orgId!, { enabled: !!orgId });
    const [search, setSearch] = useState("");
    const { data: users } = AppQuery.user.useList(); // Simple list for now, ideally search-enabled

    const addMemberMutation = useAddOrgMember();
    const removeMemberMutation = useRemoveOrgMember();
    const updateRoleMutation = useUpdateOrgMemberRole();

    const handleAddMember = (userId: number) => {
        if (!orgId) return;
        addMemberMutation.mutate({
            orgId,
            payload: {
                userId: userId,
                vaiTroTrongToChuc: EVaiTroToChuc.THANH_VIEN
            }
        });
    };

    const handleRemoveMember = (userId: number) => {
        if (!orgId) return;
        if (window.confirm("Xóa thành viên này khỏi tổ chức?")) {
            removeMemberMutation.mutate({ orgId, userId });
        }
    };

    const handleUpdateRole = (userId: number, role: EVaiTroToChuc) => {
        if (!orgId) return;
        updateRoleMutation.mutate({ orgId, userId, vaiTro: role });
    };

    const filteredUsers = users?.filter(u =>
        (u.hoTen?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) &&
        !org?.thanhViens?.some(m => m.nguoiDungId === u.id)
    ).slice(0, 5);

    return (
        <Drawer opened={opened} onClose={onClose} position="right" size="md" title={`Thành viên: ${org?.ten || '...'}`} radius="md">
            <Stack h="100%">
                <Box>
                    <TextInput
                        placeholder="Tìm người dùng để thêm..."
                        leftSection={<IconSearch size={16} />}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        mb="xs"
                    />
                    {search && filteredUsers && filteredUsers.length > 0 && (
                        <Card withBorder p={0} shadow="sm">
                            <Stack gap={0}>
                                {filteredUsers.map(user => (
                                    <Group key={user.id} justify="space-between" p="xs" style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            handleAddMember(user.id);
                                            setSearch("");
                                        }}>
                                        <Group gap="sm">
                                            <Avatar src={user.avatar} radius="xl" size="sm" />
                                            <Box>
                                                <Text size="sm" fw={500}>{user.hoTen}</Text>
                                                <Text size="xs" c="dimmed">{user.email}</Text>
                                            </Box>
                                        </Group>
                                        <ActionIcon variant="light" color="blue">
                                            <IconPlus size={16} />
                                        </ActionIcon>
                                    </Group>
                                ))}
                            </Stack>
                        </Card>
                    )}
                </Box>

                <Divider label="Danh sách thành viên" labelPosition="center" />

                <ScrollArea.Autosize mah="calc(100vh - 250px)" type="scroll">
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Người dùng</Table.Th>
                                <Table.Th>Vai trò</Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {org?.thanhViens?.map((member) => (
                                <Table.Tr key={member.id}>
                                    <Table.Td>
                                        <Group gap="sm">
                                            <Avatar src={member.nguoiDung?.avatar} radius="xl" size="sm" />
                                            <Box>
                                                <Text size="sm" fw={500}>{member.nguoiDung?.hoTen}</Text>
                                                <Text size="xs" c="dimmed">{member.nguoiDung?.taiKhoan}</Text>
                                            </Box>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Select
                                            size="xs"
                                            value={member.vaiTroTrongToChuc}
                                            data={[
                                                { value: EVaiTroToChuc.TRUONG, label: "Trưởng" },
                                                { value: EVaiTroToChuc.PHO, label: "Phó" },
                                                { value: EVaiTroToChuc.THANH_VIEN, label: "Thành viên" },
                                                { value: EVaiTroToChuc.THU_KY, label: "Thư ký" },
                                            ]}
                                            onChange={(val) => handleUpdateRole(member.nguoiDungId, val as EVaiTroToChuc)}
                                            style={{ width: 110 }}
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <ActionIcon color="red" variant="subtle" onClick={() => handleRemoveMember(member.nguoiDungId)}>
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea.Autosize>
            </Stack>
            <LoadingOverlay visible={isLoading || addMemberMutation.isPending || removeMemberMutation.isPending || updateRoleMutation.isPending} />
        </Drawer>
    );
}
