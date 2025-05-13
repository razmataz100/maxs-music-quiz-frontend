import {User} from "../types/user.ts";

export interface ProfileFormData {
    username: string;
    email: string;
}

export const getInitialFormData = (user: User | null): ProfileFormData => {
    if (!user) return { username: '', email: '' };
    return {
        username: user.username,
        email: user.email
    };
};

export const dispatchProfilePictureUpdated = () => {
    const event = new CustomEvent('profilePictureUpdated');
    window.dispatchEvent(event);
};

export const extractProfilePictureUrl = (result: any): string | null => {
    return result?.imageUrl || null;
};
