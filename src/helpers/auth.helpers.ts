import {LoginResponse} from "../types/auth.ts";

export const saveAuthData = (response: LoginResponse): void => {
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('tokenExpiration', response.expiration);
    localStorage.setItem('username', response.username);
    localStorage.setItem('userId', response.userId.toString());
    localStorage.setItem('userRole', response.userRole);
};

export const clearAuthData = (): void => {
    localStorage.clear();
};

export const getAuthToken = (): string => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Authentication token is missing.');
    }
    return token;
};

export const getUserId = (): number => {
    const userId = localStorage.getItem('userId');
    return Number(userId) || 0;
};

export const getUserRole = (): string | null => {
    return localStorage.getItem('userRole');
};

export const getUsername = (): string | null => {
    return localStorage.getItem('username');
};
