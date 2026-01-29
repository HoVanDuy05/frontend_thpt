export enum TrangThaiQuyTrinh {
    NHAP = 'NHAP',
    HOAT_DONG = 'HOAT_DONG',
    NGUNG_HOAT_DONG = 'NGUNG_HOAT_DONG'
}

export enum LoaiQuyTacBuoc {
    BAT_KY = 'BAT_KY',
    TAT_CA = 'TAT_CA'
}

export enum LoaiNguoiPheDuyet {
    NGUOI_DUNG = 'NGUOI_DUNG',
    VAI_TRO = 'VAI_TRO',
    NHOM = 'NHOM'
}

export enum LoaiTruongForm {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    TEXTAREA = 'TEXTAREA',
    LONG_TEXT = 'LONG_TEXT',
    SELECT = 'SELECT',
    DATE = 'DATE',
    DATETIME = 'DATETIME',
    TIME = 'TIME',
    CHECKBOX = 'CHECKBOX',
    RADIO = 'RADIO',
    FILE = 'FILE',
    SECTION_HEADER = 'SECTION_HEADER',
    QUILL = 'QUILL',
    MULTI_DATE = 'MULTI_DATE',
    SELECT_AFFILIATION = 'SELECT_AFFILIATION',
    SELECT_DATE_OFF_TYPE = 'SELECT_DATE_OFF_TYPE',
    DEFAULT_INPUT = 'DEFAULT_INPUT',
    IMAGE = 'IMAGE'
}

export enum TrangThaiPhien {
    CHO_DUYET = 'CHO_DUYET',
    DANG_XU_LY = 'DANG_XU_LY',
    DA_DUYET = 'DA_DUYET',
    TU_CHOI = 'TU_CHOI',
    HUY_BO = 'HUY_BO'
}

export enum TrangThaiBuocPhien {
    CHO_DUYET = 'CHO_DUYET',
    DA_DUYET = 'DA_DUYET',
    TU_CHOI = 'TU_CHOI',
    BO_QUA = 'BO_QUA'
}

export enum HanhDongPheDuyet {
    PHE_DUYET = 'PHE_DUYET',
    TU_CHOI = 'TU_CHOI',
    YEU_CAU_CHINH_SUA = 'YEU_CAU_CHINH_SUA'
}

export interface TDanhMucQuyTrinh {
    id: number;
    ten: string;
    moTa?: string;
    _count?: {
        quyTrinhs: number;
    };
}

export interface TQuyTrinh {
    id: number;
    ten: string;
    moTa?: string;
    trangThai: TrangThaiQuyTrinh;
    nguoiTaoId: number;
    ngayTao: string;
    cacBuoc?: TBuocQuyTrinh[];
    cacTruong?: TTruongFormQuyTrinh[];
    danhMuc?: TDanhMucQuyTrinh;
    _count?: {
        cacBuoc: number;
    };
}

export interface TBuocQuyTrinh {
    id: number;
    quyTrinhId: number;
    thuTuBuoc: number;
    ten: string;
    loaiQuyTac: LoaiQuyTacBuoc;
    nguoiDuyets?: TNguoiPheDuyetBuoc[];
}

export interface TNguoiPheDuyetBuoc {
    id: number;
    buocId: number;
    loaiNguoiPheDuyet: LoaiNguoiPheDuyet;
    approverId?: number; // ID of user
    approverRole?: string; // "GVCN", "ADMIN"...
    user?: {
        id: number;
        taiKhoan: string;
        hoTen?: string;
        email?: string;
    };
}

export interface TTruongFormQuyTrinh {
    id: number;
    quyTrinhId: number;
    tenTruong: string;
    nhan: string;
    loai: LoaiTruongForm;
    batBuoc: boolean;
    tuyChon?: string; // JSON string of options
    thuTu: number;
}

export interface TFlowInstanceField {
    submitContent: any;
    submitFlowFieldID: number;
    detailFlow: {
        detailFlowId: number;
        fieldName: string;
        fieldValue: string;
        optional: string;
        optionValue: string;
        order: number;
        key: string;
        parentKey: string | null;
    };
}

export interface TPhienQuyTrinh {
    id: number;
    quyTrinhId: number;
    quyTrinh?: TQuyTrinh;
    doiTuongLienQuan?: any; // Form data
    duLieuForm?: string; // Stored as JSON string
    trangThai: TrangThaiPhien;
    buocHienTai: number;
    nguoiTaoId: number;
    nguoiTao?: {
        id: number;
        taiKhoan: string;
        hoTen?: string;
        email?: string;
        avatar?: string;
    };
    ngayTao: string;
    ngayCapNhat?: string;
    buocPhiens?: TBuocPhienQuyTrinh[];
    nhatKy?: TNhatKyPheDuyetQuyTrinh[];
    fields?: TFlowInstanceField[]; // New structured fields
}

export interface TBuocPhienQuyTrinh {
    id: number;
    phienId: number;
    buocId: number;
    buoc?: TBuocQuyTrinh;
    trangThai: TrangThaiBuocPhien;
    nguoiPheDuyetId?: number;
    ngayPheDuyet?: string;
}

export interface TNhatKyPheDuyetQuyTrinh {
    id: number;
    phienId: number;
    buocId?: number;
    nguoiDungId: number;
    nguoiDung?: { id: number; taiKhoan: string };
    hanhDong: HanhDongPheDuyet;
    noiDung?: string;
    ngayTao: string;
}
