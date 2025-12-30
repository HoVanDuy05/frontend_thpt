"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";

interface AppProviderProps {
    children: React.ReactNode;
    messages: AbstractIntlMessages;
    locale: string;
}

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
                <MantineProvider
                    defaultColorScheme="light"
                    theme={{
                        primaryColor: "brand",
                        colors: {
                            brand: [
                                "#eef2ff",
                                "#e0e7ff",
                                "#c7d2fe",
                                "#a5b4fc",
                                "#818cf8",
                                "#6366f1",
                                "#4f46e5",
                                "#4338ca",
                                "#3730a3",
                                "#312e81",
                            ],
                        },
                        fontFamily: "var(--font-be-vietnam), sans-serif",
                        defaultRadius: "md",
                        components: {
                            Button: {
                                defaultProps: {
                                    fw: 600,
                                },
                            },
                        },
                    }}
                >
                    <Notifications position="top-right" zIndex={1000} />
                    {children}
                </MantineProvider>
            </QueryClientProvider>
        </NextIntlClientProvider>
    );
}
