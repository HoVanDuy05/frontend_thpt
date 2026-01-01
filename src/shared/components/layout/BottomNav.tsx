"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { IconHome, IconCalendar, IconChartBar, IconUsers, IconUser, IconGitPullRequest } from "@tabler/icons-react";
import { Box } from "@mantine/core";
import { useTranslations } from "next-intl";

export function BottomNav() {
    const pathname = usePathname();
    const t = useTranslations("student.nav");

    const navItems = [
        { href: "/student", icon: IconHome, label: t("home") },
        { href: "/student/schedule", icon: IconCalendar, label: t("schedule") },
        { href: "/student/my-flow", icon: IconGitPullRequest, label: t("flow") },
        { href: "/student/social", icon: IconUsers, label: t("social") },
        { href: "/student/profile", icon: IconUser, label: t("profile") },
    ];

    const isActive = (href: string) => {
        if (href === "/student") {
            return pathname === "/student" || pathname.endsWith("/student");
        }
        return pathname?.includes(href);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 z-50 safe-area-bottom">
            <div className="flex items-center justify-around h-full px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="no-underline flex-1"
                        >
                            <Box className="flex flex-col items-center justify-center gap-1 py-2 transition-all duration-200 hover:scale-105">
                                <div
                                    className={`p-1.5 rounded-xl transition-all duration-200 ${active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-500 dark:text-gray-400"
                                        }`}
                                >
                                    <Icon size={20} stroke={2} />
                                </div>
                                <span
                                    className={`text-xs font-semibold transition-colors duration-200 ${active
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-500 dark:text-gray-400"
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </Box>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
