"use client";

import { Stack, NavLink, ScrollArea, Box, Tooltip, Center, Menu, ActionIcon, rem, Text } from "@mantine/core";
import { IconSchool, IconChevronRight, IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";
import { usePathname, Link } from "@/i18n/routing";
import { useMenu, MenuItem } from "@/shared/hooks/useMenu";

interface AdminSidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
    onNavigate?: () => void;
}

export function AdminSidebar({ collapsed = false, onToggle, onNavigate }: AdminSidebarProps) {
    const pathname = usePathname();
    const { menu } = useMenu();

    const renderNavItems = (items: MenuItem[], isChild = false) => {
        return items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isActive = pathname === item.path || (hasChildren && pathname.startsWith(item.path));

            // Component to render as NavLink
            const navLink = (
                <NavLink
                    key={item.key}
                    active={isActive}
                    label={collapsed && !isChild ? null : <Text size="sm" fw={isActive ? 600 : 400}>{item.label}</Text>}
                    leftSection={item.icon ? <item.icon size={20} stroke={1.5} /> : null}
                    rightSection={!collapsed && hasChildren ? <IconChevronRight size={14} className="opacity-50" /> : null}
                    component={hasChildren && !collapsed ? "div" : (Link as any)}
                    href={hasChildren && !collapsed ? undefined : item.path}
                    onClick={() => {
                        if (!hasChildren && onNavigate) {
                            onNavigate();
                        }
                    }}
                    variant="light"
                    color="indigo"
                    className={`rounded-md transition-all duration-200 mb-0.5 ${collapsed && !isChild ? "px-0 justify-center h-10" : "py-2.5"}`}
                    styles={{
                        root: {
                            color: isActive ? 'var(--mantine-primary-color-filled)' : 'var(--mantine-color-text)',
                            backgroundColor: isActive ? 'var(--mantine-primary-color-light)' : 'transparent',
                        }
                    }}
                    defaultOpened={isActive}
                >
                    {!collapsed && hasChildren && (
                        <Box pl="md" className="border-l ml-4 border-[var(--mantine-color-default-border)]" mt={4}>
                            {renderNavItems(item.children!, true)}
                        </Box>
                    )}
                </NavLink>
            );

            // Collapsed mode with sub-menu
            if (collapsed && !isChild) {
                if (hasChildren) {
                    return (
                        <Menu
                            key={item.key}
                            trigger="hover"
                            position="right-start"
                            offset={15}
                            shadow="md"
                            withinPortal
                        >
                            <Menu.Target>
                                {navLink}
                            </Menu.Target>
                            <Menu.Dropdown className="p-2 min-w-[180px]">
                                <Menu.Label className="font-bold border-b pb-2 mb-2">{item.label}</Menu.Label>
                                {item.children?.map((child) => (
                                    <Menu.Item
                                        key={child.key}
                                        component={Link as any}
                                        href={child.path}
                                        leftSection={child.icon ? <child.icon size={16} /> : null}
                                        className={`rounded-md mb-1 transition-colors ${pathname === child.path
                                            ? "bg-[var(--mantine-primary-color-light)] text-[var(--mantine-primary-color-filled)] font-medium"
                                            : "text-[var(--mantine-color-text)] hover:bg-[var(--mantine-color-default-hover)]"
                                            }`}
                                    >
                                        {child.label}
                                    </Menu.Item>
                                ))}
                            </Menu.Dropdown>
                        </Menu>
                    );
                }

                return (
                    <Tooltip
                        key={item.key}
                        label={item.label}
                        position="right"
                        withArrow
                        offset={20}
                        transitionProps={{ transition: 'fade', duration: 200 }}
                    >
                        {navLink}
                    </Tooltip>
                );
            }

            return navLink;
        });
    };

    return (
        <Box
            component="nav"
            style={{
                background: 'var(--mantine-color-body)',
                borderRight: `${rem(1)} solid var(--mantine-color-default-border)`
            }}
            className="h-full flex flex-col transition-all duration-300 w-full"
        >
            {/* Logo Section */}
            <div
                style={{
                    borderBottom: `${rem(1)} solid var(--mantine-color-default-border)`
                }}
                className={`p-4 transition-all duration-300 ${collapsed ? "px-0" : "px-4"}`}
            >
                <div className={`flex items-center transition-all ${collapsed ? "justify-center" : "justify-between"}`}>
                    {!collapsed && (
                        <div className="flex items-center gap-3">
                            <Box
                                style={{
                                    background: 'linear-gradient(135deg, var(--mantine-color-indigo-6) 0%, var(--mantine-color-indigo-8) 100%)'
                                }}
                                className="p-2.5 rounded-lg shadow-md shrink-0"
                            >
                                <IconSchool size={24} className="text-white" stroke={2} />
                            </Box>
                            <div className="flex flex-col overflow-hidden whitespace-nowrap">
                                <Text fw={700} size="sm" c="var(--mantine-color-text)">
                                    Nguyễn Huệ
                                </Text>
                                <Text size="xs" c="dimmed">
                                    v1.0.0
                                </Text>
                            </div>
                        </div>
                    )}

                    {/* Desktop Toggle Button */}
                    {onToggle && (
                        <ActionIcon
                            variant="subtle"
                            onClick={onToggle}
                            visibleFrom="sm"
                            size={collapsed ? "lg" : "md"}
                            c="dimmed"
                        >
                            {collapsed ? (
                                <IconLayoutSidebarLeftExpand size={20} stroke={1.5} />
                            ) : (
                                <IconLayoutSidebarLeftCollapse size={18} stroke={1.5} />
                            )}
                        </ActionIcon>
                    )}
                </div>
            </div>

            {/* Navigation Menu */}
            <ScrollArea className="flex-1 px-3 py-4">
                <Stack gap="sm">
                    {renderNavItems(menu)}
                </Stack>
            </ScrollArea>
        </Box>
    );
}
