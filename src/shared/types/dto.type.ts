import { UserRole } from "./user.type";
import { LoaiCauHoi } from "./assessment.type";

// User DTOs
export interface TCreateUserDto {
    taiKhoan: string;
    matKhau: string;
    email?: string;
    vaiTro: UserRole;
}

export interface TCreateTeacherDto {
    taiKhoan: string;
    matKhau: string;
    email?: string;
    maSoGv: string;
    hoTen: string;
    chuyenMon?: string;
}

export interface TCreateStudentDto {
    taiKhoan: string;
    matKhau: string;
    email?: string;
    maSoHs: string;
    hoTen: string;
    ngaySinh?: string;
    lopId?: number;
}

// Academic DTOs
export interface TCreateNamHocDto {
    tenNamHoc: string;
    ngayBatDau?: string;
    ngayKetThuc?: string;
    dangKichHoat?: boolean;
}

export interface TCreateHocKyDto {
    tenHocKy: string;
    namHocId: number;
    ngayBatDau?: string;
    ngayKetThuc?: string;
    dangKichHoat?: boolean;
}

export interface TCreateMonHocDto {
    tenMon: string;
}

export interface TCreateLopHocDto {
    tenLop: string;
    khoiId: number;
    moTa?: string;
}

export interface TCreateKhoiDto {
    tenKhoi: string;
    maKhoi: number;
    moTa?: string;
}

// NEW: DTO for creating ClassYear
export interface TCreateLopNamDto {
    lopId: number;
    namHocId: number;
    gvChuNhiemId?: number;
    siSo?: number;
}


// Assessment DTOs
export interface TCreateQuestionDto {
    monHocId: number;
    gvTaoId?: number;
    noiDungCauHoi: string;
    loaiCauHoi: LoaiCauHoi;
    dapAnDung?: string;
    loiGiaiChiTiet?: string;
}

export interface TCreateExamDto {
    monHocId: number;
    gvTaoId?: number;
    tieuDe: string;
    loaiBaiThi?: string;
    thoiGianLamBai?: number;
    hanNopBai?: string;
}

// Submission DTOs
export interface TCreateSubmissionDto {
    deThiId: number;
    hocSinhId: number;
    noiDungBaiLam?: string;
}

// Grading DTOs
export interface TCreateGradingDto {
    nopBaiId: number;
    gvChamId?: number;
    diemSo: number;
    nhanXetCuaGv?: string;
}

// Approval DTOs
export interface TCreateFlowDto {
    name: string;
    description?: string;
    category_id?: number | null;
    status?: string;
    steps?: {
        name: string;
        rule: 'all' | 'any';
        approverType: string;
        specificUser?: number;
    }[];
    fields?: {
        label: string;
        type: string;
        required: boolean;
        options?: string[];
    }[];
}

export interface TAddFlowStepDto {
    step_order: number;
    name: string;
    rule_type: 'any' | 'all';
}

export interface TAddStepApproverDto {
    approver_type: 'NGUOI_DUNG' | 'VAI_TRO' | 'NHOM';
    approver_id: string | number;
}

export interface TCreateFlowFieldsDto {
    fields: {
        name: string;
        label: string;
        type: string;
        required?: boolean;
        options?: string;
        order: number;
    }[];
}

export interface TSubmitFlowInstanceDto {
    flow_id: number;
    target_id?: any;
    data: Record<string, any>; // Key-value answers
}

export interface TApproveStepDto {
    note?: string;
}
