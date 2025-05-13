import axios, { AxiosError } from 'axios';
import { LoginRequest, LoginResponse } from "../types/auth";
import { API_BASE_URL } from "../config/apiConfig.ts";
import { PasswordResetConfirmationRequest, PasswordResetRequest } from "../types/resetPassword.ts";

export async function login(request: LoginRequest): Promise<LoginResponse> {
    try {
        const { data } = await axios.post<LoginResponse>(
            `${API_BASE_URL}/auth/login`,
            request
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || 'Login failed. Please check your credentials.';
        throw new Error(message);
    }
}

export async function sendResetEmail(request: PasswordResetRequest): Promise<string> {
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/user/reset-password`,
            request
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || 'Failed to send reset email. Please try again.';
        throw new Error(message);
    }
}

export async function resetPassword(request: PasswordResetConfirmationRequest): Promise<string> {
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/user/reset-password-confirmation`,
            request
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || 'Failed to reset password. Please try again.';
        throw new Error(message);
    }
}
