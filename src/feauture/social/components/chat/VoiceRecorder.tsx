import { ActionIcon, Group, Text, rem } from "@mantine/core";
import { IconMicrophone, IconPlayerStop, IconSend, IconTrash, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";

interface VoiceRecorderProps {
    onSend: (audioBlob: Blob, durationMs: number) => void;
    onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend, onCancel }) => {
    const t = useTranslations("chat");
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    // ... rest of state
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        startRecording();
        return () => {
            stopRecordingStream();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            startTimeRef.current = Date.now();

            timerRef.current = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            notifications.show({
                title: t("micro_error_title"),
                message: t("micro_error_message"),
                color: "red"
            });
            onCancel();
        }
    };

    const stopRecordingStream = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleSend = () => {
        if (!mediaRecorderRef.current) return;

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const finalDuration = Date.now() - startTimeRef.current;
            onSend(audioBlob, finalDuration);
        };

        stopRecordingStream();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="flex items-center gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex-1 bg-red-50 dark:bg-red-900/10 rounded-[20px] px-4 py-2 flex items-center justify-between border border-red-100 dark:border-red-900/20">
                <Group gap="xs" className="flex-1">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                        <IconMicrophone size={18} className="animate-pulse" />
                    </div>
                    <Text size="sm" fw={700} className="w-12 tabular-nums text-red-600 dark:text-red-400">
                        {formatTime(duration)}
                    </Text>

                    {/* Visualizer bars (Simulated) */}
                    <div className="flex items-center gap-[2px] h-6 flex-1 opacity-50">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="w-[3px] bg-red-400 dark:bg-red-500 rounded-full animate-pulse"
                                style={{
                                    height: `${Math.random() * 60 + 20}%`,
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: '0.8s'
                                }}
                            />
                        ))}
                    </div>
                </Group>
            </div>

            <Group gap="xs">
                <ActionIcon
                    variant="subtle"
                    color="gray"
                    radius="xl"
                    size="lg"
                    onClick={onCancel}
                    className="hover:bg-gray-100 dark:hover:bg-white/10"
                >
                    <IconTrash size={22} stroke={1.5} />
                </ActionIcon>

                <ActionIcon
                    variant="filled"
                    color="indigo"
                    radius="xl"
                    size="lg"
                    onClick={handleSend}
                    className="shadow-md hover:scale-105 transition-transform"
                >
                    <IconSend size={20} stroke={1.5} />
                </ActionIcon>
            </Group>
        </div>
    );
};
