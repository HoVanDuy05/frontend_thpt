"use client";

import { useMemo } from 'react';
import type { TableColumn } from '@/shared/hooks/useDynamicTable';
import { Button, Group } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export type SubjectType = {
    id: number;
    tenMon: string;
    maMon?: string;
    moTa?: string;
    _count?: {
        lopHoc?: number;
        giaoVien?: number;
    };
};

type BaseColumnsParams<T = SubjectType> = {
    t: (key: string) => string;
    omitColumns?: (keyof T | string)[];
};

export const subjectBaseColumns = <T = SubjectType>({
    t,
    omitColumns = [],
    onEdit,
    onDelete,
}: BaseColumnsParams<T> & {
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}): TableColumn<T>[] =>
    (
        [
            {
                accessor: 'tenMon',
                title: t('fields.name'),
                align: 'left',
                render: (subject: SubjectType) => subject.tenMon || t('not_available'),
            },
            {
                accessor: 'maMon',
                title: t('fields.code'),
                align: 'left',
                render: (subject: SubjectType) => subject.maMon || '-',
            },
            {
                accessor: 'moTa',
                title: t('fields.description'),
                align: 'left',
                render: (subject: SubjectType) => subject.moTa || t('no_desc'),
            },
            {
                accessor: '_count.lopHoc',
                title: t('columns.classes'),
                align: 'right',
                render: (subject: SubjectType) => subject._count?.lopHoc || 0,
            },
            {
                accessor: '_count.giaoVien',
                title: t('columns.teachers'),
                align: 'right',
                render: (subject: SubjectType) => subject._count?.giaoVien || 0,
            },
            {
                accessor: 'actions',
                title: t('columns.actions'),
                align: 'right',
                render: (subject: SubjectType) => (
                    <Group gap="xs" justify="flex-end">
                        {onEdit && (
                            <Button
                                variant="outline"
                                color="indigo"
                                size="xs"
                                leftSection={<IconEdit size={14} />}
                                onClick={() => onEdit(subject as unknown as T)}
                            >
                                <span className="sm:hidden">{t('actions.edit')}</span>
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="outline"
                                size="xs"
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => onDelete(subject as unknown as T)}
                            >
                                <span className="sm:hidden">{t('actions.delete')}</span>
                            </Button>
                        )}
                    </Group>
                ),
            },
        ] as TableColumn<T>[]
    ).filter((column) => !omitColumns.includes(column.accessor));
