import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinGame } from "../httpUtils/game";

function JoinGame() {
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const authToken = localStorage.getItem('authToken');
            console.log('Auth token:', authToken);

            if (!authToken) {
                throw new Error('Authentication token not found');
            }

            console.log('Attempting to join game with code:', joinCode);
            const gameData = await joinGame(joinCode, authToken);
            console.log('Game data received:', gameData);

            // Store the join code
            localStorage.setItem("joinCode", joinCode);

            // Navigate to lobby with state
            console.log('Navigating to:', `/lobby/${joinCode}`);

            // Use a small timeout to ensure navigation happens
            setTimeout(() => {
                navigate(`/lobby/${joinCode}`, {
                    state: {
                        userId: gameData.userId,
                        gameId: gameData.gameId
                    }
                });
                console.log('Navigation with timeout completed');
            }, 100);

        } catch (err) {
            console.error('Error details:', err);
            setError(err instanceof Error ? err.message : "Failed to join game. Please check the join code.");
        }
    };

    return (
        <div className="relative p-8 bg-white border border-gray-300 shadow-md max-w-4xl h-auto">
            <button
                className="absolute top-4 left-4 text-blue-600 hover:underline cursor-pointer mb-10"
                onClick={() => navigate(-1)}
            >
                &#8592; Back
            </button>

            <h2 className="text-xl mb-6 mt-6">Join Game</h2>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Enter Join Code"
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                    required
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                >
                    Join Game
                </button>
            </form>
        </div>
    );
}

export default JoinGame;
