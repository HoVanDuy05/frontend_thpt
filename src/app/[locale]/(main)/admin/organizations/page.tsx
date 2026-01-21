"use client";

import { Box, Button, Card, Container, Group, Stack, Text, Title, Badge, ActionIcon, SimpleGrid, Menu, Modal, TextInput, Textarea, Select, LoadingOverlay, Drawer, Avatar, Divider, ActionIcon as MantineActionIcon, ScrollArea, Table } from "@mantine/core";
import { AppQuery } from "@/api/AppQuery";
import { AppMutation } from "@/api/AppMutation";
import { useRBAC } from "@/shared/hooks/useRBAC";
import { IconPlus, IconSettings, IconUsers, IconTrash, IconEdit, IconCheck, IconSearch, IconX, IconExternalLink, IconChevronRight, IconChevronDown, IconHierarchy2, IconBuildingSkyscraper, IconBuildingCommunity } from "@tabler/icons-react";
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

interface TreeItem extends TToChuc {
    children_nodes?: TreeItem[];
    level?: number;
}

const OrgCard = ({ org, onEdit, onDelete, isAdmin }: { org: TToChuc; onEdit: (org: TToChuc) => void; onDelete: (id: number) => void; isAdmin: boolean }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
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
                <ActionIcon variant="light" color="indigo" radius="md" size="lg" onClick={() => onEdit(org)}>
                    <IconEdit size={18} />
                </ActionIcon>
                {isAdmin && (
                    <ActionIcon
                        variant="light"
                        color="red"
                        radius="md"
                        size="lg"
                        onClick={() => onDelete(org.id)}
                        disabled={(org._count?.thanhViens ?? 0) > 0}
                        title={(org._count?.thanhViens ?? 0) > 0 ? "Không thể xóa tổ chức đang có thành viên" : ""}
                    >
                        <IconTrash size={18} />
                    </ActionIcon>
                )}
            </Group>
        </Group>
    </Card>
);

const TreeNode = ({ node, onEdit, onDelete, isAdmin }: { node: TreeItem; onEdit: (org: TToChuc) => void; onDelete: (id: number) => void; isAdmin: boolean }) => {
    const [expanded, { toggle }] = useDisclosure(true);
    const hasChildren = node.children_nodes && node.children_nodes.length > 0;

    return (
        <Box>
            <Card withBorder radius="md" p="xs" className="hover:bg-gray-50 transition-colors">
                <Group justify="space-between" wrap="nowrap">
                    <Group gap="xs" wrap="nowrap">
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={toggle}
                            style={{ visibility: hasChildren ? "visible" : "hidden" }}
                        >
                            {expanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                        </ActionIcon>

                        {node.level === 0 ? (
                            <IconBuildingSkyscraper size={20} color="var(--mantine-color-blue-6)" />
                        ) : node.level === 1 ? (
                            <IconHierarchy2 size={18} color="var(--mantine-color-indigo-5)" />
                        ) : (
                            <IconBuildingCommunity size={16} color="var(--mantine-color-gray-6)" />
                        )}

                        <Box>
                            <Group gap="xs">
                                <Text fw={600} size="sm" component={Link} href={`${PMS_PATH.ORGANIZATIONS.ROOT}/${node.id}`} className="hover:text-blue-600">
                                    {node.ten}
                                </Text>
                                <Badge size="xs" variant="dot" color={
                                    node.loaiToChuc === ELoaiToChuc.CHUYEN_MON ? "blue" :
                                        node.loaiToChuc === ELoaiToChuc.DOAN_THE ? "orange" : "gray"
                                }>
                                    {node.loaiToChuc}
                                </Badge>
                            </Group>
                            <Text size="xs" c="dimmed">{node.ma} • {node._count?.thanhViens || 0} thành viên</Text>
                        </Box>
                    </Group>

                    <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                                <IconSettings size={16} />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item
                                leftSection={<IconExternalLink size={14} />}
                                component={Link}
                                href={`${PMS_PATH.ORGANIZATIONS.ROOT}/${node.id}`}
                            >
                                Xem chi tiết
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<IconEdit size={14} />}
                                onClick={() => onEdit(node)}
                            >
                                Sửa thông tin
                            </Menu.Item>
                            {isAdmin && (
                                <>
                                    <Menu.Divider />
                                    <Menu.Item
                                        color="red"
                                        leftSection={<IconTrash size={14} />}
                                        onClick={() => onDelete(node.id)}
                                        disabled={(node._count?.thanhViens ?? 0) > 0 || hasChildren}
                                        title={hasChildren ? "Xóa các cấp con trước" : ""}
                                    >
                                        Xóa tổ chức
                                    </Menu.Item>
                                </>
                            )}
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Card>

            {hasChildren && expanded && (
                <Box pl={32} mt={4} style={{ borderLeft: '1px dashed var(--mantine-color-gray-3)' }}>
                    <Stack gap={4}>
                        {node.children_nodes?.map((child) => (
                            <TreeNode key={child.id} node={child} onEdit={onEdit} onDelete={onDelete} isAdmin={isAdmin} />
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

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

    const buildTree = (list: TToChuc[], parentId: number | null = null, level = 0): TreeItem[] => {
        return list
            .filter(item => item.parentId === parentId)
            .map(item => ({
                ...item,
                level,
                children_nodes: buildTree(list, item.id, level + 1)
            }));
    };

    const treeData = useMemo(() => {
        if (!organizations) return [];
        let filtered = organizations;
        if (searchTerm) {
            filtered = organizations.filter(org =>
                org.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
                org.ma.toLowerCase().includes(searchTerm.toLowerCase())
            );
            // If searching, just return flat list with no grouping to make it easier to find
            return filtered as TreeItem[];
        }
        return buildTree(organizations);
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
            parentId: null as number | null | string,
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
            parentId: org.parentId ? org.parentId : null,
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
                        <Stack gap="md">
                            {searchTerm ? (
                                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                                    {treeData?.map((org) => (
                                        <OrgCard key={org.id} org={org} onEdit={handleEdit} onDelete={handleDelete} isAdmin={isAdmin} />
                                    ))}
                                </SimpleGrid>
                            ) : (
                                <Stack gap="xs">
                                    {treeData.map((node) => (
                                        <TreeNode key={node.id} node={node} onEdit={handleEdit} onDelete={handleDelete} isAdmin={isAdmin} />
                                    ))}
                                </Stack>
                            )}
                            {treeData.length === 0 && (
                                <Card padding="xl" radius="md" withBorder>
                                    <Stack align="center" gap="xs">
                                        <Text c="dimmed">Không tìm thấy tổ chức nào</Text>
                                    </Stack>
                                </Card>
                            )}
                        </Stack>
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

                        <Select
                            label="Cấp trên"
                            placeholder="Chọn tổ chức cấp trên (nếu có)"
                            size="md"
                            radius="md"
                            clearable
                            searchable
                            data={organizations?.filter(o => o.id !== editingOrg?.id).map(o => ({
                                value: String(o.id),
                                label: o.ten
                            })) || []}
                            {...form.getInputProps("parentId")}
                            onChange={(val) => form.setFieldValue("parentId", val ? Number(val) : null)}
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
