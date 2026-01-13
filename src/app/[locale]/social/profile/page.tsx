"use client";

import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useAppStore } from "@/providers/store/useAppStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, Container } from "@mantine/core";

export default function ProfilePage() {
    const { user } = useAppStore();
    const router = useRouter();

    useEffect(() => {
        if (user?.id) {
            router.replace(`/social/profile/${user.id}`);
        }
    }, [router, user?.id]);

    return (
        <Container size="sm" py="xl">
            <SkeletonLoader type="threads" count={3} />
        </Container>
    );
}
