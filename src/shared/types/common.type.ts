export interface TQueryConfig {
    where?: Record<string, any>;
    orderBy?: Record<string, "asc" | "desc">;
    include?: Record<string, boolean | object>;
    skip?: number;
    take?: number;
    hocKyId?: number;
    hocSinhId?: number;
}

export interface TApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}
