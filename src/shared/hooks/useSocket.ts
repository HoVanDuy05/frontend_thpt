"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppStore } from "@/providers/store/useAppStore";

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/")
    .replace(/\/api\/?$/, "");

// Helper to check if we are in a secure context
const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
const finalSocketUrl = isSecure ? SOCKET_URL.replace(/^http:/, 'https:') : SOCKET_URL;

let socketInstance: Socket | null = null;

export function useSocket() {
    const [isConnected, setIsConnected] = useState(socketInstance?.connected || false);
    const { token } = useAppStore();

    useEffect(() => {
        if (!token) {
            if (socketInstance) {
                console.log('No token, disconnecting socket...');
                socketInstance.disconnect();
                socketInstance = null;
            }
            setIsConnected(false);
            return;
        }

        if (!socketInstance) {
            console.log('Initializing socket with URL:', finalSocketUrl);
            socketInstance = io(finalSocketUrl, {
                auth: {
                    token: token
                },
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 2000,
                timeout: 20000,
                secure: isSecure
            });
        }

        if (socketInstance && !socketInstance.connected) {
            socketInstance.connect();
        }

        // Update local state to match instance
        setIsConnected(socketInstance?.connected || false);

        const handleConnect = () => {
            console.log('Socket connected:', socketInstance?.id);
            setIsConnected(true);
        };
        const handleDisconnect = (reason: string) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
        };
        const handleConnectError = (error: any) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        };

        socketInstance.on('connect', handleConnect);
        socketInstance.on('disconnect', handleDisconnect);
        socketInstance.on('connect_error', (error) => {
            console.error('Socket error details:', {
                message: error.message,
                description: (error as any).description,
                context: (error as any).context
            });
            handleConnectError(error);
        });

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && socketInstance && !socketInstance.connected) {
                console.log('App foregrounded, reconnecting socket...');
                socketInstance.connect();
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            socketInstance?.off('connect', handleConnect);
            socketInstance?.off('disconnect', handleDisconnect);
            socketInstance?.off('connect_error', handleConnectError);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [token]);

    const emit = (event: string, data: any) => {
        socketInstance?.emit(event, data);
    };

    const on = (event: string, callback: (...args: any[]) => void) => {
        socketInstance?.on(event, callback);
    };

    const off = (event: string, callback?: (...args: any[]) => void) => {
        socketInstance?.off(event, callback);
    };

    const joinChannel = (channelId: number) => {
        emit("join:channel", channelId);
    };

    const leaveChannel = (channelId: number) => {
        emit("leave:channel", channelId);
    };

    const startTyping = (channelId: number, userName: string) => {
        emit("typing:start", { channelId, userName });
    };

    const stopTyping = (channelId: number) => {
        emit("typing:stop", channelId);
    };

    return {
        socket: socketInstance,
        isConnected,
        emit,
        on,
        off,
        joinChannel,
        leaveChannel,
        startTyping,
        stopTyping,
    };
}
