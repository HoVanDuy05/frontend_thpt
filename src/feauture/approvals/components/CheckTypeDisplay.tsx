"use client";

import React from 'react';
import { LoaiTruongForm, TTruongFormQuyTrinh } from '@/shared/types/approval.type';
import { TextDisplay } from './RenderTypeDisplay/TextDisplay';
import { FileDisplay } from './RenderTypeDisplay/FileDisplay';
import { SectionDisplay } from './RenderTypeDisplay/SectionDisplay';
import { RichTextDisplay } from './RenderTypeDisplay/RichTextDisplay';
import { dayjs } from '@/shared/utils/date.util';

interface CheckTypeDisplayProps {
    field: TTruongFormQuyTrinh;
    value: any;
}

export const CheckTypeDisplay: React.FC<CheckTypeDisplayProps> = ({ field, value }) => {
    const label = field.nhan;

    switch (field.loai) {
        case LoaiTruongForm.SECTION_HEADER:
            return <SectionDisplay label={label} />;

        case LoaiTruongForm.FILE:
            return <FileDisplay label={label} value={value} />;

        case LoaiTruongForm.IMAGE:
            return <FileDisplay label={label} value={value} isImage />;

        case LoaiTruongForm.QUILL:
            return <RichTextDisplay label={label} value={value} />;

        case LoaiTruongForm.DATE:
            return <TextDisplay label={label} value={value ? dayjs(value).format("DD/MM/YYYY") : "N/A"} />;

        case LoaiTruongForm.DATETIME:
            return <TextDisplay label={label} value={value ? dayjs(value).format("HH:mm, DD/MM/YYYY") : "N/A"} />;

        case LoaiTruongForm.CHECKBOX:
            const checkedValues = Array.isArray(value) ? value : (typeof value === 'string' ? [value] : []);
            return <TextDisplay label={label} value={checkedValues.length > 0 ? checkedValues.join(", ") : "N/A"} />;

        default:
            return <TextDisplay label={label} value={value} />;
    }
};
