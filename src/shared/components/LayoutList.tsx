"use client";

import { useRouter } from "next/navigation";
import { Box, Paper, Stack, Text, Title, Group, Transition } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { ReactNode } from "react";
import { AppButton } from "./AppButton";

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
                            className="z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800"
                            px="md"
                            py="sm"
                            ref={ref}
                            radius={0}
                            shadow="xs"
                        >
                            <Group justify="space-between" align="center" wrap="nowrap">
                                <Stack gap={4}>
                                    {backText && (
                                        <button
                                            type="button"
                                            aria-label={`Go back to ${backText}`}
                                            onClick={handleBackClick}
                                            className="text-xs font-semibold text-zinc-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1 group"
                                        >
                                            <IconArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                                            {backText}
                                        </button>
                                    )}
                                    <Title order={2} fw={800} className="tracking-tight text-zinc-900 dark:text-zinc-50">
                                        {title}
                                    </Title>
                                    {description && (
                                        <Text size="xs" c="dimmed" fw={500}>
                                            {description}
                                        </Text>
                                    )}
                                </Stack>

                                <div className="flex-none">{actions}</div>
                            </Group>
                        </Paper>
                    )}

                    <Box className="flex-1 overflow-auto bg-zinc-50/50 dark:bg-zinc-900/10" p="md">
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
                                <Box className="h-40 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />
                                <Box className="h-40 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />
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
