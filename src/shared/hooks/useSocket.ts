"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppStore } from "@/providers/store/useAppStore";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useSocket() {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { token } = useAppStore();

    useEffect(() => {
        // Temporarily disable socket connection to prevent namespace errors
        // TODO: Re-enable when socket server is properly configured
        setIsConnected(false);
        return () => {
            // Cleanup if needed
        };
    }, [token]);

    const emit = (event: string, data: any) => {
        socketRef.current?.emit(event, data);
    };

    const on = (event: string, callback: (...args: any[]) => void) => {
        socketRef.current?.on(event, callback);
    };

    const off = (event: string, callback?: (...args: any[]) => void) => {
        socketRef.current?.off(event, callback);
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
        socket: socketRef.current,
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
