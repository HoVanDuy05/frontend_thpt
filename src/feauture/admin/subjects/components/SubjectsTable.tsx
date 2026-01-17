"use client";

import { Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { DataTable } from '@/shared/components/DataTable';
import { useSubjectsTable } from '../hooks/useSubjectsTable';
import { type SubjectType } from '@/shared/utils/subjectColumns';

interface SubjectsTableProps {
    subjects?: SubjectType[];
    isLoading?: boolean;
}

export function SubjectsTable({ subjects, isLoading }: SubjectsTableProps) {
    const t = useTranslations('admin.academic.subjects');
    const { columns, rows } = useSubjectsTable(subjects);

    if (!subjects || subjects.length === 0) {
        return <Text c="dimmed">{t('no_data', { defaultMessage: 'No subjects found' })}</Text>;
    }

    return (
        <DataTable
            columns={columns}
            data={rows}
            isLoading={isLoading}
            searchable
            searchKeys={['tenMon', 'maMon', 'moTa']}
        />
    );
}
