"use client";

import { Badge } from '@mantine/core';
import type { TableColumn } from '@/shared/hooks/useDynamicTable';

type BaseColumnsParams<T = any> = {
    t: (key: string) => string;
    omitColumns?: (keyof T | string)[];
};

export const semesterGradeBaseColumns = ({
    t,
    omitColumns = [],
}: BaseColumnsParams<any>): TableColumn<any>[] =>
    (
        [
            {
                accessor: 'subject',
                title: t('subject'),
                render: (grade) => grade.monHoc?.tenMon || t('not_available'),
            },
            {
                accessor: 'midterm',
                title: t('midterm'),
                render: (grade) => grade.giuaKy || '-',
            },
            {
                accessor: 'final',
                title: t('final'),
                render: (grade) => grade.cuoiKy || '-',
            },
            {
                accessor: 'gpa',
                title: t('gpa'),
                render: (grade) =>
                    grade.trungBinh ? (
                        <Badge color={grade.trungBinh >= 8 ? 'green' : grade.trungBinh >= 6.5 ? 'yellow' : 'red'}>
                            {grade.trungBinh}
                        </Badge>
                    ) : (
                        '-'
                    ),
            },
        ] as TableColumn<any>[]
    ).filter((column) => !omitColumns.includes(column.accessor));
