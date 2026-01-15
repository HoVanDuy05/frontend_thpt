"use client";

import { useRouter } from "next/navigation";
import { Box, Paper, Stack, Text, Title, Group, Transition, rem } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
    filters?: ReactNode;
    actions?: ReactNode;
    title?: string | ReactNode;
    description?: string | ReactNode;
    backHref?: string;
    backText?: string;
    onBackClick?: () => void;
    showHeader?: boolean;
    loading?: boolean;
}

export const LayoutList = React.forwardRef<HTMLDivElement, LayoutProps>(
    (
        {
            children,
            filters,
            actions,
            title,
            description,
            backHref,
            backText,
            onBackClick,
            showHeader = true,
            loading = false,
        },
        ref,
    ) => {
        const router = useRouter();

        const handleBackClick = () => {
            if (onBackClick) {
                onBackClick();
                return;
            }
            if (backHref) {
                router.push(backHref);
            } else {
                router.back();
            }
        };

        return (
            <Box className="relative flex size-full flex-1 overflow-hidden" h="100%">
                <Stack className="flex flex-1" gap={0} h="100%">
                    {showHeader && (
                        <Paper
                            style={{
                                zIndex: 10,
                                background: 'rgba(var(--mantine-color-body-rgb), 0.8)',
                                backdropFilter: 'blur(12px)',
                                borderBottom: `${rem(1)} solid var(--mantine-color-default-border)`,
                            }}
                            px={{ base: "sm", sm: "md" }}
                            py={{ base: "xs", sm: "sm" }}
                            ref={ref}
                            radius={0}
                            shadow="xs"
                        >
                            <Stack gap="sm">
                                {/* Title and Description */}
                                <Group justify="space-between" align="center" wrap="nowrap" gap="xs">
                                    <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                                        {backText && (
                                            <button
                                                type="button"
                                                onClick={handleBackClick}
                                                className="text-[10px] font-bold text-zinc-400 hover:text-blue-600 transition-colors inline-flex items-center gap-1 group w-fit"
                                            >
                                                <IconArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                                                {backText}
                                            </button>
                                        )}
                                        <Title
                                            order={2}
                                            fw={800}
                                            style={{ color: 'var(--mantine-color-text)', lineHeight: 1 }}
                                            className="tracking-tighter text-lg sm:text-2xl truncate"
                                        >
                                            {title}
                                        </Title>
                                        {description && (
                                            <Text size="xs" c="dimmed" fw={500} visibleFrom="sm">
                                                {description}
                                            </Text>
                                        )}
                                    </Stack>

                                    {actions && (
                                        <Box className="flex-none">
                                            {actions}
                                        </Box>
                                    )}
                                </Group>
                            </Stack>
                        </Paper>
                    )}

                    <Box
                        style={{
                            background: 'var(--mantine-color-body)',
                        }}
                        className="flex-1 overflow-auto"
                        p={{ base: "sm", sm: "md" }}
                    >
                        {filters && <Box mb="md">{filters}</Box>}

                        <Transition
                            mounted={!loading}
                            transition="fade"
                            duration={400}
                            timingFunction="ease"
                        >
                            {(styles) => (
                                <div style={styles}>
                                    {children}
                                </div>
                            )}
                        </Transition>

                        {loading && (
                            <Stack gap="md">
                                <Box
                                    style={{ background: 'var(--mantine-color-default-hover)' }}
                                    className="h-40 animate-pulse rounded-xl"
                                />
                                <Box
                                    style={{ background: 'var(--mantine-color-default-hover)' }}
                                    className="h-40 animate-pulse rounded-xl"
                                />
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </Box>
        );
    },
);

LayoutList.displayName = "LayoutList";

export default LayoutList;
