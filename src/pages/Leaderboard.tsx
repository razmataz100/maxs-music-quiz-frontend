import { useState, useEffect } from 'react';
import {
    getTotalScoreLeaderboard,
    getAverageScoreLeaderboard,
    getGamesCompletedLeaderboard,
    getWeeklyLeaderboard,
    getMonthlyLeaderboard
} from '../httpUtils/leaderboard';
import { LeaderboardEntry } from "../types/leaderboard.ts";
import { useNavigate } from 'react-router-dom';
import BackButton from "../components/BackButton.tsx";
import {LoadingSpinner} from "../components/LoadingSpinner.tsx";
import {StatusMessage} from "../components/StatusMessage.tsx";
import {ProfilePicture} from "../components/ProfilePicture.tsx";
import {Button} from "../components/Button.tsx";

function Leaderboard() {
    const [leaderboardType, setLeaderboardType] = useState<string>('total');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLeaderboard(leaderboardType);
    }, [leaderboardType]);

    const fetchLeaderboard = async (type: string) => {
        try {
            setLoading(true);
            let data: LeaderboardEntry[] = [];

            switch (type) {
                case 'total':
                    data = await getTotalScoreLeaderboard();
                    break;
                case 'average':
                    data = await getAverageScoreLeaderboard();
                    break;
                case 'games':
                    data = await getGamesCompletedLeaderboard();
                    break;
                case 'weekly':
                    data = await getWeeklyLeaderboard();
                    break;
                case 'monthly':
                    data = await getMonthlyLeaderboard();
                    break;
                default:
                    data = await getTotalScoreLeaderboard();
            }

            setLeaderboard(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const getLeaderboardTitle = () => {
        switch (leaderboardType) {
            case 'total': return 'Top Players by Total Score';
            case 'average': return 'Top Players by Average Score';
            case 'games': return 'Top Players by Games Completed';
            case 'weekly': return 'Weekly Top Players';
            case 'monthly': return 'Monthly Top Players';
            default: return 'Leaderboard';
        }
    };

    const getScoreLabel = () => {
        switch (leaderboardType) {
            case 'games': return 'Games';
            default: return 'Score';
        }
    };

    if (loading) return <LoadingSpinner fullPage size="large" />;
    if (error) return <StatusMessage type="error" message={error} />;

    return (
        <div className="flex flex-col bg-white border border-gray-200 shadow-md w-full max-w-4xl rounded-lg h-[calc(100vh-14rem)] sm:h-auto sm:max-h-[70vh]">
            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-white rounded-t-lg border-b border-gray-200">
                <div className="p-6">
                    <div className="relative flex justify-start sm:justify-center items-center">
                        <h2 className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800 text-left sm:text-center w-full sm:w-auto pr-14 sm:pr-0">
                            {getLeaderboardTitle()}
                        </h2>
                        <BackButton onClick={() => navigate('/home')}/>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <Button
                            variant={leaderboardType === 'total' ? 'primary' : 'secondary'}
                            onClick={() => setLeaderboardType('total')}
                            className={leaderboardType !== 'total' ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : ''}
                        >
                            Total Score
                        </Button>
                        <Button
                            variant={leaderboardType === 'average' ? 'primary' : 'secondary'}
                            onClick={() => setLeaderboardType('average')}
                            className={leaderboardType !== 'average' ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : ''}
                        >
                            Average Score
                        </Button>
                        <Button
                            variant={leaderboardType === 'games' ? 'primary' : 'secondary'}
                            onClick={() => setLeaderboardType('games')}
                            className={leaderboardType !== 'games' ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : ''}
                        >
                            Games Completed
                        </Button>
                        <Button
                            variant={leaderboardType === 'weekly' ? 'primary' : 'secondary'}
                            onClick={() => setLeaderboardType('weekly')}
                            className={leaderboardType !== 'weekly' ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : ''}
                        >
                            Weekly
                        </Button>
                        <Button
                            variant={leaderboardType === 'monthly' ? 'primary' : 'secondary'}
                            onClick={() => setLeaderboardType('monthly')}
                            className={leaderboardType !== 'monthly' ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : ''}
                        >
                            Monthly
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto rounded-b-lg">
                <div className="p-6">
                    {leaderboard.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead>
                                <tr className="bg-gray-100 border-b border-gray-300">
                                    <th className="py-3 px-4 text-left w-16 text-gray-700">Rank</th>
                                    <th className="py-3 px-4 text-left text-gray-700">Player</th>
                                    <th className="py-3 px-4 text-right text-gray-700">{getScoreLabel()}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {leaderboard.map((entry, index) => {
                                    return (
                                        <tr key={`${entry.userId}-${index}`}
                                            className="border-b border-gray-200 hover:bg-gray-100 transition-colors bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    {entry.rank <= 3 ? (
                                                        <span
                                                            className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 text-white font-bold ${
                                                                entry.rank === 1 ? 'bg-amber-400' :
                                                                    entry.rank === 2 ? 'bg-gray-400' : 'bg-amber-600'
                                                            }`}>
                                                        {entry.rank}
                                                    </span>
                                                    ) : (
                                                        <span className="ml-3 text-gray-600">{entry.rank}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    <ProfilePicture
                                                        imageUrl={entry.profilePictureUrl}
                                                        className="w-9 h-9 mr-3"
                                                        baseUrl="http://localhost:5284"
                                                    />
                                                    <span className="font-medium text-gray-800">{entry.username}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold text-gray-800">
                                                {entry.score}{leaderboardType === 'average' ? ' %' : ''}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No data available for this leaderboard.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
