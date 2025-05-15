import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from "../config/apiConfig.ts";
import {RegisterRequest, RegisterResponse, UpdateUserRequest, User} from "../types/user.ts";

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
    try {
        const { data } = await axios.post<RegisterResponse>(
            `${API_BASE_URL}/user/register`,
            request
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ error?: string }>;
        const message = axiosError.response?.data?.error || 'Registration failed. Please try again.';
        throw new Error(message);
    }
}

export async function uploadProfilePicture(file: File): Promise<{imageUrl: string}> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required to upload profile picture');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const { data } = await axios.post<{imageUrl: string}>(
            `${API_BASE_URL}/user/profile/picture`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ error?: string }>;
        const message = axiosError.response?.data?.error || 'Failed to upload profile picture. Please try again.';
        throw new Error(message);
    }
}

export async function getProfilePictureUrl(): Promise<{ imageUrl: string } | null> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        return null;
    }

    try {
        const response = await axios.get(
            `${API_BASE_URL}/user/profile/picture`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            }
        );

        const imageUrl = URL.createObjectURL(response.data);
        return { imageUrl };
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
            return null;
        }
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
        const { data } = await axios.get<User>(
            `${API_BASE_URL}/user/profile`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return data;
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

    try {
        const { data } = await axios.put<User>(
            `${API_BASE_URL}/user/profile`,
            request,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ error?: string }>;
        const message = axiosError.response?.data?.error || 'Failed to update user information. Please try again.';
        throw new Error(message);
    }
}
