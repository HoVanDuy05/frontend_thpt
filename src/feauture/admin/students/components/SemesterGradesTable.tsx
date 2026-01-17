"use client";

import { Badge, Group, Stack, Table, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useSemesterGradesTable } from '@/feauture/admin/students/hooks/useSemesterGradesTable';

interface SemesterGradesTableProps {
    gradingData?: any[];
}

export function SemesterGradesTable({ gradingData }: SemesterGradesTableProps) {
    const t = useTranslations('students');
    const { columns, rows, overallGpa } = useSemesterGradesTable(gradingData);

    if (!gradingData || gradingData.length === 0) {
        return <Text c="dimmed">{t('no_grades_available')}</Text>;
    }

    return (
        <Stack gap="md">
            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        {columns.map((col) => (
                            <Table.Th key={String(col.accessor)} w={col.width} style={{ textAlign: col.align || 'left' }}>
                                {col.title}
                            </Table.Th>
                        ))}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows.map((grade: any, index: number) => (
                        <Table.Tr key={index}>
                            {columns.map((col) => (
                                <Table.Td key={String(col.accessor)} style={{ textAlign: col.align || 'left' }}>
                                    {col.render ? col.render(grade) : (grade as any)?.[col.accessor as any]}
                                </Table.Td>
                            ))}
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            {overallGpa != null && (
                <Group justify="space-between">
                    <Text fw={500}>{t('overall_gpa')}</Text>
                    <Badge size="lg" color="green">
                        {overallGpa.toFixed(2)}
                    </Badge>
                </Group>
            )}
        </Stack>
    );
}
