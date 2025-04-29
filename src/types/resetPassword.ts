export interface PasswordResetRequest {
    email: string;
}


export interface PasswordResetConfirmationRequest {
    token: string;
    newPassword: string;
}
