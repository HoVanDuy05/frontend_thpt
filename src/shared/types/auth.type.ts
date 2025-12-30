export interface TLoginRequest {
    email: string;
    matKhau: string;
}

export interface TLoginResponse {
    access_token: string;
    user: any; // We can type this better later
}

