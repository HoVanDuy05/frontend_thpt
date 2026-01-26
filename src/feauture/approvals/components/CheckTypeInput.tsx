"use client";

import React from 'react';
import { LoaiTruongForm, TTruongFormQuyTrinh } from '@/shared/types/approval.type';
import { useTranslations } from 'next-intl';

// Import Modular components
import { SectionHeader } from './RenderType/SectionHeader';
import { TextInput } from './RenderType/TextInput';
import { NumberInput } from './RenderType/NumberInput';
import { TextAreaInput } from './RenderType/TextAreaInput';
import { SelectInput } from './RenderType/SelectInput';
import { CheckboxInput } from './RenderType/CheckboxInput';
import { RadioInput } from './RenderType/RadioInput';
import { FileUpload } from './RenderType/FileUpload';
import { DateInput } from './RenderType/DateInput';
import { DateTimeInput } from './RenderType/DateTimeInput';
import { TimeInput } from './RenderType/TimeInput';
import { MultiDateInput } from './RenderType/MultiDateInput';
import { SelectAffiliationInput } from './RenderType/SelectAffiliationInput';
import { SelectDateOffTypeInput } from './RenderType/SelectDateOffTypeInput';
import { DefaultInput } from './RenderType/DefaultInput';
import { QuillInput } from './RenderType/QuillInput';

interface CheckTypeInputProps {
    field: TTruongFormQuyTrinh;
    value: any;
    onChange: (val: any) => void;
    error?: string;
}

export const CheckTypeInput: React.FC<CheckTypeInputProps> = ({ field, value, onChange, error }) => {
    const t = useTranslations('approvals.form.input');
    const label = field.nhan;
    const required = field.batBuoc;
    const placeholder = label ? t('placeholder', { name: label.toLowerCase() }) : '';

    const options = React.useMemo(() => {
        if (!field.tuyChon) return [];
        return typeof field.tuyChon === 'string' ? JSON.parse(field.tuyChon) : field.tuyChon;
    }, [field.tuyChon]);

    switch (field.loai) {
        case LoaiTruongForm.SECTION_HEADER:
            return <SectionHeader label={label} />;

        case LoaiTruongForm.TEXT:
            return <TextInput label={label} value={value as string || ''} onChange={onChange} placeholder={placeholder} required={required} error={error} />;

        case LoaiTruongForm.NUMBER:
            return <NumberInput label={label} value={value as number} onChange={onChange} placeholder={placeholder} required={required} error={error} />;

        case LoaiTruongForm.TEXTAREA:
        case LoaiTruongForm.LONG_TEXT:
            return <TextAreaInput label={label} value={value as string || ''} onChange={onChange} placeholder={placeholder} required={required} error={error} />;

        case LoaiTruongForm.SELECT:
            return <SelectInput label={label} value={value as string || null} onChange={onChange} data={options} placeholder={placeholder} required={required} error={error} />;

        case LoaiTruongForm.CHECKBOX:
            return <CheckboxInput label={label} value={(value as unknown as string[]) || []} onChange={onChange} options={options} required={required} error={error} />;

        case LoaiTruongForm.RADIO:
            return <RadioInput label={label} value={value as string || ""} onChange={onChange} options={options} required={required} error={error} />;

        case LoaiTruongForm.FILE:
            return <FileUpload label={label} value={value as File | null} onChange={onChange} required={required} error={error} />;

        case LoaiTruongForm.IMAGE:
            return <FileUpload label={label} value={value as File | null} onChange={onChange} required={required} error={error} isImage />;

        case LoaiTruongForm.DATE:
            return <DateInput label={label} value={value as string | null} onChange={onChange} placeholder={placeholder} required={required} error={error} />;

        case LoaiTruongForm.DATETIME:
            return <DateTimeInput label={label} value={value as string | null} onChange={onChange} placeholder={placeholder} required={required} error={error} />;

        case LoaiTruongForm.TIME:
            return <TimeInput label={label} value={value as string || ''} onChange={onChange} placeholder={placeholder} required={required} error={error} />;

        case LoaiTruongForm.MULTI_DATE:
            return <MultiDateInput label={label} value={value as string[] || []} onChange={onChange} placeholder={placeholder} required={required} error={error} />;

        case LoaiTruongForm.SELECT_AFFILIATION:
            return <SelectAffiliationInput label={label} value={value as string | null} onChange={onChange} placeholder={placeholder} required={required} error={error} />;

        case LoaiTruongForm.SELECT_DATE_OFF_TYPE:
            return <SelectDateOffTypeInput label={label} value={value as string | null} onChange={onChange} placeholder={placeholder} required={required} error={error} />;

        case LoaiTruongForm.DEFAULT_INPUT:
            return <DefaultInput label={label} value={value as string || ''} optionValue={field.tuyChon} required={required} />;

        case LoaiTruongForm.QUILL:
            return <QuillInput label={label} value={value as string || ''} onChange={onChange} placeholder={placeholder} required={required} error={error} />;

        default:
            return <TextInput label={label} value={value as string || ''} onChange={onChange} placeholder={placeholder} required={required} error={error} />;
    }
};
