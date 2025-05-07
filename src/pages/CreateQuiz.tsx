import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame } from '../httpUtils/game';
import { CreateGameRequest } from '../types/game';

function CreateQuiz() {
    const [theme, setTheme] = useState('');
    const [playlistUrl, setPlaylistUrl] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!theme || !playlistUrl) {
            setError('Please fill in all fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('Authentication token is missing.');
            }

            const request: CreateGameRequest = { theme, playlistUrl };
            await createGame(request, authToken);
            setSuccessMessage('Quiz created successfully!');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create quiz.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 bg-white border border-gray-300 shadow-md w-full max-w-4xl h-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create a New Quiz</h3>
                <button
                    onClick={handleBack}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                >
                    Back
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
                <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                        Theme
                    </label>
                    <input
                        id="theme"
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:bg-gray-100 focus:outline-none focus:ring-0"
                        placeholder="Enter quiz theme"
                    />
                </div>
                <div>
                    <label htmlFor="playlistUrl" className="block text-sm font-medium text-gray-700">
                        Playlist URL
                    </label>
                    <input
                        id="playlistUrl"
                        type="url"
                        value={playlistUrl}
                        onChange={(e) => setPlaylistUrl(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:bg-gray-100 focus:outline-none focus:ring-0"
                        placeholder="Enter playlist URL"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 text-white rounded ${
                        isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {isSubmitting ? 'Creating...' : 'Create Quiz'}
                </button>
            </form>
        </div>
    );
}

export default CreateQuiz;
