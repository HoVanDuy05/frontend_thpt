"use client";

import { Box, Button, Card, Container, Group, Stack, Text, Title, Badge, ActionIcon, SimpleGrid, Menu, Modal, TextInput, Textarea, Select, LoadingOverlay, Drawer, Avatar, Divider, ActionIcon as MantineActionIcon, ScrollArea, Table } from "@mantine/core";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { useRBAC } from "@/shared/hooks/useRBAC";
import { IconPlus, IconSettings, IconUsers, IconTrash, IconEdit, IconCheck, IconSearch, IconX, IconExternalLink } from "@tabler/icons-react";
import { useState, useMemo } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { ELoaiToChuc, EVaiTroToChuc, TToChuc } from "@/shared/types/organization.type";
import { notifications } from "@mantine/notifications";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useParamController } from "@/shared/hooks/useParamController";
import { Link } from "@/i18n/routing";
import { PMS_PATH } from "@/config/path";
import { useQueryClient } from "@tanstack/react-query";

export default function OrganizationManagementPage() {
    const { isAdmin } = useRBAC();
    const mutation = AppMutation();
    const { data: organizations, isLoading } = AppQuery.organization.useOrganizations();
    const [opened, { open, close }] = useDisclosure(false);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { params, setParam } = useParamController();
    const [editingOrg, setEditingOrg] = useState<TToChuc | null>(null);
    const queryClient = useQueryClient();

    const searchTerm = params.search || "";

    const filteredOrganizations = useMemo(() => {
        if (!organizations) return [];
        return organizations.filter(org =>
            org.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.ma.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [organizations, searchTerm]);

    const createMutation = mutation.organization.useCreate();
    const updateMutation = mutation.organization.useUpdate(editingOrg?.id || 0);
    const deleteMutation = mutation.organization.useDelete(0);

    const form = useForm({
        initialValues: {
            ten: "",
            ma: "",
            loaiToChuc: ELoaiToChuc.CHUYEN_MON,
            moTa: "",
        },
    });

    const handleCreate = (values: typeof form.values) => {
        if (editingOrg) {
            updateMutation.mutate(values, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/organizations"] });
                    handleClose();
                },
            });
        } else {
            createMutation.mutate(values, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/organizations"] });
                    handleClose();
                },
            });
        }
    };

    const handleEdit = (org: TToChuc) => {
        setEditingOrg(org);
        form.setValues({
            ten: org.ten,
            ma: org.ma,
            loaiToChuc: org.loaiToChuc,
            moTa: org.moTa || "",
        });
        open();
    };

    const handleClose = () => {
        close();
        setEditingOrg(null);
        form.reset();
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tổ chức này?")) {
            deleteMutation.mutate({ urlParams: { id } }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/organizations"] });
                },
            });
        }
    };

    return (
        <Container size="xl" py="md">
            <Stack gap="xl">
                <Group justify="space-between" align="center">
                    <Stack gap={0}>
                        <Title order={2}>Quản lý Tổ chức & Phòng ban</Title>
                        <Text c="dimmed">Quản lý cơ cấu tổ chức, các tổ chuyên môn và đoàn thể trong nhà trường</Text>
                    </Stack>
                    <Group gap="sm">
                        <TextInput
                            placeholder="Tìm kiếm..."
                            leftSection={<IconSearch size={16} />}
                            value={searchTerm}
                            onChange={(e) => setParam("search", e.currentTarget.value)}
                            radius="md"
                            w={{ base: '100%', sm: 250 }}
                        />
                        {isAdmin && (
                            <Button leftSection={<IconPlus size={18} />} onClick={open} radius="md">
                                Thêm tổ chức
                            </Button>
                        )}
                    </Group>
                </Group>

                <Box style={{ position: 'relative', minHeight: 200 }}>
                    {isLoading ? (
                        <SkeletonLoader type="cards" count={6} />
                    ) : (
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                            {filteredOrganizations?.map((org) => (
                                <Card key={org.id} shadow="sm" padding="lg" radius="md" withBorder>
                                    <Card.Section withBorder inheritPadding py="xs">
                                        <Group justify="space-between">
                                            <Text fw={600} size="lg">{org.ten}</Text>
                                            <Badge variant="light" color={
                                                org.loaiToChuc === ELoaiToChuc.CHUYEN_MON ? "blue" :
                                                    org.loaiToChuc === ELoaiToChuc.DOAN_THE ? "orange" : "gray"
                                            }>
                                                {org.loaiToChuc}
                                            </Badge>
                                        </Group>
                                    </Card.Section>

                                    <Stack mt="md" gap="xs">
                                        <Text size="sm" c="dimmed" lineClamp={2} h={40}>
                                            {org.moTa || "Không có mô tả"}
                                        </Text>
                                        <Group gap="xs">
                                            <IconUsers size={16} color="gray" />
                                            <Text size="sm" fw={500}>{org._count?.thanhViens || 0} thành viên</Text>
                                        </Group>
                                        <Text size="xs" c="dimmed" fw={500}>Mã: {org.ma}</Text>
                                    </Stack>

                                    <Divider my="md" />

                                    <Group justify="space-between">
                                        <Button
                                            component={Link}
                                            href={`${PMS_PATH.ORGANIZATIONS.ROOT}/${org.id}`}
                                            variant="subtle"
                                            leftSection={<IconExternalLink size={16} />}
                                            radius="md"
                                            size="sm"
                                        >
                                            Thành viên
                                        </Button>

                                        <Group gap="xs">
                                            <ActionIcon variant="light" color="indigo" radius="md" size="lg" onClick={() => handleEdit(org)}>
                                                <IconEdit size={18} />
                                            </ActionIcon>
                                            {isAdmin && (
                                                <ActionIcon
                                                    variant="light"
                                                    color="red"
                                                    radius="md"
                                                    size="lg"
                                                    onClick={() => handleDelete(org.id)}
                                                    disabled={(org._count?.thanhViens ?? 0) > 0}
                                                    title={(org._count?.thanhViens ?? 0) > 0 ? "Không thể xóa tổ chức đang có thành viên" : ""}
                                                >
                                                    <IconTrash size={18} />
                                                </ActionIcon>
                                            )}
                                        </Group>
                                    </Group>
                                </Card>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </Stack>

            <Modal
                opened={opened}
                onClose={handleClose}
                title={
                    <Stack gap={0}>
                        <Title order={3} fw={900}>{editingOrg ? "Cập nhật tổ chức" : "Thêm tổ chức mới"}</Title>
                        <Text size="xs" c="dimmed" fw={500}>Thông tin sẽ được lưu trữ vào hệ thống cơ cấu nhà trường</Text>
                    </Stack>
                }
                centered
                radius="lg"
                size="lg"
                fullScreen={isMobile}
                transitionProps={{ transition: 'fade', duration: 200 }}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <form onSubmit={form.onSubmit(handleCreate)}>
                    <Stack gap="md" py="md">
                        {editingOrg && (
                            <TextInput
                                label="Mã tổ chức"
                                disabled
                                size="md"
                                radius="md"
                                {...form.getInputProps("ma")}
                            />
                        )}
                        <TextInput
                            label="Tên tổ chức"
                            placeholder="Ví dụ: Tổ Toán - Tin, Đoàn thanh niên..."
                            required
                            size="md"
                            radius="md"
                            {...form.getInputProps("ten")}
                        />

                        <Select
                            label="Loại tổ chức"
                            placeholder="Chọn loại hình tổ chức"
                            size="md"
                            radius="md"
                            data={[
                                { value: ELoaiToChuc.CHUYEN_MON, label: "Tổ chuyên môn" },
                                { value: ELoaiToChuc.HANH_CHINH, label: "Phòng ban hành chính" },
                                { value: ELoaiToChuc.DOAN_THE, label: "Đoàn thể" },
                                { value: ELoaiToChuc.KHAC, label: "Khác" },
                            ]}
                            {...form.getInputProps("loaiToChuc")}
                        />

                        <Textarea
                            label="Mô tả"
                            placeholder="Nhập mô tả chi tiết về chức năng, nhiệm vụ..."
                            size="md"
                            radius="md"
                            minRows={3}
                            {...form.getInputProps("moTa")}
                        />

                        <Box mt="xl">
                            <Button
                                type="submit"
                                loading={createMutation.isPending || updateMutation.isPending}
                                fullWidth
                                size="lg"
                                radius="md"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20"
                            >
                                {editingOrg ? "Lưu thay đổi" : "Tạo tổ chức"}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Modal>

        </Container>
    );
}
