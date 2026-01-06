"use client";

import { SocialLayout } from "@/feauture/social/layouts/SocialLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SocialLayout>
            {children}
        </SocialLayout>
    );
}
