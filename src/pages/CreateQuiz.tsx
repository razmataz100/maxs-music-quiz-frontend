import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame } from '../httpUtils/game';
import { CreateGameRequest } from '../types/game';
import BackButton from "../components/BackButton.tsx";
import {FormInput} from "../components/FormInput.tsx";

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
        <div className="p-8 bg-white border border-gray-200 shadow-md w-full max-w-4xl h-auto rounded-lg">
            <div className="relative flex justify-center items-center mb-6">
                <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-800 pr-10">Create a New Quiz</h3>
                <BackButton onClick={handleBack}/>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 p-3 bg-red-50 rounded-md">{error}</p>}
                {successMessage && <p className="text-green-600 p-3 bg-green-50 rounded-md">{successMessage}</p>}

                <FormInput
                    id="theme"
                    label="Theme"
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Enter quiz theme"
                />

                <FormInput
                    id="playlistUrl"
                    label="Playlist URL"
                    type="url"
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    placeholder="Enter playlist URL"
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 text-white rounded-md transition-colors ${
                        isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'
                    }`}
                >
                    {isSubmitting ? 'Creating...' : 'Create Quiz'}
                </button>
            </form>
        </div>
    );
}

export default CreateQuiz;
