"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface PWAContextType {
    isInstallable: boolean;
    isInstalled: boolean;
    installApp: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true);
        }

        window.addEventListener("beforeinstallprompt", (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsInstallable(true);
        });

        window.addEventListener("appinstalled", () => {
            setDeferredPrompt(null);
            setIsInstallable(false);
            setIsInstalled(true);
            console.log("PWA was installed");
        });
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;

        // Show the prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    return (
        <PWAContext.Provider value={{ isInstallable, isInstalled, installApp }}>
            {children}
        </PWAContext.Provider>
    );
}

export const usePWA = () => {
    const context = useContext(PWAContext);
    if (!context) {
        throw new Error("usePWA must be used within a PWAProvider");
    }
    return context;
};
