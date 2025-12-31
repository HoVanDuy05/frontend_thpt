"use client";

import React, { useEffect, useState } from 'react';
import { Box, Stack, Image, Text, Loader, Transition, Center, rem, Progress } from '@mantine/core';

import { useTranslations } from 'next-intl';

export const SplashScreen = () => {
    const t = useTranslations("splash");
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);

    const LOADING_STEPS = [
        t("init"),
        t("user"),
        t("sync"),
        t("ready")
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setVisible(false), 500);
                    return 100;
                }
                const next = prev + Math.random() * 15;
                return next > 100 ? 100 : next;
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress < 30) setStepIndex(0);
        else if (progress < 60) setStepIndex(1);
        else if (progress < 90) setStepIndex(2);
        else setStepIndex(3);
    }, [progress]);

    return (
        <Transition mounted={visible} transition="fade" duration={800} timingFunction="ease">
            {(styles) => (
                <Box
                    style={{
                        ...styles,
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        background: 'var(--mantine-color-body)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative Background Elements */}
                    <Box
                        style={{
                            position: 'absolute',
                            width: rem(400),
                            height: rem(400),
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, var(--mantine-color-indigo-1) 0%, transparent 70%)',
                            top: '-10%',
                            right: '-10%',
                            opacity: 0.5,
                            filter: 'blur(60px)'
                        }}
                    />
                    <Box
                        style={{
                            position: 'absolute',
                            width: rem(300),
                            height: rem(300),
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, var(--mantine-color-indigo-1) 0%, transparent 70%)',
                            bottom: '-5%',
                            left: '-5%',
                            opacity: 0.3,
                            filter: 'blur(50px)'
                        }}
                    />

                    <Stack align="center" gap="xl" style={{ position: 'relative', zIndex: 1 }}>
                        <Box
                            style={{
                                width: rem(120),
                                height: rem(120),
                                borderRadius: rem(32),
                                background: 'linear-gradient(135deg, var(--mantine-color-indigo-6) 0%, var(--mantine-color-indigo-8) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 20px 40px rgba(79, 70, 229, 0.25)',
                                animation: 'pulse-premium 2.5s infinite ease-in-out',
                            }}
                        >
                            <Image
                                src="/icons/icon-512x512.png"
                                alt="Logo"
                                width={80}
                                height={80}
                                style={{ filter: 'brightness(0) invert(1)' }}
                            />
                        </Box>

                        <Stack gap={8} align="center">
                            <Text
                                fw={900}
                                size="xl"
                                style={{
                                    fontSize: rem(28),
                                    letterSpacing: rem(2),
                                    background: 'linear-gradient(to right, var(--mantine-color-indigo-7), var(--mantine-color-indigo-5))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textAlign: 'center'
                                }}
                            >
                                NGUYỄN HUỆ
                            </Text>
                            <Text size="xs" c="dimmed" fw={700} style={{ letterSpacing: rem(3), opacity: 0.8 }}>
                                {t("subtitle")}
                            </Text>
                        </Stack>

                        <Box w={rem(240)} mt="lg">
                            <Progress
                                value={progress}
                                size="xs"
                                radius="xl"
                                color="indigo"
                                striped
                                animated
                                style={{ background: 'var(--mantine-color-default-hover)' }}
                            />
                            <Transition mounted={true} transition="slide-up" duration={400}>
                                {(textStyles) => (
                                    <Text
                                        style={textStyles}
                                        size="xs"
                                        ta="center"
                                        mt={8}
                                        c="dimmed"
                                        fw={500}
                                        fs="italic"
                                    >
                                        {LOADING_STEPS[stepIndex]}
                                    </Text>
                                )}
                            </Transition>
                        </Box>
                    </Stack>

                    <style jsx global>{`
                        @keyframes pulse-premium {
                            0% { transform: scale(1); box-shadow: 0 10px 30px rgba(79, 70, 229, 0.15); }
                            50% { transform: scale(1.08); box-shadow: 0 25px 60px rgba(79, 70, 229, 0.35); }
                            100% { transform: scale(1); box-shadow: 0 10px 30px rgba(79, 70, 229, 0.15); }
                        }
                    `}</style>
                </Box>
            )}
        </Transition>
    );
};
