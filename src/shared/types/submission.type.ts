export interface TLichSuNopBai {
    id: number;
    deThiId: number;
    hocSinhId: number;
    lanNop?: number;
    noiDungBaiLam?: string;
    linkAnhChupBai?: string;
    thoiGianNop: string;
    trangThai?: string;
}

export interface TChiTietTraLoiTracNghiem {
    id: number;
    nopBaiId: number;
    cauHoiId: number;
    cauTraLoiCuaHs?: string;
    laDung?: boolean;
}
