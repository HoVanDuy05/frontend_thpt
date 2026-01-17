"use client";

import { useMemo } from 'react';
import type { TableColumn } from '@/shared/hooks/useDynamicTable';

export type SubjectType = {
    id: number;
    tenMon: string;
    maMon?: string;
    moTa?: string;
    _count?: {
        lopHoc: number;
        giaoVien: number;
    };
};

type BaseColumnsParams<T = SubjectType> = {
    t: (key: string) => string;
    omitColumns?: (keyof T | string)[];
};

export const subjectBaseColumns = <T = SubjectType>({
    t,
    omitColumns = [],
}: BaseColumnsParams<T>): TableColumn<T>[] =>
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
        ] as TableColumn<T>[]
    ).filter((column) => !omitColumns.includes(column.accessor));
