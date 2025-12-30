export interface TNamHoc {
    id: number;
    tenNamHoc: string;
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
