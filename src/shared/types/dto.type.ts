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
}

export interface TCreateMonHocDto {
    tenMon: string;
}

export interface TCreateLopHocDto {
    tenLop: string;
    namHocId?: number;
    gvChuNhiemId?: number;
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
    status?: string;
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
    target_id: any;
}

export interface TApproveStepDto {
    note?: string;
}
