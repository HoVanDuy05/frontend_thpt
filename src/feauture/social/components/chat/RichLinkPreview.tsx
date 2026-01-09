import { Card, Image, Text, Group, Skeleton, useMantineColorScheme } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IconExternalLink } from '@tabler/icons-react';

interface LinkPreviewProps {
    url: string;
}

interface LinkMetadata {
    url: string;
    title: string;
    description: string;
    image: string;
    domain: string;
}

export const RichLinkPreview = ({ url }: LinkPreviewProps) => {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

    const { data, isLoading, isError } = useQuery({
        queryKey: ['link-preview', url],
        queryFn: async () => {
            const res = await axios.get<LinkMetadata>(`${process.env.NEXT_PUBLIC_API_URL}/communication/chat/link-preview`, {
                params: { url }
            });
            return res.data;
        },
        staleTime: 1000 * 60 * 60 * 24, // Cache for 24h
        retry: false
    });

    if (isLoading) {
        return (
            <Card padding="sm" radius="md" withBorder className="w-full max-w-sm mt-2 bg-gray-50 dark:bg-zinc-900/50">
                <Group wrap="nowrap" align="flex-start">
                    <Skeleton height={60} width={60} radius="md" />
                    <div className="flex-1">
                        <Skeleton height={14} width="80%" mb={6} />
                        <Skeleton height={10} width="60%" />
                    </div>
                </Group>
            </Card>
        );
    }

    if (isError || !data || (!data.title && !data.description)) {
        return null; // Don't show empty cards, just fallback to text link
    }

    return (
        <Card
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            padding="0"
            radius="md"
            withBorder
            className="w-full max-w-sm mt-2 overflow-hidden transition-all hover:shadow-md group block bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
        >
            <div className="flex flex-col sm:flex-row h-full">
                {data.image && (
                    <div className="w-full sm:w-32 h-32 sm:h-auto shrink-0 relative bg-gray-100 dark:bg-zinc-800">
                        <img
                            src={data.image}
                            alt={data.title}
                            className="w-full h-full object-cover absolute inset-0"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    </div>
                )}
                <div className="p-3 flex flex-col justify-center flex-1 min-w-0">
                    <Text size="xs" c="dimmed" className="uppercase tracking-wider mb-1 line-clamp-1">
                        {data.domain}
                    </Text>
                    <Text size="sm" fw={600} className="line-clamp-2 leading-tight mb-1 group-hover:text-blue-500 transition-colors">
                        {data.title}
                    </Text>
                    {data.description && (
                        <Text size="xs" c="dimmed" className="line-clamp-2 leading-relaxed">
                            {data.description}
                        </Text>
                    )}
                </div>
            </div>
        </Card>
    );
};
