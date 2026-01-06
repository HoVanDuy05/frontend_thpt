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
    chuyenMon?: string;
    avatar?: string;
}

export interface THoSoHocSinh {
    id: number;
    userId: number;
    maSoHs: string;
    hoTen: string;
    ngaySinh?: string;
    lopId?: number;
    avatar?: string;
    lopHoc?: TLopHoc;
    gioiTinh?: string;
    soDienThoai?: string;
    diaChi?: string;
}
