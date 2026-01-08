"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { notifications } from "@mantine/notifications";
import { Button, Group, Text, Stack } from "@mantine/core";
import { IconDownload, IconRefresh } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import axiosClient from "@/api/axiosClient";

interface PWAContextType {
    isInstallable: boolean;
    isInstalled: boolean;
    installApp: () => Promise<void>;
    updateAvailable: boolean;
    applyUpdate: () => void;
    notificationPermission: NotificationPermission;
    requestNotificationPermission: () => Promise<boolean>;
    subscribeToPush: () => Promise<boolean>;
    isIOS: boolean;
    isIPad: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const t = useTranslations("pwa.download");
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
        typeof window !== 'undefined' ? Notification.permission : 'default'
    );
    const [isIOS, setIsIOS] = useState(false);
    const [isIPad, setIsIPad] = useState(false);

    const showUpdateNotification = useCallback((reg: ServiceWorkerRegistration) => {
        notifications.show({
            id: 'pwa-update',
            title: t('update_title'),
            message: (
                <Stack gap="xs">
                    <Text size="sm">{t('update_body')}</Text>
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
                            {t('update_btn')}
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
    }, [t]);

    useEffect(() => {
        // iOS detection
        if (typeof window !== 'undefined') {
            const ua = window.navigator.userAgent.toLowerCase();
            const ios = /iphone|ipod/.test(ua);
            const ipad = /ipad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            setIsIOS(ios || ipad);
            setIsIPad(ipad);
        }

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
                                        body: t('update_native_body'),
                                        icon: '/icons/icon-192x192.png',
                                        tag: 'pwa-update',
                                        renotify: true
                                    };
                                    reg.showNotification(t('update_title'), options);
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
    }, [showUpdateNotification, t]);

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

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribeToPush = async () => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            console.warn("Push messaging is not supported");
            return false;
        }

        try {
            const reg = await navigator.serviceWorker.ready;

            const vapidPublicKey = 'BLwohOk-X447v2Y097jpn9f6QHAZh6pQAptJ-UMHmjjdDVUqWk3x8zBSG7j1N5NpHzCDA6zc_Wfq-I3HHUgOWXw';
            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

            const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            const response = await axiosClient.post('/communication/push/subscribe', subscription); // axiosClient likely prepends /api or base url, and handles headers

            return response.status === 200 || response.status === 201;
        } catch (error) {
            console.error("Error subscribing to push:", error);
            return false;
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
            requestNotificationPermission,
            subscribeToPush,
            isIOS,
            isIPad
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
