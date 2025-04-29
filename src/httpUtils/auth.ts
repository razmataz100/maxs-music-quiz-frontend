import { LoginRequest, LoginResponse } from "../types/auth";
import {API_BASE_URL} from "../config/apiConfig.ts";
import {PasswordResetConfirmationRequest, PasswordResetRequest} from "../types/resetPassword.ts";


export async function login(request: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
    }

    return response.json();
}

export async function sendResetEmail(request: PasswordResetRequest): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/user/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send reset email. Please try again.');
    }
    return await response.text();
}


export async function resetPassword(request: PasswordResetConfirmationRequest): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/user/reset-password-confirmation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to reset password. Please try again.');
    }

    return await response.text();
}



