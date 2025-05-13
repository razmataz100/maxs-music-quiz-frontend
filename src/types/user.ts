export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    profilePictureUrl: string | null;
    totalScore: number;
    totalQuestionsAnswered: number;
    averageScore: number;
}

export interface UpdateUserRequest {
    username: string;
    email: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}


export interface RegisterResponse {
    message?: string;
    error?: string;
}
