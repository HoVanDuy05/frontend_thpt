"use client";

import { MantineProvider, createTheme, rem } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { SplashScreen } from "@/shared/components/SplashScreen";
import { PWAProvider } from "@/providers/PWAProvider";
import { GlobalSocketHandler } from "@/shared/components/GlobalSocketHandler";
import { ThemeSync } from "@/shared/components/ThemeSync";
import { PWAUpdateNotification } from "@/shared/components/PWAUpdateNotification";
import { DatesProvider } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';

dayjs.locale('vi');

interface AppProviderProps {
    children: React.ReactNode;
    messages: AbstractIntlMessages;
    locale: string;
}

const theme = createTheme({
    primaryColor: "indigo",
    primaryShade: { light: 6, dark: 5 },
    fontFamily: "var(--font-be-vietnam), sans-serif",
    defaultRadius: "lg",
    white: "#ffffff",
    black: "#09090b",

    colors: {
        // Refined Indigo palette
        indigo: [
            "#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81"
        ],
        // Zinc-based neutrals for dark mode
        dark: [
            "#fafafa", "#f4f4f5", "#e4e4e7", "#d4d4d8", "#a1a1aa", "#71717a", "#52525b", "#3f3f46", "#27272a", "#18181b"
        ],
    },

    shadows: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    },

    components: {
        Card: {
            defaultProps: {
                padding: "xl",
                withBorder: true,
                shadow: "sm",
            },
            styles: {
                root: {
                    transition: "transform 200ms ease, box-shadow 200ms ease",
                    "&:hover": {
                        transform: "translateY(-4px)",
                    }
                }
            }
        },
        Button: {
            defaultProps: {
                fw: 600,
            },
            styles: {
                root: {
                    transition: "filter 150ms ease, transform 100ms ease",
                    "&:active": {
                        transform: "scale(0.98)",
                    }
                }
            }
        },
        Paper: {
            defaultProps: {
                radius: "lg",
                withBorder: true,
            },
        },
        TextInput: {
            defaultProps: {
                radius: "md",
            }
        },
        LoadingOverlay: {
            defaultProps: {
                transitionProps: { duration: 400 },
                overlayProps: {
                    radius: "md",
                    blur: 3,
                    opacity: 0.8
                },
                loaderProps: {
                    type: "dots",
                    color: "indigo",
                }
            },
        },
        Select: {
            defaultProps: {
                radius: "md",
            }
        },
        Table: {
            defaultProps: {
                verticalSpacing: "sm",
                horizontalSpacing: "md",
            },
            styles: {
                thead: {
                    backgroundColor: 'var(--mantine-color-default-hover)',
                },
                th: {
                    color: 'var(--mantine-color-dimmed)',
                    textTransform: "uppercase",
                    fontSize: rem(12),
                    letterSpacing: rem(1),
                }
            }
        }
    },
});

export function AppProvider({ children, messages, locale }: AppProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        retry: 1,
                    },
                },
            })
    );

    return (
        <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone="Asia/Ho_Chi_Minh"
        >
            <QueryClientProvider client={queryClient}>
                <MantineProvider defaultColorScheme="auto" theme={theme}>
                    <DatesProvider settings={{ locale }}>
                        <Notifications position="top-right" zIndex={1000} />
                        <SplashScreen />
                        <Suspense fallback={null}>
                            <ThemeSync />
                        </Suspense>
                        <PWAProvider>
                            <Suspense fallback={null}>
                                <GlobalSocketHandler />
                            </Suspense>
                            <PWAUpdateNotification />
                            {children}
                        </PWAProvider>
                    </DatesProvider>
                </MantineProvider>
            </QueryClientProvider>
        </NextIntlClientProvider>
    );
}
