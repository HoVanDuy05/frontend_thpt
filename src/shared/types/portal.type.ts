import { TUser } from "./user.type";

export enum ELoaiBaiViet {
    TIN_TUC = "TIN_TUC",
    SU_KIEN = "SU_KIEN",
    THONG_BAO_CHUNG = "THONG_BAO_CHUNG",
    HUONG_DAN = "HUONG_DAN",
}

export interface TBanner {
    id: number;
    tieuDe: string | null;
    moTa: string | null;
    hinhAnh: string;
    lienKet: string | null;
    thuTu: number;
    kichHoat: boolean;
    ngayTao: string;
    ngayCapNhat: string;
}

export interface TBaiViet {
    id: number;
    tieuDe: string;
    duongDan: string;
    tomTat: string | null;
    noiDung: string;
    anhBia: string | null;
    loai: ELoaiBaiViet;
    daXuatBan: boolean;
    luotXem: number;
    doiTuong?: string[] | null;
    nguoiTaoId: number | null;
    ngayTao: string;
    ngayCapNhat: string;
    nguoiTao?: Partial<TUser>;
    _count?: {
        binhLuans: number;
    };
}

export interface TBinhLuan {
    id: number;
    baiVietId: number;
    nguoiDungId: number;
    noiDung: string;
    binhLuanChaId: number | null;
    ngayTao: string;
    ngayCapNhat: string;
    nguoiDung?: Partial<TUser>;
    phanHoi?: TBinhLuan[];
}
