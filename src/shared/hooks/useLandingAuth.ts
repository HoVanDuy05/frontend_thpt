"use client";

import { useAppStore } from "@/providers/store/useAppStore";
import { USER_ROLES, UserRole } from "@/shared/constants/roles.constant";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState, useMemo } from "react";

export function useLandingAuth() {
    const { user, token } = useAppStore();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const isLoggedIn = useMemo(() => mounted && !!token && !!user, [mounted, token, user]);

    const portalPath = useMemo(() => {
        if (!user) return "/auth/login";

        const role = user.vaiTro as UserRole;
        switch (role) {
            case USER_ROLES.ADMIN:
                return "/admin/dashboard";
            case USER_ROLES.TEACHER:
                return "/teacher/dashboard";
            case USER_ROLES.STUDENT:
                return "/student";
            case USER_ROLES.PARENT:
                return "/parent";
            default:
                return "/auth/login";
        }
    }, [user]);

    const handleAccessPortal = () => {
        router.push(portalPath);
    };

    return {
        isLoggedIn,
        user,
        portalPath,
        handleAccessPortal,
    };
}
