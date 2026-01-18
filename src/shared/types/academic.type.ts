export interface TNamHoc {
    id: number;
    tenNamHoc: string;
    ngayBatDau?: string;
    ngayKetThuc?: string;
    dangKichHoat?: boolean;
    cacHocKy?: THocKy[];
    cacLopNam?: TLopNam[]; // NEW
}

export interface THocKy {
    id: number;
    tenHocKy: string;
    namHocId: number;
    ngayBatDau?: string;
    ngayKetThuc?: string;
    dangKichHoat?: boolean;
    moTa?: string;
    namHoc?: TNamHoc;
}

export interface TMonHoc {
    id: number;
    tenMon: string;
    maMon?: string;
    moTa?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;

    _count?: {
        lopHoc?: number;
        giaoVien?: number;
    };
}

export interface TKhoi {
    id: number;
    tenKhoi: string;
    maKhoi: number;
    moTa?: string;
    _count?: {
        lopHocs?: number;
    };
}

export interface TPhanCongGv {
    id: number;
    giaoVienId: number;
    monHocId: number;
    lopNamId: number;
    namHocId: number;
    createdAt?: string;
    updatedAt?: string;
    giaoVien?: any;
    monHoc?: TMonHoc;
    lopNam?: TLopNam;
    namHoc?: TNamHoc;
}

export interface TDiem {
    id: number;
    hocSinhId: number;
    monHocId: number;
    hocKyId: number;
    giuaKy?: number;
    cuoiKy?: number;
    trungBinh?: number;
    createdAt?: string;
    updatedAt?: string;
    hocSinh?: any;
    monHoc?: TMonHoc;
    hocKy?: THocKy;
}

// Updated: LopHoc is now permanent class structure
export interface TLopHoc {
    id: number;
    tenLop: string;
    khoiId: number;
    moTa?: string;

    // Relations
    khoi?: TKhoi;
    cacLopNam?: TLopNam[];
}

// NEW: Class instance in a specific year
export interface TLopNam {
    id: number;
    lopId: number;
    namHocId: number;
    gvChuNhiemId?: number;
    siSo: number;

    lopHoc?: TLopHoc;
    namHoc?: TNamHoc;
    gvChuNhiem?: any;
    hocSinhs?: THocSinhLopNam[];
    _count?: {
        hocSinhs?: number;
    };
}

// NEW: Student assignment to a class year
export interface THocSinhLopNam {
    id: number;
    hocSinhId: number;
    lopNamId: number;
    ngayVao: string;
    ngayRa?: string;
    trangThai: 'DANG_HOC' | 'BAO_LUU' | 'THOI_HOC' | 'TOT_NGHIEP' | 'CHUYEN_TRUONG';

    hocSinh?: any; // THoSoHocSinh
    lopNam?: TLopNam;
}
