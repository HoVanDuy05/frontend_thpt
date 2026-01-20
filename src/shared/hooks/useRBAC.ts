import { useCallback } from "react";
import { EScreen } from "../types/screen.type";
import { useAppStore } from "@/providers/store/useAppStore";

export function useRBAC() {
    const { user } = useAppStore();
    const isAdmin = user?.vaiTro === "ADMIN";
    const isTeacher = user?.vaiTro === "GIAO_VIEN";

    const hasScreen = useCallback(
        (screen: EScreen) => {
            // Admin sees everything
            if (isAdmin) return true;

            // Teacher sees academic and exam management, but not account management or settings
            if (isTeacher) {
                const teacherScreens = [
                    EScreen.DASHBOARD,
                    EScreen.ACADEMIC_MANAGEMENT,
                    EScreen.EXAM_MANAGEMENT,
                    EScreen.REPORT_MANAGEMENT,
                    EScreen.COMMUNICATION_MANAGEMENT, // Teacher can use chat/notifications
                    EScreen.PORTAL_MANAGEMENT, // Teacher can post articles
                    EScreen.ORGANIZATION_MANAGEMENT,
                ];
                return teacherScreens.includes(screen);
            }

            // Other roles (like STUDENT/User) don't have access to these screens
            return false;
        },
        [isAdmin, isTeacher]
    );

    return {
        hasScreen,
        isAdmin,
        isTeacher,
    };
}
