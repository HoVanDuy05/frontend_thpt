"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppStore } from "@/providers/store/useAppStore";

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
    .replace(/\/api\/?$/, "");

let socketInstance: Socket | null = null;

export function useSocket() {
    const [isConnected, setIsConnected] = useState(socketInstance?.connected || false);
    const { token } = useAppStore();

    useEffect(() => {
        if (!token) {
            if (socketInstance) {
                socketInstance.disconnect();
                socketInstance = null;
            }
            setIsConnected(false);
            return;
        }

        if (!socketInstance) {
            socketInstance = io(SOCKET_URL, {
                auth: {
                    token: token
                },
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socketInstance.on('connect', () => {
                console.log('Socket connected:', socketInstance?.id);
                setIsConnected(true);
            });

            socketInstance.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            socketInstance.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setIsConnected(false);
            });
        } else {
            setIsConnected(socketInstance.connected);

            // Re-bind listeners just in case
            const handleConnect = () => setIsConnected(true);
            const handleDisconnect = () => setIsConnected(false);

            socketInstance.on('connect', handleConnect);
            socketInstance.on('disconnect', handleDisconnect);

            return () => {
                socketInstance?.off('connect', handleConnect);
                socketInstance?.off('disconnect', handleDisconnect);
            };
        }
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
