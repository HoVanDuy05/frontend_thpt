
import { useState } from 'react';
import { Button, Group, Text, Stack, Card, Loader, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { startRegistration } from '@simplewebauthn/browser';
import axiosClient from '@/api/axiosClient';
import { IconFingerprint } from '@tabler/icons-react';

export function BiometricSettings() {
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            // 1. Get options from backend
            const options = await axiosClient.post('/auth/webauthn/register/options');

            // 2. Start registration with browser
            const attResp = await startRegistration(options);

            // 3. Verify with backend
            await axiosClient.post('/auth/webauthn/register/verify', attResp);

            notifications.show({
                title: 'Thành công',
                message: 'Đã đăng ký thiết bị xác thực mới!',
                color: 'green',
            });
        } catch (error: any) {
            console.error(error);
            notifications.show({
                title: 'Lỗi',
                message: error?.response?.data?.message || 'Không thể đăng ký thiết bị.',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card withBorder radius="md" p="xl" className="mt-4">
            <Group justify="space-between" mb="xs">
                <Group gap="sm">
                    <IconFingerprint size={24} className="text-indigo-600" />
                    <Title order={4}>Bảo mật sinh trắc học</Title>
                </Group>
            </Group>

            <Text c="dimmed" size="sm" mb="md">
                Đăng ký vân tay hoặc khuôn mặt (FaceID/TouchID/Windows Hello) để đăng nhập nhanh chóng và an toàn hơn mà không cần mật khẩu.
            </Text>

            <Stack gap="sm">
                <Button
                    onClick={handleRegister}
                    loading={loading}
                    leftSection={<IconFingerprint size={20} />}
                    variant="light"
                    color="indigo"
                >
                    Thêm thiết bị xác thực (Passkey)
                </Button>
            </Stack>
        </Card>
    );
}
