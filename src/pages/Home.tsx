import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {deleteGame, getAllGames } from '../httpUtils/game';
import { GameWithHighScore } from "../types/game.ts";
import { UserRole } from "../types/auth.ts";
import ConfirmationPopup from "../components/ConfirmationPopup.tsx";
import ProfileIcon from '../assets/profile.svg';
import {Button} from "../components/Button.tsx";
import {StatusMessage} from "../components/StatusMessage.tsx";
import PlusIcon from '../assets/plus.svg';

function Home() {
    const [games, setGames] = useState<GameWithHighScore[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [gameToDelete, setGameToDelete] = useState<number | null>(null);

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

    const handleDeleteClick = (gameId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setGameToDelete(gameId);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (gameToDelete === null) return;

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            setError('Authentication token is missing.');
            return;
        }

        try {
            await deleteGame(gameToDelete, authToken);
            setGames((prevGames) => prevGames.filter((game) => game.gameId !== gameToDelete));
            setShowDeleteConfirm(false);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setGameToDelete(null);
    };

    if (error) {
        return <StatusMessage type="error" message={error} />;
    }

    return (
        <div className="flex flex-col bg-white border border-gray-200 shadow-md w-full max-w-4xl rounded-lg h-[calc(100vh-14rem)] sm:h-auto sm:max-h-[70vh]">
            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-white rounded-t-lg border-b border-gray-200">
                <div className="p-6">
                    <div className="relative flex justify-start sm:justify-center items-center">
                        <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 text-left sm:text-center pr-14 sm:pr-0">
                            Available Quizzes
                        </h3>
                        {userRole === UserRole.Admin && (
                            <Button
                                variant="primary"
                                onClick={() => navigate('/create-quiz')}
                                className="absolute right-0 bg-emerald-500 hover:bg-emerald-600"
                            >
                                <div className="flex items-center">
                                    <img src={PlusIcon} alt="Plus" className="h-5 w-5" />
                                    <span className="ml-1 hidden sm:inline">Create Quiz</span>
                                </div>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto rounded-b-lg">
                <div className="p-6">
                    <ul className="list-none space-y-4">
                        {games.map((game) => (
                            <li key={game.gameId}
                                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-md hover:bg-gray-100 hover:shadow-md transition-all bg-gray-50 border border-gray-200">
                                <div className="flex justify-between items-center w-full mb-2 sm:mb-0 sm:flex-1">
                                    <span className="text-lg font-bold text-gray-800">{game.theme}</span>
                                    <div className="flex items-center space-x-2 sm:hidden">
                                        <Button
                                            variant="primary"
                                            onClick={() => navigate(`/game/${game.gameId}`)}
                                        >
                                            Play
                                        </Button>
                                        {userRole === UserRole.Admin && (
                                            <Button
                                                variant="secondary"
                                                onClick={(e) => handleDeleteClick(game.gameId, e)}
                                            >
                                                X
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="mb-2 sm:mb-0 sm:flex-1">
                                    {game.highScore ? (
                                        <>
                                            <p className="text-gray-700 mb-2">High
                                                Score: {game.highScore}/{game.questionsAnswered ?? "N/A"}</p>
                                            <div className="flex items-center mt-1">
                                                {game.highScoreProfilePictureUrl ? (
                                                    <img
                                                        src={`http://localhost:5284${game.highScoreProfilePictureUrl}`}
                                                        alt={game.highScoreUsername}
                                                        className="w-9 h-9 rounded-full mr-1 object-cover border border-gray-200"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.onerror = null;
                                                            target.src = ProfileIcon;
                                                            target.className = "w-9 h-9 mr-1";
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={ProfileIcon}
                                                        alt="Profile Icon"
                                                        className="w-9 h-9  mr-1"
                                                    />
                                                )}
                                                <span className="text-gray-500">{game.highScoreUsername}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-gray-700">High Score: N/A</p>
                                    )}
                                </div>

                                <div className="mb-2 sm:mb-0 sm:flex-1">
                                    {game.questionsAnswered ? (
                                        <p className="text-gray-700">Your
                                            score: {game.correctAnswers}/{game.questionsAnswered ?? "N/A"}</p>
                                    ) : (
                                        <p className="text-gray-700">Your score: N/A</p>
                                    )}
                                </div>
                                <div className="hidden sm:flex items-center space-x-2">
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate(`/game/${game.gameId}`)}
                                    >
                                        Play
                                    </Button>
                                    {userRole === UserRole.Admin && (
                                        <Button
                                            variant="secondary"
                                            onClick={(e) => handleDeleteClick(game.gameId, e)}
                                        >
                                            X
                                        </Button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <ConfirmationPopup
                isOpen={showDeleteConfirm}
                title="Delete Quiz?"
                message="Are you sure you want to delete this quiz? This action cannot be undone."
                confirmText="Delete Quiz"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmButtonColor="bg-red-500 hover:bg-red-600"
            />
        </div>
    );
}

export default Home;
