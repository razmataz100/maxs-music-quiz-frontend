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
