import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

import { ColorSchemeScript } from "@mantine/core";
import { AppProvider } from "@/providers/AppProvider";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeSync } from "@/shared/components/ThemeSync";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "NHers - Nguyễn Huệ Academy",
  description: "Hệ thống Quản lý Trường học Thông minh THPT Nguyễn Huệ",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#4f46e5",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NHers" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* iOS Splash Screens - simplified approach */}
        <link rel="apple-touch-startup-image" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${beVietnamPro.variable} antialiased`}
      >
        <AppProvider locale={locale} messages={messages}>
          <Suspense fallback={null}>
            <ThemeSync />
          </Suspense>
          <div className="app-content">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
