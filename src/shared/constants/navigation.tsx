import {
    IconDashboard,
    IconUsers,
    IconBooks,
    IconSettings,
    IconChartBar
} from "@tabler/icons-react";

export const ADMIN_MENU_ITEMS = [
    { link: "/dashboard", label: "Dashboard", icon: IconDashboard },
    { link: "/dashboard/students", label: "Students", icon: IconUsers },
    { link: "/dashboard/courses", label: "Courses", icon: IconBooks },
    { link: "/dashboard/analytics", label: "Analytics", icon: IconChartBar },
    { link: "/dashboard/settings", label: "Settings", icon: IconSettings },
];
