"use client";

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useDynamicTable } from '@/shared/hooks/useDynamicTable';
import { semesterGradeBaseColumns } from '@/shared/utils/column';

export const useSemesterGradesTable = (gradingData?: any[]) => {
    const t = useTranslations('students');

    const { columns, data } = useDynamicTable<any>({
        columns: semesterGradeBaseColumns({ t }),
        data: gradingData || [],
    });

    const overallGpa = useMemo(() => {
        if (!gradingData || gradingData.length === 0) return null;
        const avg = gradingData.reduce((acc: number, grade: any) => acc + (grade.trungBinh || 0), 0) / gradingData.length;
        return Number.isFinite(avg) ? avg : null;
    }, [gradingData]);

    return {
        columns,
        rows: data,
        overallGpa,
    };
};
