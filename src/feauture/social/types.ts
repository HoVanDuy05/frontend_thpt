export interface UserBasic {
    id: number;
    taiKhoan: string;
    email: string;
    hoTen?: string;
    avatar?: string;
}

export interface Thread {
    id: number;
    tacGiaId: number;
    tacGia: UserBasic;
    noiDung: string;
    hinhAnh?: string;
    threadChaId?: number;
    ngayTao: string;
    _count: {
        likes: number;
        replies: number;
        reposts: number;
    };
    liked?: boolean;
}
