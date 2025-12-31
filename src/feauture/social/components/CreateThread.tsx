import React, { useState } from 'react';
import { Paper, Group, Avatar, Textarea, Button, Stack, ActionIcon, FileButton } from '@mantine/core';
import { IconPhoto, IconGif, IconList, IconAt } from '@tabler/icons-react';

interface CreateThreadProps {
    onPost: (content: string, image?: string) => void;
    loading?: boolean;
}

export const CreateThread: React.FC<CreateThreadProps> = ({ onPost, loading }) => {
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        if (content.trim()) {
            onPost(content);
            setContent('');
        }
    };

    return (
        <Paper p="md" bg="transparent" styles={{ root: { borderBottom: '1px solid var(--mantine-color-gray-2)' } }}>
            <Group align="flex-start" wrap="nowrap">
                <Avatar src={null} alt="My Avatar" radius="xl" size="md" />
                <Stack gap="xs" style={{ flex: 1 }}>
                    <Textarea
                        placeholder="What's new?"
                        variant="unstyled"
                        autosize
                        minRows={2}
                        value={content}
                        onChange={(event) => setContent(event.currentTarget.value)}
                        styles={{ input: { fontSize: '15px' } }}
                    />
                    <Group justify="space-between">
                        <Group gap="xs">
                            <ActionIcon variant="subtile" color="gray">
                                <IconPhoto size={20} />
                            </ActionIcon>
                            <ActionIcon variant="subtile" color="gray">
                                <IconGif size={20} />
                            </ActionIcon>
                            <ActionIcon variant="subtile" color="gray">
                                <IconList size={20} />
                            </ActionIcon>
                            <ActionIcon variant="subtile" color="gray">
                                <IconAt size={20} />
                            </ActionIcon>
                        </Group>
                        <Button
                            radius="xl"
                            size="xs"
                            disabled={!content.trim()}
                            loading={loading}
                            onClick={handleSubmit}
                            bg="black"
                        >
                            Post
                        </Button>
                    </Group>
                </Stack>
            </Group>
        </Paper>
    );
};
