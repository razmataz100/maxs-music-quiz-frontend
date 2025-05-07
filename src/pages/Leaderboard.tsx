import { useState, useEffect } from 'react';
import {
    getTotalScoreLeaderboard,
    getAverageScoreLeaderboard,
    getGamesCompletedLeaderboard,
    getWeeklyLeaderboard,
    getMonthlyLeaderboard
} from '../httpUtils/leaderboard';
import { LeaderboardEntry } from "../types/leaderboard.ts";
import ProfileIcon from '../assets/profile.svg';
import { useNavigate } from 'react-router-dom';

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

    if (loading) return (
        <div className="flex justify-center items-center p-8 h-64">
            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>Error: {error}</p>
        </div>
    );

    return (
        <div className="relative p-8 bg-white border border-gray-300 shadow-md w-full max-w-4xl mx-auto mt-8 rounded-lg">
            <div className="relative flex justify-center items-center mb-6">
                <h2 className="text-2xl font-bold">{getLeaderboardTitle()}</h2>
                <button
                    onClick={() => navigate('/home')}
                    className="absolute right-0 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 flex items-center cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20"
                         fill="currentColor">
                        <path
                            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                    Home
                </button>
            </div>

            <div className="mb-6 flex flex-wrap justify-center gap-2">
                <button
                    onClick={() => setLeaderboardType('total')}
                    className={`px-4 py-2 cursor-pointer rounded ${leaderboardType === 'total' ? 'bg-sky-500 text-white' : 'bg-gray-200'}`}
                >
                    Total Score
                </button>
                <button
                    onClick={() => setLeaderboardType('average')}
                    className={`px-4 py-2 cursor-pointer rounded ${leaderboardType === 'average' ? 'bg-sky-500 text-white' : 'bg-gray-200'}`}
                >
                    Average Score
                </button>
                <button
                    onClick={() => setLeaderboardType('games')}
                    className={`px-4 py-2 cursor-pointer rounded ${leaderboardType === 'games' ? 'bg-sky-500 text-white' : 'bg-gray-200'}`}
                >
                    Games Completed
                </button>
                <button
                    onClick={() => setLeaderboardType('weekly')}
                    className={`px-4 py-2 cursor-pointer rounded ${leaderboardType === 'weekly' ? 'bg-sky-500 text-white' : 'bg-gray-200'}`}
                >
                    Weekly
                </button>
                <button
                    onClick={() => setLeaderboardType('monthly')}
                    className={`px-4 py-2 cursor-pointer rounded ${leaderboardType === 'monthly' ? 'bg-sky-500 text-white' : 'bg-gray-200'}`}
                >
                    Monthly
                </button>
            </div>

            {leaderboard.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-3 px-4 text-left w-16">Rank</th>
                            <th className="py-3 px-4 text-left">Player</th>
                            <th className="py-3 px-4 text-right">{getScoreLabel()}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leaderboard.map((entry, index) => {
                            return (
                                <tr key={`${entry.userId}-${index}`} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            {entry.rank <= 3 ? (
                                                <span
                                                    className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                                                        entry.rank === 1 ? 'bg-yellow-400' :
                                                            entry.rank === 2 ? 'bg-gray-300' : 'bg-amber-600'
                                                    } text-white font-bold`}>
                                                        {entry.rank}
                                                    </span>
                                            ) : (
                                                <span className="ml-3 text-gray-600">{entry.rank}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            {entry.profilePictureUrl ? (
                                                <img
                                                    src={`http://localhost:5284${entry.profilePictureUrl}`}
                                                    alt={entry.username}
                                                    className="w-8 h-8 rounded-full mr-3 object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.onerror = null;
                                                        target.src = ProfileIcon;
                                                        target.className = "w-8 h-8 mr-3";
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={ProfileIcon}
                                                    alt="Profile Icon"
                                                    className="w-8 h-8 mr-3"
                                                />
                                            )}
                                            <span className="font-medium">{entry.username}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-right font-semibold">
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
    );
}

export default Leaderboard;
