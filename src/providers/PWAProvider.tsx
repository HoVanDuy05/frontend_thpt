"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { Button, Group, Text, Stack } from "@mantine/core";
import { IconDownload, IconRefresh } from "@tabler/icons-react";

interface PWAContextType {
    isInstallable: boolean;
    isInstalled: boolean;
    installApp: () => Promise<void>;
    updateAvailable: boolean;
    applyUpdate: () => void;
    notificationPermission: NotificationPermission;
    requestNotificationPermission: () => Promise<boolean>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
        typeof window !== 'undefined' ? Notification.permission : 'default'
    );

    useEffect(() => {
        // Check if already installed
        if (typeof window !== 'undefined' && window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true);
        }

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
            setIsInstallable(false);
            setIsInstalled(true);
            console.log("PWA was installed");
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        // Service Worker Registration and Update Logic
        if (typeof window !== 'undefined' && "serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").then((reg) => {
                setRegistration(reg);

                reg.addEventListener("updatefound", () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                        newWorker.addEventListener("statechange", () => {
                            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                                // New version available!
                                setUpdateAvailable(true);
                                showUpdateNotification(reg);

                                // Show native notification if allowed
                                if (Notification.permission === 'granted') {
                                    const options: any = {
                                        body: 'Nhấn để cập nhật ngay.',
                                        icon: '/icons/icon-192x192.png',
                                        tag: 'pwa-update',
                                        renotify: true
                                    };
                                    reg.showNotification('Phiên bản mới đã sẵn sàng!', options);
                                }
                            }
                        });
                    }
                });
            });

            let refreshing = false;
            navigator.serviceWorker.addEventListener("controllerchange", () => {
                if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                }
            });
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const showUpdateNotification = (reg: ServiceWorkerRegistration) => {
        notifications.show({
            id: 'pwa-update',
            title: 'Phiên bản mới đã sẵn sàng!',
            message: (
                <Stack gap="xs">
                    <Text size="sm">Cập nhật ngay để trải nghiệm các tính năng mới nhất.</Text>
                    <Group justify="flex-end">
                        <Button
                            variant="filled"
                            color="blue"
                            size="compact-sm"
                            leftSection={<IconRefresh size={14} />}
                            onClick={() => {
                                reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
                                notifications.hide('pwa-update');
                            }}
                        >
                            Cập nhật
                        </Button>
                    </Group>
                </Stack>
            ),
            autoClose: false,
            withCloseButton: true,
            icon: <IconDownload size={18} />,
            styles: {
                root: { padding: '12px' }
            }
        });
    };

    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) return false;

        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            return permission === 'granted';
        } catch (error) {
            console.error("Error requesting notification permission:", error);
            return false;
        }
    };

    const installApp = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    const applyUpdate = () => {
        if (registration?.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    };

    return (
        <PWAContext.Provider value={{
            isInstallable,
            isInstalled,
            installApp,
            updateAvailable,
            applyUpdate,
            notificationPermission,
            requestNotificationPermission
        }}>
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
