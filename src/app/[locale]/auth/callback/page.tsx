"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/providers/store/useAppStore";
import { BrandLoader } from "@/shared/components/BrandLoader";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setToken } = useAppStore();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            // Save token to store
            setToken(token);

            // Decode token to get user info
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));

                notifications.show({
                    title: "Đăng nhập thành công",
                    message: `Chào mừng, ${payload.username}!`,
                    color: "teal",
                    icon: <IconCheck size={16} />,
                });

                // Redirect based on role
                let targetUrl = "/student";
                switch (payload.role) {
                    case "ADMIN":
                    case "GIAO_VIEN":
                        targetUrl = "/admin/dashboard";
                        break;
                    case "HOC_SINH":
                        targetUrl = "/student";
                        break;
                }

                router.push(targetUrl);
            } catch (error) {
                notifications.show({
                    title: "Lỗi",
                    message: "Token không hợp lệ",
                    color: "red",
                    icon: <IconX size={16} />,
                });
                router.push("/auth/login");
            }
        } else {
            notifications.show({
                title: "Lỗi",
                message: "Không tìm thấy token xác thực",
                color: "red",
                icon: <IconX size={16} />,
            });
            router.push("/auth/login");
        }
    }, [searchParams, setToken, router]);

    return <BrandLoader fullscreen message="Đang xác thực..." />;
}
