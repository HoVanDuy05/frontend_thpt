"use client";

import { useComputedColorScheme } from "@mantine/core";
import { useEffect } from "react";

/**
 * ThemeSync component
 * Dynamically updates the browser/PWA theme-color meta tag 
 * based on the current Mantine color scheme.
 */
export function ThemeSync() {
    const computedColorScheme = useComputedColorScheme("light");

    useEffect(() => {
        const themeColor = computedColorScheme === "dark" ? "#18181b" : "#312e81";

        // Update theme-color meta tag
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement("meta");
            metaThemeColor.setAttribute("name", "theme-color");
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.setAttribute("content", themeColor);

        // Update apple-mobile-web-app-status-bar-style
        let metaAppleStatus = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (!metaAppleStatus) {
            metaAppleStatus = document.createElement("meta");
            metaAppleStatus.setAttribute("name", "apple-mobile-web-app-status-bar-style");
            document.head.appendChild(metaAppleStatus);
        }
        metaAppleStatus.setAttribute("content", computedColorScheme === "dark" ? "black-translucent" : "default");

        // Also update body background color to prevent glitches on rubber-banding
        document.body.style.backgroundColor = themeColor;

        // Toggle 'dark' class for tailwind and other libraries
        if (computedColorScheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [computedColorScheme]);

    return null;
}
