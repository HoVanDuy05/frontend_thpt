export const USER_ROLES = {
    ADMIN: "ADMIN",
    TEACHER: "GIAO_VIEN",
    STUDENT: "HOC_SINH",
    PARENT: "PHU_HUYNH",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_LABELS = {
    [USER_ROLES.ADMIN]: {
        label: "Quản trị viên",
        dashboardTitle: "Hệ thống Quản lý Đào tạo",
    },
    [USER_ROLES.TEACHER]: {
        label: "Giáo viên",
        dashboardTitle: "Hệ thống Quản lý Giảng dạy",
    },
    [USER_ROLES.STUDENT]: {
        label: "Học sinh",
        dashboardTitle: "Cổng thông tin Học sinh",
    },
    [USER_ROLES.PARENT]: {
        label: "Phụ huynh",
        dashboardTitle: "Cổng thông tin Phụ huynh",
    },
};
