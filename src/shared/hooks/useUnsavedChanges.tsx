"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { modals } from "@mantine/modals";
import { Text as MantineText } from "@mantine/core";

export const useUnsavedChanges = (isDirty: boolean) => {
    // Browser level check (refresh, close tab)
    useEffect(() => {
        if (!isDirty) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    // Manual navigation guard
    const checkUnsavedChanges = useCallback((onProceed: () => void) => {
        if (!isDirty) {
            onProceed();
            return;
        }

        modals.openConfirmModal({
            title: "Chưa lưu thay đổi",
            children: (
                <MantineText size="sm">
                    Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời đi? Mọi dữ liệu chưa lưu sẽ bị mất.
                </MantineText>
            ),
            labels: { confirm: "Rời đi", cancel: "Ở lại" },
            confirmProps: { color: "red" },
            onConfirm: onProceed,
        });
    }, [isDirty]);

    return { checkUnsavedChanges };
};
