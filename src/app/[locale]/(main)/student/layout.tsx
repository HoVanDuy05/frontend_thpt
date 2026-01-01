"use client";

import { MobileHeader } from "@/shared/components/layout/MobileHeader";
import { BottomNav } from "@/shared/components/layout/BottomNav";
import { RoleGuard } from "@/shared/components/auth/RoleGuard";
import { withAuth } from "@/shared/hocs/withAuth";

// Mobile-first layout for student app
const StudentLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <RoleGuard allowedRoles={["HOC_SINH"]}>
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950">
                <MobileHeader />
                <main className="flex-1 pb-16 overflow-y-auto">
                    {children}
                </main>
                <BottomNav />
            </div>
        </RoleGuard>
    );
};

export default withAuth(StudentLayout);

