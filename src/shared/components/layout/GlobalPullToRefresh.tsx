"use client";

import type { ReactNode } from "react";
import { PullToRefresh } from "@/shared/components/layout/PullToRefresh";

type GlobalPullToRefreshProps = {
    children: ReactNode;
};

export function GlobalPullToRefresh({ children }: GlobalPullToRefreshProps) {
    return <PullToRefresh>{children}</PullToRefresh>;
}
