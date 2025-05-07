import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {deleteGame, getAllGames } from '../httpUtils/game';
import { GameWithHighScore } from "../types/game.ts";
import { UserRole } from "../types/auth.ts";

function Home() {
    const [games, setGames] = useState<GameWithHighScore[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const userId = Number(localStorage.getItem('userId'));

        if (!authToken) {
            navigate('/');
            return;
        }

        const fetchGames = async () => {
            try {
                const gamesData = await getAllGames(userId, authToken);
                setGames(gamesData);
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchGames();
    }, [navigate]);

    const handleDeleteGame = async (gameId: number) => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            setError('Authentication token is missing.');
            return;
        }

        try {
            await deleteGame(gameId, authToken);
            setGames((prevGames) => prevGames.filter((game) => game.gameId !== gameId));
        } catch (err) {
            setError((err as Error).message);
        }
    };

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="relative p-8 bg-white border border-gray-300 shadow-md w-full max-w-4xl h-auto">
                <div className="relative mb-6">
                    <h3 className="text-lg font-semibold text-center">Available Quizzes</h3>
                    {userRole === UserRole.Admin && (
                        <button
                            onClick={() => navigate('/create-quiz')}
                            className="absolute top-0 right-0 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer mr-4"
                        >
                            Create Quiz
                        </button>
                    )}
                </div>
            <ul className="list-none space-y-4">
                {games.map((game) => (
                    <li
                        key={game.gameId}
                        className="group flex flex-row items-center justify-between border-none p-4 border rounded hover:bg-gray-100 hover:shadow-lg transition-shadow bg-gray-50"
                    >
                        <span className="text-lg font-bold flex-1">{game.theme}</span>
                        <div className="flex-1">
                            <p>High Score: {game.highScore}/{game.questionsAnswered ?? "N/A"}</p>
                                <p>({game.highScoreUsername})</p>
                        </div>
                        <div className="flex-1">
                            <p>Your score: {game.correctAnswers}/{game.questionsAnswered ?? "N/A"}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigate(`/game/${game.gameId}`)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                            >
                                Play
                            </button>
                            {userRole === UserRole.Admin && (
                                <button
                                    onClick={() => handleDeleteGame(game.gameId)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                                >
                                    X
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
