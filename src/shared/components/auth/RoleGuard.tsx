"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { useAppStore } from "@/providers/store/useAppStore";
import { UserRole } from "@/shared/types/user.type";
import { BrandLoader } from "../BrandLoader";

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isHydrated } = useAppStore();

    useEffect(() => {
        if (!isHydrated) return;

        if (!user) {
            // Unauthenticated: redirect to login with original callback URL
            const searchParams = new URLSearchParams();
            searchParams.set("redirect", pathname);
            router.push(`/auth/login?${searchParams.toString()}`);
            return;
        }

        if (allowedRoles && !allowedRoles.includes(user.vaiTro)) {
            router.push("/unauthorized");
        }
    }, [user, isHydrated, allowedRoles, router, pathname]);

    // Show loading state while hydrating or waiting for redirect
    if (!isHydrated || !user || (allowedRoles && !allowedRoles.includes(user.vaiTro))) {
        return <BrandLoader fullscreen />;
    }

    return <>{children}</>;
}
