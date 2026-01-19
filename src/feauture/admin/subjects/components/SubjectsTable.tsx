"use client";

import { Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { DataTable } from '@/shared/components/DataTable';
import { useSubjectsTable } from '../hooks/useSubjectsTable';
import { type SubjectType } from '@/shared/utils/subjectColumns';

interface SubjectsTableProps {
    subjects?: SubjectType[];
    isLoading?: boolean;
    onEdit?: (subject: SubjectType) => void;
    onDelete?: (subject: SubjectType) => void;
}

export function SubjectsTable({ subjects, isLoading, onEdit, onDelete }: SubjectsTableProps) {
    const t = useTranslations('admin.academic.subjects');
    const { columns, rows } = useSubjectsTable(subjects, onEdit, onDelete);

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
