import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameWithHighScore, GameHistory } from "../../types/game.ts";
import { UserRole } from "../../types/auth.ts";
import ConfirmationPopup from "../../components/common/ConfirmationPopup.tsx";
import {Button} from "../../components/common/Button.tsx";
import {StatusMessage} from "../../components/common/StatusMessage.tsx";
import PlusIcon from '../../assets/plus.svg';
import {ProfilePicture} from "../../components/common/ProfilePicture.tsx";
import {deleteGame, getAllGames, getGameHistory} from "../../services/game.service.ts";
import {getAuthToken, getUserId, getUserRole} from "../../helpers/auth.helpers.ts";
import {formatDate} from "../../helpers/date.helpers.ts";

function Home() {
    const [games, setGames] = useState<GameWithHighScore[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const userRole = getUserRole();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [gameToDelete, setGameToDelete] = useState<number | null>(null);
    const [expandedGames, setExpandedGames] = useState<Set<number>>(new Set());
    const [gameHistories, setGameHistories] = useState<{[key: number]: GameHistory[]}>({});
    const [loadingHistory, setLoadingHistory] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const authToken = getAuthToken();
                const userId = getUserId();
                const gamesData = await getAllGames(userId, authToken);
                setGames(gamesData);
            } catch (err) {
                if (err instanceof Error && err.message === 'Authentication token is missing.') {
                    navigate('/');
                } else {
                    setError((err as Error).message);
                }
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

        try {
            const authToken = getAuthToken();
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

    const toggleExpand = async (gameId: number) => {
        const isCurrentlyExpanded = expandedGames.has(gameId);
        const newExpanded = new Set<number>();

        if (!isCurrentlyExpanded) {
            newExpanded.add(gameId);
            if (!gameHistories[gameId] && !loadingHistory.has(gameId)) {
                setLoadingHistory(prev => new Set(prev).add(gameId));
                try {
                    const userId = getUserId();
                    const history = await getGameHistory(gameId, userId);
                    setGameHistories(prev => ({ ...prev, [gameId]: history }));
                } catch (error) {
                    console.error('Failed to fetch game history:', error);
                } finally {
                    setLoadingHistory(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(gameId);
                        return newSet;
                    });
                }
            }
        }

        setExpandedGames(newExpanded);
    };

    if (error) {
        return <StatusMessage type="error" message={error} />;
    }

    return (
        <div className="flex flex-col bg-white border border-gray-200 shadow-md w-full max-w-4xl rounded-lg h-[calc(100vh-14rem)] sm:h-auto sm:max-h-[70vh]">
            <div className="sticky top-0 z-10 bg-white rounded-t-lg border-b border-gray-200">
                <div className="p-6">
                    <div className="relative flex justify-start sm:justify-center items-center">
                        <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 text-left sm:text-center pr-14 sm:pr-0">
                            Available Quizzes
                        </h3>
                        {userRole === UserRole.Admin && (
                            <Button
                                variant="green"
                                onClick={() => navigate('/create-quiz')}
                                className="absolute right-0"
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

            <div className="flex-1 overflow-y-auto rounded-b-lg">
                <div className="p-6">
                    <ul className="list-none space-y-4">
                        {games.map((game) => (
                            <li key={game.gameId} className="rounded-md bg-gray-50 border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                                <div
                                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-gray-100 transition-all cursor-pointer"
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('button')) {
                                            return;
                                        }
                                        toggleExpand(game.gameId);
                                    }}
                                >
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
                                                    Score: {game.highScore}/{game.highScoreQuestions ?? "N/A"}</p>
                                                <div className="flex items-center mt-1">
                                                    <ProfilePicture
                                                        imageUrl={game.highScoreProfilePictureUrl || null}
                                                        className="w-9 h-9"
                                                        baseUrl="http://localhost:5284"
                                                    />
                                                    <div className="flex flex-col ml-2">
                                                        <span className="text-gray-500">{game.highScoreUsername}</span>
                                                        {game.highScoreDate && (
                                                            <span
                                                                className="text-xs text-gray-400">{formatDate(game.highScoreDate)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-gray-700">High Score: N/A</p>
                                        )}
                                    </div>

                                    <div className="mb-2 sm:mb-0 sm:flex-1">
                                        {game.userBestScore !== undefined && game.userBestScore !== null ? (
                                            <>
                                                <p className="text-gray-700">Your best: {game.userBestScore}/{game.userBestScoreQuestions}</p>
                                                {game.userHighScoreDate && (
                                                    <span className="text-xs text-gray-400">{formatDate(game.userHighScoreDate)}</span>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-gray-700">Your best: N/A</p>
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
                                                className="hover:bg-red-100 hover:text-red-600 transition-colors"
                                            >
                                                X
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                {expandedGames.has(game.gameId) && (
                                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Games (All Players)</h4>
                                        {loadingHistory.has(game.gameId) ? (
                                            <div className="text-center py-2">
                                                <div className="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : gameHistories[game.gameId] ? (
                                            gameHistories[game.gameId].length > 0 ? (
                                                <div className="space-y-1">
                                                    {gameHistories[game.gameId].map((history, index) => {
                                                        return (
                                                            <div key={index} className={`flex items-center justify-between text-sm p-2 rounded ${history.isCurrentUser ? 'bg-indigo-50 border border-indigo-200' : ''}`}>
                                                                <div className="flex items-center space-x-2">
                                                                    <ProfilePicture
                                                                        imageUrl={history.profilePictureUrl || null}
                                                                        className="w-5 h-5"
                                                                        baseUrl="http://localhost:5284"
                                                                    />
                                                                    <span className={`font-medium ${history.isCurrentUser ? 'text-indigo-700' : 'text-gray-700'}`}>
                                                                        {history.isCurrentUser ? 'You' : history.username}
                                                                    </span>
                                                                    <span className="text-gray-500">•</span>
                                                                    <span className="text-gray-600">{formatDate(history.playedAt)}</span>
                                                                </div>
                                                                <span className={`font-bold ${history.isCurrentUser ? 'text-indigo-700' : 'text-gray-800'}`}>
                                                                    {history.score}/{history.totalQuestions}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">No one has played this quiz yet</p>
                                            )
                                        ) : (
                                            <p className="text-sm text-gray-500">Loading...</p>
                                        )}
                                    </div>
                                )}
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
