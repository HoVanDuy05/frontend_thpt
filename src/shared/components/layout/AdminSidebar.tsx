"use client";

import { Stack, NavLink, ScrollArea, Box, Tooltip, Center, Menu, ActionIcon } from "@mantine/core";
import { IconSchool, IconChevronRight, IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";
import { usePathname, Link } from "@/i18n/routing";
import { useMenu, MenuItem } from "@/shared/hooks/useMenu";

interface AdminSidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

export function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
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
                    label={collapsed && !isChild ? null : item.label}
                    leftSection={item.icon ? <item.icon size={22} stroke={1.5} /> : null}
                    rightSection={!collapsed && hasChildren ? <IconChevronRight size={14} className="opacity-50" /> : null}
                    component={hasChildren && !collapsed ? "div" : (Link as any)}
                    href={hasChildren && !collapsed ? undefined : item.path}
                    variant="filled"
                    className={`rounded-lg transition-all duration-200 ${collapsed && !isChild ? "px-0 justify-center h-12" : "text-sm"}`}
                    defaultOpened={isActive}
                >
                    {!collapsed && hasChildren && renderNavItems(item.children!, true)}
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
                                        className={`rounded-md mb-1 ${pathname === child.path ? "bg-blue-50 text-blue-600 font-medium" : ""}`}
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
        <nav className={`h-full flex flex-col transition-all duration-300 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 w-full`}>
            {/* Logo Section */}
            <div className={`p-4 border-b border-gray-200 dark:border-zinc-800 transition-all duration-300 ${collapsed ? "px-0" : "px-4"}`}>
                <div className={`flex items-center transition-all ${collapsed ? "justify-center" : "justify-between"}`}>
                    {!collapsed && (
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-lg shadow-md shrink-0">
                                <IconSchool size={24} className="text-white" stroke={2} />
                            </div>
                            <div className="flex flex-col overflow-hidden whitespace-nowrap">
                                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                                    School PMS
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    v1.0.0
                                </span>
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
                            className="hover:bg-gray-100 dark:hover:bg-zinc-800"
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
        </nav>
    );
}
