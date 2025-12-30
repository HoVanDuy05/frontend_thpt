"use client";

import { StudentHeader } from "@/shared/components/layout/StudentHeader";
import { RoleGuard } from "@/shared/components/auth/RoleGuard";
import { withAuth } from "@/shared/hocs/withAuth";

// Retain RoleGuard for specific role check, use withAuth for profile hydration
const StudentLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <RoleGuard allowedRoles={["HOC_SINH"]}>
            <div className="min-h-screen flex flex-col pt-16">
                <StudentHeader />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
};

export default withAuth(StudentLayout);
