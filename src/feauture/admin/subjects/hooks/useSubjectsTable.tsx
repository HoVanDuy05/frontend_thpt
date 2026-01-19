"use client";

import { useTranslations } from 'next-intl';
import { subjectBaseColumns, type SubjectType } from '@/shared/utils/subjectColumns';
import type { DataTableColumn } from '@/shared/components/DataTable';

export const useSubjectsTable = (
    subjects?: SubjectType[],
    onEdit?: (subject: SubjectType) => void,
    onDelete?: (subject: SubjectType) => void
) => {
    const t = useTranslations('admin.academic.subjects');

    // Convert from TableColumn to DataTableColumn format
    const columns: DataTableColumn<SubjectType>[] = subjectBaseColumns({
        t,
        onEdit,
        onDelete
    }).map(col => ({
        key: col.accessor as string,
        header: col.title,
        width: col.width,
        align: col.align, // Pass through the align property
        render: (item: SubjectType, index: number) => {
            if (col.render) {
                return col.render(item);
            }

            // Handle nested access for _count properties
            if (col.accessor.includes('_count.')) {
                const path = col.accessor.split('.');
                return path.reduce((obj, key) => obj?.[key], item as any) || '-';
            }

            return (item as any)[col.accessor] || '-';
        }
    }));

    return {
        columns,
        rows: subjects || [],
    };
};
