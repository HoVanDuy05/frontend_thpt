export interface TNamHoc {
    id: number;
    tenNamHoc: string;
    ngayBatDau?: string;
    ngayKetThuc?: string;
    dangKichHoat?: boolean;
    cacHocKy?: THocKy[];
}

export interface THocKy {
    id: number;
    tenHocKy: string;
    namHocId: number;
    ngayBatDau?: string;
    ngayKetThuc?: string;
    dangKichHoat?: boolean;
    namHoc?: TNamHoc;
}

export interface TMonHoc {
    id: number;
    tenMon: string;
}

export interface TLopHoc {
    id: number;
    namHocId?: number;
    tenLop: string;
    gvChuNhiemId?: number;

    namHoc?: TNamHoc;
    gvChuNhiem?: any; // To avoid circular dependency or deep nesting for now
}
