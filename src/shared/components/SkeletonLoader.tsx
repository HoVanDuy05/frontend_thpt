"use client";

import { Skeleton, Stack, Table, Grid, Card, SimpleGrid, Group, Box } from "@mantine/core";

interface SkeletonLoaderProps {
    type: "table" | "cards" | "dashboard" | "form" | "stats";
    count?: number;
}

export function SkeletonLoader({ type, count = 5 }: SkeletonLoaderProps) {
    if (type === "table") {
        return (
            <Box className="w-full">
                <Table verticalSpacing="md">
                    <Table.Thead>
                        <Table.Tr>
                            {Array(count).fill(0).map((_, i) => (
                                <Table.Th key={i}><Skeleton h={15} w="60%" radius="xl" /></Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {Array(5).fill(0).map((_, i) => (
                            <Table.Tr key={i}>
                                {Array(count).fill(0).map((_, j) => (
                                    <Table.Td key={j}><Skeleton h={12} w={j === 0 ? "80%" : "40%"} radius="xl" /></Table.Td>
                                ))}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Box>
        );
    }

    if (type === "cards") {
        return (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                {Array(count).fill(0).map((_, i) => (
                    <Card key={i} padding="xl" radius="lg" withBorder>
                        <Skeleton h={200} mb="md" radius="md" />
                        <Skeleton h={20} w="70%" mb="sm" />
                        <Skeleton h={14} w="40%" mb="xl" />
                        <Group justify="space-between">
                            <Skeleton h={35} w={100} radius="md" />
                            <Skeleton h={20} w={60} radius="xl" />
                        </Group>
                    </Card>
                ))}
            </SimpleGrid>
        );
    }

    if (type === "stats") {
        return (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
                {Array(count).fill(0).map((_, i) => (
                    <Card key={i} padding="xl" radius="lg" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Skeleton h={15} w="40%" />
                            <Skeleton h={25} w={25} radius="md" />
                        </Group>
                        <Skeleton h={40} w="60%" mb="xs" />
                        <Skeleton h={12} w="30%" />
                    </Card>
                ))}
            </SimpleGrid>
        );
    }

    if (type === "form") {
        return (
            <Stack gap="xl">
                {Array(count).fill(0).map((_, i) => (
                    <Box key={i}>
                        <Skeleton h={10} w="20%" mb="xs" />
                        <Skeleton h={45} radius="md" />
                    </Box>
                ))}
                <Skeleton h={45} w={120} radius="md" />
            </Stack>
        );
    }

    return <Skeleton h={100} />;
}
