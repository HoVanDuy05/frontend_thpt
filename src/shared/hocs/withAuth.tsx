"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { useAppStore } from "@/providers/store/useAppStore";
import { EScreen } from "@/shared/types/screen.type";
import { useRBAC } from "@/shared/hooks/useRBAC";
import { BrandLoader } from "@/shared/components/BrandLoader";
import axiosClient from "@/api/axiosClient";

export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    requiredScreen?: EScreen
) {
    return function WithAuthComponent(props: P) {
        const { user, token, isHydrated, setUser } = useAppStore();
        const router = useRouter();
        const pathname = usePathname();
        const { hasScreen } = useRBAC();
        const [verifying, setVerifying] = useState(true);

        useEffect(() => {
            const checkAuth = async () => {
                if (!isHydrated) return;

                if (!token) {
                    const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
                    router.replace(loginUrl);
                    return;
                }

                // If we have token, ensure we have basic profile data
                if (!user) {
                    try {
                        const profile = await axiosClient.get("/auth/profile");
                        setUser(profile as any);
                    } catch (error) {
                        router.replace("/auth/login");
                        return;
                    }
                }

                setVerifying(false);
            };

            checkAuth();
        }, [token, isHydrated, router, pathname, user, setUser]);

        if (!isHydrated || verifying) {
            return <BrandLoader fullscreen />;
        }

        // Role Check
        if (requiredScreen && !hasScreen(requiredScreen)) {
            router.replace("/unauthorized");
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}
