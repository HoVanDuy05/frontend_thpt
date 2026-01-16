import { TLopHoc } from "./academic.type";

export type UserRole = "ADMIN" | "GIAO_VIEN" | "HOC_SINH" | "PHU_HUYNH";

export interface TUser {
    id: number;
    taiKhoan: string;
    email?: string;
    vaiTro: UserRole;
    ngayTao: string;
    hoTen?: string; // Derived or direct
    maSo?: string;  // Derived or direct
    ngaySinh?: string | Date;
    gioiTinh?: string;
    isBlocked?: boolean;
    avatar?: string;
    notifications?: TNotification[];
    soDienThoai?: string;
    diaChi?: string;
    tongKetBan?: number;
    _count?: { followers: number; following: number; };

    hoSoGiaoVien?: THoSoGiaoVien;
    hoSoHocSinh?: THoSoHocSinh;
    hoSoNhanVien?: THoSoNhanVien;
    hoSoXaHoi?: THoSoXaHoi;
}

export interface TNotification {
    id: number;
    tieuDe: string;
    noiDung: string;
    loaiThongBao: string;
    nguoiGuiId: number;
    nguoiNhanId: number;
    lienKet?: string;
    daDoc: boolean;
    ngayTao: string;
    nguoiGui?: {
        id: number;
        taiKhoan: string;
        hoTen?: string;
        avatar?: string;
    };
}

export interface THoSoGiaoVien {
    id: number;
    userId: number;
    maSoGv: string;
    hoTen: string;
    ngaySinh?: string | Date;
    gioiTinh?: string;
    diaChi?: string;
    soDienThoai?: string;
    emailLienHe?: string;
    cccd?: string;
    ngayCapCccd?: string | Date;
    noiCapCccd?: string;
    trinhDo?: string;
    chuyenMon?: string;
    ngayVaoLam?: string | Date;
    avatar?: string;
}

export interface THoSoHocSinh {
    id: number;
    userId: number;
    maSoHs: string;
    hoTen: string;
    ngaySinh?: string | Date;
    gioiTinh?: string;
    noiSinh?: string;
    danToc?: string;
    tonGiao?: string;
    diaChiThuongTru?: string;
    diaChiTamTru?: string;
    soDienThoai?: string;
    cccd?: string;
    ngayCapCccd?: string | Date;
    noiCapCccd?: string;
    hoTenCha?: string;
    ngheNghiepCha?: string;
    sdtCha?: string;
    hoTenMe?: string;
    ngheNghiepMe?: string;
    sdtMe?: string;
    ngayNhapHoc?: string | Date;
    trangThai?: string;
    lopId?: number;
    avatar?: string;
    lopHoc?: TLopHoc;
    cacLopNam?: any[]; // Since importing THocSinhLopNam here might cause circularity, we can use any[] or move types
    diaChi?: string;
}

export interface THoSoNhanVien {
    id: number;
    userId: number;
    maSo: string;
    hoTen: string;
    ngaySinh?: string | Date;
    gioiTinh?: string;
    diaChi?: string;
    soDienThoai?: string;
    emailLienHe?: string;
    cccd?: string;
}

export interface THoSoXaHoi {
    id: number;
    userId: number;
    tieuSu?: string;
    ngaySinhHienThi?: string;
    diaChiHienThi?: string;
    lienKetMangXaHoi?: string;
    soThich?: string;
}
