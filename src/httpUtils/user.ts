import {RegisterRequest, RegisterResponse} from "../types/registerRequest.ts";
import {API_BASE_URL} from "../config/apiConfig.ts";
import {UpdateUserRequest, User} from "../types/user.ts";

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

export async function uploadProfilePicture(file: File): Promise<{imageUrl: string}> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required to upload profile picture');
    }

    const formData = new FormData();
    formData.append('file', file); // Changed to 'file' to match the controller parameter

    const response = await fetch(`${API_BASE_URL}/user/upload-profile-picture`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload profile picture. Please try again.');
    }

    return await response.json();
}

export async function getProfilePictureUrl(): Promise<{ imageUrl: string } | null> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/user/profile-picture`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch profile picture: ${response.statusText}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        return { imageUrl };
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        return null;
    }
}

export async function getUserInfo(): Promise<User | null> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/user/user-info`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user info: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
}

export async function updateUserInfo(request: UpdateUserRequest): Promise<User> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required to update user information');
    }

    const response = await fetch(`${API_BASE_URL}/user/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update user information. Please try again.');
    }

    return await response.json();
}





