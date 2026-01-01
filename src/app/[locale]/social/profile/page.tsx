"use client";

import { Center, Loader } from "@mantine/core";
import { useAppStore } from "@/providers/store/useAppStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
    const { user } = useAppStore();
    const router = useRouter();

    useEffect(() => {
        if (user?.id) {
            router.replace(`/social/profile/${user.id}`);
        }
    }, [router, user?.id]);

    return (
        <Center h="50vh">
            <Loader color="indigo" />
        </Center>
    );
}
