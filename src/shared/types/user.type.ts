export type UserRole = "ADMIN" | "GIAO_VIEN" | "HOC_SINH" | "PHU_HUYNH";

export interface TUser {
    id: number;
    taiKhoan: string;
    email?: string;
    vaiTro: UserRole;
    ngayTao: string;

    hoSoGiaoVien?: THoSoGiaoVien;
    hoSoHocSinh?: THoSoHocSinh;
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
}
