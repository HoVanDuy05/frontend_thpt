import { PMS_PATH } from "@/config/path";
import {
    IconDashboard,
    IconUsers,
    IconUserCheck,
    IconUserCircle,
    IconUserShield,
    IconSchool,
    IconBook,
    IconBooks,
    IconCalendar,
    IconClipboardList,
    IconCertificate,
    IconChartBar,
    IconReportMoney,
    IconSettings,
    IconNews,
    IconMessage,
    IconBell,
    IconPhoto,
    IconChecklist,
    IconShare,
    IconProps,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import { EScreen } from "../types/screen.type";
import { useRBAC } from "./useRBAC";

export type MenuItem = {
    key: string;
    label: string;
    icon: ((props: IconProps) => React.ReactNode) | null;
    showMenu?: boolean;
    path: string;
    color?: string;
    children?: MenuItem[];
};

export const useMenu = () => {
    const t = useTranslations();
    const { hasScreen, isAdmin, isTeacher } = useRBAC();

    const menu: MenuItem[] = useMemo(
        () =>
            [
                {
                    key: "dashboard",
                    label: t("menu.dashboard"),
                    icon: IconDashboard,
                    path: PMS_PATH.DASHBOARD,
                    color: "#228be6",
                    showMenu: hasScreen(EScreen.DASHBOARD),
                },
                {
                    key: "accounts",
                    label: t("menu.accounts.title"),
                    icon: IconUsers,
                    path: PMS_PATH.ACCOUNT.ROOT,
                    color: "#40c057",
                    showMenu: hasScreen(EScreen.ACCOUNT_MANAGEMENT),
                    children: [
                        {
                            key: "students",
                            label: t("menu.accounts.students"),
                            path: PMS_PATH.ACCOUNT.STUDENTS,
                            icon: IconUserCircle,
                            showMenu: true,
                        },
                        {
                            key: "teachers",
                            label: t("menu.accounts.teachers"),
                            path: PMS_PATH.ACCOUNT.TEACHERS,
                            icon: IconUserCheck,
                            showMenu: true,
                        },
                        {
                            key: "staff",
                            label: t("menu.accounts.staff"),
                            path: PMS_PATH.ACCOUNT.STAFF,
                            icon: IconUserCircle,
                            showMenu: true,
                        },
                        {
                            key: "roles",
                            label: t("menu.accounts.roles"),
                            path: PMS_PATH.ACCOUNT.ROLES,
                            icon: IconUserShield,
                            showMenu: true,
                        },
                    ],
                },
                {
                    key: "academic",
                    label: t("menu.academic.title"),
                    icon: IconSchool,
                    path: PMS_PATH.ACADEMIC.ROOT,
                    color: "#fa5252",
                    showMenu: hasScreen(EScreen.ACADEMIC_MANAGEMENT),
                    children: [
                        {
                            key: "grades",
                            label: t("menu.academic.grades"),
                            path: PMS_PATH.ACADEMIC.GRADES,
                            icon: IconSchool,
                            showMenu: true,
                        },
                        {
                            key: "years",
                            label: t("menu.academic.years"),
                            path: PMS_PATH.ACADEMIC.YEARS,
                            icon: IconCalendar,
                            showMenu: true,
                        },
                        {
                            key: "semesters",
                            label: t("menu.academic.semesters"),
                            path: PMS_PATH.ACADEMIC.SEMESTERS,
                            icon: IconChecklist,
                            showMenu: true,
                        },
                        {
                            key: "classes",
                            label: t("menu.academic.classes"),
                            path: PMS_PATH.ACADEMIC.CLASSES,
                            icon: IconClipboardList,
                            showMenu: true,
                        },
                        {
                            key: "subjects",
                            label: t("menu.academic.subjects"),
                            path: PMS_PATH.ACADEMIC.SUBJECTS,
                            icon: IconBook,
                            showMenu: true,
                        },
                        {
                            key: "courses",
                            label: t("menu.academic.courses"),
                            path: PMS_PATH.ACADEMIC.COURSES,
                            icon: IconBooks,
                            showMenu: true,
                        },
                        {
                            key: "schedule",
                            label: t("menu.academic.schedule"),
                            path: PMS_PATH.ACADEMIC.SCHEDULE,
                            icon: IconCalendar,
                            showMenu: true,
                        },
                    ],
                },
                {
                    key: "examination",
                    label: t("menu.examination.title"),
                    icon: IconCertificate,
                    path: PMS_PATH.EXAMINATION.ROOT,
                    color: "#fab005",
                    showMenu: hasScreen(EScreen.EXAM_MANAGEMENT),
                    children: [
                        {
                            key: "exam-list",
                            label: t("menu.examination.list"),
                            path: PMS_PATH.EXAMINATION.LIST,
                            icon: IconClipboardList,
                            showMenu: true,
                        },
                        {
                            key: "results",
                            label: t("menu.examination.results"),
                            path: PMS_PATH.EXAMINATION.RESULTS,
                            icon: IconChartBar,
                            showMenu: true,
                        },
                    ],
                },
                {
                    key: "portal",
                    label: t("menu.portal.title"),
                    icon: IconNews,
                    path: PMS_PATH.PORTAL.ROOT,
                    color: "#15aabf",
                    showMenu: hasScreen(EScreen.PORTAL_MANAGEMENT),
                    children: [
                        {
                            key: "banners",
                            label: t("menu.portal.banners"),
                            path: PMS_PATH.PORTAL.BANNERS,
                            icon: IconPhoto,
                            showMenu: !isTeacher, // Restricted for Teacher
                        },
                        {
                            key: "posts",
                            label: t("menu.portal.posts"),
                            path: PMS_PATH.PORTAL.POSTS,
                            icon: IconNews,
                            showMenu: true,
                        },
                        {
                            key: "comments",
                            label: t("menu.portal.comments"),
                            path: PMS_PATH.PORTAL.COMMENTS,
                            icon: IconMessage,
                            showMenu: true,
                        },
                    ],
                },
                {
                    key: "communication",
                    label: t("menu.communication.title"),
                    icon: IconMessage,
                    path: PMS_PATH.COMMUNICATION.ROOT,
                    color: "#be4bdb",
                    showMenu: hasScreen(EScreen.COMMUNICATION_MANAGEMENT),
                    children: [
                        {
                            key: "notifications",
                            label: t("menu.communication.notifications"),
                            path: PMS_PATH.COMMUNICATION.NOTIFICATIONS,
                            icon: IconBell,
                            showMenu: true,
                        },
                        {
                            key: "chat",
                            label: t("menu.communication.chat"),
                            path: PMS_PATH.COMMUNICATION.CHAT,
                            icon: IconMessage,
                            showMenu: true,
                        },
                    ],
                },
                {
                    key: "reports",
                    label: t("menu.reports.title"),
                    icon: IconChartBar,
                    path: PMS_PATH.REPORTS.ROOT,
                    color: "#7950f2",
                    showMenu: hasScreen(EScreen.REPORT_MANAGEMENT),
                    children: [
                        {
                            key: "attendance-report",
                            label: t("menu.reports.attendance"),
                            path: PMS_PATH.REPORTS.ATTENDANCE,
                            icon: IconUserCheck,
                            showMenu: true,
                        },
                        {
                            key: "finance-report",
                            label: t("menu.reports.finance"),
                            path: PMS_PATH.REPORTS.FINANCE,
                            icon: IconReportMoney,
                            showMenu: !isTeacher, // Restricted for Teacher
                        },
                    ],
                },
                {
                    key: "settings",
                    label: t("menu.settings"),
                    icon: IconSettings,
                    path: PMS_PATH.SETTINGS,
                    color: "#868e96",
                    showMenu: !isTeacher, // Only hidden for Teacher (Admin can see)
                },
                {
                    key: "approvals",
                    label: t("menu.approvals"),
                    icon: IconChecklist,
                    path: PMS_PATH.APPROVALS,
                    color: "#fd7e14",
                    showMenu: true,
                },
                {
                    key: "social",
                    label: t("menu.social"),
                    icon: IconShare,
                    path: PMS_PATH.SOCIAL,
                    color: "#e64980",
                    showMenu: true,
                }
            ].filter((item) => item.showMenu),
        [t, hasScreen, isAdmin, isTeacher]
    );

    return {
        menu,
    };
};
