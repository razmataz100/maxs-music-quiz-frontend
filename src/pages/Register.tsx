import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {RegisterRequest, RegisterResponse} from "../types/registerRequest.ts";
import {register} from "../httpUtils/user.ts";


function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const request: RegisterRequest = { username, email, password };
            const response: RegisterResponse = await register(request);

            if (response.message) {
                setSuccessMessage(response.message);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleRegister();
    };
    return (
        <div className="flex items-center justify-center bg-gray-50">
            <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-200">
                <button
                    className="absolute top-4 right-4 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    &#8592; Back
                </button>

                <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Register</h1>

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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="register-username" className="block mb-2 text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="register-username"
                            name="register-username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={isLoading}
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label htmlFor="register-email" className="block mb-2 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="register-email"
                            name="register-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={isLoading}
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label htmlFor="register-password" className="block mb-2 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="register-password"
                            name="register-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );

}

export default Register;
