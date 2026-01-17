"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader } from "@mantine/core";
import { useRouter } from "next/navigation";

type PullToRefreshProps = {
    children: ReactNode;
    className?: string;
    thresholdPx?: number;
    maxPullPx?: number;
};

export function PullToRefresh({
    children,
    className,
    thresholdPx = 80,
    maxPullPx = 140,
}: PullToRefreshProps) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const activeScrollElRef = useRef<HTMLElement | null>(null);

    const startYRef = useRef<number | null>(null);
    const pullingRef = useRef(false);

    const [pullPx, setPullPx] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const findScrollableAncestor = useCallback((target: EventTarget | null) => {
        const container = containerRef.current;
        let node = target as HTMLElement | null;

        while (node && container && node !== container) {
            const style = window.getComputedStyle(node);
            const overflowY = style.overflowY;
            const isScrollableY = (overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight;
            if (isScrollableY) return node;
            node = node.parentElement;
        }

        return null;
    }, []);

    const canStartPull = useCallback(() => {
        const activeScrollEl = activeScrollElRef.current;
        if (activeScrollEl) return activeScrollEl.scrollTop <= 0;
        return window.scrollY <= 0;
    }, []);

    const reset = useCallback(() => {
        startYRef.current = null;
        pullingRef.current = false;
        setPullPx(0);
    }, []);

    const triggerRefresh = useCallback(async () => {
        if (isRefreshing) return;

        setIsRefreshing(true);
        setPullPx(thresholdPx);

        try {
            router.refresh();
            await new Promise((r) => setTimeout(r, 800));
        } finally {
            setIsRefreshing(false);
            reset();
        }
    }, [isRefreshing, reset, router, thresholdPx]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onTouchStart = (e: TouchEvent) => {
            if (isRefreshing) return;
            if (e.touches.length !== 1) return;

            activeScrollElRef.current = findScrollableAncestor(e.target);
            if (!canStartPull()) return;

            startYRef.current = e.touches[0].clientY;
            pullingRef.current = false;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (isRefreshing) return;
            if (startYRef.current === null) return;
            if (e.touches.length !== 1) return;

            const dy = e.touches[0].clientY - startYRef.current;
            if (dy <= 0) {
                if (pullingRef.current) setPullPx(0);
                return;
            }

            if (!canStartPull()) return;

            pullingRef.current = true;
            e.preventDefault();

            const eased = Math.min(maxPullPx, Math.round(dy * 0.6));
            setPullPx(eased);
        };

        const onTouchEnd = () => {
            if (isRefreshing) return;

            if (pullingRef.current && pullPx >= thresholdPx) {
                void triggerRefresh();
                return;
            }

            reset();
        };

        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("touchmove", onTouchMove, { passive: false });
        el.addEventListener("touchend", onTouchEnd, { passive: true });
        el.addEventListener("touchcancel", onTouchEnd, { passive: true });

        return () => {
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("touchmove", onTouchMove);
            el.removeEventListener("touchend", onTouchEnd);
            el.removeEventListener("touchcancel", onTouchEnd);
        };
    }, [canStartPull, isRefreshing, maxPullPx, pullPx, reset, thresholdPx, triggerRefresh]);

    const showLoader = isRefreshing || pullPx > 0;
    const progress = Math.min(1, pullPx / thresholdPx);

    const loaderTranslateY = Math.max(-28, Math.min(12, pullPx - 28));

    return (
        <div ref={containerRef} className={className} style={{ WebkitOverflowScrolling: "touch" }}>
            {showLoader && (
                <div
                    style={{
                        position: "fixed",
                        top: 8,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        pointerEvents: "none",
                        zIndex: 9999,
                        transform: `translateY(${loaderTranslateY}px)`,
                        transition: isRefreshing ? "transform 200ms ease" : undefined,
                    }}
                >
                    <div style={{ opacity: isRefreshing ? 1 : 0.4 + 0.6 * progress }}>
                        <Loader size="sm" color="indigo" />
                    </div>
                </div>
            )}

            <div
                style={{
                    transform: `translateY(${pullPx}px)`,
                    transition: isRefreshing ? "transform 200ms ease" : undefined,
                    willChange: "transform",
                }}
            >
                {children}
            </div>
        </div>
    );
}
