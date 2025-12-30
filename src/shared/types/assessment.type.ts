export type LoaiCauHoi = "TRAC_NGHIEM" | "TU_LUAN";

export interface TNganHangCauHoi {
    id: number;
    monHocId: number;
    gvTaoId?: number;
    noiDungCauHoi: string;
    loaiCauHoi: LoaiCauHoi;
    dapAnDung?: string;
    loiGiaiChiTiet?: string;
}

export interface TDeKiemTra {
    id: number;
    monHocId: number;
    gvTaoId?: number;
    tieuDe: string;
    loaiBaiThi?: string;
    thoiGianLamBai?: number;
    hanNopBai?: string;

    monHoc?: any;
}

export interface TChiTietDeThi {
    deThiId: number;
    cauHoiId: number;
    thuTuCau?: number;

    nganHangCauHoi?: TNganHangCauHoi;
}
