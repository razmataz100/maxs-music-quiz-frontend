import { useState } from 'react';
import { PasswordResetConfirmationRequest, PasswordResetRequest } from "../types/resetPassword.ts";
import { resetPassword, sendResetEmail } from "../httpUtils/auth.ts";
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendEmail = async () => {
        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const request: PasswordResetRequest = { email };
            await sendResetEmail(request);
            setSuccessMessage('Reset link sent to your email. Please check your inbox.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!token || !newPassword) {
            setError('Please enter both the reset token and the new password.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const request: PasswordResetConfirmationRequest = { token, newPassword };
            await resetPassword(request);
            setSuccessMessage('Your password has been reset successfully!');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-50">
            <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-200">
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-4 right-4 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                    ← Back
                </button>
                <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
                    Forgot Password
                </h1>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 rounded-md">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <div>
                        <label htmlFor="forgot-email" className="block mb-2 text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="forgot-email"
                                name="forgot-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={isLoading}
                                autoComplete="off"
                            />
                            <button
                                onClick={handleSendEmail}
                                className="cursor-pointer px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send Email'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="forgot-token" className="block mb-2 text-sm font-medium text-gray-700">
                            Reset Token
                        </label>
                        <input
                            id="forgot-token"
                            name="forgot-token"
                            type="text"
                            placeholder="Enter the reset token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={isLoading}
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label htmlFor="forgot-new-password" className="block mb-2 text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            id="forgot-new-password"
                            name="forgot-new-password"
                            type="password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                    </div>
                    <button
                        onClick={handleResetPassword}
                        className="cursor-pointer w-full px-4 py-2 text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
