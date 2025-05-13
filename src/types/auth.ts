export enum UserRole {
    Admin = 'Admin',
    User = 'User',
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    expiration: string;
    userId: number;
    username: string;
    userRole: UserRole;
}

