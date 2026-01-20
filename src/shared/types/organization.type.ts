import { TUser } from "./user.type";

export enum ELoaiToChuc {
    CHUYEN_MON = "CHUYEN_MON",
    HANH_CHINH = "HANH_CHINH",
    DOAN_THE = "DOAN_THE",
    KHAC = "KHAC",
}

export enum EVaiTroToChuc {
    TRUONG = "TRUONG",
    PHO = "PHO",
    THANH_VIEN = "THANH_VIEN",
    THU_KY = "THU_KY",
}

export interface TToChuc {
    id: number;
    ten: string;
    ma: string;
    moTa: string | null;
    hinhAnh: string | null;
    loaiToChuc: ELoaiToChuc;
    ngayTao: string;
    ngayCapNhat: string;
    thanhViens?: TThanhVienToChuc[];
    _count?: {
        thanhViens: number;
    };
}

export interface TThanhVienToChuc {
    id: number;
    toChucId: number;
    nguoiDungId: number;
    vaiTroTrongToChuc: EVaiTroToChuc;
    ngayThamGia: string;
    nguoiDung?: TUser;
}
