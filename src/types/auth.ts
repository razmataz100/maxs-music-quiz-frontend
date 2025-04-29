export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    expiration: string;
    userId: number;
    username: string;
}
