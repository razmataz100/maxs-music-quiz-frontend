import {RegisterRequest, RegisterResponse} from "../types/registerRequest.ts";
import {API_BASE_URL} from "../config/apiConfig.ts";

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Registration failed. Please try again.');
    }

    return await response.json();
}
